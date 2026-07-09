import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Publishable key: safe for client bundles by design; RLS enforces all access.
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? 'https://nbgofxqominofaghbxje.supabase.co';
const SUPABASE_KEY = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ?? 'sb_publishable_OT4qCpn8QbLCMlkuAYrGNg_6RlGxmTa';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export interface NavItem { glyph: string; label: string; path: string }
export const NAV: NavItem[] = [
  { glyph: '⌂', label: 'Home', path: '/' },
  { glyph: '▣', label: 'Live Overlay', path: '/app/overlay' },
  { glyph: '◴', label: 'Sessions', path: '/app/sessions' },
  { glyph: '▧', label: 'Replay Review', path: '/app/replay' },
  { glyph: '◎', label: 'Coach Squad', path: '/app/coaches' },
  { glyph: '◇', label: 'Community', path: '/app/community' },
  { glyph: '▥', label: 'Insights', path: '/app/insights' },
  { glyph: '⚙', label: 'Settings', path: '/app/settings' },
];

const ROUTE_EVENT = 'gp:navigate';

export function navigate(path: string): void {
  if (window.location.pathname !== path) {
    window.history.pushState({}, '', path);
  }
  window.dispatchEvent(new Event(ROUTE_EVENT));
}

export function useRoute(): string {
  const [path, setPath] = useState<string>(window.location.pathname);
  useEffect(() => {
    const onChange = (): void => setPath(window.location.pathname);
    window.addEventListener('popstate', onChange);
    window.addEventListener(ROUTE_EVENT, onChange);
    return () => {
      window.removeEventListener('popstate', onChange);
      window.removeEventListener(ROUTE_EVENT, onChange);
    };
  }, []);
  return path;
}

export function RouteLink(props: { to: string; className?: string; children: React.ReactNode; ariaLabel?: string }): React.JSX.Element {
  return (
    <a
      href={props.to}
      className={props.className}
      aria-label={props.ariaLabel}
      onClick={(e) => { e.preventDefault(); navigate(props.to); }}
    >
      {props.children}
    </a>
  );
}

export function Sidebar(props: { footer?: React.ReactNode }): React.JSX.Element {
  const path = useRoute();
  return (
    <aside className="sidebar" aria-label="GamePoint navigation">
      <div className="brand">
        <span className="brand-mark">G</span>
        <strong>GamePoint</strong>
      </div>
      <nav>
        {NAV.map((item) => (
          <a
            className={(item.path === '/' ? path === '/' : path.startsWith(item.path)) ? 'active' : undefined}
            href={item.path}
            key={item.label}
            onClick={(e) => { e.preventDefault(); navigate(item.path); }}
          >
            <span>{item.glyph}</span>
            {item.label}
          </a>
        ))}
      </nav>
      {props.footer}
    </aside>
  );
}
