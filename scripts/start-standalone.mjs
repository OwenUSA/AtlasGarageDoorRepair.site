// Hostinger assigns the port via $PORT and health-checks it. Fall back to this
// site's fixed local port so `pnpm start` still behaves locally.
process.env.PORT ||= "3101";
process.env.HOSTNAME ||= "0.0.0.0";
await import("../.next/standalone/server.js");
