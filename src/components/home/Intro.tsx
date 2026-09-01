// Intro — reference s04, ADAPTED. Two-column band, 454px @1440, accent gradient bg.
// "TOP RATED" is an unverifiable credential claim (D-14); rebuilt as a workmanship intro.

import { business, telHref } from '@/lib/business';
import { copy } from '../../../content/copy';

const s = copy.routes['/'].sections.find((x) => x.id === 's04-top-rated-roofing-contractor-in-tu')!;

export function Intro() {
  return (
    <section
      data-section="s04-top-rated-roofing-contractor-in-tu"
      className="relative block w-full bg-linear-to-b from-primary to-primary-deep text-surface"
    >
      <div className="mx-auto flex min-h-[454px] max-w-content flex-col justify-center gap-wide px-4 py-band md:flex-row md:items-center md:justify-between md:px-gutter">
        <h2 className="max-w-[24ch] text-4xl font-semibold leading-heading text-surface md:text-5xl">
          {s.heading}
        </h2>
        <div className="flex max-w-[42ch] flex-col gap-loose">
          <p className="text-base leading-body text-surface">{s.body?.[0]}</p>
          <a
            href={telHref}
            aria-label={`Call ${business.name} at ${business.phone.display}`}
            className="inline-flex min-h-11 w-fit items-center justify-center gap-2 bg-accent px-5 py-3 font-semibold text-surface no-underline transition-colors duration-[var(--duration-quick)] hover:bg-accent-deep"
          >
            {business.phone.display}
          </a>
        </div>
      </div>
    </section>
  );
}
