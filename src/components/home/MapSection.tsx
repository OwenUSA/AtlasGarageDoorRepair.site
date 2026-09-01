// Home map section — NOVEL. LEAD-OWNED (consumes the frozen <BusinessMap>).
//
// D-08: home map at zoom ~13, placed below services and above the footer. Replaces the
// reference's deleted s14 service-area band (D-02) — that band carried a Google My Maps
// city overlay, which is a locations feature and is gone. This is a single location pin,
// embedded by coordinates only (D-07).
// Reference band geometry for the slot it replaces: 806px @1440, pad 54/33.

import { business } from '@/lib/business';
import { BusinessMap } from '@/components/BusinessMap';
import { copy } from '../../../content/copy';

const s = copy.routes['/'].sections.find((x) => x.id === 'home-map')!;

export function MapSection() {
  return (
    <section data-section="home-map" className="block w-full bg-surface">
      <div className="mx-auto max-w-content px-4 py-band md:px-gutter">
        <h2 className="text-5xl font-semibold leading-heading text-primary">{s.heading}</h2>
        <p className="mt-4 max-w-[52ch] text-base leading-body">{business.serviceArea}</p>
        <BusinessMap zoom={13} className="mt-wide" />
      </div>
    </section>
  );
}
