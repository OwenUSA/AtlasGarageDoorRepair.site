import { localBusinessJsonLd } from '@/lib/business';

/**
 * LocalBusiness JSON-LD. Built entirely from lib/business.ts.
 * No email, no aggregateRating, no review, no priceRange, no areaServed city array.
 */
export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
    />
  );
}
