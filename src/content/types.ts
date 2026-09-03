/**
 * Content model for the J. Rotbart & Co. site.
 *
 * These types are the contract between content and components.
 *
 * SCOPE (revised): page content — homepage sections, services, products,
 * offices, FAQ, navigation, footer — lives HERE, in version-controlled typed
 * modules, and is edited by a developer. It does NOT go into a CMS.
 * The CMS is scoped to blog posts only; see src/content/posts/ for that model.
 *
 * Two rules hold this together:
 *   1. A page is an ordered list of `Section`s drawn from a fixed union of block
 *      types. There is no free-form page builder and no raw-HTML field.
 *   2. Anything that repeats across the site (office, product, service, faq,
 *      testimonial, mint, vault, team member) is defined once and referenced,
 *      never copied.
 */

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

/** An image reference. `alt` is required — the CMS will not allow publishing without it. */
export interface ImageRef {
  /** Path under src/assets (build-time optimised) or a remote CDN URL. */
  src: string;
  /** Required. Use `decorative: true` for images that carry no information. */
  alt: string;
  /** Set true only when the image is purely decorative; renders alt="" + aria-hidden. */
  decorative?: boolean;
  width?: number;
  height?: number;
}

export interface Link {
  label: string;
  href: string;
  /** Set by the CMS when the destination is off-site; adds rel + external affordance. */
  external?: boolean;
}

/** "dark" is the always-black button ("Open an Account", "Load More"). */
export type CtaStyle = "solid" | "outline" | "ghost" | "arrow" | "dark";

export interface Cta extends Link {
  style?: CtaStyle;
}

export interface VideoRef {
  /** YouTube video ID. We never embed an iframe until the viewer asks for it. */
  youtubeId: string;
  title: string;
  /** Required: a real poster frame. Without one the facade cannot render. */
  poster: ImageRef;
  /**
   * The VIDEO's own aspect ratio, e.g. "16/9" or "9/16" for a Short. Distinct
   * from the tile the facade is drawn in — a square 320x320 testimonial tile
   * can hold a portrait Short. The lightbox sizes itself from this, so getting
   * it wrong means black bars. Defaults to 16/9.
   */
  aspect?: string;
}

/**
 * A run of body text with a restricted mark. The only marks are strong, em and
 * link — the same three the Faq model already permits. No raw HTML.
 */
export type TextRun = string | { text: string; strong?: boolean; em?: boolean; href?: string };

/**
 * One body paragraph. A plain string is the common case; the object form
 * carries marked runs (semibold lead-ins: "The tax position is clean.") and a
 * tonal override (the brand-red registration paragraph on the office page).
 * Every existing `string[]` body field stays assignable.
 */
export type Paragraph = string | { runs: TextRun[]; tone?: "default" | "accent" };

/**
 * Keys into the single inline-SVG icon map (src/components/primitives/Icon.astro).
 * 28px stroke glyphs drawn inline so they inherit `currentColor` — the pattern
 * AboutStats already used (`StatIconName` in about.ts, promoted here). Never an
 * ImageRef: an icon has no alt text of its own, its cell title is the
 * accessible name.
 */
export type IconName =
  | "shield-safe" | "safebox" | "earth-pin" | "coin" | "gold"
  | "check" | "truck" | "earth" | "bank" | "selling"
  | "linkedin" | "email" | "phone" | "pin"
  | "check-badge" | "arrow-back" | "chevron-down" | "pin-office";

/** A value/label pair with no icon and no caption (Office listing: "5 / Owner-operated offices"). */
export interface Stat {
  value: string;
  label: string;
}

/** A labelled value row (spec tables, hero terms, definition lists). */
export interface SpecRow {
  label: string;
  value: string;
}

/** Where a block draws its header relative to its content. */
export type HeaderLayout = "stacked" | "split";

// ---------------------------------------------------------------------------
// Referenced documents
// ---------------------------------------------------------------------------

export interface Office {
  _id: string;
  /** URL segment of the office page. Live: "buy-gold-hong-kong", "buy-gold-singapore". */
  slug: string;
  city: string;
  country: string;
  /** Full street address, as it should be displayed. */
  address: string[];
  phone?: string;
  /** E.164, used for the tel: href so display formatting stays free. */
  phoneHref?: string;
  email?: string;
  /** Licence / registration disclosures, shown in the contact directory. */
  disclosures?: string[];
  mapUrl?: string;
  /** Still optional: locationMap draws a pin only when real coordinates exist; the accessible list draws every office regardless. */
  geo?: { lat: number; lng: number };
  /**
   * `display` is what the page prints; `schema` is the schema.org form
   * ("Mo-Fr 09:30-17:30") for openingHoursSpecification.
   */
  openingHours?: { display: string; schema: string };
  /** Card photo for the office listing. */
  photo?: ImageRef;
  /** "Brink's", "Le Freeport", "Malca-Amit". */
  vaultPartner?: string;
  /** Draws the HEADQUARTERS chip. Exactly one office may set it. */
  headquarters?: boolean;
  /** "By appointment only" — rendered by officeVisit and used in FAQ copy. */
  appointmentOnly?: boolean;
}

/** A vault location. Office cities that also host a vault set `officeId`. */
export interface Vault {
  _id: string;
  city: string;
  country: string;
  operator?: string;
  geo: { lat: number; lng: number };
  officeId?: Office["_id"];
}

/** A person shown on an office (or About) page. Card variant is derived: photo + bio → photo card, otherwise compact card. */
export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: ImageRef;
  office: Office["_id"];
  links?: { linkedin?: string; email?: string; phoneHref?: string };
}

export type Metal = "gold" | "silver" | "platinum" | "palladium";

/** Refiner / mint. Replaces the free-text `Product.mint`; also lets the mint strip reference the same documents. */
export interface Mint {
  _id: string;
  name: string;
  /**
   * Where the mint is. Carries the COUNTRY at minimum ("Germany") because the
   * product card prints "name, location" — and the hero eyebrow's second half
   * ("Llantrisant, UK", "Ticino, Switzerland") when the town is known.
   */
  location?: string;
  accreditation?: string;
  logo?: ImageRef;
}

export interface Product {
  _id: string;
  name: string;
  metal: Metal;
  /** URL segment under the metal listing: /buy-<metal>/<slug>/. `href` is derived, never authored. */
  slug: string;
  /** Selects copy ("About this coin"), the Form fact, and the Singapore tax rule. Components never branch on it. */
  form: "bar" | "coin";
  /** Referenced mint document, never free text. */
  mint: Mint;
  purity: string;
  /** Single-line weight list for the card's third spec row. */
  variants: string;
  description: string;
  image: ImageRef;
  bestSeller?: boolean;
}

/** Everything the coin/bar template draws beyond the card. One document type for both forms. */
export interface ProductDetail extends Product {
  /** H1 as drawn, trailing period included. `name` stays the card title. */
  title: string;
  /** "1 oz Gold Britannia" — the quote band and enquiry prefill. */
  shortName: string;
  /** One-sentence hero summary. `description` stays the card blurb. */
  summary: string;
  sku?: string;
  /** "Sovereign coin", "Bar" — spec row "Product type". */
  productType: string;
  /** "999.9" */
  fineness: string;
  /** "31.10 g", "1,000 g" */
  grossWeight: string;
  /** Fine metal content in troy ounces: 1.000, 32.148. Drives "× 1.000 oz" and any live figure. */
  fineContentToz: number;
  /** Fact-strip Form value as drawn ("Coin", "Cast"). */
  formLabel: string;
  gallery: ImageRef[];
  video?: VideoRef;
  /** Settlement / Buyback rows. Site-wide defaults spread in by the content module; per-product override allowed. */
  terms: SpecRow[];
  priceNote?: string;
  /** "Why investors hold this" — independent paragraph columns (two drawn). */
  whyHold: Paragraph[][];
  /** Identity / Physical / Issue data. Tabs render only when >1 group has rows. */
  specGroups: { _key: string; label: string; rows: SpecRow[] }[];
  provenance: { body: Paragraph[]; media: ImageRef };
  premiumDrivers: { body: Paragraph[]; media: ImageRef };
  /** Only offices with compliance-approved wording are present. `body` is Paragraph[] to match `FeatureCell.body`, which the template maps it to. */
  taxTreatment: { office: Office["_id"]; icon: IconName; body: Paragraph[] }[];
  faqs: Faq[];
  /** Exactly three drawn. */
  related: Product["_id"][];
  seo: Seo;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  image: ImageRef;
  href: string;
  /** Italic red cross-links into the FAQ. */
  faqTeasers?: Link[];
  /** Marker for feature cells that reference this service. */
  icon?: IconName;
  /** Short blurb for feature cells; `description` is the row/card paragraph. */
  teaser?: string;
}

export interface Faq {
  _id: string;
  question: string;
  /** Plain paragraphs. Rich text in Sanity, with marks restricted to link/em/strong. */
  answer: string[];
}

export interface Testimonial {
  _id: string;
  quote: string;
  name: string;
  organisation: string;
  portrait: ImageRef;
  video?: VideoRef;
}

export type ArticleCategory = "Blog" | "Press" | "Event" | "News";

export interface Article {
  _id: string;
  title: string;
  category: ArticleCategory;
  /** ISO 8601. Formatted for display at render time, never stored pre-formatted. */
  date: string;
  excerpt: string;
  image: ImageRef;
  href: string;
}

export interface LogoItem {
  name: string;
  image: ImageRef;
  href?: string;
}

// ---------------------------------------------------------------------------
// Section blocks — the fixed union
// ---------------------------------------------------------------------------

interface BlockBase {
  /** Stable key for React/Astro list rendering and for anchor links. */
  _key: string;
  /** Optional id used as a scroll anchor (e.g. "contact"). */
  anchorId?: string;
  /** Surface treatment. Maps to a background token, never a raw colour. */
  theme?: "light" | "tinted" | "dark";
  /**
   * Set on a block that sits on the SAME surface as its previous sibling.
   * "default" seams to one 96px gap (lg) / 64 (md) / 48 (base); "tight" to
   * 64 / 48 / 32. Absent = the block keeps its own top padding (two different
   * surfaces meet with 96 + 96, as every Figma frame draws it).
   * Explicit on purpose: the homepage About/Expertise/Offices trio seams with
   * the FRAME_SEAM class and must not also collapse under a generic same-theme
   * rule. The CSS lives in src/styles/global.css (`[data-seam]`).
   */
  seam?: "default" | "tight";
}

export interface HeroBlock extends BlockBase {
  _type: "hero";
  headingLead: string;
  headingAccent: string;
  body: string;
  cta: Cta;
  quickLinks: { label: string; sublabel: string; href: string; icon: ImageRef }[];
  accreditationLabel: string;
  accreditations: LogoItem[];
  media: { photo: ImageRef; cutout: ImageRef; chart: ImageRef };
}

export interface LogoStripBlock extends BlockBase {
  _type: "logoStrip";
  groups: { label: string; logos: LogoItem[] }[];
  /** Accessible name of the landmark. */
  label?: string;
}

/** One run of a heading; `accent` = Playfair italic in the accent tone. */
export interface HeadingRun {
  text: string;
  accent?: boolean;
}

export interface SectionHeading {
  overline?: string;
  /** Plain-text heading. When `headingRuns` is set this must equal their concatenation — it is what aria, schema and <title>-like uses read. */
  heading: string;
  /** Trailing italic run (existing contract; FaqAccordion additionally accepts it as a run INSIDE `heading`). */
  headingAccent?: string;
  /** Roman text after the accent, for a mid-string accent ("Buy *Gold* and Precious Metals"). */
  headingTail?: string;
  /** General form for a leading accent or several accents. When present, rendered instead of heading/headingAccent/headingTail. Spaces are baked into the run strings. */
  headingRuns?: HeadingRun[];
  /** May be several paragraphs (Buy PM intro, HK services header). */
  body?: string | string[];
  cta?: Cta;
}

export interface ProductGridBlock extends BlockBase {
  _type: "productGrid";
  /** Absent = cards only (Buy PM best sellers). With `header.cta` of style "arrow" the link sits at the heading's right (product "Often held alongside"). */
  header?: SectionHeading;
  /** `image` is an optional artwork-only backdrop. It must never be a
   *  pre-composited banner with type baked in — the copy is live text. */
  promo?: { image?: ImageRef; heading: string; body: string; cta: Cta };
  products: Product[];
}

export interface TestimonialBandBlock extends BlockBase {
  _type: "testimonialBand";
  testimonial: Testimonial;
}

export interface SocialFeedBlock extends BlockBase {
  _type: "socialFeed";
  header: SectionHeading;
  /** Items are fetched at build time; the feed never blocks render. */
  items: Article[];
}

export interface AboutStatsBlock extends BlockBase {
  _type: "aboutStats";
  header: SectionHeading;
  stats: { value: string; label: string; caption: string; icon: ImageRef }[];
}

export interface MediaWithTextBlock extends BlockBase {
  _type: "mediaWithText";
  header: SectionHeading;
  /** Paragraph[] — a plain string[] is still assignable. */
  body: Paragraph[];
  media: VideoRef | ImageRef;
  mediaSide: "left" | "right";
  /** Media aspect as "w/h". Homepage 668/392; product pages 555/416; office page 431/575 and 679/509. */
  ratio?: string;
  faqTeasers?: Link[];
  /** <dl> under the body (Buy PM "Value" / "Liquidity"). */
  definitions?: { term: string; description: string }[];
  cta?: Cta;
}

export interface OfficeGridBlock extends BlockBase {
  _type: "officeGrid";
  header: SectionHeading;
  offices: Office[];
  /** Per-office marketing copy, keyed by office id. */
  blurbs?: Record<string, string>;
}

export interface ServicesRowsBlock extends BlockBase {
  _type: "servicesRows";
  /** Optional: the Service listing opens with a pageHero and draws the rows headerless. */
  header?: SectionHeading;
  /** Accessible name of the list when `header` is absent. */
  label?: string;
  services: Service[];
}

export interface ServiceCardGridBlock extends BlockBase {
  _type: "serviceCardGrid";
  /** Optional (Service listing has no "More Services" sub-header). */
  header?: SectionHeading;
  label?: string;
  services: Service[];
}

export interface CtaBandBlock extends BlockBase {
  _type: "ctaBand";
  /** "Free initial consultation". */
  overline?: string;
  heading: string;
  body?: string;
  cta: Cta;
  /** Second stacked button, sized to the widest label ("Open an Account", style "dark"). */
  secondaryCta?: Cta;
  helperLinks?: { prefix: string; link: Link }[];
  badgeLabel?: string;
  badges?: LogoItem[];
  /** "band" = tinted, borderless (homepage; Service listing A). "card" = surface + 1px border-primary + 8px brand-red accent bar + rule between columns (Service listing B). */
  variant?: "band" | "card";
}

export interface NewsGridBlock extends BlockBase {
  _type: "newsGrid";
  header: SectionHeading;
  /** "auto" pulls the latest N; "manual" uses the picked list. */
  source: "auto" | "manual";
  limit?: number;
  articles: Article[];
}

export interface VideoGridBlock extends BlockBase {
  _type: "videoGrid";
  header: SectionHeading;
  videos: VideoRef[];
}

export interface FaqAccordionBlock extends BlockBase {
  _type: "faqAccordion";
  header: SectionHeading;
  faqs: Faq[];
  footer?: { heading: string; body?: string; cta: Cta };
}

export interface ContactFormBlock extends BlockBase {
  _type: "contactForm";
  header: SectionHeading;
  offices: Office[];
  attribution: { label: string; options: string[] };
  consent: string;
  submitLabel: string;
}

export interface MintStripBlock extends BlockBase {
  _type: "mintStrip";
  label: string;
  logos: LogoItem[];
}

// ----- Blocks introduced for the service, product and office pages ----------

/**
 * The opener of every non-homepage page: the <h1>, one paragraph, and any
 * of a check-bulleted proof list, hairline stat cells, "Member of" marks, one
 * CTA and one media composition. Absorbs serviceHero (Buy PM), splitHero
 * (Office HK), the Service listing page header and the Office listing intro.
 */
export interface PageHeroBlock extends BlockBase {
  _type: "pageHero";
  header: SectionHeading;
  /** Accent tone of the H1's italic run. Service pages draw text-tertiary, the office hero brand-red. */
  accentTone?: "muted" | "brand";
  /** "16 vault locations" … with the 16px check glyph. */
  proofPoints?: string[];
  stats?: Stat[];
  accreditationLabel?: string;
  accreditations?: LogoItem[];
  cta?: Cta;
  /** Absent = text-only opener. */
  media?:
    | { kind: "split"; image: ImageRef }
    | { kind: "composite"; photo: ImageRef; cutout: ImageRef };
}

/**
 * A contained callout: 8px brand-red bar, one heading, one action. The
 * shape is shared with the `aside` slot of proseSection/featureGrid; the block
 * form below adds the standalone layout options.
 */
export interface CalloutCard {
  heading: string;
  /** style "solid"/"dark" = button at the right; "arrow" = circled arrow (see ctaLayout). */
  cta: Cta;
}

/**
 * Standalone callout. Absorbs ctaCard (Buy PM ×7), inlineCta (Office
 * listing), calloutBand (Office HK ×2) and quoteBand (Coin/Bar) — all are
 * heading + one CTA; only the surface and type scale differ.
 */
export interface CalloutBandBlock extends BlockBase, CalloutCard {
  _type: "calloutBand";
  /** "strip" (default): contained, H3, accent bar; theme light|tinted. "display": full-bleed always-black band, H2 in always-white, no bar (theme "dark"). */
  variant?: "strip" | "display";
  /** strip only. "hug" wraps the content instead of spanning the container (Buy PM steps/comparison callouts). */
  width?: "full" | "hug";
  /** strip only. 1px border-primary on a light surface (Buy PM news callout). */
  bordered?: boolean;
  /** arrow CTAs only. "inline" = 32px circled arrow at the right, whole band is the link. "stacked" = button-text link under the heading. */
  ctaLayout?: "inline" | "stacked";
}

/**
 * Header + prose. Absorbs sectionIntro (Buy PM), splitIntro (Office HK)
 * and proseColumns (Coin/Bar). Header-only + cta is the Buy PM intro; split
 * with `aside` is "Why Product Origin Matters"; stacked with two columns is
 * "Why investors hold this".
 */
export interface ProseSectionBlock extends BlockBase {
  _type: "proseSection";
  header: SectionHeading;
  /** "split": header in the left 2/5, columns in the right 3/5. "stacked": header above, columns side by side beneath. */
  layout: HeaderLayout;
  /** Independent paragraph flows, one entry per column. Never CSS multi-column; DOM order is column order. */
  columns?: Paragraph[][];
  cta?: Cta;
  /** Callout card in the right column (split) or under the columns (stacked). */
  aside?: CalloutCard;
}

/** Marker before a feature cell's title. */
export type FeatureMarker = { kind: "icon"; icon: IconName } | { kind: "metal"; metal: Metal };

/** One cell of a featureGrid. */
export interface FeatureCell {
  _key: string;
  marker?: FeatureMarker;
  title: string;
  /** Eyebrow line under the title (metal cards: "The world's oldest store of value"). Rendered with the `eyebrow` utility, tertiary. */
  eyebrow?: string;
  body: Paragraph[];
  link?: Cta;
  /** The document this cell was built from, so hrefs, titles and schema derive from one place. */
  ref?: { service: Service["_id"] } | { office: Office["_id"] };
}

/**
 * A set of marker + title + body (+ link) cells. Absorbs iconFeatureRows
 * and linkCardGrid (Buy PM), serviceChecklist (Office HK) and
 * taxTreatmentGrid / jurisdictionGrid (Coin/Bar): same cell anatomy, three
 * frames.
 */
export interface FeatureGridBlock extends BlockBase {
  _type: "featureGrid";
  header?: SectionHeading;
  /** "split": header (and `aside`, pinned to its bottom) in a 410px left column, cells as one list on the right. */
  layout: HeaderLayout;
  /** Cell columns. split layout is always 1. */
  columns: 1 | 2 | 4;
  /** "none": bare rows (Buy PM why-choose). "rules": hairline above each row, no box (HK services). "boxed": 1px outer border + dividers, cell padding 32 (metals, related services, tax). */
  frame: "none" | "rules" | "boxed";
  cells: FeatureCell[];
  /** Paragraphs after the cells, in the cell column (Buy PM bars & coins). */
  afterBody?: Paragraph[];
  aside?: CalloutCard;
}

/** Numbered steps. Numbers are rendered ("01"…), never authored. */
export interface ProcessStepsBlock extends BlockBase {
  _type: "processSteps";
  header: SectionHeading;
  /** "split": overline + heading left, body right (Buy PM). "stacked": HK. */
  headerLayout?: HeaderLayout;
  steps: { title: string; body: Paragraph[] }[];
  cta?: Cta;
}

/** Bank / gold shops / J. Rotbart table. Rendered as a real <table>; the highlighted column is brand-950. */
export interface ComparisonTableBlock extends BlockBase {
  _type: "comparisonTable";
  header: SectionHeading;
  headerLayout?: HeaderLayout;
  columns: { label: string; highlighted?: boolean }[];
  rows: { label: string; cells: string[] }[];
}

/** One metal's tab in the product listing. Derived at build from the product collection. */
export interface MetalTab {
  metal: Metal;
  label: string;
  count: number;
  href: string;
  current?: boolean;
}

/** The per-metal product listing page body. */
export interface ProductListingBlock extends BlockBase {
  _type: "productListing";
  metal: Metal;
  /** Rendered as the <h1>. */
  header: SectionHeading;
  tabs: MetalTab[];
  /** Omit to hide the control. */
  sort?: { label: string; options: { value: "az" | "za"; label: string }[] };
  /** "Gold Bars & Coins." */
  metalHeading: string;
  /** Every product for this metal, pre-sorted, all in the HTML. */
  products: Product[];
  /** Load More reveals the next N client-side; button omitted when products fit. */
  pageSize?: number;
  loadMoreLabel: string;
  badgeLabel: string;
  ctaLabel: string;
  specLabels: { mint: string; purity: string; variants: string };
  metalLabels: Record<Metal, string>;
}

/** Template-fixed strings of the product hero. Live in one content module, not per product. */
export interface ProductHeroLabels {
  badge: string;
  facts: { metal: string; form: string; fineness: string; grossWeight: string };
  /** "%s spot" — %s = XAU/XAG/XPT/XPD, derived from metal. */
  spot: string;
  liveFeed: string;
  gallery: { zoom: string; previous: string; next: string; play: string };
}

/** Product page opener: back link, gallery, facts, terms card, CTA. One block for bars and coins. */
export interface ProductHeroBlock extends BlockBase {
  _type: "productHero";
  backLink: Link;
  product: ProductDetail;
  /** "formula" prints "XAU spot × 1.000 oz" (coin frame). "live" also fetches /api/spot and prints spot × fineContentToz client-side (bar frame's static US$4,400 must not ship). "none" hides the row. TODO(client). */
  priceDisplay: "formula" | "live" | "none";
  labels: ProductHeroLabels;
  cta: Cta;
}

/** Tabbed key/value table. Bar = Identity + Physical; Coin adds Issue data; tabs render only when >1 group has rows. */
export interface SpecTableBlock extends BlockBase {
  _type: "specTable";
  header: SectionHeading;
  groups: ProductDetail["specGroups"];
}

/** Photo office cards; offices[0] is the featured card. Distinct from the homepage's hairline officeGrid. */
export interface OfficeCardGridBlock extends BlockBase {
  _type: "officeCardGrid";
  header?: SectionHeading;
  offices: Office[];
  /** Per-office copy that is not an office fact, keyed by Office._id. `cta` is absent for offices without a built page. */
  cards: Record<string, { cta?: Cta; badge?: string }>;
  rowLabels: { phone: string; vaultPartner: string };
}

/** World map with crown office pins and vault dots, geo-driven. Always paired with an accessible list of every location. */
export interface LocationMapBlock extends BlockBase {
  _type: "locationMap";
  header: SectionHeading;
  legend: { office: string; vault: string };
  /** "legend" = static key; "filter" = toggles pin kinds (needs aria-pressed). Figma draws no selected state. TODO(client). */
  control: "legend" | "filter";
  offices: Office[];
  vaults: Vault[];
  /** Tooltip / list captions. */
  captions: { officeAndVault: string; office: string; vault: string };
}

/** Team roster. Featured card first, then photo cards, then compact cards (variant derived from data). */
export interface TeamGridBlock extends BlockBase {
  _type: "teamGrid";
  header: SectionHeading;
  featured?: TeamMember;
  members: TeamMember[];
  /** Accessible names for the icon-only links; "%s" = the member's name. */
  linkLabels: { linkedin: string; email: string; phone: string };
}

/** "Visit us" block: intro, address card from the Office document, appointment note, CTA, map panel. */
export interface OfficeVisitBlock extends BlockBase {
  _type: "officeVisit";
  header: SectionHeading;
  office: Office;
  /** "By appointment only" — brand-red Subtitle. */
  appointmentNote?: string;
  cta: Cta;
  /**
   * A static map image plus a directions link to `office.mapUrl`. No
   * third-party embed. `image` is optional: until an office has its own map
   * artwork the panel renders without it (flat surface, marker card, link).
   */
  map: { image?: ImageRef; directionsLabel: string };
}

export type Section =
  | HeroBlock
  | LogoStripBlock
  | ProductGridBlock
  | TestimonialBandBlock
  | SocialFeedBlock
  | AboutStatsBlock
  | MediaWithTextBlock
  | OfficeGridBlock
  | ServicesRowsBlock
  | ServiceCardGridBlock
  | CtaBandBlock
  | NewsGridBlock
  | VideoGridBlock
  | FaqAccordionBlock
  | ContactFormBlock
  | MintStripBlock
  | PageHeroBlock
  | CalloutBandBlock
  | ProseSectionBlock
  | FeatureGridBlock
  | ProcessStepsBlock
  | ComparisonTableBlock
  | ProductListingBlock
  | ProductHeroBlock
  | SpecTableBlock
  | OfficeCardGridBlock
  | LocationMapBlock
  | TeamGridBlock
  | OfficeVisitBlock;

// ---------------------------------------------------------------------------
// Global / page
// ---------------------------------------------------------------------------

/** The site areas a top-level menu item can stand for; SiteLayout's `currentSection` marks one as current. */
export type NavSection = "services" | "products" | "news" | "about";

/** An item inside a mega-menu panel. */
export interface NavChild extends Link {
  /** One-line explanation shown under the label. */
  description?: string;
  /** Key into the icon map in TopNavigation.astro. */
  icon?: string;
}

/** The promo rail on the right of a mega-menu panel. */
export interface NavFeature {
  eyebrow?: string;
  heading: string;
  body?: string;
  cta: Link;
  /** "red" = brand-red panel, "tinted" = warm bg-primary panel. */
  theme?: "red" | "tinted";
}

export interface NavItem extends Link {
  /** Which site area this item stands for, so a page can mark it current. */
  section?: NavSection;
  /** Label above the panel grid, e.g. "ALL SERVICES". */
  panelLabel?: string;
  /** Grid columns for the panel's item list. */
  columns?: 2 | 3;
  children?: NavChild[];
  feature?: NavFeature;
}

export interface GlobalNavigation {
  utilityLinks: { label: string; href: string; icon: string }[];
  languages: {
    label: string;
    href: string;
    current?: boolean;
    external?: boolean;
    /** Path to a flag SVG shown beside the label. */
    flag?: string;
  }[];
  menu: NavItem[];
  showPriceTicker: boolean;
}

export interface SiteFooter {
  tagline?: string;
  columns: { heading: string; links: Link[] }[];
  newsletter: { heading: string; body?: string; placeholder: string; cta: string; consent: string };
  social: { platform: string; href: string; icon: string }[];
  legalLinks: Link[];
  copyright: string;
}

export interface Seo {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: ImageRef;
  noindex?: boolean;
}

export interface Page {
  _id: string;
  slug: string;
  seo: Seo;
  sections: Section[];
}
