import { createClient, type SanityClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

/** Anything Sanity's image builder accepts: an asset ref, or an image object. */
export type SanityImageSource =
  | { asset: { _ref: string } | { _id: string }; hotspot?: unknown; crop?: unknown }
  | { _ref: string }
  | string;

/**
 * Sanity connection.
 *
 * Scoped to blog posts. Page content is not in Sanity — it lives in
 * src/content/ as typed modules.
 *
 * The client is OPTIONAL on purpose: until the Sanity project exists, or in a
 * CI job without credentials, `getClient()` returns null and the site falls
 * back to the seed posts in src/content/posts/seed.ts. A missing CMS must
 * never fail the build — it degrades to fewer posts, not a broken deploy.
 *
 * Required env (see .env.example):
 *   PUBLIC_SANITY_PROJECT_ID
 *   PUBLIC_SANITY_DATASET       (defaults to "production")
 *   SANITY_API_READ_TOKEN       (optional — only needed for draft previews)
 */

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET ?? "production";
const token = import.meta.env.SANITY_API_READ_TOKEN;

let client: SanityClient | null = null;

export function getClient(): SanityClient | null {
  if (!projectId) return null;
  if (client) return client;

  client = createClient({
    projectId,
    dataset,
    // Pin the API version. Sanity's API is dated; leaving this floating means a
    // future API change can alter query results without a code change.
    apiVersion: "2026-08-01",
    // Content is read at build time and baked into static HTML, so the CDN is
    // the right source: cheaper and faster than hitting the API directly.
    useCdn: !token,
    ...(token ? { token, perspective: "published" as const } : {}),
  });

  return client;
}

export const isSanityConfigured = Boolean(projectId);

/**
 * Build a URL for a Sanity image asset.
 *
 * Returns null when Sanity is not configured. Callers must handle that — the
 * seed posts use plain string URLs instead.
 */
export function urlForImage(source: SanityImageSource) {
  if (!projectId) return null;
  return imageUrlBuilder({ projectId, dataset }).image(source);
}

/**
 * Responsive `srcset` for a Sanity image.
 *
 * `auto("format")` makes the CDN negotiate AVIF/WebP per browser, which is the
 * single biggest win over the current site (9.4MB of unoptimised PNG on the
 * homepage alone, zero WebP anywhere).
 */
export function imageSrcSet(
  source: SanityImageSource,
  widths: number[] = [480, 768, 1024, 1440]
): { src: string; srcset: string } | null {
  const builder = urlForImage(source);
  if (!builder) return null;

  const url = (w: number) =>
    builder.width(w).auto("format").fit("max").quality(78).url();

  return {
    src: url(widths[widths.length - 1]),
    srcset: widths.map((w) => `${url(w)} ${w}w`).join(", "),
  };
}
