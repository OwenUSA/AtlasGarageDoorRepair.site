// What we handle — reference s08-our-services, ADAPTED. 1085px @1440. Our eight services,
// regrouped by symptom (same regrouping as `/`, Prompt 3 structural gate item 5). The
// reference ends this band with a partner-logo image (`lo33.jpg`, 970x137) — ours is the
// `about-partner-logo` slot, a TODO(fact) placeholder chip per D-14 (we hold no partner
// affiliation we may name), at the same box.

import { FactChip } from '@/components/primitives';
import { copy } from '../../../content/copy';

const s = copy.routes['/about'].sections.find((x) => x.id === 's08-our-services')!;

export function OurServices() {
  return (
    <section data-section="s08-our-services" className="block w-full bg-surface">
      <div className="mx-auto flex min-h-[1085px] max-w-content flex-col gap-wide px-4 py-band md:px-gutter">
        <div className="flex flex-col gap-tight">
          <h2 className="text-4xl font-semibold leading-heading text-primary">{s.heading}</h2>
          <p className="max-w-[70ch] text-base leading-body">{s.subheading}</p>
        </div>
        <div className="grid grid-cols-1 gap-loose md:grid-cols-3">
          {s.groups?.map((group) => (
            <div key={group.symptom} className="flex flex-col gap-tight border border-border p-loose">
              <h3 className="text-lg font-semibold leading-heading text-primary">{group.symptom}</h3>
              <p className="text-sm leading-body text-neutral-600">{group.lead}</p>
              <ul className="flex list-none flex-col gap-tight p-0 text-sm leading-body">
                {group.services.map((svc) => (
                  <li key={svc.name}>
                    <span className="font-semibold text-neutral-900">{svc.name}.</span> {svc.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <FactChip label="TODO(fact): partner / affiliation logo" className="h-[137px] w-full max-w-[970px]" />
      </div>
    </section>
  );
}
