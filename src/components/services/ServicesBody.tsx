// Phone CTA + services body — reference s04-call-918-630-7788-405-760-9814, ADAPTED.
// 783px @1440. Their two phone numbers become our single PHONE tel: link. Eight services
// across five symptom groups (Prompt 3 regrouping — do not reorder). Each group heading is
// an anchor target for <AnchorNav>, with scroll-margin-top matching the sticky header
// (docs/behavior/02) so the heading never lands under the header on jump.
//
// Background: services-body-bg placeholder, full-bleed behind the band (D-09, placeholder
// until Prompt 10).

import { business, telHref } from '@/lib/business';
import { copy } from '../../../content/copy';
import { ServiceCard } from './ServiceCard';

const s = copy.routes['/services'].sections.find(
  (x) => x.id === 's04-call-918-630-7788-405-760-9814',
)!;

const SLUGS = ['will-not-close', 'sounds-wrong', 'opener', 'damaged', 'commercial'];

export function ServicesBody() {
  return (
    <section data-section="s04-call-918-630-7788-405-760-9814" className="relative block w-full overflow-hidden bg-neutral-200 pt-band pb-0">
      <img
        src="/placeholders/services-body-bg.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative mx-auto flex max-w-content flex-col gap-wide px-4 md:px-gutter">
        <div className="flex flex-col items-center gap-tight text-center">
          <a
            href={telHref}
            aria-label={`Call ${business.name} at ${business.phone.display}`}
            className="text-4xl font-bold leading-heading text-accent no-underline md:text-5xl"
          >
            {s.heading}
          </a>
          <p className="text-base leading-body">{s.subheading}</p>
        </div>

        <div className="flex flex-col gap-band">
          {s.groups?.map((group, i) => (
            <div key={group.symptom} className="flex flex-col gap-loose">
              <div id={SLUGS[i]} style={{ scrollMarginTop: 'var(--spacing-header)' }} className="flex flex-col gap-hair">
                <h3 className="text-2xl font-semibold leading-heading text-primary">{group.symptom}</h3>
                <p className="max-w-[60ch] text-sm leading-body">{group.lead}</p>
              </div>
              <ul className="m-0 grid list-none grid-cols-1 gap-loose p-0 md:grid-cols-2">
                {group.services.map((service) => (
                  <ServiceCard key={service.name} name={service.name} text={service.text} />
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href={telHref}
            aria-label={`Call ${business.name} at ${business.phone.display}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 bg-accent px-5 py-3 font-semibold text-surface no-underline transition-colors duration-[var(--duration-quick)] hover:bg-accent-deep"
          >
            {s.cta?.primary}
          </a>
          <a
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center gap-2 border-2 border-primary px-5 py-3 font-semibold text-primary no-underline transition-colors duration-[var(--duration-quick)] hover:bg-primary hover:text-surface"
          >
            {s.cta?.secondary}
          </a>
        </div>
      </div>
    </section>
  );
}
