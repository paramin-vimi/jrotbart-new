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
 *      testimonial) is defined once and referenced, never copied.
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

export type CtaStyle = "solid" | "outline" | "ghost" | "arrow";

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

// ---------------------------------------------------------------------------
// Referenced documents
// ---------------------------------------------------------------------------

export interface Office {
  _id: string;
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
  geo?: { lat: number; lng: number };
  openingHours?: string;
}

export type Metal = "gold" | "silver" | "platinum" | "palladium";

export interface Product {
  _id: string;
  name: string;
  metal: Metal;
  /** Refiner / mint, e.g. "Heraeus". Referenced, not free text, in Sanity. */
  mint: string;
  purity: string;
  description: string;
  image: ImageRef;
  bestSeller?: boolean;
  href?: string;
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  image: ImageRef;
  href: string;
  /** Italic red cross-links into the FAQ. */
  faqTeasers?: Link[];
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
}

export interface SectionHeading {
  overline?: string;
  heading: string;
  headingAccent?: string;
  body?: string;
  cta?: Cta;
}

export interface ProductGridBlock extends BlockBase {
  _type: "productGrid";
  header: SectionHeading;
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
  body: string[];
  media: VideoRef | ImageRef;
  mediaSide: "left" | "right";
  faqTeasers?: Link[];
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
  header: SectionHeading;
  services: Service[];
}

export interface ServiceCardGridBlock extends BlockBase {
  _type: "serviceCardGrid";
  header: SectionHeading;
  services: Service[];
}

export interface CtaBandBlock extends BlockBase {
  _type: "ctaBand";
  heading: string;
  body?: string;
  cta: Cta;
  helperLinks?: { prefix: string; link: Link }[];
  badgeLabel?: string;
  badges?: LogoItem[];
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
  footer?: { heading: string; cta: Cta };
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
  | MintStripBlock;

// ---------------------------------------------------------------------------
// Global / page
// ---------------------------------------------------------------------------

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
