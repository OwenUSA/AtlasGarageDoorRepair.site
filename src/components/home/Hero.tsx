// Home hero — reference s03, ADAPTED. LEAD-OWNED (touches shared Button/Container).
//
// The reference "background image" is a GRADIENT, not a file (Prompt 2): the band is
// linear-gradient(accent-deep 0%, accent 99%) with no asset behind it. Nothing to
// parallax and no hero photo to wait on.
// Geometry: 741px @1440, 900px @390, zero padding on the band, content in a 1152 column.
// Proposition is workmanship, never speed (Prompt 3).

import { business, telHref } from '@/lib/business';
import { copy } from '../../../content/copy';

const s = copy.routes['/'].sections.find((x) => x.id === 's03-we-get-the-job-done')!;

export function Hero() {
  return (
    <section
      data-section="s03-we-get-the-job-done"
      className="block w-full bg-linear-to-b from-accent-deep to-accent text-surface"
    >
      <div className="mx-auto flex min-h-[900px] max-w-content flex-col justify-center gap-wide px-4 py-band md:px-gutter lg:min-h-[741px]">
        <h1 className="max-w-[18ch] text-7xl font-bold leading-heading text-surface md:text-8xl">
          {s.heading}
        </h1>
        <p className="max-w-[52ch] text-md leading-body text-surface">{s.subheading}</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href={telHref}
            aria-label={`Call ${business.name} at ${business.phone.display}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 bg-surface px-5 py-3 font-semibold text-accent no-underline transition-colors duration-[var(--duration-quick)] hover:bg-neutral-200"
          >
            {s.cta?.primary}
          </a>
          <a
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center gap-2 border-2 border-surface px-5 py-3 font-semibold text-surface no-underline transition-colors duration-[var(--duration-quick)] hover:bg-surface hover:text-accent"
          >
            {s.cta?.secondary}
          </a>
        </div>
      </div>
    </section>
  );
}
