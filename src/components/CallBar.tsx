// Mobile sticky call bar — implements docs/behavior/03-mobile-sticky-call-bar.md.
//
// NOVEL: the reference has no counterpart. Its only fixed element at 390 is a
// scroll-to-top pip. Required by D-04, and necessary because the header is static
// below 980 (docs/behavior/02), so the number would otherwise scroll away.
//
// No scroll trigger, no hide-on-scroll. Present from first paint below 768, because the
// most common arrival is a search result landing mid-page.

import { Phone } from 'lucide-react';
import { business, telHref } from '@/lib/business';

export function CallBar() {
  return (
    <div
      data-section="mobile-call-bar"
      className="fixed inset-x-0 bottom-0 z-30 bg-accent pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <a
        href={telHref}
        aria-label={`Call ${business.name} at ${business.phone.display}`}
        className="flex h-callbar items-center justify-center gap-2 font-semibold text-surface no-underline transition-transform duration-[var(--duration-fast)] active:scale-[0.98] motion-reduce:active:scale-100"
      >
        <Phone aria-hidden size={20} strokeWidth={2} />
        {business.phone.display}
      </a>
    </div>
  );
}
