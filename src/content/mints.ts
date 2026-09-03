import type { ImageRef, Mint } from "./types";

/**
 * Mint / refiner documents.
 *
 * Referenced by every product (`Product.mint`), by the product hero eyebrow
 * ("The Royal Mint · Llantrisant, UK") and by the mint provenance strip above
 * the contact form, which draws the five logos below.
 *
 * `location` is what the product card prints after the name ("Heraeus,
 * Germany"), so it carries at least the country. Only the Royal Mint's town is
 * drawn anywhere in the design (product hero 11083:19850); every other
 * location is our reading of where the refiner is and is flagged for the
 * client. The homepage card copy ("Heraeus, Germany" etc.) was already a
 * best-reading with the same flag, so nothing here changes what ships there.
 *
 * Logos: the five mint-strip files are the Figma exports from 10369:9011. They
 * are opaque JPEG-sourced bitmaps with the white keyed out from the edges; the
 * `width`/`height` are the FIGMA TILE boxes, not the bitmap sizes — the strip
 * centres each bitmap in its tile with `object-contain`.
 * TODO(assets): Figma's own sources are only ~220-290px wide, so they are soft
 * on a retina screen. Vector or 2x logos would fix that.
 */
const logo = (file: string, alt: string, width: number, height: number): ImageRef => ({
  src: `/figma/${file}`,
  alt,
  width,
  height,
});

export const royalMint: Mint = {
  _id: "royal-mint",
  name: "The Royal Mint",
  // Drawn on the coin hero eyebrow (11083:19850): "The Royal Mint · Llantrisant, UK".
  location: "Llantrisant, UK",
  logo: logo("mint-royalmint.webp", "The Royal Mint", 120, 54),
};

export const heraeus: Mint = {
  _id: "heraeus",
  name: "Heraeus",
  location: "Germany", // TODO(client): confirm — Figma showed "Lorem" on every card
};

export const argorHeraeus: Mint = {
  _id: "argor-heraeus",
  name: "Argor-Heraeus",
  location: "Switzerland", // TODO(client): confirm
};

export const royalCanadianMint: Mint = {
  _id: "royal-canadian-mint",
  name: "Royal Canadian Mint",
  location: "Canada", // TODO(client): confirm
  logo: logo("mint-canadianmint.webp", "Royal Canadian Mint / Monnaie royale canadienne", 120, 54),
};

export const pamp: Mint = {
  _id: "pamp",
  name: "PAMP",
  // TODO(client): confirm the public naming ("PAMP" vs "PAMP Suisse") and the
  // location line for the bar hero eyebrow — not drawn; Ticino is the refinery.
  location: "Ticino, Switzerland",
};

export const metalor: Mint = {
  _id: "metalor",
  name: "Metalor",
  location: "Switzerland", // TODO(client): confirm
};

export const perthMint: Mint = {
  _id: "perth-mint",
  name: "The Perth Mint",
  location: "Perth, Australia", // TODO(client): confirm
  logo: logo("mint-perthmint.webp", "The Perth Mint Australia", 120, 42),
};

export const saMint: Mint = {
  _id: "sa-mint",
  name: "The South African Mint",
  location: "Pretoria, South Africa", // TODO(client): confirm
  logo: logo("mint-samint.webp", "The South African Mint", 120, 44),
};

export const usMint: Mint = {
  _id: "us-mint",
  name: "United States Mint",
  location: "United States", // TODO(client): confirm
  logo: logo("mint-unitedmint.webp", "United States Mint", 120, 54),
};

export const mints: Mint[] = [
  royalMint,
  heraeus,
  argorHeraeus,
  royalCanadianMint,
  pamp,
  metalor,
  perthMint,
  saMint,
  usMint,
];

/** Lookup by `_id`. Throws at build time on a typo, which is the point. */
export function mintById(id: Mint["_id"]): Mint {
  const mint = mints.find((m) => m._id === id);
  if (!mint) throw new Error(`[content/mints] unknown mint "${id}"`);
  return mint;
}
