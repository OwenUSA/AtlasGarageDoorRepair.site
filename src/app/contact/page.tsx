import type { Metadata } from 'next';
import { copy } from '../../../content/copy';
import { AnnouncementStrip } from '@/components/contact/AnnouncementStrip';
import { ContactSection } from '@/components/contact/ContactSection';
import { ContactMapSection } from '@/components/contact/ContactMapSection';

const page = copy.routes['/contact'];

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
  alternates: { canonical: '/contact' },
};

/**
 * /contact. s00-top-header and s01-main-header come from the frozen shell (SiteHeader).
 * s04 (footer band, 305px grey, matches the reference's box exactly — see
 * .harness/cap/ref/contact-1440/meta.json) is already rendered by the frozen shell
 * (SiteFooter in layout.tsx) — not duplicated here.
 */
export default function Page() {
  return (
    <>
      <AnnouncementStrip />
      <ContactSection />
      <ContactMapSection />
    </>
  );
}
