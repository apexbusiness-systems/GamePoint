//! Windows foreground-window probe (title-identification fast path §III).
//! Reads only our own process's view of the desktop: window title + process
//! image name. No handles into game process memory are ever opened for reading
//! or writing — PROCESS_QUERY_LIMITED_INFORMATION only.

use crate::ForegroundProbe;
use windows::Win32::Foundation::CloseHandle;
use windows::Win32::System::ProcessStatus::GetModuleBaseNameW;
use windows::Win32::System::Threading::{OpenProcess, PROCESS_QUERY_LIMITED_INFORMATION};
use windows::Win32::UI::WindowsAndMessaging::{
    GetForegroundWindow, GetWindowTextW, GetWindowThreadProcessId,
};

pub struct WindowsForegroundProbe;

impl ForegroundProbe for WindowsForegroundProbe {
    fn foreground(&self) -> (String, String) {
        // SAFETY: GetForegroundWindow takes no arguments and returns a possibly
        // null HWND; both cases are handled.
        let hwnd = unsafe { GetForegroundWindow() };
        if hwnd.is_invalid() {
            return (String::new(), String::new());
        }

        let mut title_buf = [0u16; 512];
        // SAFETY: buffer is valid for its length; GetWindowTextW returns the
        // number of characters written.
        let len = unsafe { GetWindowTextW(hwnd, &mut title_buf) } as usize;
        let window_title = String::from_utf16_lossy(&title_buf[..len.min(title_buf.len())]);

        let mut pid = 0u32;
        // SAFETY: pid out-pointer is valid for the call.
        unsafe { GetWindowThreadProcessId(hwnd, Some(&mut pid)) };
        let mut process_name = String::new();
        if pid != 0 {
            // SAFETY: query-limited handle only — this is metadata access, not
            // memory access; handle is closed below on every path.
            if let Ok(handle) = unsafe { OpenProcess(PROCESS_QUERY_LIMITED_INFORMATION, false, pid) }
            {
                let mut name_buf = [0u16; 260];
                // SAFETY: valid handle + buffer; returns chars written.
                let n = unsafe { GetModuleBaseNameW(handle, None, &mut name_buf) } as usize;
                process_name = String::from_utf16_lossy(&name_buf[..n.min(name_buf.len())]);
                // SAFETY: handle came from a successful OpenProcess.
                let _ = unsafe { CloseHandle(handle) };
            }
        }
        (process_name, window_title)
    }
}
