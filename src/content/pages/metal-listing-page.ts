import type { Metal, ProductListingBlock, Seo, TestimonialBandBlock } from "@content/types";
import { byMetal, countsByMetal, listedMetals } from "@content/products";
import { listingSeo, productListingBlock } from "@content/pages/buy-metal";
import { productCardLabels } from "@content/homepage/products";
import { albertCheng } from "@content/testimonials";
import { navigation } from "@content/navigation";
import { metalHref } from "@lib/products";

/**
 * The metal listing PAGE — /buy-gold/ and /buy-silver/ — as an ordered list
 * of typed blocks. The route (src/pages/buy-[metal]/index.astro) calls
 * `metalListingPage(metal)` and renders the blocks in the order the fields
 * are declared, exactly as src/pages/index.astro composes the homepage.
 *
 * Figma: `Product - Gold Listing` 9922:2130 and `Product - Sliver Listing`
 * 10977:23576 (SP sections/prod-gold.txt, prod-silver.txt). Both frames are
 * the same three blocks over the site-wide tail:
 *
 *   productListing   9922:2914 / 10977:23578   (light, 1366x2905)
 *   testimonialBand  10372:5491 / 10977:23709  (dark, 512)
 *   — tail: mint strip 10373:5555, contact 10373:5565 (SiteLayout)
 *
 * Live URLs jrotbart.com/buy-gold/ and /buy-silver/ (captured 2026-09-03).
 * Copy source: SP texts/prod-gold.txt and texts/prod-silver.txt — the
 * template strings themselves live in src/content/pages/buy-metal.ts; this
 * module only composes.
 *
 * ONE TEMPLATE, TWO METALS. The Silver frame's H1 still reads "Buy Gold and
 * Precious Metals" (10977:23582 — a copy slip); the heading is built from the
 * metal label, so /buy-silver/ reads "Buy *Silver* and Precious Metals".
 *
 * Placeholder register for this page
 * ----------------------------------
 * • TODO(client): both frames draw the Albert Cheng band in the testimonial
 *   slot — the same band the homepage draws. A second testimonial is needed
 *   before the listings read as anything but a placeholder.
 * • TODO(client): the "Products" breadcrumb links to the live products hub
 *   (/products-buy-gold-silver-platinum-palladium/), the page the Products
 *   menu item points at. It is not rebuilt yet; confirm it stays the hub.
 * • The per-template placeholders (tab counts, sort control, lorem cards,
 *   silver title) are listed in src/content/pages/buy-metal.ts.
 */

export interface MetalListingPage {
  metal: Metal;
  /** "Gold" / "Silver" — the tab label, the breadcrumb and the H1 accent. */
  metalLabel: string;
  seo: Seo;
  /* ---- blocks, in page order ---- */
  listing: ProductListingBlock;
  testimonial: TestimonialBandBlock;
}

/**
 * Where the "Products" breadcrumb points: the Products menu item's own href,
 * so the crumb and the nav can never disagree. Falls back to the live hub
 * URL if the menu is ever restructured.
 * TODO(client): the hub page is not rebuilt yet.
 */
const PRODUCTS_HUB_FALLBACK = "/products-buy-gold-silver-platinum-palladium/";
export const productsHubHref =
  navigation.menu.find((item) => item.label === "Products")?.href ?? PRODUCTS_HUB_FALLBACK;

/** Breadcrumb labels — "Home" and the hub are site-wide, the metal is the tab label. */
export const listingBreadcrumbLabels = { home: "Home", products: "Products" };

/** Every listed metal gets a page — the allowlist in src/content/products/index.ts. */
export const listedMetalPages = (): Metal[] => listedMetals;

export function metalListingPage(metal: Metal): MetalListingPage {
  const metalLabel = productCardLabels.metalLabels[metal];

  const listing = productListingBlock({
    metal,
    products: byMetal(metal),
    counts: countsByMetal(),
    key: `${metal}-listing`,
  });

  /** 10372:5491 / 10977:23709. TODO(client): second testimonial — see the register above. */
  const testimonial: TestimonialBandBlock = {
    _key: `${metal}-listing-testimonial`,
    _type: "testimonialBand",
    theme: "dark",
    testimonial: albertCheng,
  };

  return {
    metal,
    metalLabel,
    seo: listingSeo[metal],
    listing,
    testimonial,
  };
}

/** The listing's own path, for canonical, breadcrumb and schema URLs. */
export const listingPath = (metal: Metal): string => metalHref(metal);
