import type { Office } from "./types";

/**
 * Office documents.
 *
 * Source: extracted verbatim from the current live site (jrotbart.com) on
 * 2026-08-30. These become referenced documents in the CMS — editing one here
 * updates the contact section, the office grid, the footer and the
 * LocalBusiness structured data together.
 *
 * NOTE FOR THE CLIENT — two open items on this data:
 *   1. `geo` is deliberately omitted. The live site's map used country
 *      centroids (e.g. the Philippines pin sits in the middle of the sea),
 *      which would be wrong in LocalBusiness schema. Real per-office
 *      coordinates are needed before we emit geo.
 *   2. The new Figma design shows a fifth office in BANGKOK. No address,
 *      phone or licence detail exists for it anywhere. See `bangkok` below.
 */

export const offices: Office[] = [
  {
    _id: "hong-kong",
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
    openingHours: "Monday to Friday, 9:30am – 5:30pm HKT",
  },
  {
    _id: "singapore",
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
    openingHours: "Monday to Friday, 9:30am – 5:30pm SGT",
  },
  {
    _id: "philippines",
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
    openingHours: "Monday to Friday, 9:30am – 5:30pm PHT",
  },
  {
    _id: "israel",
    city: "Israel",
    country: "Israel",
    address: ["37 Sheerit Israel Street", "Tel Aviv 6816522, Israel"],
    phone: "+972 54 636 3228",
    phoneHref: "+972546363228",
    email: "info@jrotbart.com",
    openingHours: "Sunday to Thursday, 9:30am – 5:30pm IST",
  },
];

/**
 * PLACEHOLDER — the Figma design includes a Bangkok office frame, but no
 * address, phone number or licence details exist in the design or on the live
 * site. Not rendered until the client supplies real data; publishing an
 * unverifiable office address for a regulated dealer is not acceptable.
 */
export const pendingOffices = [{ city: "Bangkok", country: "Thailand" }];

export const primaryEmail = "info@jrotbart.com";
