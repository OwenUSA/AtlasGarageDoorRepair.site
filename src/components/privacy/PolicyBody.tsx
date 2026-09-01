// Policy body — reference s03, NOVEL. No reference counterpart (D-16): written from
// scratch to describe what this site actually does. Measured once at 1440 by token
// conformance, not by pixel diff — every size/weight/spacing value below is pulled
// explicitly from the @theme scale rather than left to element defaults, because a long
// policy document is the easiest place to accidentally ship browser-default type.

import { business, telHref } from '@/lib/business';
import { copy } from '../../../content/copy';

const s = copy.routes['/privacy'].sections.find((x) => x.id === 's03')!;

export function PolicyBody() {
  return (
    <section data-section="s03" className="block w-full bg-surface text-neutral-600">
      <div className="mx-auto max-w-content px-4 py-band md:px-gutter">
        <div className="mx-auto max-w-[68ch]">
          <h2 className="text-2xl font-semibold leading-heading text-primary md:text-3xl">
            {s.heading}
          </h2>
          <p className="mt-tight text-base leading-body text-neutral-600">{s.subheading}</p>

          {s.note ? (
            <p className="mt-loose border border-dashed border-border-strong bg-neutral-200 px-4 py-tight text-sm leading-body font-medium text-neutral-900">
              {s.note}
            </p>
          ) : null}

          <ol className="mt-loose flex flex-col gap-loose">
            {s.items?.map((item) => (
              <li key={item.title} className="flex flex-col gap-tight">
                <h3 className="text-xl font-semibold leading-heading text-primary">
                  {item.title}
                </h3>
                <p className="text-base leading-body text-neutral-600">{item.text}</p>
              </li>
            ))}
          </ol>

          <p className="mt-loose text-sm leading-body text-neutral-400">
            Questions about this policy: call{' '}
            <a href={telHref} className="font-semibold text-primary underline">
              {business.phone.display}
            </a>
            . {business.address.display}.
          </p>
        </div>
      </div>
    </section>
  );
}
