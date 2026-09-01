import type { MetadataRoute } from 'next';
import { business, routes } from '@/lib/business';

// Exactly the five routes in CONSTANTS. No /locations/*, no per-service routes (D-01, D-02).
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((r) => ({
    url: `${business.url}${r.href === '/' ? '' : r.href}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: r.href === '/' ? 1 : 0.8,
  }));
}
