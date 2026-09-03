import type { Faq, ImageRef, Paragraph, ProductDetail, Seo } from "@content/types";
import { titleSuffix } from "@content/pages/product";

/**
 * Helpers and shared fragments for the product catalogue (gold.ts, silver.ts,
 * platinum-group.ts). Nothing here is a product; everything here is what
 * several products share so that it is written once.
 *
 * IMAGES. Every product photograph in the design is placeholder photography
 * (the survey's photo/caption mismatches are listed on the homepage cards in
 * src/content/homepage/products.ts). The catalogue reuses the six re-exported
 * homepage bitmaps (product-1..6.webp, transparent cut-outs) and the two
 * listing-only exports, choosing the closest picture for each product —
 * a bar photo for a bar, a coin photo for a coin. `width`/`height` are the
 * DRAWN card size (370), the repo convention; the files are 2x.
 * TODO(assets): per-SKU product shots, transparent, >= 1110px square (the
 * hero gallery draws the main tile at 553px on a 2x screen).
 */

// ---------------------------------------------------------------------------
// Pictures
// ---------------------------------------------------------------------------

const picture = (file: string, alt: string): ImageRef => ({
  src: `/figma/${file}`,
  alt,
  width: 370,
  height: 370,
});

/** The six homepage cut-outs and two listing exports, described as pictured. */
export const pictures = {
  /** product-1: an RCM-hallmarked 1 kilo cast gold bar. */
  goldBarKilo: picture(
    "product-1.webp",
    "One kilo cast gold bar stamped 999.9, bearing a Royal Canadian Mint hallmark",
  ),
  /** product-2: two American Gold Eagle coins, obverse and reverse. */
  goldCoins: picture("product-2.webp", "Two one-ounce American Gold Eagle coins, obverse and reverse"),
  /** product-3: the Year of the Horse minted gold bar. */
  goldBarMinted: picture("product-3.webp", "Limited edition Year of the Horse minted gold bar"),
  /** product-4: a Heraeus 1000 g cast silver bar. */
  silverBar: picture("product-4.webp", "Heraeus 1000 g cast fine silver bar"),
  /** product-5: a Heraeus 1000 g platinum bar. */
  platinumBar: picture("product-5.webp", "Heraeus 1000 g minted platinum bar stamped 999.5"),
  /** product-6: a PAMP 1000 g palladium bar. */
  palladiumBar: picture("product-6.webp", "PAMP Suisse 1000 g palladium bar stamped Switzerland 999.5"),
  /** Gold listing card 4 in the frame: Canadian Maple Leaf coins. */
  mapleCoins: picture(
    "gold-listing-card-metalor--I10979-24432_10977-24368.webp",
    "Two Canadian Gold Maple Leaf coins, obverse and reverse",
  ),
  /** Silver listing card 3 in the frame: an American Silver Eagle. */
  silverCoin: picture(
    "silver-listing-card-eagle--I10979-24563.webp",
    "One-ounce American Silver Eagle coin",
  ),
  /** Silver listing card 2 in the frame: a PAMP silver bar. */
  silverBarPamp: picture(
    "silver-listing-card-pamp--I10979-24561.webp",
    "PAMP Suisse minted silver bar",
  ),
  /** Homepage promo composite: the horse bar with two assay cards (gallery thumbnails 2 and 4). */
  horseComposite: {
    src: "/figma/image-179--9813-5851.webp",
    alt: "Argor-Heraeus Year of the Horse gold bar, shown with two certified assay cards",
    width: 370,
    height: 370,
  } as ImageRef,
} as const;

/**
 * The hero gallery as drawn (11083:19867): the main picture, the horse
 * composite, the main picture again, the composite again. Placeholder
 * photography throughout. TODO(client): four real angles per SKU.
 */
export const placeholderGallery = (main: ImageRef): ImageRef[] => [
  main,
  pictures.horseComposite,
  main,
  pictures.horseComposite,
];

// ---------------------------------------------------------------------------
// Section media shared by every product (11083:19982 / 19984)
// ---------------------------------------------------------------------------

/** Provenance & Custody — advisor with a tablet across from a client. 555x416 drawn. */
export const provenanceMedia: ImageRef = {
  src: "/figma/product-provenance-advisor-tablet--11083-19982.webp",
  // TODO(client): staged photograph — licence and who is pictured.
  alt: "A J. Rotbart & Co. adviser reviewing a delivery record on a tablet with a client",
  width: 555,
  height: 416,
};

/** Premium Drivers — two people reviewing a document beside a gold bar in a tray. */
export const premiumDriversMedia: ImageRef = {
  src: "/figma/product-premium-drivers-bar-review--11083-19984.webp",
  // TODO(client): staged photograph — licence and who is pictured.
  alt: "Two people reviewing a quotation beside a gold bar in a display tray",
  width: 555,
  height: 416,
};

// ---------------------------------------------------------------------------
// Tax & regulatory treatment (11083:19998 / 19743)
// ---------------------------------------------------------------------------

/**
 * Only offices with compliance-approved wording are present: the Philippines
 * and Israel cells read "[Compliance to supply]" in both frames and are
 * omitted, so a two-cell grid renders. TODO(client): Philippines and Israel
 * wording. The two icons are the frame's placeholders (truck, bank).
 * TODO(client): office icons.
 */
export const taxTreatment = (
  singapore: Paragraph,
  hongKong: Paragraph = "No GST or VAT applies to investment precious metals.",
): ProductDetail["taxTreatment"] => [
  { office: "singapore", icon: "truck", body: [singapore] },
  { office: "hong-kong", icon: "bank", body: [hongKong] },
];

/** The Singapore rule as drawn on the coin frame (11083:20003) — a 999.9 coin on the IRAS list. */
export const singaporeCoinRule =
  "Appears on the IRAS list of qualifying coins at 999.9 fineness, so it is exempt from GST as an Investment Precious Metal.";

/** The Singapore rule as drawn on the bar frame (11083:19748) — a bar of 99.5%+ from an LBMA refiner. */
export const singaporeBarRule =
  "Qualifies as Investment Precious Metal: bar of 99.5% purity or higher from an LBMA accredited refiner, so no GST applies.";

/** Silver has its own IPM thresholds (99.9% bars; listed 999 coins). TODO(client): compliance wording for silver. */
export const singaporeSilverBarRule =
  "Qualifies as Investment Precious Metal: silver bar of 99.9% purity or higher from an LBMA accredited refiner, so no GST applies.";

// ---------------------------------------------------------------------------
// Small constructors
// ---------------------------------------------------------------------------

/** FAQ ids follow `${slug}-faq-${n}` so the accordion's per-page group is unique. */
export const productFaq = (slug: string, n: number, question: string, answer: string): Faq => ({
  _id: `${slug}-faq-${n}`,
  question,
  answer: [answer],
});

/** `${title} | J. Rotbart & Co.` + the hero summary, the template default. TODO(client): per-product SEO copy. */
export const productSeo = (title: string, description: string): Seo => ({
  title: `${title}${titleSuffix}`,
  description,
});
