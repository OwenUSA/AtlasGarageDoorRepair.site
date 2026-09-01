// src/lib/business.ts — SINGLE SOURCE OF TRUTH for every business fact.
//
// Every component reads from here. A hard-coded phone number, address fragment,
// coordinate or hours string anywhere else in the codebase is a bug, and Prompt 11
// gate 4 greps for exactly that.
//
// EVERY VALUE BELOW IS FICTIONAL AND DELIBERATE:
//   - the street address does not exist and must never be sent to a geocoder (D-07)
//   - the coordinates are real Edmond coordinates; the map embeds by coords only
//   - the phone is in the 555-01XX reserved range and cannot ring anyone (D-04)
// All of it is listed in docs/PRE-LAUNCH.md as must-replace-before-public.

export type Hours = {
  /** ISO weekday names, for JSON-LD openingHoursSpecification */
  days: readonly string[];
  opens: string;
  closes: string;
  display: string;
};

export const business = {
  name: 'Atlas Garage Door Repair',
  tagline: 'The repair holds. That is the whole promise.',

  phone: {
    /** as rendered to a human */
    display: '(405) 555-0163',
    /** as used in href="tel:" — E.164, no punctuation */
    tel: '+14055550163',
    /** digits only, for JSON-LD */
    e164: '+1-405-555-0163',
  },

  address: {
    street: '2317 Harrow Bend',
    locality: 'Edmond',
    region: 'OK',
    postalCode: '73013',
    country: 'US',
    /** one line, as rendered */
    display: '2317 Harrow Bend, Edmond, OK 73013',
  },

  /** Real Edmond coordinates. The map is embedded by these, never by the address. */
  geo: {
    lat: 35.6528,
    lng: -97.4781,
    /** "lat,lng" — the only form passed to Google */
    pair: '35.6528,-97.4781',
  },

  hours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '07:00',
    closes: '19:00',
    display: '7 days, 7:00 AM – 7:00 PM',
  } satisfies Hours,

  serviceArea: 'Serving Edmond and the north Oklahoma City metro.',

  /** Local only, D-18. Used for canonical URLs and JSON-LD `url`. */
  url: 'http://localhost:3101',
} as const;

/** Coords-only, keyless map embed (D-07). Never accepts an address. */
export const mapEmbedSrc = (zoom: number) =>
  `https://www.google.com/maps?q=${business.geo.pair}&z=${zoom}&output=embed`;

/** Directions deep link, also coords-only (D-08). */
export const directionsHref =
  `https://www.google.com/maps/dir/?api=1&destination=${business.geo.pair}`;

export const telHref = `tel:${business.phone.tel}`;

export const routes = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy' },
] as const;

/**
 * LocalBusiness JSON-LD, built from the values above.
 * Deliberately absent: email (D-03), aggregateRating and review (D-13),
 * priceRange (D-12), areaServed city array (D-02).
 */
export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    telephone: business.phone.e164,
    url: business.url,
    image: `${business.url}/placeholders/logo-primary.svg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.locality,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: business.geo.lat,
      longitude: business.geo.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [...business.hours.days],
        opens: business.hours.opens,
        closes: business.hours.closes,
      },
    ],
  };
}
