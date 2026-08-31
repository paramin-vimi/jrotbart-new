import type {
  AboutStatsBlock,
  Cta,
  OfficeGridBlock,
  SectionHeading,
} from "@content/types";
import { offices } from "@content/offices";

/**
 * Homepage — Block A (About + statistics) and Block C (Office locations).
 *
 * Source of truth: Figma `MkPRW1BKlldItk3pnHgcW3` node `10229:7543` (frame is
 * misleadingly named "Product"; it contains no product content). Copy that the
 * Figma still shows as lorem ipsum has been replaced with the equivalent copy
 * from the current live site (jrotbart.com, captured 2026-08-30) where one
 * exists, and flagged `TODO(client)` where none does. No lorem ships.
 *
 * ---------------------------------------------------------------------------
 * LOCAL TYPE EXTENSIONS
 * ---------------------------------------------------------------------------
 * `src/content/types.ts` is owned elsewhere and must not be edited, so the two
 * fields this section needs that the shared block types do not model are added
 * here. Both are documented so they can be folded into types.ts (and the Sanity
 * schema) in one pass later.
 */

/**
 * `SectionHeading` supports a *trailing* italic accent only
 * (`heading` + `headingAccent`). Block A's heading puts the accent in the
 * middle — "Dedicated to *Preserving* Your Wealth" — so a third fragment is
 * needed. Leading/trailing spaces live inside the strings deliberately: they
 * survive `compressHTML`, whereas template whitespace does not.
 */
export interface SplitHeading extends SectionHeading {
  /** Roman text rendered after the italic accent. */
  headingTrail?: string;
}

/** The four Figma stat icons. Line icons that must inherit `currentColor`. */
export type StatIconName = "shield-safe" | "safebox" | "earth-pin" | "coin";

/**
 * `AboutStatsBlock["stats"][number]` is `{ value, label, caption, icon: ImageRef }`.
 * Two changes are needed:
 *   1. `suffix` — the design pairs a large italic numeral with a smaller upright
 *      suffix sharing its baseline ("14" + "+Years"). One `value` string cannot
 *      carry two type styles.
 *   2. `icon` is narrowed from `ImageRef` to a name. These are 28px stroke icons
 *      drawn inline so they inherit `currentColor` (brand red) and cost no
 *      request; an `ImageRef` would force a raster/`<img>` and a hard-coded fill.
 */
export interface AboutStat {
  /** Large italic numeral, e.g. "14" or "$3". */
  value: string;
  /** Upright suffix on the same baseline, e.g. "+Years". */
  suffix: string;
  /** Card title. Renders as an `<h3>`. (= `stats[].label` in types.ts) */
  label: string;
  /** Supporting sentence. (= `stats[].caption` in types.ts) */
  caption: string;
  icon: StatIconName;
}

export interface AboutStatsSection
  extends Omit<AboutStatsBlock, "header" | "stats"> {
  header: SplitHeading;
  stats: AboutStat[];
}

/**
 * `OfficeGridBlock` has no `cta`. The Figma places "Talk to Our Value Expert"
 * *below* the office grid, not inside the header, so it cannot use
 * `header.cta` (that renders inside the header stack).
 */
export interface OfficeGridSection extends OfficeGridBlock {
  cta?: Cta;
}

/* -------------------------------------------------------------------------- */
/* Block A — About + statistics                                               */
/* -------------------------------------------------------------------------- */

/**
 * TODO(client): TENURE CONFLICT — three different numbers describe the same
 * fact inside one section:
 *   • Figma stat 1 ............ "14+ Years"
 *   • Figma Block B body ...... "With over 16 years of expertise…"
 *   • live site stat 1 ........ "16 Years"
 *   • video thumbnail ......... "10-Year Anniversary"
 * The Figma value is shipped below because the design is the brief. This must
 * be reconciled to a single number before launch.
 */
export const aboutStats: AboutStatsSection = {
  _key: "home-about-stats",
  _type: "aboutStats",
  anchorId: "about",
  theme: "tinted",
  header: {
    overline: "About Us",
    // Spaces are intentional — see SplitHeading.
    heading: "Dedicated to ",
    headingAccent: "Preserving",
    headingTrail: " Your Wealth",
    body:
      "Gold and silver are timeless stores of value. Whether you’re hedging " +
      "against inflation, safeguarding your legacy, or seeking stability in " +
      "uncertain markets, we ensure your investments are secure and well-managed.",
    cta: {
      label: "Talk to Our Value Expert",
      // TODO(client): confirm the destination. The live site's equivalent CTA
      // reads "Talk To Our Precious Metals Experts" and opens the contact form;
      // this design renames it and uses it twice in one section.
      href: "#contact",
      style: "solid",
    },
  },
  stats: [
    {
      icon: "shield-safe",
      value: "14",
      suffix: "+Years",
      label: "Experience In the Precious Metals",
      caption:
        "Over 14 years of experience in the precious metals and secure logistics industries.",
    },
    {
      icon: "safebox",
      value: "16",
      suffix: "Vaults",
      label: "Storage Locations Worldwide",
      caption:
        "With over 16 storage locations – the most comprehensive storage program in the market.",
    },
    {
      icon: "earth-pin",
      value: "40",
      suffix: "+Countries",
      label: "Clients Served",
      // TODO(client): this stat is new in the redesign — it has no equivalent on
      // the live site. Verify the "40+ jurisdictions" figure before publishing.
      caption: "Family offices, advisors and HNWIs in 40+ jurisdictions.",
    },
    {
      icon: "coin",
      value: "$3",
      suffix: "BN+",
      label: "Traded Volume",
      caption: "Over USD 3BN worth of goods traded.",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* Block C — Office locations                                                 */
/* -------------------------------------------------------------------------- */

export const officeGrid: OfficeGridSection = {
  _key: "home-office-grid",
  _type: "officeGrid",
  anchorId: "offices",
  theme: "tinted",
  header: {
    // TODO(client): the Figma reads "Our Office Location" (singular) above four
    // offices. Kept verbatim; suggest "Our Office Locations".
    overline: "Our Office Location",
    // TODO(client): "Four Global Expertise," is not grammatical and looks like a
    // stale duplicate of Block B's "Global Expertise, & Personal Service".
    // Kept verbatim from the design. Suggested fix: "Four Global Offices,".
    heading: "Four Global Expertise,",
    headingAccent: "Personal Service.",
    // The Figma paragraph here is lorem ipsum and the live site has no
    // equivalent. This interim sentence states only what the office data below
    // already proves, so nothing unverified ships.
    // TODO(client): replace with approved marketing copy.
    body:
      "J. Rotbart & Co. operates from four offices — Hong Kong, Singapore, " +
      "Manila and Tel Aviv. Contact the team closest to you.",
  },
  offices,
  /**
   * TODO(client): the Figma shows a descriptive paragraph inside every office
   * card, but all four are lorem ipsum and the live site has no per-office copy
   * to fall back on. Left empty deliberately — the card renders without the
   * paragraph until real copy exists. Fill in as { "hong-kong": "…", … } using
   * the `_id` values from src/content/offices.ts.
   */
  blurbs: {},
  cta: {
    label: "Talk to Our Value Expert",
    href: "#contact", // TODO(client): confirm destination (see Block A).
    style: "solid",
  },
};
