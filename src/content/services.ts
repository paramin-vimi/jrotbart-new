import type { ImageRef, Service } from "./types";

/**
 * Service documents — the eight services, defined once and referenced by the
 * homepage rows and cards, the Service listing, the Buy PM related-services
 * grid and the Hong Kong office checklist.
 *
 * COPY SOURCE. The Figma frames are partly placeholder or carry typos, so
 * every title and description is the REAL copy from the live site
 * (jrotbart.com, captured 2026-08-30), matching the Figma text except where a
 * comment says otherwise. `teaser` is the one-line blurb the feature cells use
 * where the design draws one at document level (Buy PM related services,
 * 10734:14002 / 14004); office pages carry their own per-office teasers.
 *
 * Images: the row backdrops and card photos are the Figma exports under
 * /figma/; `width`/`height` are the sizes the DESIGN draws them at. The
 * homepage's cut-out subjects layered over the row backdrops are homepage
 * composition, not service data — see src/content/homepage/services.ts.
 */

// ---------------------------------------------------------------------------
// FAQ cross-links
//
// Two italic red FAQ questions inside every service row, cross-linking to the
// FAQ. The live site routes these through a `#b2blead_q=<question>` fragment
// that pre-selects the question in the FAQ widget; that format is preserved
// verbatim so the destinations keep working during migration.
//
// TODO(client): confirm the FAQ deep-link scheme for the new build. If the new
// FAQ accordion uses per-question anchor ids instead, these eight hrefs must be
// remapped to them.
// ---------------------------------------------------------------------------
export const faqLink = (label: string, question: string) => ({
  label,
  href: `/#b2blead_q=${question.replace(/ /g, "+")}`,
});

/** Row backdrop photo: 491 × 327 in the 1366 frame. */
const rowBackdrop = (file: string, alt: string): ImageRef => ({
  src: `/figma/${file}`,
  alt,
  width: 491,
  height: 327,
});

/** Card photo: drawn at 269.5 × 269.5 in the 1366 frame. */
const cardPhoto = (file: string, alt: string): ImageRef => ({
  src: `/figma/${file}`,
  // TODO(client): approve alt text — the live site ships alt="" on all four.
  alt,
  width: 270,
  height: 270,
});

// ---------------------------------------------------------------------------
// The four primary services (homepage rows, Service listing rows)
// ---------------------------------------------------------------------------

export const buySell: Service = {
  _id: "buy-sell",
  title: "Buy Gold & Sell Precious Metals",
  description:
    "We offer investment grade precious metals for your purchases. We will also buy your precious metals, either buybacks of bullion we sold to you or purchases of bullion acquired elsewhere, subject to authentication.",
  image: rowBackdrop(
    "rectangle-3463382--10604-45902.webp",
    // TODO(client): approve alt text. The live site ships alt="" on all eight photos.
    "Argor-Heraeus gold bullion bars and gold coins on a gold surface, with two " +
      "businessmen shaking hands in the foreground.",
  ),
  href: "/buying-precious-metals/",
  icon: "gold",
  faqTeasers: [
    faqLink(
      "How transparent is your pricing on bullion purchases?",
      "How transparent is your pricing on bullion purchases",
    ),
    faqLink(
      "Can you sell bullion not purchased through J. Rotbart & Co.?",
      "Can you sell bullion that was not purchased through your company",
    ),
  ],
};

export const globalStorage: Service = {
  _id: "global-storage",
  title: "Secure Global Storage",
  description:
    "We provide access to state-of-the-art storage facilities worldwide with extended liability coverage. High-tech alarm, climate control, and fire systems, as well as 24/7 CCTV surveillance.",
  image: rowBackdrop(
    "rectangle-3463382--10604-45949.webp",
    "A wall of Wertheim safe deposit lockers with one door open, and a client " +
      "holding a small red case in the foreground.",
  ),
  href: "/global-storage/",
  icon: "earth",
  // Buy PM related-services card, 10734:14002.
  // TODO(client): "16 secure vaults" must agree with the vault list (vaults.ts).
  teaser:
    "We store allocated, segregated bullion held in your name across 16 secure vaults and free-zone options in leading financial centres around the world. You choose the locations that best match your needs. Your holdings are always fully insured and are audited every year by an independent third party.",
  faqTeasers: [
    faqLink("Is bullion held on J. Rotbart & Co.’s balance sheet?", "Is bullion listed on your balance sheet"),
    faqLink("What insurance coverage protects stored bullion?", "What insurance coverage protects stored bullion"),
  ],
};

export const globalShipping: Service = {
  _id: "global-shipping",
  title: "Secure Global Shipping",
  description:
    "We deliver. You can depend on our logistics services as we provide secure, seamless transport of your precious metals and other tangible and valuable assets, which we further protect with insurance coverage.",
  image: rowBackdrop(
    "rectangle-3463382--10606-7606.webp",
    "An open vault drawer of Heraeus silver bars, a fine gold bar and bullion " +
      "coins, with a courier carrying a sealed transport case in the foreground.",
  ),
  href: "/global-shipping/",
  icon: "truck",
  // Buy PM related-services card, 10734:14004.
  // TODO(client): "35 countries" and the named carriers need sign-off.
  teaser:
    "Insured delivery to 35 countries through specialist carriers including Brinks, Malca-Amit, and Loomis International. Door-to-vault, vault-to-vault, or vault-to-residence. We coordinate everything, including customs.",
  faqTeasers: [
    faqLink("Which countries can you ship physical bullion to?", "Which countries can you ship physical bullion to"),
    // Live-site bug fixed here: both of this row's links carried the identical
    // `b2blead_q` query, so the liability question resolved to the shipping one.
    faqLink("How is liability handled during transport?", "How is liability handled during transport"),
  ],
};

export const lendingAndFinance: Service = {
  _id: "lending-and-finance",
  title: "Lending and Finance",
  description:
    "Leverage your precious metals holdings without selling them. We offer competitive and flexible non-bank loans using your bullion as collateral.",
  image: rowBackdrop(
    "rectangle-3463382--10607-7617.webp",
    "A rising candlestick price chart on a trading screen, with a smiling " +
      "client in the foreground.",
  ),
  href: "/lending-and-finance/",
  icon: "bank",
  // TODO(client): the Figma design repeats Row 3 (Shipping)'s two questions here
  // verbatim — placeholder text left behind when the row was duplicated. The two
  // questions below are the REAL lending questions from the live site. Confirm
  // they are the pair you want surfaced on the homepage.
  faqTeasers: [
    faqLink(
      "What’s the loan-to-value ratio for bullion collateral?",
      "What loan-to-value ratios are available against bullion collateral",
    ),
    faqLink("What happens to the collateral during the loan?", "What happens to the collateral during the loan"),
  ],
};

// ---------------------------------------------------------------------------
// The four secondary services (homepage cards, Service listing cards)
// ---------------------------------------------------------------------------

export const consultationAndAdvisory: Service = {
  _id: "consultation-and-advisory",
  title: "Consultation and Advisory",
  description:
    "We advise on purchasing precious metals and ancillary logistics as well as portfolio diversification with precious metals.",
  image: cardPhoto(
    "image-124--10563-13127.webp",
    "An adviser in glasses talking with a client across a café table.",
  ),
  href: "/consultation-and-advisory/",
};

export const safeDepositBox: Service = {
  _id: "safe-deposit-box",
  title: "Individual Safe Deposit Box",
  description:
    "J. Rotbart & Co. offers individual safe deposit boxes for when you need a cache of items confidentially protected in a separate and secure location.",
  image: cardPhoto(
    "image-124--10563-13133.webp",
    "Two keys hanging from the lock of a numbered safe deposit box.",
  ),
  // TODO(client): the live site links this card to /safe-deposit-box-storage/
  // while the live mega-menu links to /new-safe-deposit-box-storage/. Two URLs,
  // one service — pick the canonical one.
  href: "/safe-deposit-box-storage/",
  icon: "safebox",
};

export const wealthPreservation: Service = {
  _id: "wealth-preservation",
  title: "Wealth Preservation",
  description:
    "Preserve your wealth with precious metals at J. Rotbart & Co. Every fully diversified investment portfolio should have some allocation of precious metals.",
  image: cardPhoto(
    "image-the-role-of-precious-metals---10563-13139.webp",
    "A man in sunglasses at the helm of a boat on open water at sunset.",
  ),
  href: "/wealth-preservation/",
};

export const authenticationAndAssaying: Service = {
  _id: "authentication-and-assaying",
  title: "Authentication and Assaying",
  // The live site links "assaying and authentication" mid-sentence to an
  // external LBMA page. Dropped: an unmarked outbound link inside body copy is
  // a usability and SEO problem, and the design shows none.
  description:
    "We facilitate assaying and authentication of precious metals so that you know for certain the purity and value of your bullion.",
  image: cardPhoto(
    "image-124--10563-13145.webp",
    "Close-up of a bar stamped FINE GOLD 999.9 beside a stack of coins.",
  ),
  href: "/authentication-and-assaying/",
};

/*
 * The two services that appear ONLY on the Service listing frame
 * (10849:11740), which draws ten. Neither has a page on the live site
 * (/sell-precious-metals/ and /conversions-and-settlements/ both 404), so both
 * link to the contact form until one exists.
 */

export const sellPreciousMetals: Service = {
  _id: "sell-precious-metals",
  title: "Sell Precious Metals",
  /* Not invented: this is the selling half of the approved `buy-sell` copy,
     which reads "We will also buy your precious metals, either buybacks of
     bullion we sold to you or purchases of bullion acquired elsewhere, subject
     to authentication." The frame itself is lorem here.
     TODO(client): approve this wording, or supply your own. */
  description:
    "We buy your precious metals — both buybacks of bullion we sold to you and purchases of bullion acquired elsewhere, subject to authentication.",
  image: cardPhoto(
    "image-124--10563-13145.webp",
    // TODO(assets): the frame gives this service no photograph; this is the
    // authentication card's image standing in.
    "Close-up of a bar stamped FINE GOLD 999.9 beside a stack of coins.",
  ),
  // TODO(client): no page exists for this service; the card links to the
  // enquiry form until one does.
  href: "#contact",
};

export const conversionsAndSettlements: Service = {
  _id: "conversions-and-settlements",
  title: "Conversions & Settlements",
  /* TODO(client): DESCRIPTION NEEDED. The frame is lorem, the live site has no
     page, and nothing in the existing copy covers this service — so there is
     nothing to derive it from. Deliberately left as a visible placeholder
     rather than invented: this describes a regulated financial service. */
  description: "[Description to supply]",
  image: cardPhoto(
    "image-124--10563-13145.webp",
    // TODO(assets): no photograph is drawn for this service.
    "Close-up of a bar stamped FINE GOLD 999.9 beside a stack of coins.",
  ),
  // TODO(client): no page exists for this service.
  href: "#contact",
};

export const services: Service[] = [
  buySell,
  sellPreciousMetals,
  globalStorage,
  globalShipping,
  lendingAndFinance,
  consultationAndAdvisory,
  safeDepositBox,
  wealthPreservation,
  authenticationAndAssaying,
  conversionsAndSettlements,
];

/** Lookup by `_id`. Throws at build time on a typo, which is the point. */
export function serviceById(id: Service["_id"]): Service {
  const service = services.find((s) => s._id === id);
  if (!service) throw new Error(`[content/services] unknown service "${id}"`);
  return service;
}
