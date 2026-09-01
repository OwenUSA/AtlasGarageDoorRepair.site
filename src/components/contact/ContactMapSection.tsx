// contact-map — NOVEL, no reference counterpart (the reference /contact/ embeds no map).
// D-08: coords-only keyless embed at zoom 15, beside the phone/address text, lazy,
// titled, fixed aspect-ratio wrapper, directions link. Consumes the lead-owned, frozen
// <BusinessMap> — not modified here.

import { business } from '@/lib/business';
import { BusinessMap } from '@/components/BusinessMap';
import { copy } from '../../../content/copy';

const s = copy.routes['/contact'].sections.find((x) => x.id === 'contact-map')!;

export function ContactMapSection() {
  return (
    <section data-section="contact-map" className="block w-full bg-neutral-200">
      <div className="mx-auto grid max-w-content gap-wide px-4 py-band md:grid-cols-[1fr_1fr] md:items-center md:px-gutter">
        <div className="flex flex-col gap-tight">
          <h2 className="text-4xl font-semibold leading-heading text-primary">{s.heading}</h2>
          <p className="max-w-[42ch] text-base leading-body">{business.address.display}</p>
        </div>
        <BusinessMap zoom={15} />
      </div>
    </section>
  );
}
