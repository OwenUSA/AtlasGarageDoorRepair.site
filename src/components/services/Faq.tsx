// FAQ — reference s06-faq-s, ADAPTED. 782px, navy band. docs/behavior/05-faq-accordion.md.
//
// The reference has zero accordions site-wide (flat stacked text); this one is a
// deliberate addition logged in docs/known-divergence.md because the home FAQ is deleted
// and relocated here onto a page that already carries eight services. Native
// <details>/<summary>, no `useState`, no `name` attribute (multiple panels may be open),
// all closed by default. Do NOT diff this against the reference's flat block on pixel
// area — it is measured structurally, like every other ADAPTED section.
//
// Content is generic garage-door technical FAQ copy from content/copy.ts: nothing about
// response time, pricing, warranty or credentials (verified against the four items below).

import { copy } from '../../../content/copy';

const s = copy.routes['/services'].sections.find((x) => x.id === 's06-faq-s')!;

export function Faq() {
  return (
    <section data-section="s06-faq-s" className="block min-h-[782px] w-full bg-primary-deep text-surface pt-band pb-0">
      <style>{`
        .svc-faq { interpolate-size: allow-keywords; }
        .svc-faq summary { list-style: none; cursor: pointer; }
        .svc-faq summary::-webkit-details-marker { display: none; }
        .svc-faq summary::marker { content: ""; }
        .svc-faq .svc-faq-chevron {
          transition: transform var(--duration-base) var(--ease-out-quint);
          flex: none;
        }
        .svc-faq details[open] .svc-faq-chevron { transform: rotate(180deg); }
        .svc-faq details::details-content {
          overflow: hidden;
          height: 0;
          opacity: 0;
          transition:
            height var(--duration-base) var(--ease-out-quint),
            opacity var(--duration-fast) var(--ease-out-quint),
            content-visibility var(--duration-base) allow-discrete;
        }
        .svc-faq details[open]::details-content {
          height: auto;
          opacity: 1;
          transition:
            height var(--duration-base) var(--ease-out-quint),
            opacity var(--duration-quick) var(--ease-out-quint) 0.06s,
            content-visibility var(--duration-base) allow-discrete;
        }
        @media (prefers-reduced-motion: reduce) {
          .svc-faq .svc-faq-chevron { transition: none; }
          .svc-faq details::details-content,
          .svc-faq details[open]::details-content { transition: none; }
        }
      `}</style>
      <div className="mx-auto grid max-w-content gap-wide px-4 md:grid-cols-2 md:px-gutter md:items-start">
        <div className="order-2 md:order-1">
          <h2 className="mb-loose text-4xl font-semibold leading-heading text-surface">{s.heading}</h2>
          <div className="svc-faq flex flex-col">
            {s.items?.map((item) => (
              <details key={item.title} className="border-b border-surface/20 py-tight">
                <summary className="flex min-h-11 items-center justify-between gap-4 py-tight">
                  <h3 className="text-lg font-medium leading-heading text-surface">{item.title}</h3>
                  <svg
                    className="svc-faq-chevron"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <p className="max-w-[60ch] pb-tight text-sm leading-body text-surface">{item.text}</p>
              </details>
            ))}
          </div>
        </div>
        <img
          src="/placeholders/services-faq-bg.svg"
          alt=""
          aria-hidden="true"
          className="order-1 h-[674px] w-full object-cover md:order-2"
        />
      </div>
    </section>
  );
}
