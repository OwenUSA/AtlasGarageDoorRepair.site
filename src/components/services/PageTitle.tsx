// Page title band — reference s03-roofing-services, ADAPTED. 251px, our title + intro line.

import { copy } from '../../../content/copy';

const s = copy.routes['/services'].sections.find((x) => x.id === 's03-roofing-services')!;

export function PageTitle() {
  return (
    <section data-section="s03-roofing-services" className="block w-full bg-surface">
      <div className="mx-auto flex min-h-[251px] max-w-content flex-col justify-center gap-tight px-4 py-band md:px-gutter">
        <h1 className="text-6xl font-semibold leading-heading text-primary md:text-7xl">
          {s.heading}
        </h1>
        <p className="max-w-[60ch] text-base leading-body">{s.body?.[0]}</p>
      </div>
    </section>
  );
}
