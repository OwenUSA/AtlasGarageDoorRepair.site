// "Why measurement beats judgement" — reference s06-reliable-roofing-professionals,
// ADAPTED. 697px @1440, full-bleed photo band with a text column over it (theirs is a
// crew/site photo; ours is `about-photo`, placeholder-blocked, D-09). Own copy, workmanship
// proposition held.

import { copy } from '../../../content/copy';

const s = copy.routes['/about'].sections.find((x) => x.id === 's06-reliable-roofing-professionals')!;

export function ReliablePros() {
  return (
    <section
      data-section="s06-reliable-roofing-professionals"
      className="block w-full bg-neutral-900 bg-cover bg-center text-surface"
      style={{ backgroundImage: "url('/placeholders/about-photo.svg')" }}
    >
      <div className="mx-auto flex h-[697px] max-w-content flex-col justify-center px-4 md:px-gutter">
        <div className="max-w-[46ch] bg-primary-deep/80 p-loose">
          <h2 className="mb-tight text-4xl font-semibold leading-heading text-surface">{s.heading}</h2>
          <div className="flex flex-col gap-tight text-sm leading-body text-surface">
            {s.body?.map((para) => <p key={para}>{para}</p>)}
          </div>
        </div>
      </div>
    </section>
  );
}
