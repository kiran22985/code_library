/**
 * Google AdSense configuration.
 *
 * Everything is driven by environment variables so the publisher and slot IDs
 * are not hard-coded, and so ads stay switched off locally: without
 * NEXT_PUBLIC_ADSENSE_CLIENT nothing renders and no script loads.
 *
 * Set these in Render -> Environment (and .env.local if you ever want to see
 * them locally — but see the warning in the README about never clicking your
 * own ads).
 */

/** Your publisher ID, e.g. "ca-pub-1234567890123456". */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

/**
 * Ad unit slot IDs, created in AdSense -> Ads -> By ad unit. Each is optional:
 * a slot left unset simply does not render, so you can roll units out one at a
 * time.
 */
export const AD_SLOTS = {
  /** Below the lesson title, above the body. */
  lessonTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LESSON_TOP ?? "",
  /** After the lesson content, above the prev/next navigation. */
  lessonBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LESSON_BOTTOM ?? "",
  /** On the course syllabus page. */
  course: process.env.NEXT_PUBLIC_ADSENSE_SLOT_COURSE ?? "",
} as const;

/**
 * Ads render only in production with a publisher ID present. This keeps them
 * out of `npm run dev` — accidentally clicking your own ad in development is
 * one of the fastest ways to get an AdSense account banned.
 */
export const adsEnabled =
  Boolean(ADSENSE_CLIENT) && process.env.NODE_ENV === "production";
