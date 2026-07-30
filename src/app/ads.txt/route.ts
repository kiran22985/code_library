import { ADSENSE_CLIENT } from "@/lib/ads";

/**
 * Serves /ads.txt, the file Google checks to confirm who is authorised to sell
 * ad space on this domain. Without it AdSense shows a warning and some buyers
 * refuse to bid, which costs revenue.
 *
 * It is generated from NEXT_PUBLIC_ADSENSE_CLIENT rather than committed as a
 * static file, so it always matches the publisher ID the site is actually
 * running with.
 */
export const dynamic = "force-static";

export function GET() {
  if (!ADSENSE_CLIENT) {
    return new Response("# NEXT_PUBLIC_ADSENSE_CLIENT is not set\n", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // The publisher ID in ads.txt is written without the "ca-" prefix.
  const publisherId = ADSENSE_CLIENT.replace(/^ca-/, "");

  return new Response(
    `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}
