import type {
  CalloutBandBlock,
  FaqAccordionBlock,
  FeatureGridBlock,
  MediaWithTextBlock,
  ProductDetail,
  ProductHeroBlock,
  ProseSectionBlock,
  Seo,
  SpecTableBlock,
  TestimonialBandBlock,
} from "@content/types";
import type { ProductGridSection } from "@content/homepage/products";
import { productCardLabels } from "@content/homepage/products";
import { relatedProducts } from "@content/products";
import {
  faqFooter,
  faqHeader,
  fill,
  metalListingHref,
  premiumDriversHeader,
  productCta,
  productHeroBlock,
  provenanceHeader,
  quotePattern,
  relatedHeader,
  specTableBlock,
  taxHeader,
  whyHoldHeader,
} from "@content/pages/product";
import { officeById } from "@content/offices";
import { albertCheng } from "@content/testimonials";
import { productHref } from "@lib/products";

/**
 * The product PAGE — /buy-<metal>/<slug>/ — as an ordered list of typed
 * blocks built from one `ProductDetail`. The route
 * (src/pages/buy-[metal]/[product].astro) calls `productPage(product)` and
 * renders the blocks in the order the fields are declared, exactly as
 * src/pages/index.astro composes the homepage. Coin and bar are ONE
 * template: nothing here branches on `product.form` — the document carries
 * the form-specific words (`title`, `formLabel`, the spec heading via
 * `specTableBlock`).
 *
 * Figma: `Product - Coin (Template)` 11083:19848 (the Britannia) and
 * `Product - Bar (Template)` 11083:19595 (the PAMP kilo bar), identical
 * structure (SP sections/prod-coin.txt, prod-bar.txt):
 *
 *   productHero      11083:19850 / 19597   light, 1074
 *   proseSection     11083:19927 / 19674   tinted, stacked, two columns, 1px rule under
 *   — 11083:19935 / 19682, light, internal gap 96 → the two blocks after the
 *     table carry `seam: "default"`:
 *   specTable        (first child)
 *   mediaWithText    11083:19973 / 19718   media right, "Provenance & Custody"
 *   mediaWithText    11083:19983 / 19728   media left, "Premium Drivers"
 *   featureGrid      11083:19993 / 19738   tinted, boxed, tax treatment
 *   testimonialBand  11083:20019 / 19764
 *   faqAccordion     11083:20020 / 19765   tinted, every row open
 *   productGrid      11083:20045 / 19790   light, "Often held alongside." + Explore
 *   testimonialBand  11083:20098 / 19843
 *   calloutBand      11136:25475 / 11127:23329   dark display band, the quote
 *   — tail: mint strip + contact, rendered by the route with the enquiry
 *     prefilled (the one page type that passes `tail={false}`).
 *
 * Template strings live in src/content/pages/product.ts; the product facts in
 * src/content/products/*. This module only composes.
 *
 * Placeholder register for this page
 * ----------------------------------
 * • TODO(client): both frames draw the Albert Cheng band in BOTH testimonial
 *   slots. Two more testimonials are needed before the page reads as final.
 * • TODO(client): the tax grid draws four cells (Singapore, Hong Kong,
 *   Philippines, Israel); the last two read "[Compliance to supply]" and are
 *   not in any document, so a TWO-cell grid renders at the two-column width
 *   (587 per cell, not the drawn 294 — a four-column grid with two cells
 *   would paint two empty divider-coloured tracks). Philippines and Israel
 *   wording to supply.
 * • TODO(client): every FAQ row is drawn open (the accordion's exclusive
 *   group is switched off for that). Confirm the open state.
 * • TODO(client): the breadcrumb and the quote band use `product.shortName`
 *   ("1 oz Gold Britannia"); the H1 is the fuller `title`.
 * • The template-level placeholders (crypto settlement, one-day buyback,
 *   CTA wording, the static US$4,400) are listed in pages/product.ts; the
 *   per-product ones (SKUs, photography, empty spec tabs) in products/*.
 */

export interface ProductPage {
  product: ProductDetail;
  /** "Gold" / "Silver" — the back link, the breadcrumb and the Metal fact. */
  metalLabel: string;
  seo: Seo;
  /** Written into the enquiry form's message as a line of text (never a field — amendment 13). */
  prefill: { product: string };
  /* ---- blocks, in page order ---- */
  hero: ProductHeroBlock;
  whyHold: ProseSectionBlock;
  specs: SpecTableBlock;
  provenance: MediaWithTextBlock;
  premiumDrivers: MediaWithTextBlock;
  tax: FeatureGridBlock;
  testimonialA: TestimonialBandBlock;
  faq: FaqAccordionBlock;
  related: ProductGridSection;
  testimonialB: TestimonialBandBlock;
  quote: CalloutBandBlock;
}

/** Breadcrumb labels — "Home" is site-wide; the metal and product names come from the documents. */
export const productBreadcrumbLabels = { home: "Home" };

/** The drawn media box of both MediaWithText blocks (11083:19982 / 19984): 555 x 416. */
const PRODUCT_MEDIA_RATIO = "555/416";

/** 11083:19973 / 19983 — an even 555 / 64 / 555 row, whichever side the media
    is on. The 64px gutter is narrower than the homepage's 96, and the copy
    column is drawn CENTER against the 416px photo (339 / 267 tall). */
const PRODUCT_SPLIT = { media: 555, gap: 64, text: 555, align: "center" } as const;

/**
 * The FAQ heading is drawn "Frequently *Asked* Questions" (11083:20024 — the
 * italic is a style override on the middle word, so the text node reads
 * plain). FaqAccordion reads `headingAccent` as the run WITHIN `heading`.
 */
const FAQ_ACCENT = "Asked";

export function productPage(product: ProductDetail): ProductPage {
  const { slug } = product;
  const metalLabel = productCardLabels.metalLabels[product.metal];
  const listingHref = metalListingHref(product.metal);

  /* 11083:19850 / 19597 — back link, gallery, facts, terms, CTA. */
  const hero = productHeroBlock(product, metalLabel, { key: `${slug}-hero` });

  /* 11083:19927 / 19674 — overline → H2 → the document's paragraph columns. The route passes the 1px bottom rule through `class`. */
  const whyHold: ProseSectionBlock = {
    _key: `${slug}-why-hold`,
    _type: "proseSection",
    theme: "tinted",
    layout: "stacked",
    header: whyHoldHeader,
    columns: product.whyHold,
  };

  /* 11083:19935 / 19682 — first child of the light frame; heading follows `product.form`. */
  const specs = specTableBlock(product, `${slug}-specs`);

  /* MediaWithText renders `block.cta`, not `header.cta`, so the template
     header's button moves to the block level rather than being carried twice. */
  const { cta: provenanceCta, ...provenanceHeading } = provenanceHeader;
  const { cta: premiumCta, ...premiumHeading } = premiumDriversHeader;

  /* 11083:19973 / 19718 — media right, seamed 96 under the spec table. */
  const provenance: MediaWithTextBlock = {
    _key: `${slug}-provenance`,
    _type: "mediaWithText",
    theme: "light",
    seam: "default",
    header: provenanceHeading,
    body: product.provenance.body,
    media: product.provenance.media,
    mediaSide: "right",
    split: PRODUCT_SPLIT,
    ratio: PRODUCT_MEDIA_RATIO,
    cta: provenanceCta,
  };

  /* 11083:19983 / 19728 — media left, seamed 96 under provenance. */
  const premiumDrivers: MediaWithTextBlock = {
    _key: `${slug}-premium-drivers`,
    _type: "mediaWithText",
    theme: "light",
    seam: "default",
    header: premiumHeading,
    body: product.premiumDrivers.body,
    media: product.premiumDrivers.media,
    mediaSide: "left",
    split: PRODUCT_SPLIT,
    ratio: PRODUCT_MEDIA_RATIO,
    cta: premiumCta,
  };

  /* 11083:19993 / 19738 — one boxed cell per office with approved wording;
     the cell title is the office document's city, never retyped. */
  const taxCells = product.taxTreatment.map((treatment) => ({
    _key: treatment.office,
    marker: { kind: "icon" as const, icon: treatment.icon },
    title: officeById(treatment.office).city,
    body: treatment.body,
    ref: { office: treatment.office },
  }));
  const tax: FeatureGridBlock = {
    _key: `${slug}-tax`,
    _type: "featureGrid",
    theme: "tinted",
    layout: "stacked",
    // Four columns only once four offices have wording — see the register.
    columns: taxCells.length >= 4 ? 4 : 2,
    frame: "boxed",
    header: taxHeader,
    cells: taxCells,
  };

  /* 11083:20019 / 19764 and 11083:20098 / 19843. TODO(client): second and third testimonial. */
  const testimonialA: TestimonialBandBlock = {
    _key: `${slug}-testimonial-1`,
    _type: "testimonialBand",
    theme: "dark",
    testimonial: albertCheng,
  };
  const testimonialB: TestimonialBandBlock = {
    _key: `${slug}-testimonial-2`,
    _type: "testimonialBand",
    theme: "dark",
    testimonial: albertCheng,
  };

  /* 11083:20020 / 19765 — the document's FAQs, all open (route: initiallyOpen="all"). */
  const faq: FaqAccordionBlock = {
    _key: `${slug}-faq`,
    _type: "faqAccordion",
    theme: "tinted",
    header: { ...faqHeader, headingAccent: FAQ_ACCENT },
    faqs: product.faqs,
    footer: faqFooter,
  };

  /* 11083:20045 / 19790 — the three `related` documents; Explore goes back to the metal listing. */
  const related: ProductGridSection = {
    _key: `${slug}-related`,
    _type: "productGrid",
    theme: "light",
    header: {
      overline: relatedHeader.overline,
      heading: relatedHeader.heading,
      cta: { label: relatedHeader.ctaLabel, href: listingHref, style: "arrow" },
    },
    products: relatedProducts(product),
    ...productCardLabels,
  };

  /* 11136:25475 / 11127:23329 — the always-black quote band. */
  const quote: CalloutBandBlock = {
    _key: `${slug}-quote`,
    _type: "calloutBand",
    theme: "dark",
    variant: "display",
    heading: fill(quotePattern, product.shortName),
    cta: productCta,
  };

  return {
    product,
    metalLabel,
    seo: product.seo,
    prefill: { product: product.shortName },
    hero,
    whyHold,
    specs,
    provenance,
    premiumDrivers,
    tax,
    testimonialA,
    faq,
    related,
    testimonialB,
    quote,
  };
}

/** Absolute-path helpers the route feeds into the schema graph. */
export const productPath = (product: ProductDetail): string => productHref(product);

/** URLs (site-relative) of the related products that have a page of their own — `isRelatedTo` in the Product node. */
export const relatedProductPaths = (product: ProductDetail): string[] =>
  relatedProducts(product)
    .map((related) => productHref(related, ""))
    .filter((path) => path !== "");
