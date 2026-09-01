// Navy rule band — reference s04 and s09, both FIDELITY. Zero content, solid colour,
// fixed height 54px (`--spacing-band`, not the 108px `--spacing-rule` used on home s08).
// Keep it empty. Shared by both occurrences on this route via the `id` prop.

export function RuleBand({ id }: { id: 's04' | 's09' }) {
  return (
    <section
      data-section={id}
      className="block h-band w-full bg-primary-deep"
      aria-hidden="true"
    />
  );
}
