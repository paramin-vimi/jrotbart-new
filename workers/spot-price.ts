/**
 * Cloudflare Worker — GET /api/spot
 *
 * Serves live precious-metal spot prices to the homepage ticker.
 *
 * Why this exists rather than calling metals.dev from the browser:
 *   - The API key stays server-side. On the CURRENT site it is embedded in a
 *     client-side asset, publicly readable and cacheable, so anyone can read
 *     it and burn the quota. That key must be rotated before launch; the
 *     specific location is in the readiness report, deliberately not here,
 *     because this repository is public and the old key is still live.
 *   - One upstream call per 60 seconds is shared by every visitor, instead of
 *     one call per visitor per page load.
 *   - We can degrade gracefully instead of leaving the ticker blank.
 *
 * Deploy:
 *   wrangler secret put METALS_DEV_API_KEY
 *   wrangler deploy
 *
 * The key MUST be a freshly rotated one — the key currently in production is
 * compromised by virtue of having been public.
 */

export interface Env {
  /** metals.dev API key. Set via `wrangler secret put METALS_DEV_API_KEY`. */
  METALS_DEV_API_KEY: string;
}

const UPSTREAM = "https://api.metals.dev/v1/latest";
const EDGE_TTL_SECONDS = 60;
/** Serve a slightly stale cached value rather than nothing if upstream blips. */
const STALE_TTL_SECONDS = 600;

const METALS = ["gold", "silver", "platinum", "palladium"] as const;
type Metal = (typeof METALS)[number];

interface SpotResponse {
  currency: string;
  unit: string;
  fetchedAt: string;
  metals: Partial<Record<Metal, number>>;
}

function json(body: unknown, status: number, cacheSeconds: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": `public, max-age=30, s-maxage=${cacheSeconds}, stale-while-revalidate=${STALE_TTL_SECONDS}`,
      // Same-origin in production; the header keeps preview deployments working.
      "access-control-allow-origin": "https://jrotbart.com",
      "x-content-type-options": "nosniff",
    },
  });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method !== "GET") {
      return json({ error: "method_not_allowed" }, 405, 0);
    }

    const cache = caches.default;
    const cacheKey = new Request(new URL(request.url).origin + "/api/spot", request);

    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    if (!env.METALS_DEV_API_KEY) {
      return json({ error: "not_configured" }, 503, 0);
    }

    try {
      const url = new URL(UPSTREAM);
      url.searchParams.set("api_key", env.METALS_DEV_API_KEY);
      url.searchParams.set("currency", "USD");
      url.searchParams.set("unit", "toz");

      const upstream = await fetch(url.toString(), {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(5000),
      });

      if (!upstream.ok) {
        return json({ error: "upstream_error" }, 502, 0);
      }

      const data = (await upstream.json()) as { metals?: Record<string, number> };

      const metals: SpotResponse["metals"] = {};
      for (const metal of METALS) {
        const value = data.metals?.[metal];
        if (typeof value === "number" && Number.isFinite(value)) {
          metals[metal] = Math.round(value * 100) / 100;
        }
      }

      if (Object.keys(metals).length === 0) {
        return json({ error: "no_data" }, 502, 0);
      }

      const body: SpotResponse = {
        currency: "USD",
        unit: "toz",
        fetchedAt: new Date().toISOString(),
        metals,
      };

      const response = json(body, 200, EDGE_TTL_SECONDS);
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    } catch {
      // Never leak upstream error detail to the browser.
      return json({ error: "unavailable" }, 502, 0);
    }
  },
};
