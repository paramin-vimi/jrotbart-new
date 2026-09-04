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
export function productHref(
  product: Product,
  fallback = "#contact",
  detailSlugs?: ReadonlySet<Product["slug"]>,
): string {
  /* Two ways a card can earn a link. The structural guard covers a card that IS
     a ProductDetail (the listings pass the real documents). `detailSlugs` covers
     the case the guard cannot see: the homepage authors its six cards by hand as
     plain `Product`s, so they carry no gallery or specGroups even when a detail
     document for the same slug exists elsewhere — four of them do. Without this
     the homepage sent those four to the contact form while /buy-gold/ linked the
     same product to a real page.

     The registry is PASSED IN rather than imported: src/content/products/index.ts
     already imports `isProductDetail` from this module, so importing the
     catalogue here would close a cycle. */
  if (isProductDetail(product)) return `${metalHref(product.metal)}${product.slug}/`;
  if (detailSlugs?.has(product.slug)) return `${metalHref(product.metal)}${product.slug}/`;
  return fallback;
}
