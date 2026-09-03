import type { ImageRef, Office } from "./types";

/**
 * Office documents.
 *
 * Source: extracted verbatim from the current live site (jrotbart.com) on
 * 2026-08-30. These become referenced documents in the CMS — editing one here
 * updates the contact section, the office grid, the office listing cards, the
 * office pages and the LocalBusiness structured data together.
 *
 * NOTE FOR THE CLIENT — open items on this data:
 *   1. `geo` is deliberately omitted. The live site's map used country
 *      centroids (e.g. the Philippines pin sits in the middle of the sea),
 *      which would be wrong in LocalBusiness schema. Real per-office
 *      coordinates are needed before we emit geo.
 *   2. The new Figma design shows a fifth office in BANGKOK. No address,
 *      phone or licence detail exists for it anywhere. See `bangkok` below.
 *   3. `slug` is the office page URL. Hong Kong and Singapore keep the live
 *      URLs; the Philippines and Israel follow the same pattern but NO route
 *      is built for them yet — TODO(client): slug pattern for offices that
 *      have no live page today.
 *   4. `vaultPartner` is the operator named on each office-listing card
 *      (10980:12689 / 12703 / 12826 / 12786). TODO(client): confirm the
 *      partners may be named publicly, and the exact naming.
 *   5. `photo` is the office-listing card picture — stock city photography in
 *      the design. TODO(client): licence and originals at ≥2×; alt text drafted
 *      from the pictures and needs approval.
 *   6. `openingHours.display` is the live site's wording; the HK page frame
 *      draws "09.00 - 18.00" (11120:15939). TODO(client): which is right. The
 *      `schema` form feeds openingHoursSpecification in the JSON-LD.
 */
const cardPhoto = (file: string, alt: string, width: number, height: number): ImageRef => ({
  src: `/figma/${file}`,
  alt,
  width,
  height,
});

export const offices: Office[] = [
  {
    _id: "hong-kong",
    slug: "buy-gold-hong-kong",
    city: "Hong Kong",
    country: "Hong Kong SAR",
    address: [
      "Suite 1503, Champion Building",
      "287–291 Des Voeux Road",
      "Sheung Wan, Hong Kong",
    ],
    phone: "+852 2104 9255",
    phoneHref: "+85221049255",
    email: "info@jrotbart.com",
    disclosures: [
      "Strategic Transactions Limited T/A J. Rotbart & Co. (Hong Kong)",
      "Category B Registrant Licence B-B-23-11-02937",
    ],
    openingHours: { display: "Monday to Friday, 9:30am – 5:30pm HKT", schema: "Mo-Fr 09:30-17:30" },
    // Drawn 770×368 in the featured card (10980:12678).
    photo: cardPhoto(
      "office-card-hong-kong--10980-12678.webp",
      "Victoria Harbour, Hong Kong: a red-sailed junk crossing in front of the Central skyline at dusk",
      770,
      368,
    ),
    vaultPartner: "Brink's",
    // The HEADQUARTERS chip (10980:12834) and the "by appointment only" line
    // (HK page FAQ 11041:16437) are both drawn for Hong Kong only.
    headquarters: true,
    appointmentOnly: true,
  },
  {
    _id: "singapore",
    slug: "buy-gold-singapore",
    city: "Singapore",
    country: "Singapore",
    address: ["Six Battery Road", "Level 3, Room 369", "Singapore 049909"],
    phone: "+65 6980 2968",
    phoneHref: "+6569802968",
    email: "info@jrotbart.com",
    disclosures: [
      "Strategic Transactions (Singapore) Pte. Ltd.",
      "PSPM Dealer Licence PS20210002149",
    ],
    openingHours: { display: "Monday to Friday, 9:30am – 5:30pm SGT", schema: "Mo-Fr 09:30-17:30" },
    photo: cardPhoto(
      "office-card-singapore--10980-12692.webp",
      "The Merlion, Singapore, at sunset with Marina Bay behind it",
      368,
      368,
    ),
    vaultPartner: "Le Freeport",
  },
  {
    _id: "philippines",
    slug: "buy-gold-philippines", // TODO(client): slug pattern — no live page, no route built
    // Figma labels this card "Philippines", not "Manila" (and "Israel", not
    // "Tel Aviv"), while Hong Kong and Singapore are city names. Matching the
    // design as drawn.
    // TODO(client): the mix of two cities and two countries is inconsistent —
    // confirm it is deliberate, or let us normalise to cities.
    city: "Philippines",
    country: "Philippines",
    address: [
      "The Penthouse, PNB Makati Center",
      "Ayala Avenue",
      "Makati City 1203, Philippines",
    ],
    phone: "+63 966 957 5118",
    phoneHref: "+639669575118",
    email: "info@jrotbart.com",
    openingHours: { display: "Monday to Friday, 9:30am – 5:30pm PHT", schema: "Mo-Fr 09:30-17:30" },
    photo: cardPhoto(
      "office-card-philippines--10980-12815.webp",
      "Aerial view of the Manila Bay shoreline and yacht marina, Philippines",
      368,
      368,
    ),
    vaultPartner: "Brink's",
  },
  {
    _id: "israel",
    slug: "buy-gold-israel", // TODO(client): slug pattern — no live page, no route built
    city: "Israel",
    country: "Israel",
    address: ["37 Sheerit Israel Street", "Tel Aviv 6816522, Israel"],
    phone: "+972 54 636 3228",
    phoneHref: "+972546363228",
    email: "info@jrotbart.com",
    openingHours: { display: "Sunday to Thursday, 9:30am – 5:30pm IST", schema: "Su-Th 09:30-17:30" },
    photo: cardPhoto(
      "office-card-israel--10980-12775.webp",
      "The Tel Aviv seafront promenade at sunset, with the city's towers behind",
      368,
      368,
    ),
    vaultPartner: "Malca-Amit",
  },
];

/**
 * PLACEHOLDER — the Figma design includes a Bangkok office frame, but no
 * address, phone number or licence details exist in the design or on the live
 * site (the card is Tel Aviv's data with "Bangkok" substituted, 10980:12798).
 * Not rendered until the client supplies real data; publishing an
 * unverifiable office address for a regulated dealer is not acceptable.
 */
export const pendingOffices = [{ city: "Bangkok", country: "Thailand" }];

export const primaryEmail = "info@jrotbart.com";

/** Lookup by `_id`. Throws at build time on a typo, which is the point. */
export function officeById(id: Office["_id"]): Office {
  const office = offices.find((o) => o._id === id);
  if (!office) throw new Error(`[content/offices] unknown office "${id}"`);
  return office;
}
