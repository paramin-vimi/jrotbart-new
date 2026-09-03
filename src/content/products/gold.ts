import type { Product, ProductDetail } from "@content/types";
import {
  argorHeraeus,
  heraeus,
  metalor,
  pamp,
  perthMint,
  royalCanadianMint,
  royalMint,
  saMint,
  usMint,
} from "@content/mints";
import { abcBullion, austrianMint, chinaGoldCoin, valcambi } from "./catalogue-mints";
import { defaultTerms } from "@content/pages/product";
import {
  pictures,
  placeholderGallery,
  premiumDriversMedia,
  productFaq,
  productSeo,
  provenanceMedia,
  singaporeBarRule,
  singaporeCoinRule,
  taxTreatment,
} from "./shared";

/**
 * The GOLD catalogue — every product the live /buy-gold/ page lists
 * (jrotbart.com/buy-gold/, captured 2026-09-03: 16 products), in the live
 * order. Figma: Gold listing 9922:2130 (nine lorem cards, so the copy source
 * is the live site), Coin template 11083:19848 (the Britannia), Bar template
 * 11083:19595 (the PAMP kilo bar).
 *
 * FIVE documents are full `ProductDetail`s and get a page: the three homepage
 * gold cards (their `_id`s and slugs match src/content/homepage/products.ts so
 * the two modules describe the same products), the 1 oz Gold Britannia and
 * the PAMP 1 kilogram cast bar — the two the design actually drew. The other
 * eleven are listing-only `Product`s: their card CTA resolves to the contact
 * anchor through `productHref()` until a detail document exists.
 *
 * Placeholder register
 * --------------------
 * • TODO(client): every card description is the live site's own sentence,
 *   verbatim, including its typos ("has a finest of"). They repeat the purity
 *   and variants that now have their own rows and want rewriting.
 * • TODO(client): `variants` on the coin cards. The live copy names only the
 *   1 oz face value for most coins; fractional sizes are our reading.
 * • TODO(client): the three homepage bar documents (Heraeus, Argor-Heraeus,
 *   Royal Canadian Mint) had no detail copy anywhere — the design drew only
 *   the Britannia and PAMP pages. Their detail sections are DRAFTED from the
 *   live card sentence and the PAMP template's structure, anchored on the
 *   1 kilogram bar as the flagship size. Every sentence needs sign-off.
 * • TODO(client): the Britannia and PAMP copy is the Figma template copy
 *   verbatim; the survey flagged the SKU format, the 32.148 oz figure
 *   (1,000 g is 32.151 troy oz) and the crypto-settlement row for review.
 * • TODO(client): `bestSeller` follows the live site (Heraeus, Argor-Heraeus)
 *   plus the two drawn hero pages, which both carry the badge.
 * • TODO(assets): every picture is a stand-in (see shared.ts).
 */

const KILO_TOZ = 32.151;

// ---------------------------------------------------------------------------
// Detail documents
// ---------------------------------------------------------------------------

export const heraeusGold: ProductDetail = {
  _id: "heraeus-gold",
  name: "Heraeus",
  metal: "gold",
  slug: "heraeus-gold-bar",
  form: "bar",
  mint: heraeus,
  purity: "999.9 fine gold",
  variants: "100g, 250g, 500g and 1000g",
  description:
    "Heraeus bars have a purity of 999.9 fine gold and are available in 100g, " +
    "250g, 500g and 1000g variants. The design has changed since 2013.",
  // TODO(client): PHOTO/CAPTION MISMATCH — an RCM-hallmarked bar stands in for Heraeus (as on the homepage).
  image: pictures.goldBarKilo,
  bestSeller: true,

  title: "1 Kilogram Heraeus Cast Gold Bar 999.9.",
  shortName: "1 kg Heraeus gold bar",
  summary:
    "A full kilogram of LBMA certified gold from Germany’s largest precious-metals refiner, cast and serial-numbered.",
  productType: "Bar",
  fineness: "999.9",
  grossWeight: "1,000 g",
  fineContentToz: KILO_TOZ,
  formLabel: "Cast",
  gallery: placeholderGallery(pictures.goldBarKilo),
  terms: [...defaultTerms],
  whyHold: [
    [
      "A kilogram bar is the simplest way to hold a large amount of gold in one piece. You pay one fabrication cost for the whole bar, so more of your money goes into the metal itself.",
      "Heraeus is an LBMA Good Delivery refiner, so the bar is accepted at face value by dealers and vaults worldwide, and it is available in smaller sizes if you expect to sell in stages.",
    ],
    [
      "Heraeus has refined precious metals in Hanau since 1851. The current bar design dates from 2013; earlier designs remain fully tradeable and are bought back at the same live price.",
    ],
  ],
  specGroups: [
    {
      _key: "identity",
      label: "Identity",
      rows: [
        { label: "Product type", value: "Bar" },
        { label: "Metal", value: "Gold" },
        { label: "Form", value: "Cast" },
        { label: "Manufacturer", value: "Heraeus Precious Metals, Hanau, Germany" },
        { label: "Accreditation", value: "LBMA Good Delivery refiner" },
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
      "The price of a kilo bar follows the live gold market, plus a premium that covers fabrication, brand, and market conditions. Kilo bars carry one of the lowest premiums of any gold format, because the making cost is spread across a full kilogram.",
    ],
    media: premiumDriversMedia,
  },
  taxTreatment: taxTreatment(singaporeBarRule),
  faqs: [
    productFaq(
      "heraeus-gold-bar",
      1,
      "Is a 1 kg Heraeus gold bar GST-exempt in Singapore?",
      "Yes. Bars of 99.5% purity or higher from an LBMA accredited refiner qualify as Investment Precious Metals, so no GST applies when you buy in Singapore. Your Value Expert will confirm the position for your specific transaction.",
    ),
    productFaq(
      "heraeus-gold-bar",
      2,
      "Can my bar go straight into your vault?",
      "Yes. We can place your bar in allocated, segregated storage in your name on the day you buy it, fully insured, in Singapore, Hong Kong, or any of our 16 vault locations.",
    ),
    productFaq(
      "heraeus-gold-bar",
      3,
      "Will you buy the bar back?",
      "Yes. We buy back bullion we sold you at live market prices, with settlement usually within one business day, in fiat or crypto.",
    ),
  ],
  related: ["argor-heraeus-gold", "royal-canadian-mint-gold", "pamp-gold"],
  seo: productSeo(
    "1 Kilogram Heraeus Cast Gold Bar 999.9",
    "Buy a 1 kg Heraeus cast gold bar, 999.9 fine and LBMA certified, delivered or vaulted in your name.",
  ),
};

export const argorHeraeusGold: ProductDetail = {
  _id: "argor-heraeus-gold",
  name: "Argor-Heraeus",
  metal: "gold",
  slug: "argor-heraeus-gold-bar",
  form: "bar",
  mint: argorHeraeus,
  purity: "999.9 fine gold",
  variants: "1g to 1kg",
  description:
    "Argor-Heraeus gold bars are available in all variants from 1 gram to 1 " +
    "kilogram. Each cast or minted bar has a purity of 999.9 fine gold.",
  // TODO(client): PHOTO/CAPTION MISMATCH — the minted horse bar stands in for an Argor-Heraeus bar.
  image: pictures.goldBarMinted,
  bestSeller: true,

  title: "1 Kilogram Argor-Heraeus Cast Gold Bar 999.9.",
  shortName: "1 kg Argor-Heraeus gold bar",
  summary:
    "A full kilogram of LBMA certified Swiss gold from one of the refiners on the LBMA’s Good Delivery Referee panel.",
  productType: "Bar",
  fineness: "999.9",
  grossWeight: "1,000 g",
  fineContentToz: KILO_TOZ,
  formLabel: "Cast",
  gallery: placeholderGallery(pictures.goldBarMinted),
  terms: [...defaultTerms],
  whyHold: [
    [
      "A kilogram bar is the simplest way to hold a large amount of gold in one piece. You pay one fabrication cost for the whole bar, so more of your money goes into the metal itself.",
      "Argor-Heraeus casts and mints every size from 1 gram to 1 kilogram, so a holding can be built from one kilo bar and a ladder of smaller pieces that sell separately.",
    ],
    [
      "Argor-Heraeus, in Mendrisio, is one of only five refiners on the LBMA’s Good Delivery Referee panel. When the time comes to sell, that recognition works in your favour: dealers and vaults know the brand, so your bar is easy to value and easy to move.",
    ],
  ],
  specGroups: [
    {
      _key: "identity",
      label: "Identity",
      rows: [
        { label: "Product type", value: "Bar" },
        { label: "Metal", value: "Gold" },
        { label: "Form", value: "Cast" },
        { label: "Manufacturer", value: "Argor-Heraeus SA, Mendrisio, Switzerland" },
        { label: "Accreditation", value: "LBMA Good Delivery; Good Delivery Referee panel" },
        { label: "Series / Program", value: "N/A" },
      ],
    },
    { _key: "physical", label: "Physical", rows: [] },
  ],
  provenance: {
    body: [
      "Every Argor-Heraeus bar we deliver comes through LBMA accredited channels. Before it reaches you or your vault account, we check the weight, the dimensions, the markings, and the serial number against refinery records.",
      "You receive the serial number in your documents, and it stays with the bar through storage, audits, and an eventual sale.",
    ],
    media: provenanceMedia,
  },
  premiumDrivers: {
    body: [
      "The price of a kilo bar follows the live gold market, plus a premium that covers fabrication, brand, and market conditions. Kilo bars carry one of the lowest premiums of any gold format, because the making cost is spread across a full kilogram.",
    ],
    media: premiumDriversMedia,
  },
  taxTreatment: taxTreatment(singaporeBarRule),
  faqs: [
    productFaq(
      "argor-heraeus-gold-bar",
      1,
      "Is a 1 kg Argor-Heraeus gold bar GST-exempt in Singapore?",
      "Yes. Bars of 99.5% purity or higher from an LBMA accredited refiner qualify as Investment Precious Metals, so no GST applies when you buy in Singapore. Your Value Expert will confirm the position for your specific transaction.",
    ),
    productFaq(
      "argor-heraeus-gold-bar",
      2,
      "How does a kilo bar compare with smaller bars and coins?",
      "A kilo bar usually carries the lowest premium per ounce, because one fabrication cost covers the whole kilogram. Smaller bars and coins cost a little more per ounce, and in return they are easier to sell in parts. Many clients hold a mix of both.",
    ),
    productFaq(
      "argor-heraeus-gold-bar",
      3,
      "Will you buy the bar back?",
      "Yes. We buy back bullion we sold you at live market prices, with settlement usually within one business day, in fiat or crypto.",
    ),
  ],
  related: ["heraeus-gold", "royal-canadian-mint-gold", "pamp-gold"],
  seo: productSeo(
    "1 Kilogram Argor-Heraeus Cast Gold Bar 999.9",
    "Buy a 1 kg Argor-Heraeus cast gold bar, 999.9 fine and LBMA certified, delivered or vaulted in your name.",
  ),
};

export const royalCanadianMintGold: ProductDetail = {
  _id: "royal-canadian-mint-gold",
  name: "Royal Canadian Mint",
  metal: "gold",
  slug: "royal-canadian-mint-gold-bar",
  form: "bar",
  mint: royalCanadianMint,
  purity: "999.9 fine gold",
  variants: "1oz, 10oz and 1kg",
  description:
    "RCM gold bars are available in three variants: 1oz, 10oz and 1kg. These gold bars have 999.9 pure gold composition.",
  // The one catalogue picture that matches its caption: product-1 IS an RCM kilo bar.
  image: pictures.goldBarKilo,
  bestSeller: false,

  title: "1 Kilogram Royal Canadian Mint Gold Bar 999.9.",
  shortName: "1 kg Royal Canadian Mint gold bar",
  summary:
    "A full kilogram of 999.9 fine gold from Canada’s national mint, LBMA certified and recognised by refiners and vaults worldwide.",
  productType: "Bar",
  fineness: "999.9",
  grossWeight: "1,000 g",
  fineContentToz: KILO_TOZ,
  formLabel: "Cast",
  gallery: placeholderGallery(pictures.goldBarKilo),
  terms: [...defaultTerms],
  whyHold: [
    [
      "A kilogram bar is the simplest way to hold a large amount of gold in one piece. You pay one fabrication cost for the whole bar, so more of your money goes into the metal itself.",
      "The Royal Canadian Mint is a Crown corporation, so its bars carry sovereign backing as well as LBMA Good Delivery status — the same recognition that makes the Maple Leaf coin one of the most traded in the world.",
    ],
    [
      "The 1 oz and 10 oz sizes share the same hallmark, so a holding can combine one kilo bar with smaller pieces that sell separately.",
    ],
  ],
  specGroups: [
    {
      _key: "identity",
      label: "Identity",
      rows: [
        { label: "Product type", value: "Bar" },
        { label: "Metal", value: "Gold" },
        { label: "Form", value: "Cast" },
        { label: "Manufacturer", value: "Royal Canadian Mint, Ottawa, Canada" },
        { label: "Accreditation", value: "LBMA Good Delivery refiner" },
        { label: "Series / Program", value: "N/A" },
      ],
    },
    { _key: "physical", label: "Physical", rows: [] },
  ],
  provenance: {
    body: [
      "Every Royal Canadian Mint bar we deliver comes through LBMA accredited channels. Before it reaches you or your vault account, we check the weight, the dimensions, the markings, and the serial number against refinery records.",
      "You receive the serial number in your documents, and it stays with the bar through storage, audits, and an eventual sale.",
    ],
    media: provenanceMedia,
  },
  premiumDrivers: {
    body: [
      "The price of a kilo bar follows the live gold market, plus a premium that covers fabrication, brand, and market conditions. Kilo bars carry one of the lowest premiums of any gold format, because the making cost is spread across a full kilogram.",
    ],
    media: premiumDriversMedia,
  },
  taxTreatment: taxTreatment(singaporeBarRule),
  faqs: [
    productFaq(
      "royal-canadian-mint-gold-bar",
      1,
      "Is a 1 kg Royal Canadian Mint gold bar GST-exempt in Singapore?",
      "Yes. Bars of 99.5% purity or higher from an LBMA accredited refiner qualify as Investment Precious Metals, so no GST applies when you buy in Singapore. Your Value Expert will confirm the position for your specific transaction.",
    ),
    productFaq(
      "royal-canadian-mint-gold-bar",
      2,
      "Can I collect in Hong Kong instead?",
      "Yes. You can collect at our Hong Kong office, arrange fully insured delivery, or move the bar straight into storage. Your Value Expert will set this up for you.",
    ),
    productFaq(
      "royal-canadian-mint-gold-bar",
      3,
      "Will you buy the bar back?",
      "Yes. We buy back bullion we sold you at live market prices, with settlement usually within one business day, in fiat or crypto.",
    ),
  ],
  related: ["heraeus-gold", "argor-heraeus-gold", "canadian-gold-maple"],
  seo: productSeo(
    "1 Kilogram Royal Canadian Mint Gold Bar 999.9",
    "Buy a 1 kg Royal Canadian Mint gold bar, 999.9 fine and LBMA certified, delivered or vaulted in your name.",
  ),
};

/** Coin template 11083:19848 — copy verbatim from the frame. */
export const goldBritannia: ProductDetail = {
  _id: "gold-britannia-1oz",
  name: "British Britannia (The Royal Mint)",
  metal: "gold",
  slug: "1-oz-gold-britannia-coin",
  form: "coin",
  mint: royalMint,
  purity: "999.9 fine gold",
  variants: "1 oz", // TODO(client): fractional sizes (1/2, 1/4, 1/10 oz) on request?
  description:
    "The British Britannia is recognized as a legal tender, possessing a face value of GBP 100. It has a purity of 999.9 gold.",
  // TODO(client): PHOTO/CAPTION MISMATCH — the frame's hero and card draw American Gold Eagles.
  image: pictures.goldCoins,
  bestSeller: true,

  title: "1 oz Gold Britannia Coin 999.9.",
  shortName: "1 oz Gold Britannia",
  summary:
    "Britain's flagship gold coin: one troy ounce of 999.9 pure, LBMA certified gold, with legal tender status guaranteed by HM Treasury.",
  sku: "JR-AU-RM-BRIT-1OZ", // TODO(client): is the internal SKU public?
  productType: "Sovereign coin",
  fineness: "999.9",
  grossWeight: "31.10 g",
  fineContentToz: 1,
  formLabel: "Coin",
  gallery: placeholderGallery(pictures.goldCoins),
  // TODO(client): a product video — the frame draws a fifth, black video tile.
  terms: [...defaultTerms],
  priceNote:
    "Buying in full tubes usually improves your terms. Your Value Expert confirms a firm quote and holds it for you while you decide.",
  whyHold: [
    [
      "The Gold Britannia has been struck by The Royal Mint since 1987, and since 2013 it has been produced in 999.9 pure gold. Each coin carries a face value of GBP 100, guaranteed by HM Treasury, though its market value follows the gold price and is far higher.",
      "Philip Nathan's standing Britannia with trident and shield is one of the most recognised designs in modern bullion. That recognition matters at resale: any dealer in any major market will identify this coin at a glance, which protects both the price you receive and the speed of any transaction.",
    ],
    [
      "Gold and silver Britannias are available alongside each other, letting you hold both metals in a consistent, matched format. Many investors find that a satisfying way to build a precious metals portfolio.",
    ],
  ],
  specGroups: [
    {
      _key: "identity",
      label: "Identity",
      rows: [
        { label: "SKU", value: "JR-AU-RM-BRIT-1OZ" },
        { label: "Product type", value: "Sovereign coin" },
        { label: "Metal", value: "Gold" },
        { label: "Form", value: "Coin" },
        { label: "Manufacturer", value: "The Royal Mint, Llantrisant, United Kingdom" },
        { label: "Accreditation", value: "LBMA certified; The Royal Mint is an LBMA Good Delivery refiner" },
        { label: "Series / Program", value: "Britannia — gold bullion coin series since 1987; 999.9 fine since 2013" },
      ],
    },
    // The frame draws "Physical" and "Issue data" tabs with no rows; tabs render only once a second group has rows.
    // TODO(client): diameter, thickness, edge, mintage.
    { _key: "physical", label: "Physical", rows: [] },
    { _key: "issue-data", label: "Issue data", rows: [] },
  ],
  provenance: {
    body: [
      "We source Gold Britannias through official Royal Mint and LBMA accredited channels, in sealed tubes, and we check every delivery before it reaches you.",
      "The Royal Mint's long history, government backing, and LBMA Good Delivery status together mean the coin's provenance is self-evident to any buyer. Your purchase documents record every coin, and the Royal Mint's own certification supports the chain of custody through storage and an eventual sale.",
    ],
    media: provenanceMedia,
  },
  premiumDrivers: {
    body: [
      "The price follows the live gold market, plus a premium that covers minting, finishing, and demand. Gold coins carry a somewhat higher premium than large bars, because each is individually struck. Buying in full tubes usually improves your terms.",
    ],
    media: premiumDriversMedia,
  },
  taxTreatment: taxTreatment(singaporeCoinRule),
  faqs: [
    productFaq(
      "1-oz-gold-britannia-coin",
      1,
      "Is the 1 oz Gold Britannia GST-exempt in Singapore?",
      "Yes. The Gold Britannia is 999.9 fine and appears on the IRAS list of qualifying coins, so no GST applies when you buy in Singapore.",
    ),
    productFaq(
      "1-oz-gold-britannia-coin",
      2,
      "What is the face value of the Gold Britannia?",
      "GBP 100, guaranteed by HM Treasury. Its market value is far higher because it follows the gold price.",
    ),
    productFaq(
      "1-oz-gold-britannia-coin",
      3,
      "Is there also a Silver Britannia?",
      "Yes. The Silver Britannia is 999 fine and available separately. Many clients hold both metals in the same coin format.",
    ),
    productFaq(
      "1-oz-gold-britannia-coin",
      4,
      "How does the Gold Britannia differ from the Silver Britannia?",
      "The gold version is 999.9 fine (99.99%) and carries a GBP 100 face value. The silver version is 999 fine (99.9%) and carries GBP 2. Both are struck by The Royal Mint and share the Britannia design.",
    ),
    productFaq(
      "1-oz-gold-britannia-coin",
      5,
      "Can I vault my coins immediately?",
      "Yes, allocated and segregated in your name, insured, across 16 vault locations.",
    ),
    productFaq(
      "1-oz-gold-britannia-coin",
      6,
      "Will you buy them back?",
      "Yes, at live market prices, with settlement usually within one business day.",
    ),
    productFaq(
      "1-oz-gold-britannia-coin",
      7,
      "What years are available?",
      "Current year as standard; earlier years on request subject to availability.",
    ),
  ],
  related: ["heraeus-gold", "argor-heraeus-gold", "royal-canadian-mint-gold"],
  seo: productSeo(
    "1 oz Gold Britannia Coin 999.9",
    "Britain's flagship gold coin: one troy ounce of 999.9 pure, LBMA certified gold, with legal tender status guaranteed by HM Treasury.",
  ),
};

/** Bar template 11083:19595 — copy verbatim from the frame. */
export const pampGold: ProductDetail = {
  _id: "pamp-gold",
  name: "PAMP",
  metal: "gold",
  slug: "pamp-suisse-1-kilogram-cast-gold-bar",
  form: "bar",
  mint: pamp,
  purity: "999.9 fine gold",
  // TODO(client): the card describes the live PAMP range; the page describes the 1 kg cast bar.
  variants: "1g to 1kg",
  description:
    "PAMP gold bar products are available in 1 gram to 1 kg. These bars contain a purity of 999.9.",
  // TODO(client): PHOTO/CAPTION MISMATCH — the frame's hero draws an RCM kilo bar for a PAMP product.
  image: pictures.goldBarKilo,
  bestSeller: true,

  title: "1 Kilogram PAMP Suisse Cast Gold Bar 999.9.",
  shortName: "1 kg PAMP gold bar",
  summary:
    "A single bar holding a full kilogram of LBMA certified gold. Simple to buy, simple to store, and recognised by refiners and vaults worldwide.",
  sku: "JR-AU-PAMP-1KG-CAST", // TODO(client): is the internal SKU public?
  productType: "Bar",
  fineness: "999.9",
  grossWeight: "1,000 g",
  fineContentToz: KILO_TOZ,
  formLabel: "Cast",
  gallery: placeholderGallery(pictures.goldBarKilo),
  terms: [...defaultTerms],
  // TODO(client): the bar frame repeats the coin's "full tubes" note; bars have no tube terms, so none ships.
  whyHold: [
    [
      // TODO(client): 1,000 g is 32.151 troy ounces, not 32.148.
      "A kilogram bar is the simplest way to hold a large amount of gold in one piece. You pay one fabrication cost for 32.148 troy ounces, so more of your money goes into the metal itself. This is why family offices and experienced investors often choose kilo bars for the core of their holdings.",
      "There is a trade-off to think about. A kilo bar sells as one unit. If you expect to sell in stages, a mix of kilo bars and smaller pieces may serve you better. Your Value Expert will happily help you find the right split for your plans.",
    ],
    [
      "PAMP is one of the most recognised refiners in the world, and one of only five on the LBMA’s Good Delivery Referee panel. When the time comes to sell, that recognition works in your favour: dealers and vaults know the brand, so your bar is easy to value and easy to move.",
    ],
  ],
  specGroups: [
    {
      _key: "identity",
      label: "Identity",
      rows: [
        { label: "SKU", value: "JR-AU-PAMP-1KG-CAST" },
        { label: "Product type", value: "Bar" },
        { label: "Metal", value: "Gold" },
        { label: "Form", value: "Cast" },
        { label: "Manufacturer", value: "PAMP SA, Ticino, Switzerland (MKS PAMP Group)" },
        { label: "Accreditation", value: "LBMA Good Delivery; Good Delivery Referee panel" },
        { label: "Series / Program", value: "N/A" },
      ],
    },
    // TODO(client): the frame draws an empty "Physical" tab — dimensions and packaging to supply.
    { _key: "physical", label: "Physical", rows: [] },
  ],
  provenance: {
    body: [
      "Every PAMP bar we deliver comes through LBMA accredited channels. Before it reaches you or your vault account, we check the weight, the dimensions, the markings, and the serial number against refinery records. You receive the serial number in your documents, and it stays with the bar through storage, audits, and an eventual sale.",
      "This paper trail matters. Metal with a clear, unbroken history sells at the full market bid and is welcome in any professional vault. If you would like to see how we verify each bar, your Value Expert will gladly walk you through it.",
    ],
    media: provenanceMedia,
  },
  premiumDrivers: {
    body: [
      "The price of a kilo bar follows the live gold market, plus a premium that covers fabrication, brand, and market conditions. Kilo bars carry one of the lowest premiums of any gold format, because the making cost is spread across a full kilogram.",
    ],
    media: premiumDriversMedia,
  },
  // The bar frame's Hong Kong cell ends in a stray "Correct" — stripped.
  taxTreatment: taxTreatment(singaporeBarRule),
  faqs: [
    productFaq(
      "pamp-suisse-1-kilogram-cast-gold-bar",
      1,
      "Is a 1 kg PAMP gold bar GST-exempt in Singapore?",
      "Yes. Bars of 99.5% purity or higher from an LBMA accredited refiner qualify as Investment Precious Metals, so no GST applies when you buy in Singapore. Your Value Expert will confirm the position for your specific transaction.",
    ),
    productFaq(
      "pamp-suisse-1-kilogram-cast-gold-bar",
      2,
      "How does a kilo bar compare with smaller bars and coins?",
      "A kilo bar usually carries the lowest premium per ounce, because one fabrication cost covers the whole kilogram. Smaller bars and coins cost a little more per ounce, and in return they are easier to sell in parts. Many clients hold a mix of both.",
    ),
    productFaq(
      "pamp-suisse-1-kilogram-cast-gold-bar",
      3,
      "Can my bar go straight into your vault?",
      "Yes. We can place your bar in allocated, segregated storage in your name on the day you buy it, fully insured, in Singapore, Hong Kong, or any of our 16 vault locations.",
    ),
    productFaq(
      "pamp-suisse-1-kilogram-cast-gold-bar",
      4,
      "Will you buy the bar back?",
      "Yes. We buy back bullion we sold you at live market prices, with settlement usually within one business day, in fiat or crypto.",
    ),
    productFaq(
      "pamp-suisse-1-kilogram-cast-gold-bar",
      5,
      "How do I know the bar is genuine?",
      "Every bar is checked before delivery: weight, dimensions, markings, and serial number, all against refinery records. If you would like an independent assay as well, we can arrange one for you.",
    ),
    productFaq(
      "pamp-suisse-1-kilogram-cast-gold-bar",
      6,
      "What documents do I receive?",
      "You receive an invoice recording the bar's serial number, along with the manufacturer's certificate. If the bar goes into storage, you also receive vault documentation in your name.",
    ),
    productFaq(
      "pamp-suisse-1-kilogram-cast-gold-bar",
      7,
      "Can I collect in Hong Kong instead?",
      "Yes. You can collect at our Hong Kong office, arrange fully insured delivery, or move the bar straight into storage. Your Value Expert will set this up for you.",
    ),
  ],
  related: ["heraeus-gold", "argor-heraeus-gold", "royal-canadian-mint-gold"],
  seo: productSeo(
    "1 Kilogram PAMP Suisse Cast Gold Bar 999.9",
    "A single bar holding a full kilogram of LBMA certified gold. Simple to buy, simple to store, and recognised by refiners and vaults worldwide.",
  ),
};

// ---------------------------------------------------------------------------
// Listing-only products (live copy verbatim; no page until a detail exists)
// ---------------------------------------------------------------------------

export const argorHeraeusHorse: Product = {
  _id: "argor-heraeus-year-of-the-horse",
  name: "Argor-Heraeus Year of the Horse",
  metal: "gold",
  slug: "argor-heraeus-year-of-the-horse",
  form: "bar",
  mint: argorHeraeus,
  purity: "999.9 fine gold",
  variants: "1g, 5g, 10g and 1oz",
  description:
    "Celebrate the Lunar New Year limited edition. It is available in a variety of weights: 1g, 5g, 10g and 1oz.",
  // Matches: product-3 is the horse bar. TODO(client): date-bound seasonal product — retire after the season?
  image: pictures.goldBarMinted,
};

export const metalorGold: Product = {
  _id: "metalor-gold",
  name: "Metalor",
  metal: "gold",
  slug: "metalor-gold-bar",
  form: "bar",
  mint: metalor,
  purity: "999.9 fine gold",
  variants: "5g, 10g, 20g, 1oz, 50g, 100g, 250g, 500g and 1kg",
  description:
    "Contains a purity of 999.9 gold. It is available in a variety of weights: 5g, 10g, 20g, 1oz, 50g, 100g, 250g, 500g and 1kg.",
  // TODO(client): the frame's Metalor card draws Maple Leaf coins; a bar picture stands in.
  image: pictures.goldBarKilo,
};

export const abcBullionGold: Product = {
  _id: "abc-bullion-gold",
  name: "ABC Bullion",
  metal: "gold",
  slug: "abc-bullion-gold-bar",
  form: "bar",
  mint: abcBullion,
  purity: "999.9 fine gold",
  variants: "1oz, 2oz, tael bar, 5oz, 10oz, 100g, 250g, 500g and 1kg",
  description:
    "ABC Bullion gold bar has a finest of 999.9 gold. It is available in 1oz, 2oz, tael bar, 5oz, 10oz, 100g, 250g, 500g and 1kg.",
  image: pictures.goldBarMinted,
};

export const valcambiGold: Product = {
  _id: "valcambi-gold",
  name: "Valcambi",
  metal: "gold",
  slug: "valcambi-gold-bar",
  form: "bar",
  mint: valcambi,
  purity: "999.9 fine gold",
  variants: "20g, 50g, 1oz and 100g",
  description:
    "Valcambi gold bar is composed of 999.9 pure gold. Its popular variants include 20g, 50g, 1oz and 100g.",
  image: pictures.goldBarMinted,
};

export const americanGoldEagle: Product = {
  _id: "american-gold-eagle",
  name: "American Eagle (US Mint)",
  metal: "gold",
  slug: "american-gold-eagle-coin",
  form: "coin",
  mint: usMint,
  purity: "916.7 fine gold (22 carat)",
  variants: "1/10 oz, 1/4 oz, 1/2 oz and 1 oz",
  description:
    "Holding USD 50 value, the American Eagle coin is composed of 91.67% gold. It is offered in 1/10 oz to 1 oz denomination.",
  // Matches: product-2 is a pair of American Gold Eagles.
  image: pictures.goldCoins,
};

export const americanGoldBuffalo: Product = {
  _id: "american-gold-buffalo",
  name: "American Buffalo (US Mint)",
  metal: "gold",
  slug: "american-gold-buffalo-coin",
  form: "coin",
  mint: usMint,
  purity: "999.9 fine gold",
  variants: "1 oz",
  // TODO(client): the live sentence is cut off mid-sentence ("…the American Buffalo coin is a"); the ending is ours.
  description:
    "Having a composition of 999.9 pure gold, the American Buffalo coin is the first 24-karat gold coin struck by the United States Mint.",
  image: pictures.goldCoins,
};

export const australianGoldKangaroo: Product = {
  _id: "australian-gold-kangaroo",
  name: "Australian Kangaroo (The Perth Mint)",
  metal: "gold",
  slug: "australian-gold-kangaroo-coin",
  form: "coin",
  mint: perthMint,
  purity: "999.9 fine gold",
  variants: "1 oz",
  description:
    "Depicting Australia’s icon, the Australian Kangaroo gold coin comes in 999.9 pure gold finish. It holds AUD 100 face value.",
  image: pictures.goldCoins,
};

export const austrianGoldPhilharmonic: Product = {
  _id: "austrian-gold-philharmonic",
  name: "Austrian Philharmonic (Austrian Mint)",
  metal: "gold",
  slug: "austrian-gold-philharmonic-coin",
  form: "coin",
  mint: austrianMint,
  purity: "999.9 fine gold",
  variants: "1 oz",
  description:
    "Inspired by the world-renowned Vienna Philharmonic Orchestra, the Austrian Philharmonic gold coin is composed of 999.9 pure gold and holds a EUR 100 value.",
  image: pictures.goldCoins,
};

export const canadianGoldMaple: Product = {
  _id: "canadian-gold-maple",
  name: "Canadian Maple (The Royal Canadian Mint)",
  metal: "gold",
  slug: "canadian-gold-maple-leaf-coin",
  form: "coin",
  mint: royalCanadianMint,
  purity: "999.9 fine gold",
  variants: "1 oz",
  // TODO(client): issues since 2024 carry King Charles III; the live sentence still says Queen Elizabeth II.
  description:
    "The Canadian Maple gold holds a value of CAD 50, contains 999.9 gold and features Queen Elizabeth II and maple leaf on each side.",
  // Matches: the listing export is a pair of Maple Leaf coins.
  image: pictures.mapleCoins,
};

export const chineseGoldPanda: Product = {
  _id: "chinese-gold-panda",
  name: "Chinese Panda (China Gold Coin)",
  metal: "gold",
  slug: "chinese-gold-panda-coin",
  form: "coin",
  mint: chinaGoldCoin,
  purity: "999.9 fine gold",
  variants: "30g",
  description:
    "Unlike other bullion coins, the coin issued by the People’s Republic of China has a design that changes yearly. It is 999.9 pure gold.",
  image: pictures.goldCoins,
};

export const goldKrugerrand: Product = {
  _id: "gold-krugerrand",
  // The live title is "South African Krugerrand (Rand Refinery and South African Mint)" — too long for a card.
  // TODO(client): confirm the short title; the issuer is the SA Mint on Rand Refinery blanks.
  name: "South African Krugerrand",
  metal: "gold",
  slug: "south-african-gold-krugerrand-coin",
  form: "coin",
  mint: saMint,
  purity: "916.7 fine gold (22 carat)",
  variants: "1 oz",
  description:
    "The South African Krugerrand was the first bullion coin to be produced. It was first issued in 1967 and contains 91.67% pure gold.",
  image: pictures.goldCoins,
};

/** Live order, /buy-gold/ (16). */
export const goldProducts: Product[] = [
  argorHeraeusHorse,
  heraeusGold,
  argorHeraeusGold,
  metalorGold,
  royalCanadianMintGold,
  pampGold,
  abcBullionGold,
  valcambiGold,
  americanGoldEagle,
  americanGoldBuffalo,
  australianGoldKangaroo,
  austrianGoldPhilharmonic,
  goldBritannia,
  canadianGoldMaple,
  chineseGoldPanda,
  goldKrugerrand,
];
