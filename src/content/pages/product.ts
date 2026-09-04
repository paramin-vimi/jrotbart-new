import type {
  Cta,
  Metal,
  ProductDetail,
  ProductHeroBlock,
  ProductHeroLabels,
  SectionHeading,
  SpecRow,
  SpecTableBlock,
} from "@content/types";

/**
 * Coin / bar template copy — everything the product page draws that is NOT a
 * fact of one product. Figma frames `Product - Coin (Template)` 11083:19848
 * and `Product - Bar (Template)` 11083:19595 (identical structure); copy from
 * SP texts/prod-coin.txt and texts/prod-bar.txt. Live URL pattern (none —
 * the live site has no product pages; every card links to the contact form).
 *
 * The per-product documents live in src/content/products/. The route
 * (src/pages/buy-[metal]/[product].astro, Phase 3) composes its block list
 * from these strings plus the document, through the builders at the bottom.
 *
 * Placeholder register for this template
 * ---------------------------------------
 * • TODO(client): the Settlement row names cryptocurrency settlement
 *   (BTC/ETH/USDT/USDC). Legal approval required before launch.
 * • TODO(client): the Buyback row promises settlement "usually within one
 *   business day". Confirm the operational commitment.
 * • TODO(client): "Speak With a Value Expert" is one of three CTA wordings
 *   used site-wide; every instance links to the contact anchor.
 * • TODO(client): the FAQ rows are drawn all open on this template.
 * • TODO(client): the bar frame draws a static "US$4,400" price. It never
 *   ships — `priceDisplay` is "formula" until a live feed is approved.
 */

// ---------------------------------------------------------------------------
// Hero labels (11083:19850)
// ---------------------------------------------------------------------------

/**
 * Two strings the shared `ProductHeroLabels` has no slot for yet; both
 * optional so a plain `ProductHeroLabels` still satisfies the component.
 * INTEGRATOR: fold `livePrice` and `gallery.close` into `ProductHeroLabels`
 * in src/content/types.ts and delete this interface.
 */
export interface ProductHeroLabelsExtended extends ProductHeroLabels {
  /** "US$%s" — how a live figure prints (bar frame 11086:15932 "US$4,400"); %s = the rounded number. */
  livePrice?: string;
  gallery: ProductHeroLabels["gallery"] & {
    /** Accessible name of the zoom dialog's close button. */
    close?: string;
  };
}

export const productHeroLabels: ProductHeroLabelsExtended = {
  badge: "Best seller",
  facts: {
    metal: "Metal",
    form: "Form",
    fineness: "Fineness",
    grossWeight: "Gross weight",
  },
  /** "%s" = the metal's ISO 4217 code (XAU, XAG, XPT, XPD), derived by the component. */
  spot: "%s spot",
  // TODO(design): status colour. The frame draws this label and a 7px dot in
  // #1f8a5b, which is not a Figma Variable; it renders in text-secondary with
  // no dot until a token exists (CLAUDE.md rule 2).
  liveFeed: "Live feed",
  livePrice: "US$%s",
  gallery: {
    zoom: "Zoom image",
    previous: "Previous image",
    next: "Next image",
    play: "Play product video",
    close: "Close",
  },
};

/** "Back to gold" (I11083:19851) — %s = the metal label. */
export const backLinkLabel = "Back to %s";

/** The hero CTA and every section CTA on the template. */
export const productCta: Cta = {
  label: "Speak With a Value Expert",
  // TODO(client): destination and wording — three variants exist site-wide.
  href: "#contact",
  style: "solid",
};

// ---------------------------------------------------------------------------
// Site-wide terms (11083:19916–19920) — spread into every ProductDetail.terms
// ---------------------------------------------------------------------------

export const defaultTerms: SpecRow[] = [
  {
    label: "Settlement",
    // TODO(client): legal approval of crypto settlement before launch.
    value: "USD, SGD, HKD, EUR; major cryptocurrencies incl. BTC/ETH/USDT/USDC",
  },
  {
    label: "Buyback",
    // TODO(client): confirm the one-business-day settlement commitment.
    value: "Live market prices; settlement usually within one business day",
  },
];

// ---------------------------------------------------------------------------
// Section headings, in page order
// ---------------------------------------------------------------------------

/** 11083:19929 / 19931 — overline and heading are the same words in the frame. */
export const whyHoldHeader: SectionHeading = {
  overline: "Why investors hold this",
  heading: "Why investors hold this",
};

/** 11083:19938 / 19940. The heading follows `product.form`; the coin frame's "About this bar" is a file slip. */
export const specHeader = {
  overline: "Specifications",
  heading: { coin: "About this coin", bar: "About this bar" } as Record<ProductDetail["form"], string>,
};

/** 11083:19976 / 19978. */
export const provenanceHeader: SectionHeading = {
  overline: "Provenance & Custody",
  heading: "Provenance & Custody",
  cta: productCta,
};

/** 11083:19987 / 19989. */
export const premiumDriversHeader: SectionHeading = {
  overline: "Premium Drivers",
  heading: "Premium Drivers",
  cta: productCta,
};

/** 11083:19995 / 19997. */
export const taxHeader: SectionHeading = {
  overline: "Tax & regulatory treatment",
  heading: "Where you buy matters.",
};

/** 11083:20023 / 20024 and the footer 11083:20042 / 20043. */
export const faqHeader: SectionHeading = {
  overline: "People also asked",
  heading: "Frequently Asked Questions",
};

export const faqFooter = {
  heading: "Have a Question We Haven’t Answered Here?",
  body:
    "Speak with our Value Experts — Your enquiry will be treated in strict confidence and answered within 1 business day.",
  cta: productCta,
};

/** 11127:23352 / 23354 / 23355 — `cta.href` is the metal listing, set by the route. */
export const relatedHeader = {
  overline: "Related Products",
  /* "alongside." is italic tertiary in the frame. The geometry dump reports one
     roman style for the whole line, which is why an earlier build rendered it
     flat — the run lives in `characterStyleOverrides` on 11127:23354, where
     characters 11-20 carry PlayfairDisplay-MediumItalic in #767676.
     `headingRuns`, not `headingAccent`: ProductGrid APPENDS an accent after the
     heading, so an accent here would print "alongside." twice. `heading` keeps
     the full plain string because aria and schema read it. Per the accepted
     deviation the run renders at the roman size, not the 40px Figma sets. */
  heading: "Often held alongside.",
  headingRuns: [{ text: "Often held " }, { text: "alongside.", accent: true }],
  ctaLabel: "Explore",
};

/** 11136:25476 — %s = `product.shortName`. */
export const quotePattern = "Request a private quote for the %s.";

/** Default <title> suffix when a product's `seo` does not set one. */
export const titleSuffix = " | J. Rotbart & Co.";

// ---------------------------------------------------------------------------
// Builders — the route composes blocks from a document with these
// ---------------------------------------------------------------------------

/** Fill a "%s" template. */
export const fill = (template: string, value: string): string => template.replace("%s", value);

export function productHeroBlock(
  product: ProductDetail,
  metalLabel: string,
  options: { priceDisplay?: ProductHeroBlock["priceDisplay"]; key?: string } = {},
): ProductHeroBlock {
  return {
    _key: options.key ?? `${product.slug}-hero`,
    _type: "productHero",
    theme: "light",
    backLink: { label: fill(backLinkLabel, metalLabel), href: `/buy-${product.metal}/` },
    product,
    // TODO(client): "live" once the spot feed is approved for product pages.
    priceDisplay: options.priceDisplay ?? "formula",
    labels: productHeroLabels,
    cta: productCta,
  };
}

export function specTableBlock(product: ProductDetail, key?: string): SpecTableBlock {
  return {
    _key: key ?? `${product.slug}-specs`,
    _type: "specTable",
    theme: "light",
    header: { overline: specHeader.overline, heading: specHeader.heading[product.form] },
    groups: product.specGroups,
  };
}

/** The listing the quote band and back link point at. */
export const metalListingHref = (metal: Metal): string => `/buy-${metal}/`;
