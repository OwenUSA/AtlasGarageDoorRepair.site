// Announcement strip — reference s02, ADAPTED. 50px band, single centred line.
// Reference claims veteran support/employment; we hold no such claim (D-14/D-17), so
// the band carries the tagline instead, at identical geometry.

import { copy } from '../../../content/copy';

const s = copy.routes['/'].sections.find((x) => x.id === 's02-vh1-is-proud-to-support-employ-v')!;

export function AnnouncementStrip() {
  return (
    <section
      data-section="s02-vh1-is-proud-to-support-employ-v"
      className="relative block w-full bg-accent-deep"
    >
      <div className="mx-auto flex h-[50px] max-w-content items-center justify-center px-4 md:px-gutter">
        <p className="text-center text-sm font-medium leading-body text-surface">{s.heading}</p>
      </div>
    </section>
  );
}
