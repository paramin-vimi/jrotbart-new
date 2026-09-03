import type { Product, ProductDetail } from "@content/types";
import {
  heraeus,
  metalor,
  pamp,
  perthMint,
  royalCanadianMint,
  royalMint,
  saMint,
  usMint,
} from "@content/mints";
import { austrianMint, chinaGoldCoin, valcambi } from "./catalogue-mints";
import { defaultTerms } from "@content/pages/product";
import {
  pictures,
  placeholderGallery,
  premiumDriversMedia,
  productFaq,
  productSeo,
  provenanceMedia,
  singaporeSilverBarRule,
  taxTreatment,
} from "./shared";

/**
 * The SILVER catalogue — every product the live /buy-silver/ page lists
 * (jrotbart.com/buy-silver/, captured 2026-09-03: 12 products), in the live
 * order. Figma: Silver listing 10977:23576 (nine lorem cards whose spec rows
 * still read "999.9 fine gold" — a copy/paste error; the copy source is the
 * live site).
 *
 * ONE document is a full `ProductDetail`: the homepage's Heraeus silver bar
 * (`_id` and slug match src/content/homepage/products.ts). No silver page was
 * designed; its detail sections are drafted on the bar template and anchored
 * on the 1 kilogram bar. The other eleven are listing-only.
 *
 * Placeholder register
 * --------------------
 * • TODO(client): descriptions are the live sentences verbatim ("Heraeus
 *   offer both…", "These swiss brand metal bars…"); they want rewriting.
 * • TODO(client): the live Austrian Philharmonic SILVER card carries the GOLD
 *   coin's description. Replaced with a one-line silver description of ours.
 * • TODO(client): live purity claims disagree with the mints' own figures in
 *   two places — the Silver Britannia (live "99.99%"; The Royal Mint strikes
 *   it 999 fine, as the coin template's own FAQ says) and the Heraeus bar
 *   (live 999.9; the pictured bar is stamped "Feinsilber 999,0"). Britannia
 *   follows the Mint; Heraeus follows the live site, as the homepage does.
 * • TODO(client): `variants` on the coins is the 1 oz standard size; the
 *   live copy names no sizes.
 * • TODO(client): `bestSeller` follows the live site (Heraeus, Royal Canadian
 *   Mint bar, Canadian Maple).
 * • TODO(assets): every picture is a stand-in (see shared.ts).
 */

const KILO_TOZ = 32.151;

// ---------------------------------------------------------------------------
// Detail document
// ---------------------------------------------------------------------------

export const heraeusSilver: ProductDetail = {
  _id: "heraeus-silver",
  name: "Heraeus",
  metal: "silver",
  slug: "heraeus-silver-bar",
  form: "bar",
  mint: heraeus,
  purity: "999.9 fine silver",
  variants: "100g, 250g, 500g and 1000g", // TODO(client): confirm silver weights
  description:
    "In 2014 Heraeus began producing silver bars with a 999.9 silver " +
    "composition. Heraeus offers both cast and minted silver bar products.",
  image: pictures.silverBar,
  bestSeller: true,

  title: "1 Kilogram Heraeus Cast Silver Bar 999.9.",
  shortName: "1 kg Heraeus silver bar",
  summary:
    "A full kilogram of LBMA certified silver from Germany’s largest precious-metals refiner, cast and serial-numbered.",
  productType: "Bar",
  fineness: "999.9",
  grossWeight: "1,000 g",
  fineContentToz: KILO_TOZ,
  formLabel: "Cast",
  gallery: placeholderGallery(pictures.silverBar),
  terms: [...defaultTerms],
  whyHold: [
    [
      "Silver moves in larger swings than gold and trades at a fraction of the price per ounce, so a kilogram bar is the practical unit for holding a meaningful silver position in one piece.",
      "Heraeus has cast silver bars since 2014 alongside its gold range, so a holding can be built in a single refiner’s format across both metals.",
    ],
    [
      "Heraeus is an LBMA Good Delivery refiner for silver as well as gold. When the time comes to sell, dealers and vaults know the brand, so your bar is easy to value and easy to move.",
    ],
  ],
  specGroups: [
    {
      _key: "identity",
      label: "Identity",
      rows: [
        { label: "Product type", value: "Bar" },
        { label: "Metal", value: "Silver" },
        { label: "Form", value: "Cast" },
        { label: "Manufacturer", value: "Heraeus Precious Metals, Hanau, Germany" },
        { label: "Accreditation", value: "LBMA Good Delivery refiner (silver)" },
        { label: "Series / Program", value: "N/A" },
      ],
    },
    // TODO(client): dimensions, thickness and packaging for the Physical tab.
    { _key: "physical", label: "Physical", rows: [] },
  ],
  provenance: {
    body: [
      "Every Heraeus bar we deliver comes through LBMA accredited channels. Before it reaches you or your vault account, we check the weight, the dimensions, the markings, and the serial number against refinery records.",
      "You receive the serial number in your documents, and it stays with the bar through storage, audits, and an eventual sale.",
    ],
    media: provenanceMedia,
  },
  premiumDrivers: {
    body: [
      "The price of a kilo bar follows the live silver market, plus a premium that covers fabrication, brand, and market conditions. Because silver is worth far less per gram than gold, fabrication is a larger share of the price, so kilo bars carry a much lower premium per ounce than small bars or coins.",
    ],
    media: premiumDriversMedia,
  },
  taxTreatment: taxTreatment(singaporeSilverBarRule),
  faqs: [
    productFaq(
      "heraeus-silver-bar",
      1,
      "Is a 1 kg Heraeus silver bar GST-exempt in Singapore?",
      "Silver bars of 99.9% purity or higher from an LBMA accredited refiner qualify as Investment Precious Metals, so no GST applies when you buy in Singapore. Your Value Expert will confirm the position for your specific transaction.",
    ),
    productFaq(
      "heraeus-silver-bar",
      2,
      "Can my bar go straight into your vault?",
      "Yes. We can place your bar in allocated, segregated storage in your name on the day you buy it, fully insured, in Singapore, Hong Kong, or any of our 16 vault locations.",
    ),
    productFaq(
      "heraeus-silver-bar",
      3,
      "Will you buy the bar back?",
      "Yes. We buy back bullion we sold you at live market prices, with settlement usually within one business day, in fiat or crypto.",
    ),
  ],
  related: ["royal-canadian-mint-silver", "pamp-silver", "british-silver-britannia"],
  seo: productSeo(
    "1 Kilogram Heraeus Cast Silver Bar 999.9",
    "Buy a 1 kg Heraeus cast silver bar, 999.9 fine and LBMA certified, delivered or vaulted in your name.",
  ),
};

// ---------------------------------------------------------------------------
// Listing-only products (live copy verbatim; no page until a detail exists)
// ---------------------------------------------------------------------------

export const pampSilver: Product = {
  _id: "pamp-silver",
  name: "PAMP",
  metal: "silver",
  slug: "pamp-silver-bar",
  form: "bar",
  mint: pamp,
  purity: "999.0 fine silver",
  variants: "500g, 1kg and 1000oz",
  description:
    "PAMP silver bars are available in 1000oz, 1kg and 500g. These precious bars have a composition of 999.0 pure silver.",
  // Matches: the silver listing export is a PAMP minted silver bar.
  image: pictures.silverBarPamp,
};

export const metalorSilver: Product = {
  _id: "metalor-silver",
  name: "Metalor",
  metal: "silver",
  slug: "metalor-silver-bar",
  form: "bar",
  mint: metalor,
  purity: "999.0 fine silver",
  variants: "100g and 1kg",
  description:
    "Metalor silver bar has a composition of 999.0 pure silver. These swiss brand metal bars are available in 100g and 1 kg.",
  image: pictures.silverBar,
};

export const valcambiSilver: Product = {
  _id: "valcambi-silver",
  name: "Valcambi",
  metal: "silver",
  slug: "valcambi-silver-bar",
  form: "bar",
  mint: valcambi,
  purity: "999.0 fine silver",
  variants: "1oz to 1000g",
  description:
    "Valcambi silver bars carry a purity of 999.0 pure silver. It is widely offered in 1oz to 1000g variants.",
  image: pictures.silverBarPamp,
};

export const royalCanadianMintSilver: Product = {
  _id: "royal-canadian-mint-silver",
  name: "Royal Canadian Mint",
  metal: "silver",
  slug: "royal-canadian-mint-silver-bar",
  form: "bar",
  mint: royalCanadianMint,
  purity: "999 to 999.9 fine silver",
  variants: "10oz and 1kg",
  description:
    "This internationally recognized mint produces silver bars with purity ranging from 999 to 999.9. It is available in different variants including 10oz and 1kg.",
  image: pictures.silverBar,
  bestSeller: true,
};

export const americanSilverEagle: Product = {
  _id: "american-silver-eagle",
  name: "American Eagle (US Mint)",
  metal: "silver",
  slug: "american-silver-eagle-coin",
  form: "coin",
  mint: usMint,
  purity: "999 fine silver",
  variants: "1 oz",
  description:
    "The American Eagle silver coin has 99.9% fineness and holds a USD 1 value. It is the official silver coin of the United States.",
  // Matches: the silver listing export is an American Silver Eagle.
  image: pictures.silverCoin,
};

export const australianSilverKangaroo: Product = {
  _id: "australian-silver-kangaroo",
  name: "Australian Kangaroo (The Perth Mint)",
  metal: "silver",
  slug: "australian-silver-kangaroo-coin",
  form: "coin",
  mint: perthMint,
  purity: "999.9 fine silver",
  variants: "1 oz",
  description:
    "Introduced in 1993, the Australian Kangaroo silver coin has a legal tender status in Australia. It has 99.99% fineness and holds AUD 1 value.",
  image: pictures.silverCoin,
};

export const austrianSilverPhilharmonic: Product = {
  _id: "austrian-silver-philharmonic",
  name: "Austrian Philharmonic (Austrian Mint)",
  metal: "silver",
  slug: "austrian-silver-philharmonic-coin",
  form: "coin",
  mint: austrianMint,
  purity: "999 fine silver",
  variants: "1 oz",
  // TODO(client): the live silver card carries the GOLD Philharmonic's description; this line is ours.
  description:
    "The silver Austrian Philharmonic is struck in 999 fine silver by the Austrian Mint and carries a EUR 1.50 face value.",
  image: pictures.silverCoin,
};

export const britishSilverBritannia: Product = {
  _id: "british-silver-britannia",
  name: "British Britannia (The Royal Mint)",
  metal: "silver",
  slug: "british-silver-britannia-coin",
  form: "coin",
  mint: royalMint,
  purity: "999 fine silver", // TODO(client): live says 99.99%; The Royal Mint strikes the Silver Britannia 999 fine
  variants: "1 oz",
  description:
    "The British Britania silver coin has a fineness of 99.99% silver. Its most popular denomination, 1 oz, has a value of GBP 2.",
  image: pictures.silverCoin,
};

export const canadianSilverMaple: Product = {
  _id: "canadian-silver-maple",
  name: "Canadian Maple (The Royal Canadian Mint)",
  metal: "silver",
  slug: "canadian-silver-maple-leaf-coin",
  form: "coin",
  mint: royalCanadianMint,
  purity: "999.9 fine silver",
  variants: "1 oz",
  description:
    "Having 99.99% pure silver content, the Canadian Maple silver coin is considered as one of the finest bullion coins in the world and holds CAD 5 face value.",
  image: pictures.silverCoin,
  bestSeller: true,
};

export const chineseSilverPanda: Product = {
  _id: "chinese-silver-panda",
  name: "Chinese Panda (China Gold Coin)",
  metal: "silver",
  slug: "chinese-silver-panda-coin",
  form: "coin",
  mint: chinaGoldCoin,
  purity: "999 fine silver",
  variants: "30g",
  description:
    "Bearing a face value of 10 Yuan, the Chinese Panda silver coin has fineness of 99.9%. Its design changes yearly like the gold version.",
  image: pictures.silverCoin,
};

export const silverKrugerrand: Product = {
  _id: "silver-krugerrand",
  // TODO(client): the live title is "South Africa Krugerrand (Rand Refinery and South African Mint)".
  name: "South African Krugerrand",
  metal: "silver",
  slug: "south-african-silver-krugerrand-coin",
  form: "coin",
  mint: saMint,
  purity: "999 fine silver",
  variants: "1 oz",
  description:
    "In 2017, South Africa Krugerrand silver coin was introduced. Similar to the gold version, it has no face value but considered as a legal tender.",
  image: pictures.silverCoin,
};

/** Live order, /buy-silver/ (12). */
export const silverProducts: Product[] = [
  heraeusSilver,
  pampSilver,
  metalorSilver,
  valcambiSilver,
  royalCanadianMintSilver,
  americanSilverEagle,
  australianSilverKangaroo,
  austrianSilverPhilharmonic,
  britishSilverBritannia,
  canadianSilverMaple,
  chineseSilverPanda,
  silverKrugerrand,
];
