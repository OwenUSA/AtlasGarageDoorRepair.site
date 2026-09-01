// Rule band — reference s08, FIDELITY. Zero content, solid colour, fixed height 108px.
// Keep it empty. This is the one section a pixel diff is exactly the right instrument for.

export function RuleBand() {
  return (
    <section
      data-section="s08"
      className="relative block w-full bg-primary-deep py-band"
      aria-hidden="true"
    />
  );
}
