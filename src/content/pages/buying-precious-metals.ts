import type {
  CalloutBandBlock,
  ComparisonTableBlock,
  Cta,
  Faq,
  FaqAccordionBlock,
  FeatureGridBlock,
  MediaWithTextBlock,
  NewsGridBlock,
  PageHeroBlock,
  ProcessStepsBlock,
  Product,
  ProseSectionBlock,
  Seo,
  TestimonialBandBlock,
} from "@content/types";
import { hero } from "@content/homepage/hero";
import {
  logoStrip,
  productCardLabels,
  productGrid as homepageProductGrid,
  type ProductGridSection,
} from "@content/homepage/products";
import { newsCardCtaLabel } from "@content/homepage/news";
import { testimonialOne } from "@content/testimonials";
import { globalShipping, globalStorage } from "@content/services";
import { products as catalogue } from "@content/products";

/**
 * /buying-precious-metals/ — the "Buy Gold and Precious Metals" service page.
 *
 * Figma frame `Service - Buy Precious Metals` 10726:9159 (1366 × 17317),
 * page "New Website". Live URL https://jrotbart.com/buying-precious-metals/
 * (captured 2026-09-03; live H1 "Buying Precious Metals", live Yoast title
 * "J. Rotbart & Co. | Precious Metals Broker"). Copy source: the frame's own
 * text nodes (SP/build-plan/texts/svc-buy.txt and the node tree for the full
 * strings and italic runs). The route, src/pages/buying-precious-metals.astro,
 * composes the blocks below in frame order:
 *
 *   pageHero 10726:9161 · logoStrip 10726:9170 (homepage block by reference)
 *   · proseSection 10726:9171 · featureGrid 10726:10448 · testimonialBand
 *   10726:9194 · [light compound frame 10726:9195, internal gap 96 → every
 *   block after the first carries `seam: "default"`: featureGrid 10726:9202 ·
 *   calloutBand I10770:11997 · featureGrid 11008:15326 · productGrid
 *   10726:13040 · calloutBand I10770:12006 · mediaWithText 10726:13303 ·
 *   proseSection 10726:13476] · testimonialBand 10726:13251 · processSteps
 *   10726:9257 · calloutBand I10770:12141 · comparisonTable 10726:9306 ·
 *   calloutBand I10770:12175 · testimonialBand 10726:9364 · faqAccordion
 *   10726:9365 · newsGrid 11009:15432 · calloutBand I11009:15467 ·
 *   featureGrid 10726:9457 · calloutBand I10770:12191 · tail (mint strip
 *   10726:9488 + contact 10726:9489, rendered by SiteLayout).
 *
 * Placeholder register (plan §6, "Buy PM") — every item sits as a
 * TODO(client) / TODO(assets) beside the field it affects:
 * • Three identical Albert Cheng testimonial bands, as drawn.
 * • "Speak With a Value Expert" → #contact throughout (three wordings exist
 *   site-wide).
 * • Hero proof statistics 11010:13113–13121; hero cut-out identity.
 * • Overline 10726:10510 "Precious metals are our expert" shipped verbatim.
 * • Market statistics 10726:9209/9217/9225 (863 tonnes, 145 %, 127 %).
 * • Six product cards are lorem in the frame → the homepage products by
 *   reference; their real purity strings replace "999.9 fine gold" on the
 *   silver / platinum / palladium cards.
 * • Step 5 body 10726:13543 "nce your purchase…" → "Once".
 * • Timelines: "two and ten business days" vs 2–3 / 1–7 days elsewhere.
 * • Comparison claims 10726:13768–13762 about banks and gold shops.
 * • FAQ rows drawn all open; lending disclosure 10726:13836.
 * • News cards are lorem in the frame → the latest three posts from the CMS.
 * • Callout I11009:15467 carries the Storage page's line (10770:11896).
 * • Four "Finance/Gold" icon placeholders on the feature rows.
 * • LBMA/LPPM photo 10726:13447: stock, usage rights unconfirmed.
 */

// ---------------------------------------------------------------------------
// Route facts
// ---------------------------------------------------------------------------

/** URL path of this page. The route builds the canonical from `SITE`. */
export const path = "/buying-precious-metals/";

export const seo: Seo = {
  // TODO(client): the live Yoast title is "J. Rotbart & Co. | Precious Metals
  // Broker" and the live H1 "Buying Precious Metals"; the frame's H1 is "Buy
  // Gold and Precious Metals". Confirm which phrase the title should carry.
  title: "Buy Gold and Precious Metals | J. Rotbart & Co.",
  // First sentence of the intro (10726:9176).
  description:
    "Take possession at one of our global offices, arrange secure delivery, or store your metals fully allocated, segregated, and recorded in your name across 16 vault locations in leading financial centres and free zones.",
};

/** Breadcrumb trail for the BreadcrumbList node; `path` is site-relative. */
export const breadcrumb: { name: string; path: string }[] = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services/" },
  { name: "Buying Precious Metals", path },
];

/** The schema.org Service this page describes. */
export const service = {
  name: "Buying Precious Metals",
  serviceType: "Precious metals dealer",
  // The four staffed offices (src/content/offices.ts); Bangkok is pending.
  areaServed: ["Hong Kong", "Singapore", "Philippines", "Israel"],
};

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------

/** TODO(client): destination and wording — three "Speak with a Value Expert" variants exist site-wide; every one links to the on-page contact form. */
const speakCta: Cta = { label: "Speak With a Value Expert", href: "#contact", style: "solid" };

/** The "Member of:" marks are the homepage hero's, by reference. */
const memberOf = {
  accreditationLabel: hero.accreditationLabel,
  accreditations: hero.accreditations,
};

/**
 * TODO(client): the frame draws the SAME Albert Cheng band three times
 * (10726:9194, 10726:13251, 10726:9364). Shipped as drawn, one instance per
 * slot with a page-scoped key; a second and third testimonial are wanted.
 */
const testimonialSlot = (n: 1 | 2 | 3): TestimonialBandBlock => ({
  ...testimonialOne,
  _key: `buy-testimonial-${n}`,
});

// ---------------------------------------------------------------------------
// 1. Hero — 10726:9161 (tinted, composite media, under the transparent nav)
// ---------------------------------------------------------------------------

export const pageHero: PageHeroBlock = {
  _key: "buy-hero",
  _type: "pageHero",
  theme: "tinted",
  header: {
    heading: "Buy Gold and Precious Metals",
    // 10726:10229: "Gold" is the italic accent (text-tertiary).
    headingRuns: [{ text: "Buy " }, { text: "Gold", accent: true }, { text: " and Precious Metals" }],
    body: "Fully Allocated in Your Name, Insured, and Stored in Your Chosen Country",
  },
  // TODO(client): verify the three proof statistics (11010:13113/13117/13121)
  // — the vault count is also drawn as "15" on the Office listing frame.
  proofPoints: ["16 vault locations", "35 countries delivered", "US$3 billion+ traded and stored since founding"],
  ...memberOf,
  cta: speakCta,
  media: {
    kind: "composite",
    photo: {
      // Figma 10726:9167, drawn 530 × 353 object-cover (Phase 0 export).
      src: "/figma/buy-pm-hero-silver-bars--10726-9167.webp",
      alt: "Stacked 999 fine silver bars",
      width: 530,
      height: 353,
    },
    cutout: {
      // Figma 10726:9168, drawn 312 × 530.
      // TODO(client): who is pictured? The alt names a role, not a person.
      // TODO(assets): export the DRAWN crop — the raw bitmap carries a quarter
      // of empty canvas above the head (see the Phase 2 fixture note).
      src: "/figma/buy-pm-hero-advisor-cutout--10726-9168.webp",
      alt: "A J. Rotbart & Co. Value Expert",
      width: 312,
      height: 530,
    },
  },
};

// ---------------------------------------------------------------------------
// 2. Press / endorsement strip — 10726:9170 = the homepage block by reference
// ---------------------------------------------------------------------------

export { logoStrip };

// ---------------------------------------------------------------------------
// 3. Intro — 10726:9171 (light, header-only + button)
// ---------------------------------------------------------------------------

export const intro: ProseSectionBlock = {
  _key: "buy-intro",
  _type: "proseSection",
  theme: "light",
  layout: "stacked",
  header: {
    overline: "Protect Your Wealth",
    heading:
      "Protect your wealth with LBMA certified gold and silver, and LPPM certified platinum and palladium.",
    // 10726:9175: two italic accents, verified against the node's style runs.
    headingRuns: [
      { text: "Protect your wealth with " },
      { text: "LBMA certified", accent: true },
      { text: " gold and silver, and " },
      { text: "LPPM certified", accent: true },
      { text: " platinum and palladium." },
    ],
    body: [
      "Take possession at one of our global offices, arrange secure delivery, or store your metals fully allocated, segregated, and recorded in your name across 16 vault locations in leading financial centres and free zones.",
      "From your first purchase through storage, shipping, lending, conversion, and sale, one dedicated Value Expert and one accountable team support you throughout the full precious metals ownership lifecycle.",
    ],
  },
  cta: speakCta,
};

// ---------------------------------------------------------------------------
// 4. Why clients choose us — 10726:10448 (tinted, split / 1 / none, aside)
// ---------------------------------------------------------------------------

export const whyClients: FeatureGridBlock = {
  _key: "buy-why-clients",
  _type: "featureGrid",
  theme: "tinted",
  layout: "split",
  columns: 1,
  frame: "none",
  header: {
    // TODO(client): drawn verbatim (10726:10510) — "…Our Expertise"?
    overline: "Precious metals are our expert",
    heading: "Why Clients Choose J. Rotbart & Co.",
    body: [
      "Your precious metals strategy should give you more than ownership. It should give you control over where your assets are held, confidence in how they are protected, and the flexibility to access, move, finance, or sell them when your needs change.",
      "J. Rotbart & Co. gives you one relationship through which to manage your precious metals across jurisdictions and throughout the lifetime of your holdings.",
    ],
  },
  cells: [
    {
      _key: "own",
      // TODO(client): the frame draws the same Finance/Gold glyph on all four
      // rows — four distinct icons wanted.
      marker: { kind: "icon", icon: "gold" },
      title: "Your Bullion. Your Name. Your Control.",
      body: [
        "Your bullion is fully allocated and segregated, recorded in your name and identified by individual serial numbers where applicable. It is held off our balance sheet, preserving clear ownership of your assets. When your needs change, you can access liquidity by borrowing against eligible holdings, or sell your metals for fiat or cryptocurrency. We also provide a straightforward buy-back option for the products you purchased through us.",
      ],
    },
    {
      _key: "diversify",
      marker: { kind: "icon", icon: "gold" },
      title: "Diversify Where Your Wealth is Held",
      body: [
        "You choose where your precious metals are stored. With access to 16 vault locations and delivery to 35 countries, you can hold and move bullion across leading financial centres including Hong Kong, Singapore, Zurich, Frankfurt, Dubai, London, New York, and Sydney. This lets you spread your holdings across jurisdictions rather than relying on one location or legal system.",
      ],
    },
    {
      _key: "one-relationship",
      marker: { kind: "icon", icon: "gold" },
      title: "Manage Your Precious Metals Through One Trusted Relationship",
      body: [
        "Manage every aspect of your precious metals ownership through one experienced team. Buy LBMA- and LPPM-certified investment-grade metals, arrange fully insured global shipping, and store your bullion in allocated and segregated vaults. When your needs change, borrow against eligible holdings, convert between fiat and cryptocurrency, or sell and arrange buy-backs. One accountable relationship covers you from purchase through to final settlement.",
      ],
    },
    {
      _key: "expert-service",
      marker: { kind: "icon", icon: "gold" },
      title: "Expert Service Tailored to Your Priorities",
      body: [
        "You have an experienced advisor at your side for the lifetime of your holdings. They help you weigh storage jurisdictions, liquidity options, and changes to your strategy as your circumstances evolve. You also receive an annual audit of your holdings and can arrange to visit the vault and inspect your bullion in person, giving you full transparency over the assets you own.",
      ],
    },
  ],
  // I10765:11507 — light card, stacked arrow link.
  aside: {
    heading: "Tell us your goal. We will show you how to get there.",
    cta: { label: "Speak with a Value Expert", href: "#contact", style: "arrow" },
  },
};

// ---------------------------------------------------------------------------
// 5 / 8 / 12. Testimonial bands — 10726:9194, 10726:13251, 10726:9364
// ---------------------------------------------------------------------------

export const testimonialFirst = testimonialSlot(1);
export const testimonialSecond = testimonialSlot(2);
export const testimonialThird = testimonialSlot(3);

// ---------------------------------------------------------------------------
// 6a. What you can buy — 10726:9197 header + 10726:9202 grid (light, boxed)
// ---------------------------------------------------------------------------

export const metals: FeatureGridBlock = {
  _key: "buy-metals",
  _type: "featureGrid",
  theme: "light",
  layout: "stacked",
  columns: 2,
  frame: "boxed",
  header: {
    overline: "What we Offer",
    heading: "What You Can Buy Through Us",
    // 10726:9199: "Buy Through Us" is the italic accent.
    headingRuns: [{ text: "What You Can " }, { text: "Buy Through Us", accent: true }],
    body: [
      "You can buy gold, silver, platinum, and palladium through us. Each metal plays a different role in your portfolio. We help you assess which metals, and what allocation, best align with your goals, time horizon, and broader wealth strategy.",
      "The bars and coins we source for you come exclusively from LBMA- and/or LPPM-accredited refineries and sovereign mints, including PAMP Suisse, Valcambi, the Royal Canadian Mint, the Perth Mint, Heraeus, and Rand Refinery. This gives you investment-grade products from producers recognised and traded worldwide.",
    ],
  },
  // The eyebrow lines render with the `eyebrow` utility, tertiary (amendment 8).
  cells: [
    {
      _key: "gold",
      marker: { kind: "metal", metal: "gold" },
      title: "Gold",
      eyebrow: "The World’s Oldest Store of Value",
      body: [
        // TODO(client): market statistics (863 tonnes, 2025 record highs) need a source and a date.
        "Gold is the world’s most widely held reserve asset. In 2025, central banks added approximately 863 tonnes to their reserves, even as gold reached successive record highs. For clients seeking long-term wealth preservation and diversification, gold is the core precious metal. We offer investment-grade gold bars from refiners on the LBMA Good Delivery List, and coins from recognised sovereign mints.",
      ],
      link: { label: "Request a private gold quote now", href: "#contact", style: "arrow" },
    },
    {
      _key: "silver",
      marker: { kind: "metal", metal: "silver" },
      title: "Silver",
      eyebrow: "Affordable, and in-demand",
      body: [
        // TODO(client): "rose roughly 145%" needs a source and a date.
        "Silver is both a monetary asset and an industrial metal. It gives you exposure to investment demand, and to a raw material vital for electronics, solar energy, and other technologies. In 2025, the LBMA silver price rose roughly 145%, making it one of the year’s top-performing assets. We offer investment-grade silver bars from refiners on the LBMA Good Delivery List, alongside coins from recognised sovereign mints.",
      ],
      link: { label: "Request your tailored silver quote now", href: "#contact", style: "arrow" },
    },
    {
      _key: "platinum",
      marker: { kind: "metal", metal: "platinum" },
      title: "Platinum",
      eyebrow: "Scarce, Versatile, and Supply-Constrained",
      body: [
        // TODO(client): "rose approximately 127%" needs a source and a date.
        "Platinum is one of the world’s rarest metals. Demand spans automotive emissions systems, industry, jewellery, medicine, and emerging hydrogen technologies. Its price rose approximately 127% during 2025, supported by tight market conditions and strong investment demand. We offer investment-grade platinum from refiners on the LPPM Good Delivery List, together with selected coins from recognised mints.",
      ],
      link: { label: "Get a private platinum quote now", href: "#contact", style: "arrow" },
    },
    {
      _key: "palladium",
      marker: { kind: "metal", metal: "palladium" },
      title: "Palladium",
      eyebrow: "Specialised Exposure to Industrial Demand",
      body: [
        "Palladium is a highly specialised precious metal. Most of it goes into automotive catalytic converters, with further uses in electronics, chemical production, and other industries. This gives you exposure to a different set of supply-and-demand drivers from gold, silver, and platinum. We offer investment-grade palladium from refiners on the LPPM Good Delivery List, together with selected coins from recognised mints.",
      ],
      link: { label: "Request a bespoke palladium quote now", href: "#contact", style: "arrow" },
    },
  ],
};

// ---------------------------------------------------------------------------
// 6b. Metals callout — I10770:11997 (tinted card on the light surface, button)
// ---------------------------------------------------------------------------

export const metalsCallout: CalloutBandBlock = {
  _key: "buy-metals-callout",
  _type: "calloutBand",
  theme: "tinted",
  seam: "default",
  heading:
    "Not sure which metals suit your goals? Schedule a private consultation with our Value Experts to learn more about each.",
  cta: speakCta,
};

// ---------------------------------------------------------------------------
// 6c. Bars and coins — 11008:15326 (light, split / 1 / none, afterBody)
// ---------------------------------------------------------------------------

export const barsAndCoins: FeatureGridBlock = {
  _key: "buy-bars-and-coins",
  _type: "featureGrid",
  theme: "light",
  seam: "default",
  layout: "split",
  columns: 1,
  frame: "none",
  header: {
    heading: "The Bars and Coins We Source for You.",
    // 11008:15374: leading italic accent.
    headingRuns: [{ text: "The Bars and Coins", accent: true }, { text: " We Source for You." }],
    body: "You can hold precious metals in bars, coins, or a combination of both, depending on how you want to balance cost efficiency, flexibility, and liquidity.",
  },
  cells: [
    {
      _key: "bars",
      // TODO(client): placeholder glyph (Finance/Gold) on both rows.
      marker: { kind: "icon", icon: "gold" },
      title: "Bars",
      body: ["Typically offer a lower premium per ounce, making them well suited to larger allocations."],
    },
    {
      _key: "coins",
      marker: { kind: "icon", icon: "gold" },
      title: "Coins",
      body: [
        "Give you greater flexibility through smaller denominations and, in many cases, the added recognition of legal-tender issues from leading sovereign mints.",
      ],
    },
  ],
  afterBody: [
    "Talk to our Value Experts about your goals and they will help you determine the mix of bars and coins best suited to the size, purpose, and expected holding period of your precious metals allocation.",
    "We source investment-grade bars only from refiners on the LBMA and LPPM Good Delivery Lists, and recognised bullion coins from leading sovereign mints.",
  ],
};

// ---------------------------------------------------------------------------
// 6d. Best sellers — 10726:13040 (headerless product grid)
// ---------------------------------------------------------------------------

/**
 * The six cards are lorem in the frame ("Mint: Lorem", lorem descriptions,
 * "999.9 fine gold" on every metal), so they are the six HOMEPAGE products
 * by `_id` (amendment 2), in the drawn order. Each id is resolved through the
 * live catalogue first (src/content/products — the same documents, promoted
 * to `ProductDetail`, so the card CTA reaches the product page through
 * `productHref()`), and falls back to the homepage document for the platinum
 * and palladium products, which have no listing yet and therefore link to
 * the contact anchor as the homepage does.
 * TODO(client): confirm these six as the Buy PM best sellers — the frame
 * draws the "Best seller" ribbon on all six.
 */
const bestSellerIds: Product["_id"][] = [
  "heraeus-gold",
  "argor-heraeus-gold",
  "royal-canadian-mint-gold",
  "heraeus-silver",
  "heraeus-platinum",
  "heraeus-palladium",
];

function bestSeller(id: Product["_id"]): Product {
  const product =
    catalogue.find((p) => p._id === id) ?? homepageProductGrid.products.find((p) => p._id === id);
  if (!product) throw new Error(`[pages/buying-precious-metals] unknown product "${id}"`);
  return product;
}

export const bestSellers: ProductGridSection = {
  _key: "buy-best-sellers",
  _type: "productGrid",
  theme: "light",
  seam: "default",
  products: bestSellerIds.map(bestSeller),
  ...productCardLabels,
};

// ---------------------------------------------------------------------------
// 6e. Explore callout — I10770:12006 (tinted card on the light surface, button)
// ---------------------------------------------------------------------------

export const exploreCallout: CalloutBandBlock = {
  _key: "buy-explore-callout",
  _type: "calloutBand",
  theme: "tinted",
  seam: "default",
  heading: "For a full list of our available products, please visit our product page",
  // TODO(client): "our product page" — the catalogue is one listing per metal
  // (/buy-gold/, /buy-silver/); the gold listing is the destination until a
  // combined products page exists.
  cta: { label: "Explore Our Products", href: "/buy-gold/", style: "solid" },
};

// ---------------------------------------------------------------------------
// 6f. LBMA / LPPM — 10726:13303 (light, photo right 539 × 674, definitions)
// ---------------------------------------------------------------------------

export const lbmaStandards: MediaWithTextBlock = {
  _key: "buy-lbma",
  _type: "mediaWithText",
  theme: "light",
  seam: "default",
  header: {
    overline: "What LBMA and LPPM Standards Mean for You",
    heading: "The Value LBMA and LPPM Approval Holds for You.",
  },
  // 10726:13308 is one text node with a blank line; two paragraphs.
  body: [
    "The London Bullion Market Association (LBMA) and the London Platinum and Palladium Market (LPPM) set the recognised Good Delivery standards for precious metals bars. Their Good Delivery Lists name the refiners whose products meet the world’s strictest tests. These cover fineness, weight, production quality, responsible sourcing, and operational integrity.",
    "For you, these standards support two important benefits:",
  ],
  media: {
    // Figma 10726:13447, drawn 539 × 674 object-cover (Phase 0 export).
    // TODO(client): stock photograph (Figma layer "Screenshot 2025-02-19 at
    // 10.07.18 1") — usage rights and an original at ≥ 2× are needed; the
    // alt describes what is pictured and wants confirming.
    src: "/figma/lbma-safe-deposit-boxes--10726-13447.webp",
    alt: "A woman opening a safe-deposit box in a vault",
    width: 539,
    height: 674,
  },
  mediaSide: "right",
  // 10726:13303 — copy 539 @x=96, gutter 96, image 539 @x=731; the frame is
  // `HORIZONTAL gap=96/CENTER`, copy 505 tall in a 674 row.
  split: { media: 539, gap: 96, text: 539, align: "center" },
  ratio: "539/674",
  // 10726:13310 / 13313 — the two hairline rows under the body.
  definitions: [
    {
      term: "Value",
      description: "Your bullion is recognised worldwide, which supports its resale value across major bullion markets.",
    },
    {
      term: "Liquidity",
      description: "Your products sell easily to a broad pool of buyers. We are always happy to give you a buy-back quote.",
    },
  ],
};

// ---------------------------------------------------------------------------
// 6g. Why product origin matters — 10726:13476 (light, split, tinted aside)
// ---------------------------------------------------------------------------

export const origin: ProseSectionBlock = {
  _key: "buy-origin",
  _type: "proseSection",
  theme: "light",
  seam: "default",
  layout: "split",
  header: {
    heading: "Why Product Origin Matters.",
    body: "Your bullion’s refiner, mint, product type, condition, and documentation determine how easily it will sell and the price buyers will offer for it. Choosing investment-grade bullion from recognised refiners and sovereign mints gives you established provenance and broad market acceptance. It makes your holdings easier to store, transport, finance, and sell, while helping preserve their liquidity and resale value over time.",
  },
  // I11012:14216 — the whole card is the link (inline 32px arrow).
  aside: {
    heading:
      "Still not sure what to get? Schedule a consultation about your optimal mix of coins and bars with our Value Experts.",
    cta: { label: "Speak With a Value Expert", href: "#contact", style: "arrow" },
  },
};

// ---------------------------------------------------------------------------
// 9. How it works — 10726:9257 (tinted, split header, five steps)
// ---------------------------------------------------------------------------

export const steps: ProcessStepsBlock = {
  _key: "buy-steps",
  _type: "processSteps",
  theme: "tinted",
  headerLayout: "split",
  header: {
    overline: "How it works",
    heading: "How Buying Through J. Rotbart & Co. Works",
    // 10770:12118: "Buying Through" is the italic accent.
    headingRuns: [{ text: "How " }, { text: "Buying Through", accent: true }, { text: " J. Rotbart & Co. Works" }],
    // TODO(client): "between two and ten business days" vs the 2–3 day
    // onboarding and 1–7 day settlement figures in the FAQ below.
    body: "From your first conversation with us through to the allocation and storage of your bullion, the process is straightforward and transparent, with every step clearly explained and documented. The process typically takes between two and ten business days, depending on your transaction size, onboarding needs, and chosen storage country. Your Value Expert remains your point of contact throughout, so you always know what has been completed and what happens next.",
  },
  // Numbers ("01"…"05") are rendered by the component, never authored.
  steps: [
    {
      title: "Understanding Your Requirements",
      body: [
        "Your process begins with a 30-minute conversation with one of our Value Experts. We listen to your goals, answer your questions, and discuss your preferred storage countries, investment amount, and any specific needs. This gives us the information we need to recommend suitable products and structure your purchase around your priorities. There is no commitment to proceed at this stage.",
      ],
    },
    {
      title: "Receive Your Written Proposal",
      body: [
        "Within two business days of your initial call, you will receive a tailored proposal setting out the recommended products, pricing and premiums over spot, insurance terms, applicable storage fees, and any other relevant costs.",
        "Everything is clearly itemised, so you can see exactly what you are paying for and make an informed decision before proceeding.",
      ],
    },
    {
      title: "Complete Onboarding",
      body: [
        "We guide you through the required compliance and onboarding process, which typically takes two to three business days. You receive a clear list of the documents required, and your dedicated Value Expert remains available throughout to answer questions and help keep the process moving smoothly.",
      ],
    },
    {
      title: "Lock Your Price and Settle",
      body: [
        // TODO(client): legal approval of the cryptocurrency settlement wording.
        "Once you are ready to move forward, your purchase price is locked. You can choose to settle by bank wire, credit card, or cryptocurrency, depending on your preference. Your bullion is then allocated to you and arranged for storage in your chosen vault. Where applicable, individual bars are identified by serial number and recorded as part of your holdings.",
      ],
    },
    {
      title: "Documentation and Ongoing Service",
      body: [
        // TODO(client): the frame reads "nce your purchase…" (10726:13543); corrected to "Once".
        "Once your purchase is complete, you will receive your trade documentation, vault confirmation, and applicable serial-number records. Your holdings are independently audited each year, with a copy of the audit report provided to you. Your Value Expert remains your single point of contact for any future sale, insured shipment, transfer, or lending request against eligible bullion.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 10. Steps callout — I10770:12141 (light "hug" card on the tinted surface)
// ---------------------------------------------------------------------------

export const stepsCallout: CalloutBandBlock = {
  _key: "buy-steps-callout",
  _type: "calloutBand",
  theme: "light",
  seam: "default",
  width: "hug",
  ctaLayout: "inline",
  heading: "Ready to begin? Schedule your briefing with a Value Expert.",
  // The label is the link's accessible name only; the card draws the arrow.
  cta: { label: "Schedule a briefing", href: "#contact", style: "arrow" },
};

// ---------------------------------------------------------------------------
// 11. Comparison — 10726:9306 (light, split header, highlighted third column)
// ---------------------------------------------------------------------------

export const comparison: ComparisonTableBlock = {
  _key: "buy-comparison",
  _type: "comparisonTable",
  theme: "light",
  headerLayout: "split",
  header: {
    // Rendered uppercase by the eyebrow utility; stored as drawn (10726:9309).
    overline: "Why us",
    heading: "What Makes Working With Us Different.",
    // 10726:9310: "With Us Different." is the italic accent.
    headingRuns: [{ text: "What Makes Working " }, { text: "With Us Different.", accent: true }],
    body: "Clients usually consider three places to buy investment-grade bullion: their bank, a gold shop, or a specialist firm like J. Rotbart & Co. Each one offers something different. Here is what working with us gives you:",
  },
  columns: [{ label: "Bank" }, { label: "Gold shops" }, { label: "J. Rotbart & Co.", highlighted: true }],
  // TODO(client): the claims about banks and gold shops (10726:13768–13762) need sign-off.
  rows: [
    {
      label: "How you own it",
      cells: [
        "Often a paper claim, or unallocated.",
        "You take the bullion home.",
        "Allocated and segregated bars recorded in your name, with a serial number. Held off our balance sheet.",
      ],
    },
    {
      label: "Where it is stored",
      cells: [
        "The bank decides.",
        "You arrange it yourself.",
        "You choose from 16 international vault locations. Fully insured.",
      ],
    },
    {
      label: "What you can do",
      cells: [
        "Usually limited to buying, holding, and selling.",
        "Mainly buying and selling.",
        "Buy, store, ship, finance, convert, and sell through one team.",
      ],
    },
    {
      label: "Who helps you",
      cells: [
        "A general relationship manager.",
        "A salesperson.",
        "A dedicated Value Expert. Advisor first, salesperson second.",
      ],
    },
    {
      label: "Ongoing service",
      cells: [
        "Quarterly statements at best. No vault audit.",
        "None. The transaction ends at the counter.",
        "Complimentary annual independent audit. Vault visits on request. Ongoing support whenever you need it.",
      ],
    },
    {
      label: "Best suited to",
      cells: [
        "Basic exposure through an existing banking relationship.",
        "Small purchases for personal possession.",
        "People looking for control, flexibility, and meaningful long-term wealth management.",
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 12. Comparison callout — I10770:12175 (tinted "hug" card on the light surface)
// ---------------------------------------------------------------------------

export const comparisonCallout: CalloutBandBlock = {
  _key: "buy-comparison-callout",
  _type: "calloutBand",
  theme: "tinted",
  seam: "default",
  width: "hug",
  ctaLayout: "inline",
  // The frame breaks the line after "specialist." (I10770:12175 is 707 wide);
  // the card hugs its content, so the break falls where the text wraps.
  heading:
    "Discover the benefits of working with a precious metals specialist. Schedule a call with our Value Experts today.",
  cta: { label: "Schedule a call", href: "#contact", style: "arrow" },
};

// ---------------------------------------------------------------------------
// 14. FAQ — 10726:9365 (tinted, eight rows, footer + button)
// ---------------------------------------------------------------------------

/**
 * Eight questions, verbatim from the frame (I10726:9372…9386, 13836), answers
 * split at the frame's blank lines. All eight are authored copy, so all eight
 * go into the FAQPage node.
 */
export const faqs: Faq[] = [
  {
    _id: "buy-faq-minimum",
    question: "Is there a minimum amount I need to buy?",
    answer: [
      "We do not set a strict minimum purchase amount, and we are happy to accommodate smaller purchases at our offices. If you are considering a precious metals allocation, speak with one of our Value Experts about the options available to you.",
    ],
  },
  {
    _id: "buy-faq-allocated",
    question: "What does \"allocated and segregated\" really mean?",
    answer: [
      "Allocated means specific bullion is assigned to you and recorded in your name. Segregated means your holdings are stored separately from those of other clients. Where applicable, individual bars are identified by serial number.",
      "Your bullion remains your property, is held off our balance sheet, and is independently audited each year. You can also arrange to visit the vault and inspect your holdings in person.",
    ],
  },
  {
    _id: "buy-faq-products",
    question: "What products do you offer?",
    answer: [
      "We source investment-grade bars from refiners on the LBMA and LPPM Good Delivery Lists, together with recognised bullion coins from leading sovereign mints. Some of the producers we work with are PAMP Suisse, Valcambi Suisse, Heraeus, Argor-Heraeus, Metalor, the Royal Canadian Mint, the Perth Mint, and Rand Refinery.",
      "LBMA and LPPM recognition matters because it supports the resale value and marketability of your bullion. Products from recognised refiners are accepted across world bullion markets, so your holdings are easier to verify and sell.",
    ],
  },
  {
    _id: "buy-faq-storage",
    question: "Where can my bullion be stored?",
    answer: [
      "You can choose from our international network of professional vaults across major precious metals jurisdictions. Your Value Expert will help you compare locations on access, jurisdiction, residency, tax and reporting factors, and your long-term plans.",
    ],
  },
  {
    _id: "buy-faq-prices",
    question: "How are your prices structured?",
    answer: [
      "You see the full cost before you commit: the spot price, premium over spot, storage, insurance, and any other applicable charges.",
      "For meaningful holdings intended for long-term wealth preservation, purchase price is only one consideration. How your bullion is owned, where it is stored, how easily it can be moved or sold, and the support you receive over time can matter far more than a small difference in the initial premium.",
    ],
  },
  {
    _id: "buy-faq-sell-back",
    question: "Can I sell back what I buy from you?",
    answer: [
      "Yes. We are happy to buy back precious metals purchased through us and can also purchase bullion acquired elsewhere, subject to inspection or authentication. You receive a quotation based on prevailing market conditions before you sell.",
    ],
  },
  {
    _id: "buy-faq-borrow",
    question: "Can I borrow against my bullion?",
    answer: [
      // TODO(client): the LTV figures (75 % gold / 70 % silver) and the lending
      // disclosure below (10726:13836 — licensee, Money Lenders Licence
      // MLR5962) need legal sign-off before launch.
      "Yes. We offer loans of up to 75 percent loan-to-value against gold and up to 70 percent against silver, with flexible terms, allowing you to access capital without selling your holdings.",
      "Lending is provided by J.R. Trading (International) Limited under Hong Kong SAR Money Lenders Licence No. MLR5962. Loan terms, eligibility, interest rates, and LTV are subject to individual assessment.",
    ],
  },
  {
    _id: "buy-faq-timeline",
    question: "How long does executing a purchase take?",
    answer: [
      // TODO(client): 2–3 + 1–7 business days here vs "two and ten" in the steps header.
      "Onboarding typically takes two to three business days. Settlement and allocation normally follow within one to seven business days, depending on the size of your transaction and chosen vault location.",
      "Your Value Expert will give you a clear timeline before you proceed and remain your point of contact throughout.",
    ],
  },
];

export const faq: FaqAccordionBlock = {
  _key: "buy-faq",
  _type: "faqAccordion",
  theme: "tinted",
  header: {
    // Rendered uppercase by the eyebrow utility; stored sentence case.
    overline: "People also asked",
    // 11009:15420: "Asked" is the italic accent mid-line (FaqAccordion reads
    // `headingAccent` as the run WITHIN `heading`).
    heading: "Frequently Asked Questions",
    headingAccent: "Asked",
    body: "These are some of the questions clients ask us most often before buying. If yours is not covered here, one of our Value Experts will be happy to answer it directly.",
  },
  // TODO(client): the frame draws every row open, so the route passes
  // initiallyOpen="all" AND exclusiveGroup="" — the second is not optional,
  // because the native exclusive group would close all but one row again.
  // Confirm against the homepage's one-open convention.
  faqs,
  footer: {
    // U+2019 apostrophe, verbatim from the frame (11009:15425).
    heading: "Have a Question We Haven’t Answered Here?",
    // TODO(client): "1 business day" here vs "24 hours" in the contact block.
    body: "Speak with our Value Experts — Your enquiry will be treated in strict confidence and answered within 1 business day.",
    cta: speakCta,
  },
};

// ---------------------------------------------------------------------------
// 15. News — 11009:15432 (light, the latest three posts)
// ---------------------------------------------------------------------------

/**
 * `articles` is empty here: the route fills it at build time with the three
 * most recent posts (amendment 13 — the latest three, NOT the homepage-pin
 * selection). The frame's three cards are lorem (11009:15447/15456/15465).
 */
export const news: NewsGridBlock = {
  _key: "buy-news",
  _type: "newsGrid",
  theme: "light",
  header: {
    // Rendered uppercase by the eyebrow utility; stored sentence case.
    overline: "Perspectives on global wealth",
    // 11009:15437: "News and Media." is the italic accent.
    heading: "Precious Metals",
    headingAccent: "News and Media.",
    body: "Our latest articles on storage, allocation, and protecting physical wealth. Updated as new pieces are published.",
  },
  source: "auto",
  limit: 3,
  articles: [],
};

/** The per-card affordance — the homepage's, by reference (the frame draws "Read More"). */
export { newsCardCtaLabel };

// ---------------------------------------------------------------------------
// 16. Storage-plan callout — I11009:15467 (bordered box on the light surface)
// ---------------------------------------------------------------------------

export const storageCallout: CalloutBandBlock = {
  _key: "buy-storage-callout",
  _type: "calloutBand",
  theme: "light",
  seam: "default",
  bordered: true,
  // TODO(client): this is the Storage page's line (I11009:15467 reuses
  // 10770:11896) under the news grid of the BUYING page; shipped verbatim.
  heading: "Want a tailored storage plan for your situation?",
  cta: speakCta,
};

// ---------------------------------------------------------------------------
// 17. Related services — 10726:9457 (tinted, boxed 2-up, h4 titles)
// ---------------------------------------------------------------------------

export const relatedServices: FeatureGridBlock = {
  _key: "buy-related-services",
  _type: "featureGrid",
  theme: "tinted",
  layout: "stacked",
  columns: 2,
  frame: "boxed",
  header: {
    overline: "Related Services",
    heading: "Services That Work Alongside.",
    body: "Buying is the first step. Most of our clients opt for a package that includes shipping and storage straight away, because those are the services required to deliver and protect your bullion. Both run through the same team, with the same care and the same accountability.",
  },
  // Titles and blurbs are the frame's (10734:13982/14004, 13975/14002); the
  // links and `ref`s come from the Service documents so they cannot drift.
  cells: [
    {
      _key: "shipping",
      marker: { kind: "icon", icon: globalShipping.icon ?? "truck" },
      title: "Global Shipping & Logistics",
      body: [
        "Insured delivery to 35 countries through specialist carriers including Brinks, Malca-Amit, and Loomis International. Door-to-vault, vault-to-vault, or vault-to-residence. We coordinate everything, including customs.",
      ],
      // TODO(client): /global-shipping/ is not rebuilt yet (404 on the new site until its page exists).
      link: { label: "Learn More", href: globalShipping.href, style: "arrow" },
      ref: { service: globalShipping._id },
    },
    {
      _key: "storage",
      marker: { kind: "icon", icon: globalStorage.icon ?? "earth" },
      title: "Global Storage",
      body: [
        "We store allocated, segregated bullion held in your name across 16 secure vaults and free-zone options in leading financial centres around the world. You choose the locations that best match your needs. Your holdings are always fully insured and are audited every year by an independent third party.",
      ],
      // TODO(client): /global-storage/ is not rebuilt yet (404 on the new site until its page exists).
      link: { label: "Learn More", href: globalStorage.href, style: "arrow" },
      ref: { service: globalStorage._id },
    },
  ],
};

// ---------------------------------------------------------------------------
// 18. Package callout — I10770:12191 (light card on the tinted surface, button)
// ---------------------------------------------------------------------------

export const packageCallout: CalloutBandBlock = {
  _key: "buy-package-callout",
  _type: "calloutBand",
  theme: "light",
  seam: "default",
  heading: "Want buying, storage, and shipping priced together?",
  cta: speakCta,
};
