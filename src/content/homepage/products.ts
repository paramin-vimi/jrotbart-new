import type {
  Cta,
  ImageRef,
  LogoStripBlock,
  Metal,
  Product,
  ProductGridBlock,
  SectionHeading,
} from "@content/types";

/**
 * Homepage content — press/endorsement logo strip (Figma `Featured` 10563:13076)
 * and the best-seller product grid (Figma `Product` 9813:5533).
 *
 * Sources
 * -------
 * • Geometry, type and structure: the Figma desktop frame (1366px), via the
 *   design spec for those two nodes.
 * • Copy: the Figma frame is largely lorem ipsum in the product cards, so every
 *   product string below is lifted from the CURRENT LIVE SITE (jrotbart.com,
 *   crawled 2026-08-30) where a real equivalent exists. Nothing here is lorem.
 * • Images: the Figma exports under /figma/. The interim WordPress uploads are
 *   gone. `width`/`height` are the sizes the DESIGN draws each image at; the
 *   files themselves are exported at 2x.
 *
 * Local type extensions
 * ---------------------
 * `src/content/types.ts` is owned by another process and must not be edited, so
 * the three fields this design needs that the shared model does not carry
 * (`headingTail`, `variants`, the two-line promo banner) are added here as
 * interfaces that EXTEND the shared block types. Every value below is still a
 * valid `LogoStripBlock` / `ProductGridBlock`. See the report for the list.
 */

// ---------------------------------------------------------------------------
// Local type extensions
// ---------------------------------------------------------------------------

/**
 * The logo strip is not a landmark without a name. `LogoStripBlock` has no
 * label field, so it is added here rather than hardcoded in the component.
 * Never rendered visually — it is the `aria-label` on the <section>.
 */
export interface LogoStripSection extends LogoStripBlock {
  label: string;
}

/**
 * `SectionHeading` renders its accent at the END of the heading. This section's
 * heading puts it in the MIDDLE — "Buy *Gold* and Precious Metals" — so a
 * trailing fragment is needed.
 */
export interface ProductGridHeading extends SectionHeading {
  /** Upright text rendered after the italic accent. */
  headingTail?: string;
}

/** `Product` has no `variants` field; the card's third spec row needs one. */
export interface ProductCard extends Product {
  /** Single-line weight list, e.g. "100g, 250g, 500g and 1000g". */
  variants: string;
  /** Overrides the section-level CTA label. Rarely needed. */
  ctaLabel?: string;
}

/**
 * The shared `promo` shape is a single image + heading + body. The Figma banner
 * is two stacked bitmaps and a two-line heading whose second line is italic, so
 * it is widened here (still assignable to the shared shape).
 */
export interface PromoBanner {
  /** Artwork-only backdrop (Figma `image 181`). Optional: the promo reads correctly on the flat
   *  brand ground, and a pre-composited banner would duplicate the live text. */
  image?: ImageRef;
  /** Product cutout composited over the backdrop — Figma `image 179`, 195x160. */
  productImage?: ImageRef;
  /** Line 1, upright. */
  heading: string;
  /** Line 2, rendered italic. */
  headingAccent: string;
  /** Sub-line above the CTA, rendered italic. */
  body: string;
  cta: Cta;
}

export interface ProductGridSection extends ProductGridBlock {
  header: ProductGridHeading;
  promo?: PromoBanner;
  products: ProductCard[];
  /** Ribbon text drawn across the top of a best-seller card image. */
  badgeLabel: string;
  /** Default per-card CTA label. */
  ctaLabel: string;
  /** Labels for the three spec rows. Kept as copy so they stay translatable. */
  specLabels: { mint: string; purity: string; variants: string };
  /** Display label for each metal enum value; drives the chip caption. */
  metalLabels: Record<Metal, string>;
}

// ---------------------------------------------------------------------------
// Section 1 — press / endorsement logo strip (Figma 10563:13076)
// ---------------------------------------------------------------------------

/*
 * TODO(client): the Figma frame draws FOUR press logos (WSJ, MSNBC, Inquirer,
 * finews). The current live site carries EIGHT — it also has Forbes, CNBC,
 * Financial Times and MONEY FM 89.3. We have shipped the four the design draws.
 * Confirm whether the other four should be dropped or whether the row should
 * carry all eight. NOTE this is no longer free: below 768 the row is a
 * horizontal track, so eight logos lengthen the scroll rather than wrapping,
 * and at >=1280 group 1 is `xl:shrink-0` sized to hug four tiles — eight would
 * overrun the drawn 742px column and push the divider off its x=838. Adding
 * four more is a layout change at both ends, not just more data.
 *
 * TODO(client): the live site auto-scrolls these logos in a carousel. The new
 * design draws a static row and shows no carousel affordance, so this is built
 * static — below 768 the rows scroll horizontally on swipe, but nothing moves
 * on its own. Confirm that the auto-scroll is intentionally gone.
 *
 * TODO(client): no logo links to anything in the design. `href` is supported per
 * logo — supply the article/partner URLs if these should be outbound links.
 *
 * `width`/`height` on each image are the Figma TILE boxes, not the bitmap sizes.
 * The component renders each tile at a fixed height with `object-contain`, so
 * the tile aspect reserves layout space and the bitmap letterboxes inside it —
 * which is exactly how Figma composes them (e.g. a 160x16 WSJ bitmap
 * vertically centred in a 160x30 frame).
 */
export const logoStrip: LogoStripSection = {
  _key: "home-logo-strip",
  _type: "logoStrip",
  theme: "light",
  label: "Press coverage and endorsements",
  groups: [
    {
      label: "Featured on:",
      logos: [
        {
          name: "The Wall Street Journal",
          image: {
            src: "/logos/wsj.png",
            alt: "The Wall Street Journal",
            width: 160,
            height: 30,
          },
        },
        {
          name: "MSNBC",
          image: {
            src: "/logos/msnbc.png",
            alt: "MSNBC",
            width: 102,
            height: 30,
          },
        },
        {
          name: "Inquirer.net",
          image: {
            src: "/logos/inquirer.png",
            alt: "Inquirer.net",
            width: 128,
            height: 30,
          },
        },
        {
          name: "finews.asia",
          image: {
            src: "/logos/finews.png",
            alt: "finews.asia",
            width: 128,
            height: 30,
          },
        },
      ],
    },
    {
      label: "Endorsed by:",
      logos: [
        {
          name: "Carret Private Investments",
          image: {
            src: "/logos/carret.png",
            alt: "Carret Private Investments",
            width: 100,
            height: 30,
          },
        },
        {
          name: "eastwest PRIORITY",
          image: {
            src: "/logos/eastwest.png",
            alt: "eastwest PRIORITY",
            width: 96,
            height: 30,
          },
        },
        {
          name: "Nomad Capitalist",
          image: {
            // TODO(assets): replace with Figma export. Also a crop of a larger
            // source bitmap in Figma — re-export clean.
            src: "/logos/nomad-capitalist.png",
            alt: "Nomad Capitalist",
            width: 80,
            height: 30,
          },
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Section 2 — best-seller product grid (Figma 9813:5533)
// ---------------------------------------------------------------------------

/*
 * TODO(client): the Figma card copy is placeholder throughout — all six mints
 * read "Mint: Lorem", all six descriptions are lorem ipsum, and the Silver,
 * Platinum and Palladium cards all incorrectly say "Purity: 999.9 fine gold".
 * Every string below is therefore taken from the live site's product tabs, with
 * the purity corrected to the right metal. Two consequences to review:
 *   1. `mint` values are our best reading of each refiner's home (Heraeus is
 *      German, Argor-Heraeus Swiss, the Royal Canadian Mint Canadian). The
 *      design supplies none. Confirm or replace.
 *   2. The live descriptions repeat the purity and variants that now have their
 *      own spec rows. They should be rewritten as genuine editorial copy —
 *      roughly three lines at a 370px column.
 *
 * TODO(client): the design shows the "Best seller" ribbon on ALL SIX cards, so a
 * badge that appears everywhere carries no information. On the live site only
 * four products are flagged. Confirm whether the ribbon is per-product data or a
 * section-wide decoration.
 *
 * TODO(client): the live site's four metal TABS are gone — this is a flat grid
 * with metal shown as a colour chip. Filtering by metal no longer exists.
 *
 * TODO(client): the design shows no prices anywhere. Confirm this is intended.
 *
 * TODO(client): card 3 is a conflict. The design labels "Royal Canadian Mint"
 * as GOLD, but the only Royal Canadian Mint product on the live site is a
 * SILVER bar. We have followed the design (gold chip, the design's variant
 * string) and made the description metal-neutral, but real gold copy and a gold
 * product photo are required.
 *
 * TODO(client): every card links to "#contact", matching the live site. Supply
 * real product-page URLs if these should be deep links.
 */
export const productGrid: ProductGridSection = {
  _key: "home-product-grid",
  _type: "productGrid",
  anchorId: "products",
  theme: "light",

  header: {
    overline: "Best seller",
    // "Buy *Gold* and Precious Metals" — the accent sits mid-string, hence headingTail.
    heading: "Buy",
    headingAccent: "Gold",
    headingTail: "and Precious Metals",
    body:
      "We help customers buy gold, silver, platinum, or palladium as well as sell, " +
      "store, and transport their precious metals. We are experts at securing assets " +
      "in offshore jurisdictions.",
  },

  /*
   * Seasonal promo. This is date-bound content (Lunar New Year, Year of the
   * Horse) and should become a schedulable, switchable block in the CMS rather
   * than permanent homepage furniture.
   *
   * Two layers, both now the Figma exports: `image 181` (507x195 backdrop) and
   * `image 179` (195x160 product composite).
   */
  promo: {
    // The backdrop is now wired: the Figma export of `image 181` is artwork only
    // — a pale seigaiha wave pattern rising from the bottom edge, with NO type
    // baked in. That was the blocker before: the live site's banner_horseyear.jpg
    // had the whole headline burnt into the JPEG, so using it under the live text
    // rendered the promo twice. Every word stays real text (selectable,
    // translatable, searchable, readable by assistive tech) and this sits behind
    // it. The component renders it alt="" + aria-hidden.
    image: {
      src: "/figma/image-181--9813-6897.webp",
      alt: "",
      decorative: true,
      width: 507,
      height: 195,
    },
    productImage: {
      src: "/figma/image-179--9813-5851.webp",
      // The Figma export is the three-piece composite the design draws, not the
      // single-bar photo the live site used: the large horse bar plus the two
      // certified assay cards, over a red lantern backdrop.
      alt:
        "Argor-Heraeus Year of the Horse limited edition gold bar, shown with " +
        "two certified assay cards",
      width: 195,
      height: 160,
    },
    heading: "Celebrate",
    headingAccent: "The Lunar New Year",
    body: "With our brand new premium",
    cta: {
      label: "Limited Edition Gold Bar",
      // TODO(client): the live site links this promo to the contact anchor.
      // Supply a product page URL if one exists.
      href: "#contact",
      style: "solid",
    },
  },

  badgeLabel: "Best seller",
  ctaLabel: "Learn more",
  specLabels: { mint: "Mint:", purity: "Purity:", variants: "Variants:" },
  metalLabels: {
    gold: "Gold",
    silver: "Silver",
    platinum: "Platinum",
    palladium: "Palladium",
  },

  /*
   * TODO(assets): BLOCKER — the six card exports are the wrong NODE, not the
   * wrong picture. Each one is the composed 370x370 image TILE: the beige matte,
   * the red "Best seller" ribbon and the product, flattened together. The
   * component composes those itself — it draws the matte, overlays the ribbon
   * from `badgeLabel`, and insets the product 13% — so wiring the tiles renders
   * the ribbon TWICE (the live full-bleed one, and a second inset one baked into
   * the bitmap) and shrinks every bar to ~74% of the size the design draws.
   *
   * The pictures below are correct and are kept: they are what Figma draws, at
   * 2x, and they fix the "gold card showing a silver bar" the client raised.
   * What is needed is a re-export of the PRODUCT BITMAP inside each tile —
   * transparent background, no matte, no ribbon — at the same six nodes' image
   * fills. Not fixable from this file; the component and the export pipeline are
   * both owned elsewhere. Do not ship until the six files are re-exported.
   */
  products: [
    {
      _id: "heraeus-gold",
      name: "Heraeus",
      metal: "gold",
      mint: "Heraeus, Germany", // TODO(client): confirm — Figma showed "Lorem"
      purity: "999.9 fine gold",
      variants: "100g, 250g, 500g and 1000g",
      description:
        "Heraeus bars have a purity of 999.9 fine gold and are available in 100g, " +
        "250g, 500g and 1000g variants. The design has changed since 2013.",
      // TODO(client): PHOTO/CAPTION MISMATCH. The Figma export for card 1 is a
      // cast bar carrying the ROYAL CANADIAN MINT hallmark ("Monnaie Royale
      // Canadienne", maple leaf and crown), stamped 1 KILO GOLD 999.9 — not a
      // Heraeus bar. The card order is Figma's, so the export stays in slot 1
      // and the alt describes what is actually pictured. Either supply a Heraeus
      // gold bar shot or re-attribute this card.
      image: {
        src: "/figma/product-1.webp",
        alt: "One kilo cast gold bar stamped 999.9, bearing a Royal Canadian Mint hallmark",
        width: 370,
        height: 370,
      },
      bestSeller: true,
      href: "#contact",
    },
    {
      _id: "argor-heraeus-gold",
      name: "Argor-Heraeus",
      metal: "gold",
      mint: "Argor-Heraeus, Switzerland", // TODO(client): confirm
      purity: "999.9 fine gold",
      variants: "1g to 1kg",
      description:
        "Argor-Heraeus gold bars are available in all variants from 1 gram to 1 " +
        "kilogram. Each cast or minted bar has a purity of 999.9 fine gold.",
      // TODO(client): PHOTO/CAPTION MISMATCH. The Figma export for card 2 is not
      // a bar at all — it is a pair of 1oz American Gold Eagle COINS (obverse
      // Liberty, reverse eagle, "1 OZ. FINE GOLD~50 DOLLARS"). Nothing about it
      // is Argor-Heraeus, and the card's "Variants: 1g to 1kg" spec describes a
      // bar range. Supply an Argor-Heraeus bar shot, or re-caption the card.
      image: {
        src: "/figma/product-2.webp",
        alt: "Two one-ounce American Gold Eagle coins, obverse and reverse",
        width: 370,
        height: 370,
      },
      bestSeller: true,
      href: "#contact",
    },
    {
      _id: "royal-canadian-mint-gold",
      name: "Royal Canadian Mint",
      metal: "gold",
      mint: "Royal Canadian Mint, Canada", // TODO(client): confirm
      purity: "999.9 fine gold",
      variants: "1oz, 10oz and 1kg",
      // TODO(client): rewritten to be metal-neutral because the live equivalent
      // describes the Royal Canadian Mint SILVER bar. Real gold copy needed.
      // Trimmed to ~3 lines at the drawn 370px column: the Figma card is a fixed
      // 666px tall and assumes every description is exactly three lines.
      description:
        "An internationally recognised mint, producing bars with a purity of 999 " +
        "to 999.9 in several variants including 1oz, 10oz and 1kg.",
      // The client's "gold card showing a silver bar" bug is fixed: the old
      // WordPress source here was the SILVER Royal Canadian Mint photo. The Figma
      // export for card 3 is gold, so the chip and the picture now agree.
      // TODO(client): PHOTO/CAPTION MISMATCH remains, in the other direction —
      // what Figma draws in slot 3 is the limited-edition Year of the Horse
      // minted bar, i.e. the SAME product as the seasonal promo banner above,
      // and its assay card in that banner reads Argor-Heraeus, not Royal
      // Canadian Mint. Running it twice in one section also weakens the promo.
      // A Royal Canadian Mint gold bar shot is still what this card wants.
      image: {
        src: "/figma/product-3.webp",
        alt: "Limited edition Year of the Horse minted gold bar",
        width: 370,
        height: 370,
      },
      bestSeller: true,
      href: "#contact",
    },
    {
      _id: "heraeus-silver",
      name: "Heraeus",
      metal: "silver",
      mint: "Heraeus, Germany", // TODO(client): confirm
      // Figma reads "999.9 fine gold" on this card — a copy/paste error. Corrected
      // against the live site, which states a 999.9 silver composition.
      purity: "999.9 fine silver",
      variants: "100g, 250g, 500g and 1000g", // TODO(client): confirm silver weights
      description:
        "In 2014 Heraeus began producing silver bars with a 999.9 silver " +
        "composition. Heraeus offers both cast and minted silver bar products.",
      // TODO(client): the bar in the Figma export is stamped "Feinsilber 999,0",
      // but the spec row above it reads 999.9 (taken from the live site). One of
      // the two is wrong. The alt below avoids repeating either number until
      // that is settled.
      image: {
        src: "/figma/product-4.webp",
        alt: "Heraeus 1000 g cast fine silver bar",
        width: 370,
        height: 370,
      },
      bestSeller: true,
      href: "#contact",
    },
    {
      _id: "heraeus-platinum",
      name: "Heraeus",
      metal: "platinum",
      mint: "Heraeus, Germany", // TODO(client): confirm
      purity: "999.5 fine platinum", // Figma read "999.9 fine gold" — corrected
      variants: "Four sizes, from 1oz to 1kg",
      description:
        "Offered in four sizes, from 1oz to 1kg, the Heraeus platinum bar has a " +
        "composition of 999.5 pure platinum.",
      // The one card where the Figma photo, the mint and the purity all agree.
      image: {
        src: "/figma/product-5.webp",
        alt: "Heraeus 1000 g minted platinum bar stamped 999.5",
        width: 370,
        height: 370,
      },
      bestSeller: true,
      href: "#contact",
    },
    {
      _id: "heraeus-palladium",
      name: "Heraeus",
      metal: "palladium",
      mint: "Heraeus, Germany", // TODO(client): confirm
      purity: "999.5 fine palladium", // Figma read "999.9 fine gold" — corrected
      variants: "Four sizes, from 1oz to 1000g",
      description:
        "Heraeus palladium bars are available in four sizes, ranging from 1oz to " +
        "1000g. Each bar offers a fineness of 999.5 pure palladium.",
      // TODO(client): PHOTO/CAPTION MISMATCH. The Figma export for card 6 is a
      // PAMP Suisse bar — the four-circle PAMP logo, "Switzerland / 1000 g /
      // PALLADIUM / 999.5" — not a Heraeus one. The purity matches; the mint
      // does not. Supply a Heraeus palladium shot or re-attribute the card.
      image: {
        src: "/figma/product-6.webp",
        alt: "PAMP Suisse 1000 g palladium bar stamped Switzerland 999.5",
        width: 370,
        height: 370,
      },
      bestSeller: true,
      href: "#contact",
    },
  ],
};
