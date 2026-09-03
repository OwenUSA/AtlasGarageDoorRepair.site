// Hero image strip — reference s02, ADAPTED (reclassified in Prompt 3: image subject
// swapped, D-09). Pure image band, 100px at every breakpoint. Placeholder-blocked until
// Prompt 10 hands back `about-title-bg` (assets/INVENTORY.md).

export function HeroStrip() {
  return (
    <section
      data-section="s02"
      className="block h-[100px] w-full bg-neutral-400 bg-cover bg-center"
      style={{ backgroundImage: "url('/placeholders/about-title-bg.jpg')" }}
      aria-hidden="true"
    />
  );
}
