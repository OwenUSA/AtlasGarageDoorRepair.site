// Stat strip — reference s12, ADAPTED. 439px, accent gradient band, three 225px tiles.
// Every number is an invented business fact; tiles carry TODO(fact) chips (D-14).
// No count-up — the values are placeholder strings, not numbers (docs/behavior/08).

import { FactChip } from '@/components/primitives';
import { copy } from '../../../content/copy';

const s = copy.routes['/'].sections.find((x) => x.id === 's12-the-proof-is-in-the-numbers-vh1-g')!;

export function StatStrip() {
  return (
    <section
      data-section="s12-the-proof-is-in-the-numbers-vh1-g"
      className="relative block w-full bg-linear-to-b from-accent to-accent-deep text-surface"
    >
      <div className="mx-auto flex min-h-[439px] max-w-content flex-col items-center justify-center gap-wide px-4 py-band md:px-gutter">
        <h2 className="max-w-[40ch] text-center text-3xl font-semibold leading-heading text-surface">
          {s.heading}
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-wide">
          {s.stats?.map((stat) => (
            <div key={stat.label} className="flex w-[225px] flex-col items-center gap-tight text-center">
              <FactChip label={stat.value} className="w-full" />
              <p className="text-sm font-medium leading-body text-surface">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
