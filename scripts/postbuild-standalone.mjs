// next build with output:"standalone" emits a self-contained server.js but does NOT
// copy public/ or .next/static into it -- Next leaves that to the deploy step. Without
// this the server boots and every page 200s with no CSS, no JS and no images.
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const standalone = join(root, ".next", "standalone");

if (!existsSync(standalone)) {
  // Expected on Windows, where next.config skips standalone output entirely.
  console.log("[postbuild] no .next/standalone - skipping asset copy");
  process.exit(0);
}

for (const [from, to] of [
  [join(root, "public"), join(standalone, "public")],
  [join(root, ".next", "static"), join(standalone, ".next", "static")],
]) {
  if (!existsSync(from)) continue;
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true });
  console.log("[postbuild] copied " + from.slice(root.length + 1) + " -> standalone");
}
