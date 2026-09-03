// CTA band — reference s04, ADAPTED. 302px, grey band (neutral-400). Shared shape with
// the /about and /services CTA bands per docs/sections.md.

import { business, telHref } from '@/lib/business';
import { Button } from '@/components/primitives';
import { copy } from '../../../content/copy';

const s = copy.routes['/privacy'].sections.find((x) => x.id === 's04')!;

export function CtaBand() {
  return (
    <section
      data-section="s04"
      className="relative block w-full bg-neutral-400 pt-snug pb-gutter font-medium text-neutral-900"
    >
      <div className="mx-auto flex min-h-[302px] max-w-content flex-col items-center justify-center gap-loose px-4 py-band text-center md:px-gutter">
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
          {s.cta?.secondary ? (
            <Button href="/contact/" variant="secondary">
              {s.cta.secondary}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
