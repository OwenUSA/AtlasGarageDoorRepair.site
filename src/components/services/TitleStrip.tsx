// Hero image strip — reference s02, ADAPTED (reclassified in Prompt 3: image subject
// swapped, placeholder-blocked until Prompt 10). Pure image band, 100px at every
// breakpoint. No text, no overlay — the reference band carries nothing else.

export function TitleStrip() {
  return (
    <section data-section="s02" className="block h-[100px] w-full overflow-hidden bg-neutral-400">
      <img
        src="/placeholders/services-title-bg.svg"
        alt=""
        aria-hidden="true"
        className="h-[100px] w-full object-cover"
      />
    </section>
  );
}
