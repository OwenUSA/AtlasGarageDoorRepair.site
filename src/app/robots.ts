import type { MetadataRoute } from 'next';
import { business } from '@/lib/business';

// No trackers, no crawl traps, five routes. D-15: nothing to disallow that we do not ship.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${business.url}/sitemap.xml`,
  };
}

// output: "export" cannot infer this metadata route is static; say so explicitly.
export const dynamic = "force-static";
