import type { Metal, MetalTab, Product, ProductListingBlock, Seo } from "@content/types";
import { productCardLabels } from "@content/homepage/products";
import { listedMetals } from "@content/products";
import { metalHref } from "@lib/products";

/**
 * Metal listing template copy — /buy-gold/ and /buy-silver/.
 * Figma: `Product - Gold Listing` 9922:2130 (section 9922:2914) and
 * `Product - Sliver Listing` 10977:23576 (section 10977:23578); copy from SP
 * texts/prod-gold.txt and texts/prod-silver.txt. Live URLs jrotbart.com/buy-gold/
 * and /buy-silver/ (captured 2026-09-03).
 *
 * One template, one string set; the metal is interpolated. The route
 * (src/pages/buy-[metal]/index.astro, Phase 3) builds its block with
 * `productListingBlock()` below.
 *
 * Placeholder register for this template
 * ---------------------------------------
 * • TODO(client): the frame draws four tabs with counts 42 / 28 / 22 / 20.
 *   Counts are computed from the catalogue (16 / 12 today) and only metals
 *   with a listing page get a tab — platinum and palladium have none, so a
 *   tab would link to nothing.
 * • TODO(client): the frame draws a "Sort by : A–Z" control with one option.
 *   Not shipped (`sort` unset); the cards are ordered A–Z by name.
 * • TODO(client): the frame's nine cards are lorem; the catalogue is the live
 *   site's. Every "Best seller" ribbon follows the live site.
 * • TODO(client): the live silver page title and both descriptions.
 */

export const listingCopy = {
  overline: "Products",
  /** "Buy *Gold* and Precious Metals" — the metal label is the accent run (9922:2999). */
  heading: { before: "Buy ", after: " and Precious Metals" },
  body:
    "We help customers buy gold, silver, platinum, or palladium as well as sell, store, and transport their precious metals. We are experts at securing assets in offshore jurisdictions.",
  /** "Gold Bars & Coins." (10563:27934) — %s = the metal label. */
  metalHeading: "%s Bars & Coins.",
  /** I10359:4317 */
  loadMoreLabel: "Load More",
  /** Nine cards drawn before the button (3 x 3 at lg). */
  pageSize: 9,
};

/** Per-metal <title> / description. Gold keeps the live title. */
export const listingSeo: Record<Metal, Seo> = {
  gold: {
    title: "Gold Bars, Bullion, Coins | J. Rotbart & Co.",
    // TODO(client): description copy — the H1 body doubles as the meta description.
    description:
      "Buy LBMA certified gold bars and coins from Heraeus, Argor-Heraeus, PAMP, The Royal Mint and more, delivered or vaulted in your name.",
  },
  silver: {
    // TODO(client): the live title is "Silver Bars, Bullion, Coins"? Confirm.
    title: "Silver Bars, Bullion, Coins | J. Rotbart & Co.",
    description:
      "Buy LBMA certified silver bars and coins from Heraeus, PAMP, The Royal Mint, the US Mint and more, delivered or vaulted in your name.",
  },
  // No listing is built for these two (see src/content/products/index.ts). TODO(client).
  platinum: { title: "Platinum Bars, Bullion, Coins | J. Rotbart & Co.", description: "" },
  palladium: { title: "Palladium Bars, Bullion, Coins | J. Rotbart & Co.", description: "" },
};

const fill = (template: string, value: string): string => template.replace("%s", value);

/** Cards ordered A–Z by name, the drawn control's default state. */
export const sortAz = (products: Product[]): Product[] =>
  [...products].sort((a, b) => a.name.localeCompare(b.name, "en"));

/**
 * Build the listing block for one metal. `counts` is products-per-metal
 * (src/content/products `countsByMetal()`); only listed metals get a tab.
 */
export function productListingBlock(options: {
  metal: Metal;
  products: Product[];
  counts: Record<Metal, number>;
  /** "az" (default) or the catalogue's own order. */
  order?: "az" | "catalogue";
  key?: string;
}): ProductListingBlock {
  const { metal, counts, order = "az" } = options;
  const { metalLabels } = productCardLabels;
  const label = metalLabels[metal];

  const tabs: MetalTab[] = listedMetals.map((m) => ({
    metal: m,
    label: metalLabels[m],
    count: counts[m],
    href: metalHref(m),
    current: m === metal,
  }));

  return {
    _key: options.key ?? `${metal}-listing`,
    _type: "productListing",
    theme: "light",
    metal,
    header: {
      overline: listingCopy.overline,
      heading: `${listingCopy.heading.before}${label}${listingCopy.heading.after}`,
      headingRuns: [
        { text: listingCopy.heading.before },
        { text: label, accent: true },
        { text: listingCopy.heading.after },
      ],
      body: listingCopy.body,
    },
    tabs,
    metalHeading: fill(listingCopy.metalHeading, label),
    products: order === "az" ? sortAz(options.products) : options.products,
    pageSize: listingCopy.pageSize,
    loadMoreLabel: listingCopy.loadMoreLabel,
    ...productCardLabels,
  };
}
