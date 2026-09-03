// Footer — NAP block, hours, the single SERVICE_AREA sentence (the only D-02 survivor),
// route links. No email column, no locations column, one phone number.

import Link from 'next/link';
import { business, routes, telHref } from '@/lib/business';
import { Container } from './primitives';

export function SiteFooter() {
  return (
    <footer className="w-full bg-neutral-400 text-neutral-900" data-section="site-footer">
      <Container>
        <div className="grid gap-band py-band md:grid-cols-3">
          <div>
            <h2 className="text-lg font-bold">{business.name}</h2>
            <p className="mt-3 text-sm">{business.serviceArea}</p>
          </div>

          {/* NAP block — every value from lib/business.ts */}
          <address className="not-italic text-sm">
            <dl className="grid gap-2">
              <div className="flex gap-2">
                <dt className="font-semibold">Phone</dt>
                <dd>
                  <a
                    href={telHref}
                    aria-label={`Call ${business.name} at ${business.phone.display}`}
                    className="text-neutral-900 hover:text-primary"
                  >
                    {business.phone.display}
                  </a>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold">Address</dt>
                <dd>{business.address.display}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-semibold">Hours</dt>
                <dd>{business.hours.display}</dd>
              </div>
            </dl>
          </address>

          <nav aria-label="Footer">
            <h2 className="text-sm font-semibold uppercase">Pages</h2>
            <ul className="mt-3 grid list-none gap-2 p-0 text-sm">
              {routes.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="no-underline text-neutral-900 hover:text-primary">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-primary py-4 text-2xs">
          <Link href="/privacy" className="text-neutral-900">Privacy Policy</Link>
        </div>
      </Container>
    </footer>
  );
}
