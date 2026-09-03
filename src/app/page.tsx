import type { Metadata } from 'next';
import { copy } from '../../content/copy';
import { business } from '@/lib/business';
import { AnnouncementStrip } from '@/components/home/AnnouncementStrip';
import { Hero } from '@/components/home/Hero';
import { Services } from '@/components/home/Services';
import { Intro } from '@/components/home/Intro';
import { BadgeRow } from '@/components/home/BadgeRow';
import { RuleBand } from '@/components/home/RuleBand';
import { Process } from '@/components/home/Process';
import { StatStrip } from '@/components/home/StatStrip';
import { CtaBand } from '@/components/home/CtaBand';
import { Testimonials } from '@/components/home/Testimonials';
import { MapSection } from '@/components/home/MapSection';
import { NapHours } from '@/components/home/NapHours';

const page = copy.routes['/'];

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
  alternates: { canonical: '/' },
  openGraph: {
    title: page.meta.title,
    description: page.meta.description,
    url: '/',
    siteName: business.name,
    type: 'website',
    images: [
      {
        url: '/placeholders/home-hero-media.svg',
        width: 1920,
        height: 1080,
        alt: `${business.name} — garage door repair in Edmond, OK`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: page.meta.title,
    description: page.meta.description,
    images: ['/placeholders/home-hero-media.svg'],
  },
};

/**
 * Home. Section order per docs/content-divergence.md — four bands move relative to the
 * reference: services 13th -> 5th, stats 12th -> 10th, CTA 10th -> 11th, testimonials
 * 11th -> 12th. Reference s05 (grant promo) and s07 (brand strip) are dropped; s14
 * (service-area map) is deleted under D-02 and replaced by <MapSection>; s15 (FAQ) is
 * relocated to /services.
 */
export default function Page() {
  return (
    <>
      <AnnouncementStrip />
      <Hero />
      <Services />
      <Intro />
      <BadgeRow />
      <RuleBand />
      <Process />
      <StatStrip />
      <CtaBand />
      <Testimonials />
      <MapSection />
      <NapHours />
    </>
  );
}
