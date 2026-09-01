// CTA band — reference s07, ADAPTED. 302px, grey, call-first CTA pair, as /about's s10.

import { business, telHref } from '@/lib/business';
import { copy } from '../../../content/copy';

const s = copy.routes['/services'].sections.find((x) => x.id === 's07')!;

export function CtaBand() {
  return (
    <section data-section="s07" className="block w-full bg-neutral-400 text-neutral-900">
      <div className="mx-auto flex min-h-[302px] max-w-content flex-col items-center justify-center gap-wide px-4 py-band text-center md:px-gutter">
        <h2 className="max-w-[28ch] text-4xl font-semibold leading-heading text-primary">{s.heading}</h2>
        <p className="max-w-[60ch] text-base leading-body">{s.body?.[0]}</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href={telHref}
            aria-label={`Call ${business.name} at ${business.phone.display}`}
            className="inline-flex min-h-11 items-center justify-center gap-2 bg-accent px-5 py-3 font-semibold text-surface no-underline transition-colors duration-[var(--duration-quick)] hover:bg-accent-deep"
          >
            {s.cta?.primary}
          </a>
          <a
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center gap-2 border-2 border-primary px-5 py-3 font-semibold text-primary no-underline transition-colors duration-[var(--duration-quick)] hover:bg-primary hover:text-surface"
          >
            {s.cta?.secondary}
          </a>
        </div>
      </div>
    </section>
  );
}
