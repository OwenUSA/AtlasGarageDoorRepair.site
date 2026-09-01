import type { Metadata } from 'next';
import { copy } from '../../../content/copy';

const page = copy.routes['/services'];

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
  alternates: { canonical: '/services' },
};

export default function Page() {
  // Prompt 5: shell only. Sections land in Prompts 6-7.
  return <div data-section="route-stub-services" style={{ minHeight: '40vh' }} />;
}
