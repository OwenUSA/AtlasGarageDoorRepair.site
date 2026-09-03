// CTA band — reference s10, ADAPTED. 476px, accent gradient, heading + body + two CTAs.
// Own copy; primary is call-with-number-visible, secondary is request-a-callback.

import { business, telHref } from '@/lib/business';
import { copy } from '../../../content/copy';

const s = copy.routes['/'].sections.find((x) => x.id === 's10-your-roof-our-reputation')!;

export function CtaBand() {
  return (
    <section
      data-section="s10-your-roof-our-reputation"
      className="relative block min-h-[476px] w-full bg-linear-to-b from-accent-deep to-accent text-surface pt-band pb-wide"
    >
      <div className="mx-auto flex max-w-content flex-col items-center justify-center gap-wide px-4 text-center md:px-gutter">
        <h2 className="max-w-[28ch] text-5xl font-semibold leading-heading text-surface">
          {s.heading}
        </h2>
        <p className="max-w-[60ch] text-base leading-body text-surface">{s.body?.[0]}</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href={telHref}
            aria-label={`Call ${business.name} at ${business.phone.display}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 bg-surface px-5 py-3 font-semibold text-accent no-underline transition-colors duration-[var(--duration-quick)] hover:bg-neutral-200"
          >
            {s.cta?.primary}
          </a>
          <a
            href="/contact/"
            className="inline-flex min-h-11 items-center justify-center gap-2 border-2 border-surface px-5 py-3 font-semibold text-surface no-underline transition-colors duration-[var(--duration-quick)] hover:bg-surface hover:text-accent"
          >
            {s.cta?.secondary}
          </a>
        </div>
      </div>
    </section>
  );
}
