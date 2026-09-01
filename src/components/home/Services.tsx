// Services — reference s13, ADAPTED. 743px reference; our eight services regrouped into
// five symptom groups (Prompt 3 structural gate item 4), moved 13th -> 5th in page order.
//
// Card hover/press per docs/behavior/04-service-card-hover-press.md: transform
// translateY(-2px) + box-shadow on hover (>=768 only, via Tailwind's hover: which already
// compiles to @media (hover:hover)), press returns to translateY(0). One anchor per card
// wraps the SERVICE NAME only, with a stretched ::after covering the card. The per-card
// tel: link is a separate, clearly labelled anchor, not folded into the stretched link.

import { business, telHref } from '@/lib/business';
import { copy } from '../../../content/copy';

const s = copy.routes['/'].sections.find((x) => x.id === 's13-services-our-services')!;

export function Services() {
  return (
    <section data-section="s13-services-our-services" className="relative block w-full bg-surface pb-band">
      <div className="mx-auto flex max-w-content flex-col gap-wide px-4 md:px-gutter">
        <div className="flex flex-col gap-tight text-center">
          <h2 className="text-4xl font-semibold leading-heading text-primary">{s.heading}</h2>
          <p className="mx-auto max-w-[52ch] text-base leading-body">{s.subheading}</p>
        </div>

        <div className="flex flex-col gap-band">
          {s.groups?.map((group) => (
            <div key={group.symptom} className="flex flex-col gap-loose">
              <div className="flex flex-col gap-hair">
                <h3 className="text-xl font-semibold leading-heading text-primary">
                  {group.symptom}
                </h3>
                <p className="max-w-[64ch] text-sm leading-body">{group.lead}</p>
              </div>
              <ul className="grid grid-cols-1 gap-loose md:grid-cols-2">
                {group.services.map((service) => (
                  <li
                    key={service.name}
                    className={
                      'relative flex flex-col gap-tight border border-border bg-surface p-wide ' +
                      'shadow-hairline transition-[transform,box-shadow] duration-[var(--duration-quick)] ease-out-quint ' +
                      'hover:-translate-y-0.5 hover:shadow-raised hover:duration-[var(--duration-base)] ' +
                      'active:translate-y-0 active:duration-[var(--duration-fast)]'
                    }
                  >
                    <h4 className="text-lg font-semibold leading-heading text-primary">
                      <a
                        href="/contact"
                        className="text-primary no-underline after:absolute after:inset-0 after:content-['']"
                      >
                        {service.name}
                      </a>
                    </h4>
                    <p className="text-sm leading-body">{service.text}</p>
                    <a
                      href={telHref}
                      aria-label={`Call ${business.name} at ${business.phone.display}`}
                      className="relative z-[1] w-fit text-sm font-semibold text-accent no-underline hover:text-accent-deep"
                    >
                      {business.phone.display}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
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
