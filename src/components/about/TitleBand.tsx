// Page title band — reference s03-about-vh1-roofing, ADAPTED. Our business name, our
// page title. 129px @1440 (grows to 189px on mobile where the two lines stack).
// The reference "background image" here is a gradient (accent-deep -> accent), the
// same tokens as the home hero — no asset behind it (Prompt 2).

import { copy } from '../../../content/copy';

const s = copy.routes['/about'].sections.find((x) => x.id === 's03-about-vh1-roofing')!;

export function TitleBand() {
  return (
    <section
      data-section="s03-about-vh1-roofing"
      className="block w-full bg-linear-to-b from-accent-deep to-accent text-surface pt-hair pb-tight"
    >
      <div className="mx-auto flex min-h-[189px] max-w-content flex-col justify-center gap-tight px-4 md:min-h-[129px] md:flex-row md:items-center md:justify-between md:px-gutter">
        <h1 className="max-w-[28ch] text-4xl font-semibold leading-heading text-surface md:text-5xl">
          {s.heading}
        </h1>
        <p className="text-md leading-body text-surface">{s.subheading}</p>
      </div>
    </section>
  );
}
