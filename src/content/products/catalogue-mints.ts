import type { Mint } from "@content/types";

/**
 * Mint documents the LIVE catalogue needs that src/content/mints.ts does not
 * yet carry. The live /buy-gold/ and /buy-silver/ pages (captured 2026-09-03)
 * list products from four refiners the shared module has no document for.
 *
 * They live here, beside the catalogue that references them, only because the
 * shared module is owned by the foundation phase. INTEGRATOR: move these four
 * into src/content/mints.ts (and its `mints[]` array) and delete this file;
 * every import is `@content/products/catalogue-mints`, so it is one
 * find-and-replace.
 *
 * Locations are our reading of where each refiner is, flagged like the
 * others in mints.ts. No logos: none of the four is drawn in the mint strip.
 */

export const abcBullion: Mint = {
  _id: "abc-bullion",
  name: "ABC Bullion",
  location: "Sydney, Australia", // TODO(client): confirm
};

export const valcambi: Mint = {
  _id: "valcambi",
  name: "Valcambi",
  location: "Balerna, Switzerland", // TODO(client): confirm
};

export const austrianMint: Mint = {
  _id: "austrian-mint",
  name: "Austrian Mint",
  location: "Vienna, Austria", // TODO(client): confirm
};

export const chinaGoldCoin: Mint = {
  _id: "china-gold-coin",
  // The live site labels the Panda's issuer "Chinese Central Mint"; the
  // issuing body is China Gold Coin Inc. under the People's Bank of China.
  // TODO(client): which name should appear on the card.
  name: "China Gold Coin",
  location: "China", // TODO(client): confirm
};

export const catalogueMints: Mint[] = [abcBullion, valcambi, austrianMint, chinaGoldCoin];
