import type { Vault } from "./types";

/**
 * Vault locations — the red dots and crown pins on the office-listing map
 * (Figma 10980:13178) and the "16 Vaults" statistic everywhere it appears.
 *
 * COUNT CONFLICT, for the client to settle:
 *   • the design pins SIXTEEN locations (five office cities + eleven dots),
 *   • the map heading on the same frame says "Fifteen Vaults" (10980:13182),
 *   • the live FAQ lists ELEVEN storage locations,
 *   • the homepage About stat says "16 Vaults".
 * This list follows the drawn pins, and every heading or stat that quotes a
 * number now reads `vaults.length`, so there is one place to correct.
 *
 * COORDINATES are city centroids from a gazetteer, good enough to land a pin
 * on the right city at map scale. TODO(client): real vault coordinates (and
 * which are Brink's / Malca-Amit / Le Freeport / other), plus the status of
 * London and Bangkok — London is NOT pinned in the design, Bangkok IS pinned
 * but has no office document yet (see `pendingOffices` in offices.ts).
 *
 * Three drawn dots sit between two candidate cities (office-listing
 * inventory, nodes 10980:13455 / 13460 / 13461). Each carries the plan's
 * reading and a TODO(client): ambiguous pin.
 */
export const vaults: Vault[] = [
  // ---- Office cities that also host a vault (crown pin: Office · Vault) ----
  { _id: "vault-hong-kong", city: "Hong Kong", country: "Hong Kong SAR", geo: { lat: 22.3193, lng: 114.1694 }, officeId: "hong-kong" },
  { _id: "vault-singapore", city: "Singapore", country: "Singapore", geo: { lat: 1.3521, lng: 103.8198 }, officeId: "singapore" },
  { _id: "vault-manila", city: "Manila", country: "Philippines", geo: { lat: 14.5995, lng: 120.9842 }, officeId: "philippines" },
  { _id: "vault-tel-aviv", city: "Tel Aviv", country: "Israel", geo: { lat: 32.0853, lng: 34.7818 }, officeId: "israel" },
  // Pinned as an office in the design (10980:13452) but no office document
  // exists — a vault dot only until Bangkok is confirmed. TODO(client).
  { _id: "vault-bangkok", city: "Bangkok", country: "Thailand", geo: { lat: 13.7563, lng: 100.5018 } },

  // ---- Vault-only dots, west to east ----
  { _id: "vault-los-angeles", city: "Los Angeles", country: "United States", geo: { lat: 34.0522, lng: -118.2437 } },
  // TODO(client): ambiguous pin — 10980:13455 is 12px from Salt Lake City and 13px from Boise.
  { _id: "vault-salt-lake-city", city: "Salt Lake City", country: "United States", geo: { lat: 40.7608, lng: -111.891 } },
  { _id: "vault-dallas", city: "Dallas", country: "United States", geo: { lat: 32.7767, lng: -96.797 } },
  { _id: "vault-new-york", city: "New York", country: "United States", geo: { lat: 40.7128, lng: -74.006 } },
  { _id: "vault-toronto", city: "Toronto", country: "Canada", geo: { lat: 43.6532, lng: -79.3832 } },
  { _id: "vault-geneva", city: "Geneva", country: "Switzerland", geo: { lat: 46.2044, lng: 6.1432 } },
  // TODO(client): ambiguous pin — 10980:13460 is 7px from Frankfurt and 9px from Zurich.
  { _id: "vault-zurich", city: "Zurich", country: "Switzerland", geo: { lat: 47.3769, lng: 8.5417 } },
  // TODO(client): ambiguous pin — 10980:13461 is 11px from Frankfurt and 13px from Amsterdam (London is 34px away and NOT pinned).
  { _id: "vault-frankfurt", city: "Frankfurt", country: "Germany", geo: { lat: 50.1109, lng: 8.6821 } },
  { _id: "vault-dubai", city: "Dubai", country: "United Arab Emirates", geo: { lat: 25.2048, lng: 55.2708 } },
  { _id: "vault-sydney", city: "Sydney", country: "Australia", geo: { lat: -33.8688, lng: 151.2093 } },
  { _id: "vault-wellington", city: "Wellington", country: "New Zealand", geo: { lat: -41.2865, lng: 174.7762 } },
];
