//! DXGI Desktop Duplication backend (Windows only). OS-level duplication of the
//! desktop image — never touches game processes. Pool of GPU textures with a
//! single staging readback on hotkey; no continuous CPU copies.
//!
//! `unsafe` is confined to this module per §1.2, one safety comment per block.

use crate::{CaptureError, FrameSource, RawFrame, SlotPool};
use windows::core::Interface;
use windows::Win32::Graphics::Direct3D::D3D_DRIVER_TYPE_HARDWARE;
use windows::Win32::Graphics::Direct3D11::{
    D3D11CreateDevice, ID3D11Device, ID3D11DeviceContext, ID3D11Texture2D,
    D3D11_CPU_ACCESS_READ, D3D11_CREATE_DEVICE_FLAG, D3D11_MAPPED_SUBRESOURCE, D3D11_MAP_READ,
    D3D11_SDK_VERSION, D3D11_TEXTURE2D_DESC, D3D11_USAGE_DEFAULT, D3D11_USAGE_STAGING,
};
use windows::Win32::Graphics::Dxgi::Common::{DXGI_FORMAT_B8G8R8A8_UNORM, DXGI_SAMPLE_DESC};
use windows::Win32::Graphics::Dxgi::{
    IDXGIDevice, IDXGIOutput1, IDXGIOutputDuplication, IDXGIResource, DXGI_ERROR_ACCESS_LOST,
    DXGI_ERROR_WAIT_TIMEOUT, DXGI_OUTDUPL_FRAME_INFO,
};

/// Number of GPU-resident pool textures (contract WP-5: circular pool of 300).
pub const POOL_SLOTS: usize = 300;

pub struct DxgiDuplication {
    device: ID3D11Device,
    context: ID3D11DeviceContext,
    duplication: IDXGIOutputDuplication,
    pool: Vec<ID3D11Texture2D>,
    slots: SlotPool,
    width: u32,
    height: u32,
}

impl DxgiDuplication {
    pub fn new() -> Result<Self, CaptureError> {
        let mut device: Option<ID3D11Device> = None;
        let mut context: Option<ID3D11DeviceContext> = None;
        // SAFETY: out-pointers are valid for the duration of the call; no borrowed
        // data escapes. D3D11CreateDevice writes valid COM pointers on S_OK.
        unsafe {
            D3D11CreateDevice(
                None,
                D3D_DRIVER_TYPE_HARDWARE,
                None,
                D3D11_CREATE_DEVICE_FLAG(0),
                None,
                D3D11_SDK_VERSION,
                Some(&mut device),
                None,
                Some(&mut context),
            )
        }
        .map_err(|e| CaptureError::Platform(e.message()))?;
        let device = device.ok_or_else(|| CaptureError::Platform("no device".into()))?;
        let context = context.ok_or_else(|| CaptureError::Platform("no context".into()))?;

        let dxgi_device: IDXGIDevice =
            device.cast().map_err(|e| CaptureError::Platform(e.message()))?;
        // SAFETY: dxgi_device is a valid COM interface obtained above.
        let adapter = unsafe { dxgi_device.GetAdapter() }
            .map_err(|e| CaptureError::Platform(e.message()))?;
        // SAFETY: adapter is valid; output 0 is the primary display.
        let output = unsafe { adapter.EnumOutputs(0) }
            .map_err(|e| CaptureError::Platform(e.message()))?;
        let output1: IDXGIOutput1 =
            output.cast().map_err(|e| CaptureError::Platform(e.message()))?;
        // SAFETY: device and output1 are valid COM interfaces; DuplicateOutput
        // returns an owned duplication interface.
        let duplication = unsafe { output1.DuplicateOutput(&device) }
            .map_err(|e| CaptureError::Platform(e.message()))?;

        // SAFETY: GetDesc writes into a valid out-param struct.
        let desc = unsafe { duplication.GetDesc() };
        let (width, height) = (desc.ModeDesc.Width, desc.ModeDesc.Height);

        let pool = (0..POOL_SLOTS)
            .map(|_| create_texture(&device, width, height, D3D11_USAGE_DEFAULT, 0))
            .collect::<Result<Vec<_>, _>>()?;

        Ok(Self { device, context, duplication, pool, slots: SlotPool::new(POOL_SLOTS), width, height })
    }

    /// Pump one duplicated frame into the next pool slot (pointer swap + single
    /// GPU-GPU copy; hot path, no CPU readback).
    pub fn pump(&mut self) -> Result<Option<usize>, CaptureError> {
        let mut info = DXGI_OUTDUPL_FRAME_INFO::default();
        let mut resource: Option<IDXGIResource> = None;
        // SAFETY: out-params are valid; on success we own the acquired resource
        // until ReleaseFrame.
        let acquired = unsafe { self.duplication.AcquireNextFrame(8, &mut info, &mut resource) };
        match acquired {
            Ok(()) => {}
            Err(e) if e.code() == DXGI_ERROR_WAIT_TIMEOUT => return Ok(None),
            Err(e) if e.code() == DXGI_ERROR_ACCESS_LOST => return Err(CaptureError::DeviceLost),
            Err(e) => return Err(CaptureError::Platform(e.message())),
        }
        let result = (|| {
            let resource = resource.ok_or(CaptureError::Timeout)?;
            let texture: ID3D11Texture2D =
                resource.cast().map_err(|e| CaptureError::Platform(e.message()))?;
            let slot = self.slots.stamp_next(self.slots.now_ms());
            // SAFETY: both textures are alive, same device, identical desc.
            unsafe { self.context.CopyResource(&self.pool[slot], &texture) };
            Ok(Some(slot))
        })();
        // SAFETY: every AcquireNextFrame success is paired with exactly one release.
        unsafe { self.duplication.ReleaseFrame() }
            .map_err(|e| CaptureError::Platform(e.message()))?;
        result
    }

    fn read_slot(&mut self, slot: usize) -> Result<RawFrame, CaptureError> {
        let staging = create_texture(
            &self.device,
            self.width,
            self.height,
            D3D11_USAGE_STAGING,
            D3D11_CPU_ACCESS_READ.0 as u32,
        )?;
        // SAFETY: staging + pool textures are valid and dimension-matched.
        unsafe { self.context.CopyResource(&staging, &self.pool[slot]) };
        let mut mapped = D3D11_MAPPED_SUBRESOURCE::default();
        // SAFETY: staging texture was created CPU-readable; Map writes a valid
        // pointer + pitch on success and is paired with Unmap below.
        unsafe { self.context.Map(&staging, 0, D3D11_MAP_READ, 0, Some(&mut mapped)) }
            .map_err(|e| CaptureError::Platform(e.message()))?;
        let mut bgra = vec![0u8; (self.width * self.height * 4) as usize];
        let row_bytes = (self.width * 4) as usize;
        for y in 0..self.height as usize {
            // SAFETY: mapped.pData is valid for RowPitch*height bytes while mapped;
            // we copy row_bytes <= RowPitch per row into an exactly-sized buffer.
            unsafe {
                std::ptr::copy_nonoverlapping(
                    (mapped.pData as *const u8).add(y * mapped.RowPitch as usize),
                    bgra.as_mut_ptr().add(y * row_bytes),
                    row_bytes,
                );
            }
        }
        // SAFETY: paired with the successful Map above.
        unsafe { self.context.Unmap(&staging, 0) };
        let ts = self.slots.freshest().map(|(_, t)| t).unwrap_or(0);
        Ok(RawFrame { bgra, width: self.width, height: self.height, ts_monotonic_ms: ts })
    }
}

impl FrameSource for DxgiDuplication {
    fn grab(&mut self, roi: Option<(u32, u32, u32, u32)>) -> Result<RawFrame, CaptureError> {
        // Ensure at least one fresh frame is pooled, then read the freshest slot.
        let _ = self.pump()?;
        let (slot, _) = self.slots.freshest().ok_or(CaptureError::Timeout)?;
        let full = self.read_slot(slot)?;
        Ok(match roi {
            None => full,
            Some((x, y, w, h)) => crop_bgra(full, x, y, w, h),
        })
    }
}

fn crop_bgra(frame: RawFrame, x: u32, y: u32, w: u32, h: u32) -> RawFrame {
    let w = w.min(frame.width.saturating_sub(x)).max(1);
    let h = h.min(frame.height.saturating_sub(y)).max(1);
    let src_row = (frame.width * 4) as usize;
    let dst_row = (w * 4) as usize;
    let mut bgra = vec![0u8; dst_row * h as usize];
    for row in 0..h as usize {
        let src_off = (y as usize + row) * src_row + (x as usize * 4);
        bgra[row * dst_row..(row + 1) * dst_row]
            .copy_from_slice(&frame.bgra[src_off..src_off + dst_row]);
    }
    RawFrame { bgra, width: w, height: h, ts_monotonic_ms: frame.ts_monotonic_ms }
}

fn create_texture(
    device: &ID3D11Device,
    width: u32,
    height: u32,
    usage: windows::Win32::Graphics::Direct3D11::D3D11_USAGE,
    cpu_access: u32,
) -> Result<ID3D11Texture2D, CaptureError> {
    let desc = D3D11_TEXTURE2D_DESC {
        Width: width,
        Height: height,
        MipLevels: 1,
        ArraySize: 1,
        Format: DXGI_FORMAT_B8G8R8A8_UNORM,
        SampleDesc: DXGI_SAMPLE_DESC { Count: 1, Quality: 0 },
        Usage: usage,
        BindFlags: 0,
        CPUAccessFlags: cpu_access,
        MiscFlags: 0,
    };
    let mut texture: Option<ID3D11Texture2D> = None;
    // SAFETY: desc is fully initialized; out-pointer valid for the call.
    unsafe { device.CreateTexture2D(&desc, None, Some(&mut texture)) }
        .map_err(|e| CaptureError::Platform(e.message()))?;
    texture.ok_or_else(|| CaptureError::Platform("texture creation returned null".into()))
}
