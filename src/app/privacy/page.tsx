import type { Metadata } from 'next';
import { copy } from '../../../content/copy';
import { business } from '@/lib/business';
import { TitleBand } from '@/components/privacy/TitleBand';
import { PolicyBody } from '@/components/privacy/PolicyBody';
import { CtaBand } from '@/components/privacy/CtaBand';

const page = copy.routes['/privacy'];

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: page.meta.title,
    description: page.meta.description,
    url: '/privacy',
    siteName: business.name,
    type: 'website',
    images: [
      {
        url: '/placeholders/logo-primary.svg',
        width: 300,
        height: 120,
        alt: `${business.name} logo`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: page.meta.title,
    description: page.meta.description,
    images: ['/placeholders/logo-primary.svg'],
  },
};

/**
 * Privacy. Reference `/privacy-policy/`, docs/sections.md. s00/s01 are the shared header,
 * s05 is the shared footer (both rendered by the frozen shell in layout.tsx) — neither is
 * built here. s05's reference content (NAP, hours, page links) is identical in substance
 * to the site footer already rendered by the shell, so it is intentionally not duplicated.
 */
export default function Page() {
  return (
    <>
      <TitleBand />
      <PolicyBody />
      <CtaBand />
    </>
  );
}
