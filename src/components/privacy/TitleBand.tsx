// Page title band — reference s02-privacy-policy-and-terms-and-condi, ADAPTED. 112px @1440.
// Same gradient-band pattern as /about's TitleBand (accent-deep -> accent), no image asset.

import { copy } from '../../../content/copy';

const s = copy.routes['/privacy'].sections.find(
  (x) => x.id === 's02-privacy-policy-and-terms-and-condi',
)!;

export function TitleBand() {
  return (
    <section
      data-section="s02-privacy-policy-and-terms-and-condi"
      className="relative block w-full bg-linear-to-b from-accent-deep to-accent text-surface font-medium"
    >
      <div className="mx-auto flex min-h-[160px] max-w-content flex-col justify-center gap-tight px-4 py-wide md:min-h-[112px] md:flex-row md:items-center md:justify-between md:px-gutter">
        <h1 className="max-w-[28ch] text-3xl font-semibold leading-heading text-surface md:text-4xl">
          {s.heading}
        </h1>
        <p className="text-md leading-body text-surface">{s.subheading}</p>
      </div>
    </section>
  );
}
