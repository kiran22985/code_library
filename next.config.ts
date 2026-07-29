import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The site used to be a fully static export. Adding accounts means it now
   * needs a server for the /api/auth and /api/progress routes, so it runs as a
   * Next.js server (Render Web Service).
   *
   * Everything else is unchanged: all 76 lesson pages are still prerendered at
   * build time and served as static HTML. Only the API routes are dynamic, and
   * the session is read from the client, so pages stay cacheable.
   */
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
