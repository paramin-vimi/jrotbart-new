import type {
  ImageRef,
  MediaWithTextBlock,
  SectionHeading,
  Service,
  ServiceCardGridBlock,
  ServicesRowsBlock,
} from "@content/types";

/**
 * Homepage — Services.
 *
 * Figma: section `9813:5974` (layer name "Product" is STALE — the frame is 100%
 * services content). The Expertise media+text block is Figma `10229:7600`, which
 * lives inside the About section but shares this component + content module.
 *
 * COPY SOURCE. Large parts of the Figma frame are placeholder or contain typos.
 * Everything below is the REAL copy from the live site (jrotbart.com, captured
 * 2026-08-30), which matches the Figma text except where noted:
 *   - Figma reads "We Offer**s** Comprehensive…" — a typo. Live site reads
 *     "We Offer Comprehensive…". We ship the live (correct) version.
 *   - Figma's header paragraph is missing the space in "needs.We ensure".
 *     Restored here.
 *   - Figma's Row 4 (Lending and Finance) FAQ teasers are byte-identical to
 *     Row 3's (Shipping) — placeholder text carried over during duplication.
 *     The live site has two REAL lending questions; those are used instead.
 *     See TODO(client) on `lending` below.
 *
 * These are hand-authored content documents today; they become Sanity documents
 * later without any change to the component signatures.
 */

// ---------------------------------------------------------------------------
// Local type extensions
//
// src/content/types.ts is a shared file we do not own. Three fields this design
// needs do not exist there yet, so they are declared locally and flagged for
// promotion into types.ts (and the Sanity schema) by whoever owns that file.
// Every interface below is a strict *extension*, so the exported constants stay
// assignable to their canonical block types.
// ---------------------------------------------------------------------------

/**
 * MISSING FROM types.ts (1/3).
 * `SectionHeading` models an accent run that is always the LAST thing in the
 * heading (`heading` + `<em>headingAccent</em>`). The services heading
 * italicises a run in the MIDDLE — "We Offer *Comprehensive* Precious Metals
 * Services" — so a trailing run is needed too.
 */
export interface SplitHeading extends SectionHeading {
  /** Roman text rendered AFTER the italic `headingAccent` run. */
  headingTail?: string;
}

/**
 * MISSING FROM types.ts (2/3).
 * Placement for the hand-composited cut-out subject that sits over a service
 * row's backdrop photo.
 *
 * Figma places each subject with absolute pixel offsets inside a 491 × 368.25
 * box, and Row 4's subject hangs 141px BELOW the frame (clipped). Absolute
 * offsets cannot survive a fluid width, so every value here is a PERCENTAGE of
 * the media box. Because the box is locked to 4:3 at every breakpoint, the whole
 * composite scales linearly and the crop stays identical at any width.
 */
export interface CutoutPlacement {
  /** Subject width as a % of the media box width. */
  widthPct: number;
  /** Which edge the subject is pinned to. */
  anchor: "left" | "center" | "right";
  /** Distance from that edge as a % of box width. Ignored when anchor is "center". */
  insetPct?: number;
  /** Distance from the box bottom as a % of box HEIGHT. Negative = cropped off the bottom. */
  bottomPct?: number;
}

/**
 * MISSING FROM types.ts (3/3).
 * `Service` carries no CTA label, and a service row's media is a composite
 * (backdrop + optional cut-out + fade), not a single photo.
 */
export interface ServiceEntry extends Service {
  /** Label for the arrow link. Figma shows "Explore" on all eight. */
  ctaLabel: string;
}

export interface ServiceRowEntry extends ServiceEntry {
  /** The backdrop photo is `image`. This is the optional subject layered over it. */
  cutout?: ImageRef;
  /** Required when `cutout` is set. Measured off the 1366 Figma frame. */
  cutoutPlacement?: CutoutPlacement;
  /**
   * Backdrop height as a % of the media box, top-anchored.
   * Figma = 88.8% (491 × 327 in a 491 × 368.25 box); the remaining band is
   * revealed section background that the cut-out subject bleeds down into.
   */
  backdropHeightPct?: number;
}

export interface ServicesRowsSection extends Omit<ServicesRowsBlock, "header" | "services"> {
  header: SplitHeading;
  services: ServiceRowEntry[];
}

export interface ServiceCardGridSection extends Omit<ServiceCardGridBlock, "services"> {
  services: ServiceEntry[];
}

// ---------------------------------------------------------------------------
// FAQ cross-links
//
// New pattern in this design: two italic red FAQ questions inside every service
// row, cross-linking the homepage to the FAQ. The live site routes these through
// a `#b2blead_q=<question>` fragment that pre-selects the question in the FAQ
// widget; that format is preserved verbatim so the destinations keep working
// during migration.
//
// TODO(client): confirm the FAQ deep-link scheme for the new build. If the new
// FAQ accordion uses per-question anchor ids instead, these eight hrefs must be
// remapped to them.
// ---------------------------------------------------------------------------
const faqLink = (label: string, question: string) => ({
  label,
  href: `/#b2blead_q=${question.replace(/ /g, "+")}`,
});

// ---------------------------------------------------------------------------
// A — Expertise (Figma 10229:7600) — media + text
// ---------------------------------------------------------------------------

export const expertise: MediaWithTextBlock = {
  _key: "home-expertise",
  _type: "mediaWithText",
  // The About section this block sits inside is background-primary (#efece8),
  // not the services background — see Figma 10229:7543.
  theme: "tinted",
  header: {
    // Verbatim from Figma and the live site, including the stray comma before "&".
    // TODO(client): "Global Expertise, & Personal Service" — confirm whether the
    // comma is intentional. It reads as a typo; the same string is used on the
    // live site, so it has not been fixed unilaterally.
    heading: "Global Expertise, & Personal Service",
  },
  body: [
    "With over 16 years of expertise, USD 3 BN+ in transactions, and 16 global storage locations, J. Rotbart & Co. is your trusted partner for buying, selling, storing, and financing physical precious metals.",
    "We offer tailored solutions, discreet transactions, and world-class logistics, to help you buy, store, and transport gold, silver, platinum, and palladium.",
  ],
  faqTeasers: [faqLink("How are you licensed and regulated?", "How is the company licensed and regulated")],
  media: {
    // Live site's Elementor video widget: youtube.com/watch?v=-PvzlkZpnZg
    youtubeId: "-PvzlkZpnZg",
    title: "A Decade of Trust, Growth & Gratitude | 10-Year Anniversary",
    poster: {
      // Figma export, node 10229:7607.
      //
      // NOTE: the designer's source frame is a *screenshot of the YouTube
      // player*, so this still has the player's chrome baked into the pixels:
      // a title bar, a red play button, share + watch-later icons and a "Watch
      // on YouTube" pill. None of them are real controls. VideoFacade's own
      // play button happens to land almost exactly on the baked-in one, so
      // there is no visible duplicate — only a faint halo where the painted
      // button is wider than the drawn one — but the rest of the fake chrome
      // still reads as UI. Fixing it needs a clean poster frame from the video
      // (or the chrome cropped off); it cannot be fixed from this module.
      src: "/figma/screen-shot-2566-08-25-at-13-48-1--10229-7607.webp",
      alt:
        "End card of the J. Rotbart & Co. ten-year anniversary film: Joshua " +
        "Rotbart standing beside an invitation to book a personalised precious " +
        "metals consultation, with a QR code to jrotbart.com.",
      width: 498,
      height: 292,
    },
  },
  mediaSide: "right",
  cta: { label: "Learn More", href: "/about-us-gold-and-silver/", style: "arrow" },
};

// ---------------------------------------------------------------------------
// B — Four primary service rows (Figma 10359:4504)
//
// The live site numbered these 01–04. The new design drops the numbering, and
// promotes Lending and Finance into the primary four.
// ---------------------------------------------------------------------------

/**
 * Row media is the three-layer composite the Figma draws: a 491 × 327 backdrop
 * photo top-anchored in the 491 × 368.25 box, the cut-out subject layered over
 * it and bleeding past the backdrop's bottom edge, then the fade drawn by the
 * component. Every layer below is a Figma export (WebP, 2x).
 */
const rowBackdrop = (file: string, alt: string): ImageRef => ({
  src: `/figma/${file}`,
  alt,
  width: 491,
  height: 327,
});

/**
 * The cut-out subject. Marked decorative on purpose: it is one half of a single
 * picture, and the backdrop's alt already describes the whole composite. Giving
 * both layers real alt text would announce every service row twice. The `alt`
 * string is still filled in — ImageRef requires it, and it records what the
 * layer shows for the next person to touch this file.
 */
const rowCutout = (
  file: string,
  alt: string,
  width: number,
  height: number,
): ImageRef => ({ src: `/figma/${file}`, alt, decorative: true, width, height });

const buySell: ServiceRowEntry = {
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
  cutout: rowCutout(
    "image-139--10604-45903.webp",
    "Two seated businessmen in dark suits shaking hands.",
    425,
    320,
  ),
  backdropHeightPct: 88.8,
  cutoutPlacement: { widthPct: 86.56, anchor: "center", bottomPct: 0 },
  href: "/buying-precious-metals/",
  ctaLabel: "Explore",
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

const storage: ServiceRowEntry = {
  _id: "global-storage",
  title: "Secure Global Storage",
  description:
    "We provide access to state-of-the-art storage facilities worldwide with extended liability coverage. High-tech alarm, climate control, and fire systems, as well as 24/7 CCTV surveillance.",
  image: rowBackdrop(
    "rectangle-3463382--10604-45949.webp",
    "A wall of Wertheim safe deposit lockers with one door open, and a client " +
      "holding a small red case in the foreground.",
  ),
  cutout: rowCutout(
    "screenshot-2025-02-19-at-10-07-18---10604-45989.webp",
    "A woman in a black dress and silk scarf holding a small red case.",
    288,
    373,
  ),
  backdropHeightPct: 88.8,
  cutoutPlacement: { widthPct: 58.57, anchor: "right", insetPct: -0.22, bottomPct: -1.18 },
  href: "/global-storage/",
  ctaLabel: "Explore",
  faqTeasers: [
    faqLink("Is bullion held on J. Rotbart & Co.’s balance sheet?", "Is bullion listed on your balance sheet"),
    faqLink("What insurance coverage protects stored bullion?", "What insurance coverage protects stored bullion"),
  ],
};

const shipping: ServiceRowEntry = {
  _id: "global-shipping",
  title: "Secure Global Shipping",
  description:
    "We deliver. You can depend on our logistics services as we provide secure, seamless transport of your precious metals and other tangible and valuable assets, which we further protect with insurance coverage.",
  image: rowBackdrop(
    "rectangle-3463382--10606-7606.webp",
    "An open vault drawer of Heraeus silver bars, a fine gold bar and bullion " +
      "coins, with a courier carrying a sealed transport case in the foreground.",
  ),
  cutout: rowCutout(
    "image-146--10607-13197.webp",
    "A smiling man in a blue suit carrying a grey lidded transport case.",
    318,
    363,
  ),
  backdropHeightPct: 88.8,
  cutoutPlacement: { widthPct: 64.77, anchor: "center", bottomPct: 0 },
  href: "/global-shipping/",
  ctaLabel: "Explore",
  faqTeasers: [
    faqLink("Which countries can you ship physical bullion to?", "Which countries can you ship physical bullion to"),
    // Live-site bug fixed here: both of this row's links carried the identical
    // `b2blead_q` query, so the liability question resolved to the shipping one.
    faqLink("How is liability handled during transport?", "How is liability handled during transport"),
  ],
};

const lending: ServiceRowEntry = {
  _id: "lending-and-finance",
  title: "Lending and Finance",
  description:
    "Leverage your precious metals holdings without selling them. We offer competitive and flexible non-bank loans using your bullion as collateral.",
  image: rowBackdrop(
    "rectangle-3463382--10607-7617.webp",
    "A rising candlestick price chart on a trading screen, with a smiling " +
      "client in the foreground.",
  ),
  cutout: rowCutout(
    "image-147--10607-13189.webp",
    "A laughing man in a charcoal blazer over an open-collar white shirt.",
    277,
    509,
  ),
  backdropHeightPct: 88.8,
  // The most extreme placement in the design: the subject hangs 140.85px below a
  // 368.25px-tall box, i.e. 38.25% of the box height, and is clipped.
  cutoutPlacement: { widthPct: 56.42, anchor: "right", insetPct: 8.15, bottomPct: -38.25 },
  href: "/lending-and-finance/",
  ctaLabel: "Explore",
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

export const servicesRows: ServicesRowsSection = {
  _key: "home-services-rows",
  _type: "servicesRows",
  anchorId: "services",
  header: {
    overline: "Services",
    heading: "We Offer",
    headingAccent: "Comprehensive",
    headingTail: "Precious Metals Services",
    body: "J. Rotbart & Co. are bullion experts offering a full range of services to meet all your precious metals needs. We ensure your investment is executed and maintained to the highest level of quality and professionalism.",
  },
  services: [buySell, storage, shipping, lending],
};

// ---------------------------------------------------------------------------
// C — "More Services We Offer" 4-up card grid (Figma 9813:6073)
// ---------------------------------------------------------------------------

const card = (
  _id: string,
  title: string,
  description: string,
  file: string,
  alt: string,
  href: string,
): ServiceEntry => ({
  _id,
  title,
  description,
  image: {
    // Figma exports, 1:1, drawn at 269.5 × 269.5 in the 1366 frame.
    src: `/figma/${file}`,
    // TODO(client): approve alt text — the live site ships alt="" on all four.
    alt,
    width: 270,
    height: 270,
  },
  href,
  ctaLabel: "Explore",
});

export const serviceCards: ServiceCardGridSection = {
  _key: "home-service-cards",
  _type: "serviceCardGrid",
  header: {
    heading: "More Services We Offer",
    // Verbatim duplicate of the servicesRows intro — that is how both the live
    // site and the Figma frame read.
    // TODO(client): the same paragraph now appears twice in one section. Worth
    // rewriting one of the two.
    body: "J. Rotbart & Co. are bullion experts offering a full range of services to meet all your precious metals needs. We ensure your investment is executed and maintained to the highest level of quality and professionalism.",
  },
  services: [
    card(
      "consultation-and-advisory",
      "Consultation and Advisory",
      "We advise on purchasing precious metals and ancillary logistics as well as portfolio diversification with precious metals.",
      "image-124--10563-13127.webp",
      "An adviser in glasses talking with a client across a café table.",
      "/consultation-and-advisory/",
    ),
    card(
      "safe-deposit-box",
      "Individual Safe Deposit Box",
      "J. Rotbart & Co. offers individual safe deposit boxes for when you need a cache of items confidentially protected in a separate and secure location.",
      "image-124--10563-13133.webp",
      "Two keys hanging from the lock of a numbered safe deposit box.",
      // TODO(client): the live site links this card to /safe-deposit-box-storage/
      // while the live mega-menu links to /new-safe-deposit-box-storage/. Two URLs,
      // one service — pick the canonical one.
      "/safe-deposit-box-storage/",
    ),
    card(
      "wealth-preservation",
      "Wealth Preservation",
      "Preserve your wealth with precious metals at J. Rotbart & Co. Every fully diversified investment portfolio should have some allocation of precious metals.",
      "image-the-role-of-precious-metals---10563-13139.webp",
      "A man in sunglasses at the helm of a boat on open water at sunset.",
      "/wealth-preservation/",
    ),
    card(
      "authentication-and-assaying",
      "Authentication and Assaying",
      // The live site links "assaying and authentication" mid-sentence to an
      // external LBMA page. Dropped: an unmarked outbound link inside body copy is
      // a usability and SEO problem, and the design shows none.
      "We facilitate assaying and authentication of precious metals so that you know for certain the purity and value of your bullion.",
      "image-124--10563-13145.webp",
      "Close-up of a bar stamped FINE GOLD 999.9 beside a stack of coins.",
      "/authentication-and-assaying/",
    ),
  ],
};
