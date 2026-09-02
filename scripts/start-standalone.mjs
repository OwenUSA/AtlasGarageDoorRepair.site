// Hostinger assigns the port via $PORT and health-checks it. Fall back to this
// site's fixed local port so `pnpm start` still behaves locally.
process.env.PORT ||= "3101";
process.env.HOSTNAME ||= "0.0.0.0";

// next.config.ts sets `output: 'standalone'` on Linux only -- on Windows the
// standalone tracer symlinks into the pnpm store and dies with EPERM. So on a
// Windows build there is no .next/standalone/server.js and `pnpm start` has to
// fall through to `next start`, which serves the SAME .next build. Without this
// the Prompt 11 acceptance sweep cannot start the production server at all.
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const standalone = fileURLToPath(new URL("../.next/standalone/server.js", import.meta.url));

if (existsSync(standalone)) {
  await import("../.next/standalone/server.js");
} else {
  const child = spawn(
    process.execPath,
    [fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url)), "start", "-p", process.env.PORT],
    { stdio: "inherit", env: process.env },
  );
  child.on("exit", (code) => process.exit(code ?? 0));
}
