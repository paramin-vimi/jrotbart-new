import type {
  CalloutBandBlock,
  Cta,
  LocationMapBlock,
  Office,
  OfficeCardGridBlock,
  PageHeroBlock,
  Seo,
  Stat,
  TestimonialBandBlock,
} from "@content/types";
import { offices } from "@content/offices";
import { vaults } from "@content/vaults";
import { hero as homepageHero } from "@content/homepage/hero";
import { testimonialOne } from "@content/testimonials";
import { locationMapBlock, officeCardGridBlock } from "@content/pages/office";
import { numberWord } from "@lib/geo";

/**
 * Office listing — /offices/.
 *
 * Figma: `Office - Listing` 10980:11772, Main Content 10980:11774. Copy from
 * SP/build-plan/texts/office-listing.txt; the block order is the frame's
 * section tree (sections/office-listing.txt) top to bottom:
 *
 *   10980:11777  pageHero        text-only, 530 column, three stats, marks
 *   10980:12676  officeCardGrid  64 under the hero on the same surface
 *   10980:13178  locationMap     96 under the cards, same surface
 *   I10980:13468 calloutBand     96 under the map, tinted card on the surface
 *   10980:11862  testimonialBand the shared Albert Cheng band
 *   (tail)       mint strip + contact, rendered by SiteLayout
 *
 * There is no such page on the live site — this is a NEW route. Nothing links
 * to it yet: the Phase 4 integrator adds it to the About-us panel in
 * navigation.ts and to the footer sitemap. TODO(client): nav placement.
 *
 * COUNTS ARE DERIVED. The frame hard-codes "Five offices" / "5" / "15" /
 * "Fifteen Vaults"; every number here reads `offices.length` (four — the
 * Bangkok card is Tel Aviv's data with the name swapped, 10980:12798, and is
 * not shipped; see `pendingOffices` in offices.ts) and `vaults.length`
 * (sixteen pins drawn; see the count conflict in vaults.ts). So the page says
 * "Four offices" and "16" today and corrects itself when the documents do.
 * Recorded deviation (Amendment 11).
 *
 * Placeholder register for this page (each also sits beside its field):
 *   • TODO(client): Bangkok — fifth office (address, phone, licence).
 *   • TODO(client): vault count — 15 drawn, 16 pinned, 11 on the live FAQ.
 *   • TODO(client): "40+ jurisdictions served" — unverifiable stat.
 *   • TODO(client): "never an agent, sub-agent, or white-label representative"
 *     is a compliance-grade claim; confirm it can be published.
 *   • TODO(client): meta description.
 *   • TODO(client): desk links for the Philippines and Israel (no page).
 *   • TODO(client): the Singapore link goes to the LIVE page, not rebuilt yet.
 *   • TODO(client): "1 business day" (this CTA) vs "24 hours" (contact section).
 *   • TODO(client): CTA destination and wording (three variants site-wide).
 *   • TODO(client): the same SBMA testimonial is drawn on every page.
 *   • TODO(client): Office / Vault control — key or filter (office.ts).
 *   • TODO(client): HEADQUARTERS chip, vault-partner naming, stock photos and
 *     alt text — carried by offices.ts / office.ts, not repeated here.
 */

export const officesPath = "/offices/";

/** Breadcrumb trail for the JSON-LD; the route makes the URLs absolute. */
export const breadcrumb = [
  { name: "Home", path: "/" },
  { name: "Offices", path: officesPath },
] as const;

/* ------------------------------------------------------------------------ */
/* SEO                                                                       */
/* ------------------------------------------------------------------------ */

const heroBody = {
  /** 10980:11780, first sentence. TODO(client): compliance-grade claim ("never an agent, sub-agent, or white-label representative") — confirm it may be published. */
  claim:
    "Every location below is staffed directly by J. Rotbart & Co. — never an agent, sub-agent, or white-label representative.",
  /** 10980:11780, second sentence. */
  invitation: "Pick the desk closest to you, or the jurisdiction that best fits your goals.",
};

export const seo: Seo = {
  title: "Our Offices | J. Rotbart & Co.",
  // TODO(client): meta description — the plan ships the hero body's second
  // sentence; a description naming the four cities would serve search better.
  description: heroBody.invitation,
};

/* ------------------------------------------------------------------------ */
/* 10980:11777 — pageHero (text-only, 530 column)                            */
/* ------------------------------------------------------------------------ */

/** "Five" → "Four" today; sentence position, so capitalised. */
const officeCount = numberWord(offices.length, true);

/** 10980:11779 "Five offices. Owner-operated, everywhere." — the count is derived (see the header comment). */
const heroHeading = {
  /* The "\n" is the frame's own hard line break (10980:11779); PageHero
     renders the H1 pre-line so it holds instead of splitting "Owner-operated"
     at the hyphen. The plain `heading` carries a space in its place — it is
     the aria / schema string, where a line break is just whitespace. */
  lead: `${officeCount} offices.`,
  middle: "Owner-operated, ",
  accent: "everywhere.",
};

const heroStats: Stat[] = [
  // 10980:12508 / 12509 — drawn "5"; derived. TODO(client): Bangkok.
  { value: String(offices.length), label: "Owner-operated offices" },
  // 10980:12520 / 12521 — drawn "15"; derived from the pinned vaults. TODO(client): vault count (15 / 16 / 11).
  { value: String(vaults.length), label: "Allocated vault locations" },
  // 10980:12511 / 12512. TODO(client): "40+" jurisdictions served — source for the figure.
  { value: "40+", label: "Jurisdictions served" },
];

export const hero: PageHeroBlock = {
  _key: "offices-hero",
  _type: "pageHero",
  header: {
    // 10980:11778
    overline: "Offices location",
    heading: `${heroHeading.lead} ${heroHeading.middle}${heroHeading.accent}`,
    headingRuns: [
      { text: `${heroHeading.lead}\n${heroHeading.middle}` },
      { text: heroHeading.accent, accent: true },
    ],
    body: `${heroBody.claim} ${heroBody.invitation}`,
  },
  stats: heroStats,
  // 10980:12514 "Member of:" + the same three marks as the homepage hero, by reference.
  accreditationLabel: homepageHero.accreditationLabel,
  accreditations: homepageHero.accreditations,
};

/* ------------------------------------------------------------------------ */
/* 10980:12676 — officeCardGrid                                              */
/* ------------------------------------------------------------------------ */

/**
 * Offices whose card gets a "Visit the … desk" link, and where it goes. The
 * href is the office's own `slug` so the URL lives in offices.ts only.
 *   • hong-kong  → /buy-gold-hong-kong/, rebuilt by this project (P5).
 *   • singapore  → /buy-gold-singapore/, the LIVE page — out of scope for the
 *     rebuild (Amendment 9) but a real destination. TODO(client): not rebuilt yet.
 * The Philippines and Israel have no page (offices.ts), so their cards draw
 * no link rather than a 404. TODO(client): desk links for those two.
 */
const officesWithPages: ReadonlySet<Office["_id"]> = new Set(["hong-kong", "singapore"]);

const routes: Partial<Record<Office["_id"], string>> = Object.fromEntries(
  offices.filter((office) => officesWithPages.has(office._id)).map((office) => [office._id, `/${office.slug}/`]),
);

export const cardGrid: OfficeCardGridBlock = officeCardGridBlock({
  _key: "offices-cards",
  offices,
  routes,
  // Drawn 64 under the hero on the same #fdfcfc surface (10980:11776 gap 64).
  seam: "tight",
});

/* ------------------------------------------------------------------------ */
/* 10980:13178 — locationMap                                                 */
/* ------------------------------------------------------------------------ */

export const map: LocationMapBlock = locationMapBlock({
  _key: "offices-map",
  offices,
  vaults,
  // Drawn 96 under the cards on the same surface (10980:11775 gap 96).
  seam: "default",
});

/* ------------------------------------------------------------------------ */
/* I10980:13468 — calloutBand (tinted card on the light surface)             */
/* ------------------------------------------------------------------------ */

/** I10980:13468;10761:11147;3605:2078. TODO(client): destination and wording — three "speak with…" variants exist site-wide. */
const speakCta: Cta = { label: "Speak With a Value Expert", href: "#contact", style: "solid" };

export const callout: CalloutBandBlock = {
  _key: "offices-cta",
  _type: "calloutBand",
  theme: "tinted",
  // Drawn 96 under the map band, still inside the light surface.
  seam: "default",
  // I10980:13468;10761:11146. TODO(client): "1 business day" here vs "24 hours" in the contact section.
  heading: "Ready to begin? Talk to Our Value Expert. We'll respond within 1 business day.",
  cta: speakCta,
};

/* ------------------------------------------------------------------------ */
/* 10980:11862 — testimonialBand                                             */
/* ------------------------------------------------------------------------ */

/** The frame draws the homepage's SBMA band. TODO(client): a second testimonial for this page. */
export const testimonial: TestimonialBandBlock = testimonialOne;

/* ------------------------------------------------------------------------ */
/* The page: an ordered list of typed blocks                                 */
/* ------------------------------------------------------------------------ */

/** In frame order. The route renders exactly this list; nothing else is on the page above the tail. */
export const blocks = [hero, cardGrid, map, callout, testimonial] as const;
