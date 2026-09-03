// CTA band — reference s10, ADAPTED. 302px, grey band (neutral-400). Own copy, call-first
// CTA pair, shared shape with the /services and /privacy CTA bands per docs/sections.md.

import { business, telHref } from '@/lib/business';
import { Button } from '@/components/primitives';
import { copy } from '../../../content/copy';

const s = copy.routes['/about'].sections.find((x) => x.id === 's10')!;

export function CtaBand() {
  return (
    <section data-section="s10" className="block w-full bg-neutral-400 text-neutral-900 pt-snug pb-gutter">
      <div className="mx-auto flex min-h-[302px] max-w-content flex-col items-center justify-center gap-loose px-4 text-center md:px-gutter">
        <h2 className="max-w-[32ch] text-3xl font-semibold leading-heading text-primary">{s.heading}</h2>
        {s.body?.map((para) => (
          <p key={para} className="max-w-[52ch] text-base leading-body">{para}</p>
        ))}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button
            href={telHref}
            variant="cta"
            aria-label={`Call ${business.name} at ${business.phone.display}`}
          >
            {s.cta?.primary}
          </Button>
          <Button href="/contact/" variant="secondary">
            {s.cta?.secondary}
          </Button>
        </div>
      </div>
    </section>
  );
}
