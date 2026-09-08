import type { ImageRef, Metal, Mint, Product } from "@content/types";

/**
 * THE LISTING GRIDS EXACTLY AS FIGMA DRAWS THEM — placeholder content.
 *
 * `Product - Gold Listing` 9922:2130 (grid 10359:4178) and
 * `Product - Sliver Listing` 10977:23576 (grid 10979:24560). Nine cards each,
 * transcribed from the frames' own text nodes and image fills rather than
 * retyped: the strings and the eight bitmaps below were pulled from the Figma
 * REST API and are byte-for-byte what the frames contain.
 *
 * READ THIS BEFORE LAUNCH — none of this is real product data.
 *
 * • Both frames repeat a handful of products to fill nine cards. Gold draws
 *   four distinct names (Heraeus x3, Argor-Heraeus x3, Royal Canadian Mint x2,
 *   Metalor x1); silver draws three (Heraeus x3, PAMP x3, American Eagle x3).
 * • Every card says "Mint: Lorem".
 * • Every card says "Purity: 999.9 fine gold" — INCLUDING all nine on the
 *   SILVER frame, which is a copy/paste error in the design.
 * • Every card says "Variants: 100g, 250g, 500g and 1000g".
 * • Every description is the standard lorem ipsum paragraph.
 * • Every card carries the "Best seller" ribbon.
 *
 * The real catalogue is untouched and still lives in ./gold.ts and ./silver.ts
 * — it builds the product detail pages, the homepage best sellers, the Buy PM
 * grid and "Often held alongside". Only the two listing PAGES read this module.
 * Deleting this file and restoring `byMetal(metal)` in
 * src/content/pages/metal-listing-page.ts puts the 16 gold and 12 silver real
 * products back.
 *
 * TODO(client): replace with the real catalogue, or supply the intended nine.
 */

/** "Mint: Lorem" on all eighteen cards. No location, so the card prints the name alone. */
const loremMint: Mint = {
  _id: "figma-lorem-mint",
  name: "Lorem",
};

/** The frame's body copy, one string, identical on all eighteen cards. */
const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

/** Drawn 370 x 370 (a 370 x 345 photo under the 25px ribbon strip); the bitmaps are the Figma originals. */
const cardImage = (file: string, alt: string): ImageRef => ({
  src: `/figma/listing-${file}.webp`,
  alt,
  width: 370,
  height: 370,
});

/*
 * The eight distinct bitmaps, keyed by the frame position that first uses
 * them. Alt text is ours — the frames carry none, and every image type on this
 * site requires it. It describes the photograph, not the lorem card it sits on.
 */
const images = {
  goldHeraeus: cardImage("gold-1-heraeus", "A stack of cast fine gold bars"),
  goldArgor: cardImage("gold-2-argor", "Minted gold bars in sealed assay cards"),
  goldRcm: cardImage("gold-3-rcm", "A one kilogram cast gold bar"),
  goldMetalor: cardImage("gold-4-metalor", "A minted gold bar beside loose bullion coins"),
  goldHeraeusAlt: cardImage("gold-5-heraeus", "Fine gold bars arranged in a row"),
  silverHeraeus: cardImage("silver-1-heraeus", "Cast fine silver bars stacked in a block"),
  silverPamp: cardImage("silver-2-pamp", "A minted silver bar in its assay card"),
  silverEagle: cardImage("silver-3-eagle", "One-ounce silver bullion coins"),
} as const;

/**
 * One drawn card. `slug` is deliberately a `figma-` id that matches no real
 * product, so `productHref()` finds no detail page and the CTA falls back to
 * the contact anchor — the frames link nowhere either.
 */
const card = (metal: Metal, index: number, name: string, image: ImageRef): Product => ({
  _id: `figma-${metal}-listing-${index}`,
  name,
  metal,
  slug: `figma-${metal}-listing-${index}`,
  // Every drawn card is a bar-shaped placeholder; nothing on the listing reads this.
  form: "bar",
  mint: loremMint,
  // As drawn — "fine gold" on the silver frame too.
  purity: "999.9 fine gold",
  variants: "100g, 250g, 500g and 1000g",
  description: LOREM,
  image,
  bestSeller: true,
});

/** Gold grid 10359:4178, rows 1-9 in drawn order. */
const gold: Product[] = [
  card("gold", 1, "Heraeus", images.goldHeraeus),
  card("gold", 2, "Argor-Heraeus", images.goldArgor),
  card("gold", 3, "Royal Canadian Mint", images.goldRcm),
  card("gold", 4, "Metalor", images.goldMetalor),
  card("gold", 5, "Heraeus", images.goldHeraeusAlt),
  card("gold", 6, "Argor-Heraeus", images.goldArgor),
  card("gold", 7, "Heraeus", images.goldHeraeus),
  card("gold", 8, "Argor-Heraeus", images.goldArgor),
  card("gold", 9, "Royal Canadian Mint", images.goldRcm),
];

/** Silver grid 10979:24560, rows 1-9 in drawn order. */
const silver: Product[] = [
  card("silver", 1, "Heraeus", images.silverHeraeus),
  card("silver", 2, "PAMP", images.silverPamp),
  card("silver", 3, "American Eagle (US Mint)", images.silverEagle),
  card("silver", 4, "PAMP", images.silverPamp),
  card("silver", 5, "American Eagle (US Mint)", images.silverEagle),
  card("silver", 6, "PAMP", images.silverPamp),
  card("silver", 7, "Heraeus", images.silverHeraeus),
  card("silver", 8, "American Eagle (US Mint)", images.silverEagle),
  card("silver", 9, "Heraeus", images.silverHeraeus),
];

/**
 * Keyed by metal, but only gold and silver have a frame — and only those two
 * have a listing page, so a lookup never misses in practice. Partial rather
 * than a cast: if a platinum listing is ever built before its frame is drawn,
 * it gets an empty grid instead of a type error or a silent wrong catalogue.
 */
export const figmaListingCards: Partial<Record<Metal, Product[]>> = { gold, silver };

/**
 * The tab counts the frames draw (9933:3070 / 10977:23584). They are invented
 * numbers — the real catalogue holds 16 gold and 12 silver — and all four
 * metals get a tab even though only gold and silver have a listing page.
 * TODO(client): real counts, and where the platinum / palladium tabs point.
 */
export const figmaTabCounts: Record<Metal, number> = {
  gold: 42,
  silver: 28,
  platinum: 22,
  palladium: 20,
};
