// Site header — implements docs/behavior/02-sticky-header-transition.md.
//
// STATIC sticky header: the reference has NO at-top vs engaged difference at any width
// (same background, same shadow: none, same transform). Appendix A says shrink-on-scroll
// only if the reference does it. It does not. There is no scroll listener anywhere here.
//
// Structure mirrors the reference: each band is a full-width BLOCK with zero padding, and
// an inner container carries the layout. Making the band itself the flex container changes
// its computed display, padding, gap and width and shows up as structural divergence.
//
// Top bar + header are one sticky group at >=980, matching the reference where both live
// inside a single positioned #main-header. Static below 980 — the reference is absolute at
// 390 — and there the CallBar carries the phone number instead.
//
// Known deliberate divergence: `position: sticky` vs the reference's `fixed`. Sticky keeps
// the header in flow so nothing needs a compensating offset (docs/behavior/02).

import Image from 'next/image';
import Link from 'next/link';
import { Phone } from 'lucide-react';
import { business, telHref } from '@/lib/business';
import { MobileDrawer } from './MobileDrawer';
import { NavLinks } from './NavLinks';

export function SiteHeader() {
  return (
    <div className="w-full lg:sticky lg:top-0 lg:z-30">
      {/* Top bar. The reference's reads "OK Lic # 80006064" — a licence number we cannot
          invent (D-14), so ours carries the hours. Forced s00 FIDELITY -> ADAPTED. */}
      <div
        data-section="s00-top-header"
        className="block w-full bg-primary-deep text-2xs font-medium leading-heading text-surface"
      >
        <div className="mx-auto flex h-topbar max-w-content items-center justify-center px-4 md:justify-end md:px-gutter">
          Open daily 7am–7pm
        </div>
      </div>

      <header
        data-section="s01-main-header"
        className="block w-full bg-surface text-base font-medium leading-[23px] shadow-hairline"
      >
        <div className="mx-auto flex h-header-sm max-w-content items-center justify-between gap-4 px-4 md:px-gutter lg:h-header">
          <Link href="/" className="no-underline" aria-label={`${business.name} — home`}>
            {/* Supplied logo lockup (2026-09-03), keyed off its JPG backdrop and trimmed to
                the artwork box: 910x240 source, served at 640w. Height-driven so the header
                band height stays the measured value at every breakpoint. */}
            <Image
              src="/placeholders/logo-primary.png"
              alt=""
              width={640}
              height={169}
              priority
              className="block h-10 w-auto lg:h-14"
            />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <NavLinks />
          </nav>

          {/* Phone CTA: always visible at >=768 (Appendix A). Primary conversion path. */}
          <a
            href={telHref}
            aria-label={`Call ${business.name} at ${business.phone.display}`}
            className="hidden min-h-11 items-center gap-2 bg-accent px-5 py-3 font-semibold text-surface no-underline transition-colors duration-[var(--duration-quick)] hover:bg-accent-deep md:inline-flex"
          >
            <Phone aria-hidden size={18} strokeWidth={2} />
            {business.phone.display}
          </a>

          <MobileDrawer />
        </div>
      </header>
    </div>
  );
}
