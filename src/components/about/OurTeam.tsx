// Who turns up — reference s07-our-team, ADAPTED. 448px @1440, gradient band (same
// accent-deep -> accent gradient tokens as the home hero and title band — no asset,
// Prompt 2). No headcount, no names, no credentials, no staff photos (D-09/D-14); the
// copy's TODO(fact) line is rendered literally.

import { copy } from '../../../content/copy';

const s = copy.routes['/about'].sections.find((x) => x.id === 's07-our-team')!;

export function OurTeam() {
  return (
    <section
      data-section="s07-our-team"
      className="block w-full bg-linear-to-b from-accent-deep to-accent text-surface"
    >
      <div className="mx-auto flex min-h-[448px] max-w-content flex-col justify-center gap-loose px-4 py-band md:px-gutter">
        <h2 className="text-4xl font-semibold leading-heading text-surface">{s.heading}</h2>
        <div className="grid grid-cols-1 gap-loose text-base leading-body text-surface md:grid-cols-3">
          {s.body?.map((para) => <p key={para}>{para}</p>)}
        </div>
      </div>
    </section>
  );
}
