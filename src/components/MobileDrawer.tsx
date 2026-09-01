'use client';

// Mobile nav drawer — implements docs/behavior/01-mobile-nav-drawer.md exactly.
//
// The reference's own drawer is a `display: none -> block` toggle with no body scroll
// lock. That is the failure mode the spec exists to correct; we do not clone it.

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { business, routes, telHref } from '@/lib/business';

export function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollY = useRef(0);

  const close = useCallback(() => setOpen(false), []);

  // Close on pathname change — in App Router the drawer survives navigation.
  useEffect(() => { setOpen(false); }, [pathname]);

  // Close if the viewport crosses up into desktop nav territory.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 980px)');
    const onChange = (e: MediaQueryListEvent) => { if (e.matches) setOpen(false); };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Body scroll lock: position:fixed + restore. NOT overflow:hidden, which iOS ignores.
  useEffect(() => {
    if (!open) return;
    scrollY.current = window.scrollY;
    const body = document.body;
    body.style.position = 'fixed';
    body.style.top = `-${scrollY.current}px`;
    body.style.width = '100%';
    return () => {
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      window.scrollTo(0, scrollY.current);
    };
  }, [open]);

  // Escape to close, and a focus trap while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  // Focus into the panel on open; return focus to the toggle on close.
  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus();
    else toggleRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-drawer"
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="inline-flex h-11 w-11 items-center justify-center text-primary lg:hidden"
      >
        {open ? <X aria-hidden size={26} strokeWidth={2} /> : <Menu aria-hidden size={26} strokeWidth={2} />}
      </button>

      {/* Backdrop: 0.2s linear, finishes BEFORE the panel so the page reads as
          already dimmed when the panel arrives. */}
      <div
        aria-hidden
        onClick={close}
        data-open={open}
        className={
          'fixed inset-0 z-40 bg-neutral-900 transition-opacity duration-200 ease-linear lg:hidden ' +
          (open ? 'opacity-60' : 'pointer-events-none opacity-0')
        }
      />

      {/* Panel: translate3d only. Never max-height, never left, never display. */}
      <div
        id="mobile-drawer"
        ref={panelRef}
        data-open={open}
        aria-hidden={!open}
        className={
          'fixed right-0 top-0 z-50 flex h-dvh w-80 max-w-[85vw] flex-col gap-4 ' +
          'bg-surface px-5 pb-5 pt-band shadow-raised lg:hidden ' +
          'transition-transform duration-[var(--duration-panel)] ease-out-quint motion-reduce:duration-[0.01s] ' +
          (open ? 'translate-x-0' : 'translate-x-full')
        }
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {routes.map((r, i) => (
            <Link
              key={r.href}
              href={r.href}
              tabIndex={open ? 0 : -1}
              aria-current={pathname === r.href ? 'page' : undefined}
              style={{ transitionDelay: open ? `${80 + i * 30}ms` : '0ms' }}
              className={
                'border-b border-border py-4 text-lg font-semibold no-underline ' +
                'transition-[opacity,transform] duration-[var(--duration-base)] ease-out-quint ' +
                'motion-reduce:transition-none motion-reduce:!delay-0 ' +
                (open ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0') + ' ' +
                (pathname === r.href ? 'text-accent' : 'text-primary')
              }
            >
              {r.label}
            </Link>
          ))}
        </nav>

        <a
          href={telHref}
          tabIndex={open ? 0 : -1}
          aria-label={`Call ${business.name} at ${business.phone.display}`}
          className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 bg-accent px-5 py-3 font-semibold text-surface no-underline"
        >
          <Phone aria-hidden size={18} strokeWidth={2} />
          {business.phone.display}
        </a>
      </div>
    </>
  );
}
