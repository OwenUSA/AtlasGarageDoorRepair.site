// s03 — ADAPTED. Reference: Gravity Forms with 8 visible fields (incl. email + reCAPTCHA)
// beside a WP logo image, 1739px @1440. D-03/D-05: ours is name, phone, service select,
// callback-window select, message — no email, no captcha, no backend — beside an info
// card built from lib/business.ts. Field count and box geometry are matched so the
// two-column layout is tested honestly; the reference's 5883-char figure includes the
// full Gravity Forms DOM (every select option, hidden label, consent paragraph, reCAPTCHA
// notice) and is exempt in scripts/similarity.mjs — not chased here.

import { business, telHref } from '@/lib/business';
import { copy } from '../../../content/copy';
import { ContactForm } from './ContactForm';

const s = copy.routes['/contact'].sections.find((x) => x.id === 's03')!;

export function ContactSection() {
  return (
    <section data-section="s03" className="relative block w-full bg-surface">
      <div className="mx-auto max-w-content px-4 py-band md:px-gutter">
        <div className="grid gap-band-lg md:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-loose">
            <h1 className="text-6xl font-semibold leading-heading text-primary">{s.heading}</h1>
            <p className="max-w-[60ch] text-base leading-body">{s.subheading}</p>
            <ContactForm />
            {s.body?.map((p) => (
              <p key={p} className="max-w-[60ch] text-sm leading-body text-neutral-600">
                {p}
              </p>
            ))}
          </div>

          <aside className="flex flex-col gap-loose bg-neutral-200 px-gutter py-wide">
            <h2 className="text-lg font-semibold leading-heading text-primary">Reach us directly</h2>
            <dl className="flex flex-col gap-loose">
              {s.items?.map((item) => (
                <div key={item.title} className="flex flex-col gap-hair">
                  <dt className="text-2xs font-semibold uppercase tracking-wide text-neutral-600">
                    {item.title}
                  </dt>
                  <dd className="text-base leading-body text-primary">
                    {item.title === 'Phone' ? (
                      <a
                        href={telHref}
                        aria-label={`Call ${business.name} at ${business.phone.display}`}
                        className="text-primary no-underline hover:text-accent"
                      >
                        {business.phone.display}
                      </a>
                    ) : item.title === 'Address' ? (
                      business.address.display
                    ) : item.title === 'Hours' ? (
                      business.hours.display
                    ) : (
                      business.serviceArea
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </div>
    </section>
  );
}
