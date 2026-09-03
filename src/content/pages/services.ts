import type { CtaBandBlock, Link, PageHeroBlock, Seo, TestimonialBandBlock } from "@content/types";
import type { ServiceCardGridSection, ServicesRowsSection } from "@content/homepage/services";
import { toCardEntry, toRowEntry } from "@content/homepage/services";
import {
  authenticationAndAssaying,
  buySell,
  consultationAndAdvisory,
  globalShipping,
  globalStorage,
  lendingAndFinance,
  safeDepositBox,
  wealthPreservation,
} from "@content/services";
import { primaryEmail } from "@content/offices";
import { testimonialOne } from "@content/testimonials";

/**
 * Service listing — /services/.
 *
 * Figma: frame `Service - Listing` 10976:21516; the page-specific blocks are
 * the children of 10976:21519 (a 96-padded surface with a 64px rhythm), then
 * the shared testimonial band 10976:21607 and the site tail. Live URL
 * jrotbart.com/services/ (captured 2026-09-03). Copy source: SP
 * build-plan/texts/svc-listing.txt, cross-checked against the live page.
 *
 * Block order, top to bottom (rendered by src/pages/services.astro):
 *   1. pageHero        10976:21520  text-only opener, 454-wide column
 *   2. servicesRows    10976:21524–21554  headerless, seamed 64 under the hero
 *   3. serviceCardGrid 10976:21564  headerless, seamed 64 under the rows
 *   4. ctaBand         10976:21597  "card" variant (variant B), seamed 64
 *   5. testimonialBand 10976:21607
 *   then the tail (mint strip + contact) from SiteLayout.
 *
 * The eight Service DOCUMENTS live in src/content/services.ts and the row /
 * card composition (cut-out subjects, "Explore" label) in
 * src/content/homepage/services.ts; this module only assembles them.
 *
 * Placeholder register for this page
 * ----------------------------------
 * • 10976:21522 "We Offers Comprehensive…" → "We Offer" (typo; the live site
 *   already reads "We Offer"). Shipped corrected, as homepage/services.ts does.
 * • 10976:21523 "needs.We ensure" → "needs. We ensure" (missing space restored).
 * • 10976:21601 "which of the nine services above" — the page lists EIGHT.
 *   Shipped as "eight" with TODO(client) below.
 * • 10976:21558 the lending row repeats the shipping row's FAQ teasers — the
 *   document in services.ts carries the two real lending questions.
 * • 10976:21589 CTA band variant A (tinted, no rule, no helper line) is NOT
 *   built: the frame draws two consecutive designs of the same band and
 *   variant B (10976:21597) is the one that carries the full content.
 * • 10976:21605 the helper line exposes a mailto: — TODO(client) below.
 * • "Open an Account" → /open-account/ (live), whereas the homepage band
 *   sends "Get Started" to /register/ (also live) — TODO(client) below.
 * • 10976:21607 the Albert Cheng testimonial again — TODO(client) below.
 * • Six of the eight service hrefs are not rebuilt yet (only
 *   /buying-precious-metals/ ships in this phase); they stay pointed at the
 *   live URLs, see services.ts.
 */

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------

export const seo: Seo = {
  // Live: "Services - J.Rotbart & Co". Brand suffix normalised to the site's
  // "| J. Rotbart & Co." pattern.
  title: "Services | J. Rotbart & Co.",
  // TODO(client): meta description — the live page has none of its own; this
  // is the opener's first sentence, which is the best available stand-in.
  description:
    "J. Rotbart & Co. are bullion experts offering a full range of services to meet all your precious metals needs.",
};

/** Breadcrumb trail (JSON-LD only; nothing is drawn). Paths are root-relative; the route makes them absolute. */
export const breadcrumb: Link[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services/" },
];

// ---------------------------------------------------------------------------
// 1 — Page hero (10976:21520)
// ---------------------------------------------------------------------------

export const servicesHero: PageHeroBlock = {
  _key: "services-hero",
  _type: "pageHero",
  header: {
    overline: "Services",
    heading: "We Offer Comprehensive Precious Metals Services",
    headingRuns: [
      { text: "We Offer " },
      { text: "Comprehensive", accent: true },
      // The line break is AUTHORED in the Figma text node (10976:21522
      // characters contain "\n"); PageHero renders the H1 pre-line so it holds.
      { text: "\nPrecious Metals Services" },
    ],
    body: "J. Rotbart & Co. are bullion experts offering a full range of services to meet all your precious metals needs. We ensure your investment is executed and maintained to the highest level of quality and professionalism.",
  },
};

// ---------------------------------------------------------------------------
// 2 — The four primary service rows (10976:21524–21554), headerless
// ---------------------------------------------------------------------------

export const servicesRows: ServicesRowsSection = {
  _key: "services-rows",
  _type: "servicesRows",
  // Headerless: the pageHero above carries the page's H1, so the rows start
  // at the top of the block and the landmark is named by `label`.
  label: "Our services",
  // Drawn 64px under the hero on the same surface (frame gap, 10976:21519).
  seam: "tight",
  services: [buySell, globalStorage, globalShipping, lendingAndFinance].map(toRowEntry),
};

// ---------------------------------------------------------------------------
// 3 — The four secondary service cards (10976:21564), headerless
// ---------------------------------------------------------------------------

export const serviceCards: ServiceCardGridSection = {
  _key: "services-cards",
  _type: "serviceCardGrid",
  // No "More Services We Offer" sub-header on this frame; the label is the
  // landmark's accessible name only.
  label: "More services",
  seam: "tight",
  services: [
    consultationAndAdvisory,
    safeDepositBox,
    wealthPreservation,
    authenticationAndAssaying,
  ].map(toCardEntry),
};

// ---------------------------------------------------------------------------
// 4 — "Free initial consultation" card (10976:21597, variant B)
// ---------------------------------------------------------------------------

export const consultationBand: CtaBandBlock = {
  _key: "services-consultation",
  _type: "ctaBand",
  theme: "light",
  variant: "card",
  seam: "tight",
  overline: "Free initial consultation",
  heading: "Not sure which service to start with?",
  // TODO(client): the frame reads "which of the nine services above apply";
  // the page lists eight. Shipped as "eight" — confirm the wording (and the
  // "at least three" claim).
  body:
    "Speak to our expert about your goal and they will walk you through which of the eight services above apply — most clients end up using at least three.",
  // TODO(client): destination and wording — three variants of this CTA exist
  // site-wide ("Speak With a Value Expert" / "Talk to Our Value Expert" /
  // "Speak with a Value Expert"). Points at the contact section on this page.
  cta: { label: "Speak With a Value Expert", href: "#contact", style: "solid" },
  // TODO(client): /open-account/ is the live "Open an account" page, but the
  // homepage band's "Get Started" goes to /register/ (also live). One
  // destination for opening an account, please. Neither page is rebuilt yet.
  secondaryCta: { label: "Open an Account", href: "/open-account/", style: "dark" },
  helperLinks: [
    {
      prefix: "Or email us directly at",
      // TODO(client): mailto exposure — a bare mailto: on a public page is
      // harvested by spam bots; confirm you want the address linked here.
      link: { label: primaryEmail, href: `mailto:${primaryEmail}` },
    },
  ],
};

// ---------------------------------------------------------------------------
// 5 — Testimonial band (10976:21607)
// ---------------------------------------------------------------------------

export const testimonial: TestimonialBandBlock = {
  ...testimonialOne,
  // Page-scoped key: the same band also renders on the homepage.
  _key: "services-testimonial",
  // TODO(client): the frame draws the Albert Cheng band here as on every
  // page; a page-specific (second) testimonial is needed.
};
