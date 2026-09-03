import type { Metadata } from 'next';
import { copy } from '../../../content/copy';
import { business } from '@/lib/business';
import { HeroStrip } from '@/components/about/HeroStrip';
import { TitleBand } from '@/components/about/TitleBand';
import { RuleBand } from '@/components/about/RuleBand';
import { OurMission } from '@/components/about/OurMission';
import { ReliablePros } from '@/components/about/ReliablePros';
import { OurTeam } from '@/components/about/OurTeam';
import { OurServices } from '@/components/about/OurServices';
import { CtaBand } from '@/components/about/CtaBand';

const page = copy.routes['/about'];

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
  alternates: { canonical: '/about' },
  openGraph: {
    title: page.meta.title,
    description: page.meta.description,
    url: '/about',
    siteName: business.name,
    type: 'website',
    images: [
      {
        url: '/placeholders/about-photo.svg',
        width: 1440,
        height: 697,
        alt: `${business.name} team in Edmond, OK`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: page.meta.title,
    description: page.meta.description,
    images: ['/placeholders/about-photo.svg'],
  },
};

/**
 * About. Reference `/about-vh1/`, docs/sections.md. s00/s01 are the shared header, s11 is
 * the shared footer (both rendered by the frozen shell in layout.tsx) — neither is built
 * here.
 */
export default function Page() {
  return (
    <>
      <HeroStrip />
      <TitleBand />
      <RuleBand id="s04" />
      <OurMission />
      <ReliablePros />
      <OurTeam />
      <OurServices />
      <RuleBand id="s09" />
      <CtaBand />
    </>
  );
}
