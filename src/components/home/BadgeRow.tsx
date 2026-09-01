// Badge row — reference s06, ADAPTED. 377px, GAF Master Elite certification row. We hold
// no certifications we may name (D-14); retained at correct dimensions, filled with
// TODO(fact) chips. Uses the frozen <FactChip> primitive.

import { FactChip } from '@/components/primitives';
import { copy } from '../../../content/copy';

const s = copy.routes['/'].sections.find((x) => x.id === 's06')!;

export function BadgeRow() {
  return (
    <section data-section="s06" className="relative block w-full bg-surface">
      <div className="mx-auto flex min-h-[377px] max-w-content flex-col justify-center gap-wide px-4 py-band md:px-gutter">
        <div className="flex flex-col gap-tight text-center">
          <h2 className="text-2xl font-semibold leading-heading text-primary">{s.heading}</h2>
          {s.body?.map((line) => (
            <p key={line} className="mx-auto max-w-[60ch] text-sm leading-body">
              {line}
            </p>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-loose">
          {s.chips?.map((chip) => (
            <FactChip key={chip} label={chip} className="h-[86px] w-[150px]" />
          ))}
        </div>
      </div>
    </section>
  );
}
