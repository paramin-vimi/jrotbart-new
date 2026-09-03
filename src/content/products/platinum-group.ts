import type { ProductDetail } from "@content/types";
import { heraeus } from "@content/mints";
import { defaultTerms } from "@content/pages/product";
import {
  pictures,
  placeholderGallery,
  premiumDriversMedia,
  productFaq,
  productSeo,
  provenanceMedia,
  taxTreatment,
} from "./shared";

/**
 * The homepage's platinum and palladium products as full `ProductDetail`s —
 * PENDING, not in the live catalogue.
 *
 * Only /buy-gold/ and /buy-silver/ are built (the live site has no platinum
 * or palladium listing, and the homepage's two cards are the only PGM
 * products anywhere). These documents therefore stay out of `products` in
 * index.ts: nothing renders a card for them, so `productHref()` never points
 * at a /buy-platinum/ page that is not emitted. They are exported as
 * `pendingProducts` (the `pendingOffices` pattern) so the day the client
 * approves those listings the route needs no new content, only the metal
 * added to `listedMetals`.
 * TODO(client): platinum and palladium listings — scope and product range.
 *
 * `_id`s and slugs match src/content/homepage/products.ts. Detail copy is
 * drafted on the bar template; every sentence needs sign-off, and the
 * Singapore tax cells in particular need compliance wording: platinum bars
 * of 99% or higher qualify as Investment Precious Metals, palladium does NOT
 * and attracts GST.
 */

const KILO_TOZ = 32.151;

export const heraeusPlatinum: ProductDetail = {
  _id: "heraeus-platinum",
  name: "Heraeus",
  metal: "platinum",
  slug: "heraeus-platinum-bar",
  form: "bar",
  mint: heraeus,
  purity: "999.5 fine platinum",
  variants: "Four sizes, from 1oz to 1kg",
  description:
    "Offered in four sizes, from 1oz to 1kg, the Heraeus platinum bar has a " +
    "composition of 999.5 pure platinum.",
  image: pictures.platinumBar,
  bestSeller: true,

  title: "1 Kilogram Heraeus Platinum Bar 999.5.",
  shortName: "1 kg Heraeus platinum bar",
  summary:
    "A full kilogram of LPPM certified platinum from Heraeus, one of the few refiners accredited for all four precious metals.",
  productType: "Bar",
  fineness: "999.5",
  grossWeight: "1,000 g",
  fineContentToz: KILO_TOZ,
  formLabel: "Cast",
  gallery: placeholderGallery(pictures.platinumBar),
  terms: [...defaultTerms],
  whyHold: [
    [
      "Platinum is scarcer than gold and its price is driven by industrial demand as well as investment, so it behaves differently from gold in a portfolio.",
      "A kilogram bar is the practical unit for a meaningful platinum position: one fabrication cost for the whole bar, so more of your money goes into the metal itself.",
    ],
    [
      "Heraeus is an LPPM Good Delivery refiner for platinum. Dealers and vaults know the brand, so your bar is easy to value and easy to move.",
    ],
  ],
  specGroups: [
    {
      _key: "identity",
      label: "Identity",
      rows: [
        { label: "Product type", value: "Bar" },
        { label: "Metal", value: "Platinum" },
        { label: "Form", value: "Cast" },
        { label: "Manufacturer", value: "Heraeus Precious Metals, Hanau, Germany" },
        { label: "Accreditation", value: "LPPM Good Delivery refiner" },
        { label: "Series / Program", value: "N/A" },
      ],
    },
    { _key: "physical", label: "Physical", rows: [] },
  ],
  provenance: {
    body: [
      "Every Heraeus bar we deliver comes through LPPM accredited channels. Before it reaches you or your vault account, we check the weight, the dimensions, the markings, and the serial number against refinery records.",
    ],
    media: provenanceMedia,
  },
  premiumDrivers: {
    body: [
      "The price of a kilo bar follows the live platinum market, plus a premium that covers fabrication, brand, and market conditions. Kilo bars carry the lowest premium of any platinum format.",
    ],
    media: premiumDriversMedia,
  },
  // TODO(client): compliance wording — platinum bars of 99%+ from an LPPM refiner qualify as IPM in Singapore.
  taxTreatment: taxTreatment(
    "Qualifies as Investment Precious Metal: platinum bar of 99% purity or higher from an LPPM accredited refiner, so no GST applies.",
  ),
  faqs: [
    productFaq(
      "heraeus-platinum-bar",
      1,
      "Will you buy the bar back?",
      "Yes. We buy back bullion we sold you at live market prices, with settlement usually within one business day, in fiat or crypto.",
    ),
  ],
  related: ["heraeus-gold", "heraeus-silver", "heraeus-palladium"],
  seo: productSeo(
    "1 Kilogram Heraeus Platinum Bar 999.5",
    "Buy a 1 kg Heraeus platinum bar, 999.5 fine and LPPM certified, delivered or vaulted in your name.",
  ),
};

export const heraeusPalladium: ProductDetail = {
  _id: "heraeus-palladium",
  name: "Heraeus",
  metal: "palladium",
  slug: "heraeus-palladium-bar",
  form: "bar",
  mint: heraeus,
  purity: "999.5 fine palladium",
  variants: "Four sizes, from 1oz to 1000g",
  description:
    "Heraeus palladium bars are available in four sizes, ranging from 1oz to " +
    "1000g. Each bar offers a fineness of 999.5 pure palladium.",
  // TODO(client): PHOTO/CAPTION MISMATCH — a PAMP bar stands in for Heraeus (as on the homepage).
  image: pictures.palladiumBar,
  bestSeller: true,

  title: "1 Kilogram Heraeus Palladium Bar 999.5.",
  shortName: "1 kg Heraeus palladium bar",
  summary:
    "A full kilogram of LPPM certified palladium from Heraeus, in the largest bar size the refiner produces.",
  productType: "Bar",
  fineness: "999.5",
  grossWeight: "1,000 g",
  fineContentToz: KILO_TOZ,
  formLabel: "Cast",
  gallery: placeholderGallery(pictures.palladiumBar),
  terms: [...defaultTerms],
  whyHold: [
    [
      "Palladium is the rarest of the four precious metals we trade and the most exposed to industrial demand, which gives it a price cycle of its own.",
      "A kilogram bar is the practical unit for a meaningful position: one fabrication cost for the whole bar, so more of your money goes into the metal itself.",
    ],
    [
      "Heraeus is an LPPM Good Delivery refiner for palladium. Dealers and vaults know the brand, so your bar is easy to value and easy to move.",
    ],
  ],
  specGroups: [
    {
      _key: "identity",
      label: "Identity",
      rows: [
        { label: "Product type", value: "Bar" },
        { label: "Metal", value: "Palladium" },
        { label: "Form", value: "Cast" },
        { label: "Manufacturer", value: "Heraeus Precious Metals, Hanau, Germany" },
        { label: "Accreditation", value: "LPPM Good Delivery refiner" },
        { label: "Series / Program", value: "N/A" },
      ],
    },
    { _key: "physical", label: "Physical", rows: [] },
  ],
  provenance: {
    body: [
      "Every Heraeus bar we deliver comes through LPPM accredited channels. Before it reaches you or your vault account, we check the weight, the dimensions, the markings, and the serial number against refinery records.",
    ],
    media: provenanceMedia,
  },
  premiumDrivers: {
    body: [
      "The price of a kilo bar follows the live palladium market, plus a premium that covers fabrication, brand, and market conditions. Palladium premiums move with the metal's thin physical market.",
    ],
    media: premiumDriversMedia,
  },
  // TODO(client): compliance wording — palladium is NOT an Investment Precious Metal in Singapore.
  taxTreatment: taxTreatment(
    "Palladium is not an Investment Precious Metal under Singapore’s GST rules, so GST applies. Your Value Expert will confirm the position for your transaction.",
  ),
  faqs: [
    productFaq(
      "heraeus-palladium-bar",
      1,
      "Will you buy the bar back?",
      "Yes. We buy back bullion we sold you at live market prices, with settlement usually within one business day, in fiat or crypto.",
    ),
  ],
  related: ["heraeus-gold", "heraeus-silver", "heraeus-platinum"],
  seo: productSeo(
    "1 Kilogram Heraeus Palladium Bar 999.5",
    "Buy a 1 kg Heraeus palladium bar, 999.5 fine and LPPM certified, delivered or vaulted in your name.",
  ),
};

export const platinumGroupProducts: ProductDetail[] = [heraeusPlatinum, heraeusPalladium];
