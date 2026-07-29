import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Fully static output: `npm run build` emits an `out/` directory that can be
   * dropped on GitHub Pages, Netlify, S3 or any plain web server.
   */
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
