import type { Metadata } from 'next';
import Link from 'next/link';
import { business, telHref, routes } from '@/lib/business';

// Custom 404. Renders inside the shared shell from layout.tsx (header, footer, call bar),
// so it is not a bare error page — a visitor who mistypes still has the phone number.

export const metadata: Metadata = {
  title: `Page not found | ${business.name}`,
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section data-section="not-found" className="block w-full bg-surface pt-band pb-band">
      <div className="mx-auto max-w-content px-4 md:px-gutter">
        <h1 className="text-7xl font-bold leading-heading text-primary">Page not found</h1>
        <p className="mt-wide max-w-[52ch] text-base leading-body">
          That page does not exist. If you are looking for help with a garage door, the
          quickest route is the phone — a person answers it between 7:00 AM and 7:00 PM,
          every day.
        </p>
        <div className="mt-wide flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href={telHref}
            aria-label={`Call ${business.name} at ${business.phone.display}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 bg-accent px-5 py-3 font-semibold text-surface no-underline transition-colors duration-[var(--duration-quick)] hover:bg-accent-deep"
          >
            Call {business.phone.display}
          </a>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center gap-2 border-2 border-primary px-5 py-3 font-semibold text-primary no-underline transition-colors duration-[var(--duration-quick)] hover:bg-primary hover:text-surface"
          >
            Back to home
          </Link>
        </div>
        <nav aria-label="All pages" className="mt-wide">
          <ul className="flex list-none flex-wrap gap-4 p-0 text-sm">
            {routes.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="font-semibold">{r.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
