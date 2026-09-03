// Service card — docs/behavior/04-service-card-hover-press.md. Reference has no
// interactive cards (stacked text); this is a deliberate addition for our symptom-grouped
// layout, held to the reference's own transition character.
//
// Stretched-link pattern: one <a> wraps the SERVICE NAME only, with a stretched ::after
// covering the card. The card itself is not a link and not a button. A separate tel: link
// sits below, not folded into the stretched link. Hover only above 768 (Tailwind's
// `hover:` variant is gated to `@media (hover: hover)` by default in v4, matching the
// spec's `(hover: hover) and (pointer: fine)` requirement). Press returns to rest.

import { telHref } from '@/lib/business';

export function ServiceCard({ name, text }: { name: string; text: string }) {
  return (
    <li
      className={[
        'service-card group relative flex flex-col gap-tight border border-border bg-surface p-5',
        'transition-[transform,box-shadow] duration-[var(--duration-base)] ease-out',
        'hover:-translate-y-0.5 hover:shadow-raised hover:duration-[var(--duration-quick)]',
        'active:translate-y-0 active:duration-[var(--duration-fast)]',
      ].join(' ')}
    >
      <h4 className="text-lg font-semibold leading-heading text-primary">
        <a href="/contact/" className="text-primary no-underline after:absolute after:inset-0 after:content-['']">
          {name}
        </a>
      </h4>
      <p className="text-sm leading-body">{text}</p>
      <a
        href={telHref}
        className="relative z-10 inline-flex w-fit items-center text-sm font-semibold text-accent no-underline hover:text-accent-deep"
      >
        Call about this
      </a>
    </li>
  );
}
