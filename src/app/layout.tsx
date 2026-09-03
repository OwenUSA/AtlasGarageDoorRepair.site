import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { CallBar } from '@/components/CallBar';
import { JsonLd } from '@/components/JsonLd';
import { business } from '@/lib/business';
import { copy } from '../../content/copy';

// Montserrat is SIL OFL and is the reference's only design face (Prompt 2 disproved the
// GD Sherpa substitution). Self-hosted by next/font at build time, no CDN call.
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(business.url),
  title: copy.routes['/'].meta.title,
  description: copy.routes['/'].meta.description,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    title: copy.routes['/'].meta.title,
    description: copy.routes['/'].meta.description,
    url: '/',
    siteName: business.name,
    type: 'website',
    images: [
      {
        url: '/placeholders/home-hero-media.jpg',
        width: 1920,
        height: 1080,
        alt: `${business.name} — garage door repair in Naples, FL`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: copy.routes['/'].meta.title,
    description: copy.routes['/'].meta.description,
    images: ['/placeholders/home-hero-media.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="min-h-dvh pb-callbar md:pb-0">
        <a href="#main" className="skip-link">Skip to content</a>
        <SiteHeader />
        <main id="main" style={{ scrollMarginTop: 'var(--spacing-header)' }}>
          {children}
        </main>
        <SiteFooter />
        <CallBar />
        <JsonLd />
      </body>
    </html>
  );
}
