import type {
  ImageRef,
  MediaWithTextBlock,
  SectionHeading,
  Service,
  ServiceCardGridBlock,
  ServicesRowsBlock,
} from "@content/types";
import {
  authenticationAndAssaying,
  buySell,
  consultationAndAdvisory,
  faqLink,
  globalShipping,
  globalStorage,
  lendingAndFinance,
  safeDepositBox,
  wealthPreservation,
} from "@content/services";

/**
 * Homepage — Services.
 *
 * Figma: section `9813:5974` (layer name "Product" is STALE — the frame is 100%
 * services content). The Expertise media+text block is Figma `10229:7600`, which
 * lives inside the About section but shares this component + content module.
 *
 * The eight Service DOCUMENTS (titles, descriptions, backdrop photos, hrefs,
 * FAQ teasers) live in `src/content/services.ts` — they are referenced by
 * several pages. What stays here is homepage COMPOSITION: the hand-placed
 * cut-out subjects over the row backdrops, the "Explore" label, and the two
 * section blocks.
 *
 * COPY SOURCE. Large parts of the Figma frame are placeholder or contain typos.
 * Everything is the REAL copy from the live site (jrotbart.com, captured
 * 2026-08-30), which matches the Figma text except where noted:
 *   - Figma reads "We Offer**s** Comprehensive…" — a typo. Live site reads
 *     "We Offer Comprehensive…". We ship the live (correct) version.
 *   - Figma's header paragraph is missing the space in "needs.We ensure".
 *     Restored here.
 *   - Figma's Row 4 (Lending and Finance) FAQ teasers are byte-identical to
 *     Row 3's (Shipping) — placeholder text carried over during duplication.
 *     The live site has two REAL lending questions; those are used instead.
 *     See TODO(client) on `lendingAndFinance` in services.ts.
 */

// ---------------------------------------------------------------------------
// Local type extensions — homepage composition on top of the Service document
// ---------------------------------------------------------------------------

/** `SectionHeading` now carries `headingTail`; kept as an alias for existing imports. */
export type SplitHeading = SectionHeading;

/**
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
  header?: SplitHeading;
  services: ServiceRowEntry[];
}

export interface ServiceCardGridSection extends Omit<ServiceCardGridBlock, "services"> {
  services: ServiceEntry[];
}

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

/**
 * Row media is the three-layer composite the Figma draws: the document's
 * 491 × 327 backdrop photo top-anchored in the 491 × 368.25 box, the cut-out
 * subject layered over it and bleeding past the backdrop's bottom edge, then
 * the fade drawn by the component. Every layer is a Figma export (WebP, 2x).
 *
 * Keyed by service `_id` and exported so the Service listing page can draw the
 * same rows from the same documents.
 */
export const rowMedia: Record<
  string,
  Pick<ServiceRowEntry, "cutout" | "cutoutPlacement" | "backdropHeightPct" | "ctaLabel">
> = {
  "buy-sell": {
    cutout: rowCutout(
      "image-139--10604-45903.webp",
      "Two seated businessmen in dark suits shaking hands.",
      425,
      320,
    ),
    backdropHeightPct: 88.8,
    cutoutPlacement: { widthPct: 86.56, anchor: "center", bottomPct: 0 },
    ctaLabel: "Explore",
  },
  "global-storage": {
    cutout: rowCutout(
      "screenshot-2025-02-19-at-10-07-18---10604-45989.webp",
      "A woman in a black dress and silk scarf holding a small red case.",
      288,
      373,
    ),
    backdropHeightPct: 88.8,
    cutoutPlacement: { widthPct: 58.57, anchor: "right", insetPct: -0.22, bottomPct: -1.18 },
    ctaLabel: "Explore",
  },
  "global-shipping": {
    cutout: rowCutout(
      "image-146--10607-13197.webp",
      "A smiling man in a blue suit carrying a grey lidded transport case.",
      318,
      363,
    ),
    backdropHeightPct: 88.8,
    cutoutPlacement: { widthPct: 64.77, anchor: "center", bottomPct: 0 },
    ctaLabel: "Explore",
  },
  "lending-and-finance": {
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
    ctaLabel: "Explore",
  },
};

/** A Service document plus its homepage row composition. */
/* No `ctaLabel` default here: every `rowMedia` entry carries its own, and a
   default placed before the spread is always overwritten (ts 2783). */
export const toRowEntry = (service: Service): ServiceRowEntry => ({
  ...service,
  ...rowMedia[service._id],
});

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
  services: [buySell, globalStorage, globalShipping, lendingAndFinance].map(toRowEntry),
};

// ---------------------------------------------------------------------------
// C — "More Services We Offer" 4-up card grid (Figma 9813:6073)
// ---------------------------------------------------------------------------

/** A Service document plus the card's CTA label. */
export const toCardEntry = (service: Service): ServiceEntry => ({
  ...service,
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
    consultationAndAdvisory,
    safeDepositBox,
    wealthPreservation,
    authenticationAndAssaying,
  ].map(toCardEntry),
};
