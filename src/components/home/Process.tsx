// Process — reference s09, ADAPTED. 527px, five steps in a row @1440, stacked @390.
// Own copy, own step names. Icons from lucide-react, matched on stroke width/size only.

import { Phone, Search, ClipboardCheck, Wrench, CheckCircle2 } from 'lucide-react';
import { copy } from '../../../content/copy';

const s = copy.routes['/'].sections.find((x) => x.id === 's09-we-make-it-easy-to-get-the-job-don')!;

const ICONS = [Phone, Search, ClipboardCheck, Wrench, CheckCircle2];

export function Process() {
  return (
    <section
      data-section="s09-we-make-it-easy-to-get-the-job-don"
      className="relative block min-h-[527px] w-full bg-surface pb-loose"
    >
      <div className="mx-auto flex max-w-content flex-col gap-wide px-4 md:px-gutter">
        <div className="flex flex-col gap-tight text-center">
          <h2 className="text-4xl font-semibold leading-heading text-primary">{s.heading}</h2>
          <p className="mx-auto max-w-[52ch] text-base leading-body">{s.subheading}</p>
        </div>
        <ol className="flex flex-col gap-wide md:flex-row md:justify-between md:gap-loose">
          {s.items?.map((item, i) => {
            const Icon = ICONS[i] ?? Phone;
            return (
              <li key={item.title} className="flex flex-1 flex-col items-center gap-tight text-center">
                <Icon className="text-accent" size={38} strokeWidth={1.5} aria-hidden="true" />
                <h3 className="text-lg font-semibold leading-heading text-primary">{item.title}</h3>
                <p className="max-w-[28ch] text-sm leading-body">{item.text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
