// Our Mission — reference s05-our-mission, ADAPTED. 932px @1440, single text column
// (~660px, half the 1080 content width per the reference innerGrid). Own copy at matched
// length. No founding year, no history (D-17) — the copy carries the TODO(fact) line
// literally, rendered as-is.

import { copy } from '../../../content/copy';

const s = copy.routes['/about'].sections.find((x) => x.id === 's05-our-mission')!;

export function OurMission() {
  return (
    <section data-section="s05-our-mission" className="block w-full bg-surface pt-band pb-0">
      <div className="mx-auto flex min-h-[932px] max-w-content flex-col justify-center px-4 md:px-gutter">
        <h2 className="mb-loose text-4xl font-semibold leading-heading text-primary">{s.heading}</h2>
        <ul className="flex max-w-[60ch] list-none flex-col gap-loose p-0 text-base leading-body">
          {s.body?.map((para) => <li key={para}>{para}</li>)}
        </ul>
      </div>
    </section>
  );
}
