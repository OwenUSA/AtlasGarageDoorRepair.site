// NAP + hours — NOVEL, no reference counterpart. Hours and service-area card, single
// 7am-7pm block held everywhere. Placed after the map, ahead of the footer.

import { business, telHref } from '@/lib/business';
import { copy } from '../../../content/copy';

const s = copy.routes['/'].sections.find((x) => x.id === 'home-nap-hours')!;

export function NapHours() {
  return (
    <section data-section="home-nap-hours" className="relative block w-full bg-neutral-200">
      <div className="mx-auto flex max-w-content flex-col gap-wide px-4 py-band md:flex-row md:items-center md:justify-between md:px-gutter">
        <div className="flex max-w-[52ch] flex-col gap-tight">
          <h2 className="text-4xl font-semibold leading-heading text-primary">{s.heading}</h2>
          <p className="text-base leading-body">{s.body?.[0]}</p>
        </div>
        <dl className="grid grid-cols-1 gap-loose sm:grid-cols-3">
          {s.items?.map((item) => (
            <div key={item.title} className="flex flex-col gap-hair">
              <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-600">
                {item.title}
              </dt>
              <dd className="text-base leading-body text-primary">
                {item.title === 'Phone' ? (
                  <a href={telHref} className="text-primary no-underline hover:text-accent">
                    {business.phone.display}
                  </a>
                ) : (
                  item.text
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
