// Short impact band — reference s05-we-get-the-job-done, ADAPTED. 173px, workmanship line.

import { copy } from '../../../content/copy';

const s = copy.routes['/services'].sections.find((x) => x.id === 's05-we-get-the-job-done')!;

export function ImpactBand() {
  return (
    <section data-section="s05-we-get-the-job-done" className="block w-full bg-primary text-surface pt-hair pb-tight">
      <div className="mx-auto flex min-h-[173px] max-w-content flex-col items-center justify-center gap-tight px-4 text-center md:px-gutter">
        <h2 className="text-3xl font-bold leading-heading text-surface md:text-4xl">{s.heading}</h2>
        <p className="max-w-[52ch] text-sm font-medium uppercase leading-body tracking-wide text-surface">
          {s.body?.[0]}
        </p>
      </div>
    </section>
  );
}
