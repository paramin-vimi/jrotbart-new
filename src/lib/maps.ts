import type { Office } from "@content/types";

/**
 * Google Maps deep link for an office.
 *
 * TODO(client): supply a canonical Google Maps place URL per office
 * (`Office.mapUrl` in src/content/offices.ts, currently unset for all four).
 * Until then the link is a search on the published address, which always
 * resolves and never invents a location. One helper, shared by the contact
 * directory, the homepage office grid and the office pages, so the fallback
 * cannot drift between them.
 */
export const mapHref = (office: Pick<Office, "mapUrl" | "city" | "address">): string =>
  office.mapUrl ??
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    [office.city, ...office.address].join(", "),
  )}`;
