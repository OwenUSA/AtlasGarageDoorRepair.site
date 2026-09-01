// In-page anchor nav — services-anchor-nav, NOVEL, no reference counterpart. D-01 forbids
// per-service routes, so this carries the navigation the reference spreads across pages.
// Targets are the five symptom-group headings rendered in <ServicesBody>. Every target
// needs scroll-margin-top matching the sticky header (docs/behavior/02), applied on the
// heading itself, not here.

import { copy } from '../../../content/copy';

const s = copy.routes['/services'].sections.find((x) => x.id === 'services-anchor-nav')!;

export function AnchorNav() {
  return (
    <section
      data-section="services-anchor-nav"
      className="block w-full border-y border-border bg-neutral-200"
    >
      <nav aria-label={s.heading} className="mx-auto max-w-content px-4 py-tight md:px-gutter">
        <p className="mb-tight text-2xs font-semibold uppercase tracking-wide text-neutral-600">
          {s.heading}
        </p>
        <ul className="m-0 flex list-none flex-wrap gap-tight p-0">
          {s.items?.map((item) => (
            <li key={item.text}>
              <a
                href={item.text}
                className="inline-flex min-h-11 items-center border border-border-strong px-4 py-2 text-sm font-medium text-primary no-underline hover:bg-surface"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
