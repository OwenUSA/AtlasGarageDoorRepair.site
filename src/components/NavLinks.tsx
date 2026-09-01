'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { routes } from '@/lib/business';

/** Five routes. No Locations item — the whole tree is scrubbed per D-02. */
export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex list-none items-center gap-6 p-0">
      {routes.map((r) => (
        <li key={r.href}>
          <Link
            href={r.href}
            aria-current={pathname === r.href ? 'page' : undefined}
            className={
              'text-sm font-semibold uppercase no-underline transition-colors duration-[var(--duration-quick)] ' +
              (pathname === r.href ? 'text-accent' : 'text-primary hover:text-accent')
            }
          >
            {r.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
