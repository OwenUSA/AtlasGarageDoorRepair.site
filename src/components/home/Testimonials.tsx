// Testimonials — reference s11, ADAPTED. 1458px, seven literal placeholder cards (D-13).
// No invented names, no quotes, no star ratings, no AggregateRating/Review JSON-LD.

import { copy } from '../../../content/copy';

const s = copy.routes['/'].sections.find((x) => x.id === 's11-hundreds-of-oklahoman-s-rate-vh1-5')!;

export function Testimonials() {
  return (
    <section
      data-section="s11-hundreds-of-oklahoman-s-rate-vh1-5"
      className="relative block min-h-[1458px] w-full bg-surface py-band"
    >
      <div className="mx-auto flex max-w-content flex-col gap-wide px-4 md:px-gutter">
        <div className="flex flex-col gap-tight text-center">
          <h2 className="text-4xl font-semibold leading-heading text-primary">{s.heading}</h2>
          <p className="mx-auto max-w-[52ch] text-sm leading-body">{s.subheading}</p>
        </div>
        <ul className="grid grid-cols-1 gap-loose md:grid-cols-2 lg:grid-cols-3">
          {s.quotes?.map((quote, i) => (
            <li
              key={i}
              className="flex flex-col gap-tight border border-border bg-neutral-200 p-wide text-sm leading-body text-neutral-600"
            >
              {quote}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
