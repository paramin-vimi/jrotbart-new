import type { Metal, Product, ProductDetail } from "@content/types";

/**
 * Product routing helpers.
 *
 * A `Product` is a listing-only document (card data); a `ProductDetail` carries
 * everything the coin/bar template draws. Only the latter gets a page, so every
 * card CTA decides its destination through `productHref()` rather than
 * assuming `/buy-<metal>/<slug>/` exists.
 */

/** Type guard: a product with a detail page. Checks the fields only `ProductDetail` carries. */
export function isProductDetail(product: Product): product is ProductDetail {
  return "title" in product && "gallery" in product && "specGroups" in product;
}

/** The metal listing route. Only gold and silver are emitted today — see src/pages/buy-[metal]/. */
export const metalHref = (metal: Metal): string => `/buy-${metal}/`;

/**
 * Where a product card links. `/buy-<metal>/<slug>/` when a detail document
 * exists, else the `fallback` — the contact anchor, matching the live site,
 * where a client can ask about a product that has no page of its own yet.
 */
export function productHref(product: Product, fallback = "#contact"): string {
  return isProductDetail(product) ? `${metalHref(product.metal)}${product.slug}/` : fallback;
}
