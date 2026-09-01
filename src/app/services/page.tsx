import type { Metadata } from 'next';
import { copy } from '../../../content/copy';
import { TitleStrip } from '@/components/services/TitleStrip';
import { PageTitle } from '@/components/services/PageTitle';
import { AnchorNav } from '@/components/services/AnchorNav';
import { ServicesBody } from '@/components/services/ServicesBody';
import { ImpactBand } from '@/components/services/ImpactBand';
import { Faq } from '@/components/services/Faq';
import { CtaBand } from '@/components/services/CtaBand';

const page = copy.routes['/services'];

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
  alternates: { canonical: '/services' },
};

/**
 * /services. s00/s01 (top bar, header) are the frozen shell, rendered by layout.tsx.
 * s08 (footer-adjacent band) is purely the site footer — also shell-rendered — so it is
 * not duplicated here; see docs/BUILDER-BRIEF handback note in the report.
 */
export default function Page() {
  return (
    <>
      <TitleStrip />
      <PageTitle />
      <AnchorNav />
      <ServicesBody />
      <ImpactBand />
      <Faq />
      <CtaBand />
    </>
  );
}
