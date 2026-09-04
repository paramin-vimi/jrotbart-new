import type { Metal, Product, ProductDetail } from "@content/types";
import { isProductDetail } from "@lib/products";
import { goldProducts } from "./gold";
import { silverProducts } from "./silver";
import { platinumGroupProducts } from "./platinum-group";

/**
 * The product catalogue. Every route reads products through this module —
 * the listing (src/pages/buy-[metal]/index.astro), the detail template
 * (src/pages/buy-[metal]/[product].astro) and any "related" resolution.
 *
 * SCOPE. `products` is the LIVE catalogue: the 16 gold and 12 silver products
 * jrotbart.com lists today, eight of them full `ProductDetail`s (see gold.ts
 * and silver.ts headers for which). Only `listedMetals` get a listing page —
 * gold and silver — and only `ProductDetail`s get a detail page. The homepage's
 * platinum and palladium products are in `pendingProducts`, deliberately
 * outside `products` (see platinum-group.ts).
 * TODO(client): platinum and palladium listings.
 */

/** Metals with a listing route. `getStaticPaths` filters on this, never on what metals exist. */
export const listedMetals: Metal[] = ["gold", "silver"];

/** The live catalogue, gold then silver, each in the live site's order. */
export const products: Product[] = [...goldProducts, ...silverProducts];

/** The eight documents with a detail page (six live, two pending). */
export const productDetails: ProductDetail[] = [
  ...products.filter(isProductDetail),
  ...platinumGroupProducts,
];

/** Full documents for metals without a listing yet. Not rendered anywhere. */
export const pendingProducts: ProductDetail[] = platinumGroupProducts;

/** Slugs that have a built detail page, for cards authored outside this catalogue
 *  (the homepage writes its own `Product` literals). See productHref(). */
export const detailSlugs: ReadonlySet<Product["slug"]> = new Set(
  productDetails.map((product) => product.slug),
);

/** Every product of one metal, in catalogue order. */
export const byMetal = (metal: Metal): Product[] => products.filter((p) => p.metal === metal);

/** Products per metal, for the listing tabs. Zero for metals with no listing. */
export const countsByMetal = (): Record<Metal, number> => ({
  gold: byMetal("gold").length,
  silver: byMetal("silver").length,
  platinum: byMetal("platinum").length,
  palladium: byMetal("palladium").length,
});

/** Lookup by `_id` across the live catalogue. Throws at build time on a typo, which is the point. */
export function productById(id: Product["_id"]): Product {
  const product = products.find((p) => p._id === id);
  if (!product) throw new Error(`[content/products] unknown product "${id}"`);
  return product;
}

/** Resolve a detail document's `related` ids to products (the "Often held alongside" grid). */
export const relatedProducts = (product: ProductDetail): Product[] => product.related.map(productById);
