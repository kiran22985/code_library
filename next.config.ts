import type { NextConfig } from "next";

/**
 * When the site is served from a subdirectory — which is what GitHub Pages does
 * for a project site (username.github.io/repo-name) — every internal link and
 * asset URL needs that prefix. The deploy workflow sets this automatically;
 * locally it stays empty so `npm run dev` serves from `/`.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  /**
   * Fully static output: `npm run build` emits an `out/` directory that can be
   * dropped on GitHub Pages, Netlify, S3 or any plain web server.
   */
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
