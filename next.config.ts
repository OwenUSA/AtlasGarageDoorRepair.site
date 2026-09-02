import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  // Hostinger runs this as a Node app, so the Linux build emits
  // .next/standalone/server.js. Skipped on Windows: standalone tracing symlinks
  // into the pnpm store and dies with EPERM unless Developer Mode is on, which
  // would break the local `pnpm build` acceptance gate for no deploy benefit.
  output: process.platform === 'win32' ? undefined : 'standalone', reactStrictMode: true, images: { unoptimized: true } };
export default nextConfig;
