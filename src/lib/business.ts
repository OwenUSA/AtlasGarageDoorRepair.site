// src/lib/business.ts — SINGLE SOURCE OF TRUTH for every business fact.
//
// Every component reads from here. A hard-coded phone number, address fragment,
// coordinate or hours string anywhere else in the codebase is a bug, and Prompt 11
// gate 4 greps for exactly that.
//
// Real business facts, verified against domains-table.md. Coordinates were
// geocoded from the street address via the US Census geocoder.

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
    display: '(239) 427-4221',
    /** as used in href="tel:" — E.164, no punctuation */
    tel: '+12394274221',
    /** digits only, for JSON-LD */
    e164: '+1-239-427-4221',
  },

  address: {
    street: '6050 Collier Blvd, Ste 1',
    locality: 'Naples',
    region: 'FL',
    postalCode: '34114',
    country: 'US',
    /** one line, as rendered */
    display: '6050 Collier Blvd, Ste 1, Naples, FL 34114',
  },

  /** Geocoded from the street address (US Census geocoder). */
  geo: {
    lat: 26.0439,
    lng: -81.6999,
    /** "lat,lng" — the only form passed to Google */
    pair: '26.0439,-81.6999',
  },

  hours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '07:00',
    closes: '19:00',
    display: '7 days, 7:00 AM – 7:00 PM',
  } satisfies Hours,

  serviceArea: 'Serving Naples and the surrounding Collier County communities.',

  /** Local only, D-18. Used for canonical URLs and JSON-LD `url`. */
  url: 'https://atlasgaragedoorrepair.site',
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
    image: `${business.url}/placeholders/atlas-door-logo.jpg`,
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
