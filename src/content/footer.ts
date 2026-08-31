import type { ImageRef, SiteFooter } from "./types";

/**
 * Global site footer — Figma node 9813:6346 (instance of a shared component).
 *
 * A global singleton, not page-scoped: it renders identically on every route,
 * which is why it lives here rather than under `content/homepage/`.
 *
 * Two structural changes versus the current WordPress footer:
 *
 *  1. NO OFFICE / CONTACT BLOCK. The live footer repeats all four offices with
 *     addresses and phone numbers. The new design drops that entirely — office
 *     detail now lives only in the Contact section immediately above.
 *     TODO(client): confirm this de-duplication is intentional. It is a real
 *     loss of on-every-page NAP data, which matters for local SEO; the
 *     LocalBusiness JSON-LD in `lib/schema.ts` covers the machine-readable
 *     half, but human visitors on a deep page lose the addresses.
 *
 *  2. PRESS AND BLOG FOLD INTO ONE "News & Events" DESTINATION, matching the
 *     live site's /blogs-events-press/ index.
 */

// ---------------------------------------------------------------------------
// Brand lockup
// ---------------------------------------------------------------------------

/**
 * TODO(assets): replace with the Figma export `logo-jrotbart-wordmark.svg`
 * (279.8 × 40 — crown mark + wordmark + hairline rule + "PRECIOUS METALS").
 *
 * The interim source is the live site's only white lockup. It is the 10-year
 * anniversary mark and is a completely different shape (2.56:1 stacked, versus
 * the design's 7:1 horizontal), so the footer brand area renders roughly
 * 102 × 40 instead of the comp's 280 × 40 and will keep looking narrow until
 * the SVG lands. Dimensions below are the intrinsic size of the 767px srcset
 * variant, so the aspect box is correct and nothing shifts.
 *
 * Re-checked against jrotbart.com on 2026-08-31: the live theme ships exactly
 * one lockup (`themes/jrotbart/img/logo_10years.png`) and no horizontal white
 * `J.ROTBART & CO. / PRECIOUS METALS` mark in any format, so there is no
 * better interim substitute to reach for — this one is blocked on the export.
 * `SiteFooter` sizes the lockup by height (`h-10`), so dropping in the real
 * 279.801 × 40 SVG is a one-line swap with no layout change.
 */
export const footerLogo: ImageRef = {
  // Figma "Group 9643" from the footer instance, exported as SVG: crown +
  // wordmark + rule + PRECIOUS METALS, all white for the black footer.
  // Replaces a 767x300 raster from the live site that rendered soft and
  // carried the 10-year anniversary lockup the design does not use here.
  src: "/figma/logo-white.svg",
  alt: "J. Rotbart & Co. — Precious Metals",
  width: 280,
  height: 40,
};

// ---------------------------------------------------------------------------
// Newsletter plumbing
// ---------------------------------------------------------------------------

/**
 * Where a newsletter signup is POSTed.
 *
 * TODO(client): this is a NEW email-capture endpoint — nothing on the current
 * homepage captures email. The live site posts to a Mailjet widget iframe
 * (`https://app.mailjet.com/widget/iframe/2ip8/LMk`) which currently 404s, so
 * every signup made on jrotbart.com today is being silently discarded. Decide:
 * repair Mailjet, or move the list to HubSpot alongside the contact form
 * (portal 7115897). See NEWSLETTER_ENDPOINT in `.env.example`.
 *
 * Until this is a real URL the form validates and reports, but never submits —
 * it must not fake a success it cannot deliver. The consent line below is an
 * explicit consent statement, so whatever endpoint we land on has to store the
 * consent text and a timestamp with the address, not just the address.
 */
export const NEWSLETTER_ENDPOINT = "";

/**
 * Form outcome copy.
 *
 * NOT IN THE DESIGN — the comp draws the empty/placeholder state only, with no
 * slot for success, error or validation messaging (design spec §9). These
 * strings are ours; they render into a live region under the input.
 * TODO(client): approve this wording.
 */
export interface NewsletterMessages {
  /** Shown when the endpoint constant is still empty (pre-launch only). */
  pending: string;
  success: string;
  error: string;
  /** Client-side validation fallback for browsers with no native bubble. */
  invalid: string;
}

export const newsletterMessages: NewsletterMessages = {
  pending:
    "Newsletter sign-up is not connected yet. Please email info@jrotbart.com and we will add you to the list.",
  success: "Thank you — please check your inbox to confirm your subscription.",
  error:
    "Sorry, we could not sign you up just now. Please try again, or email info@jrotbart.com.",
  invalid: "Please enter a valid email address.",
};

// ---------------------------------------------------------------------------
// The footer
// ---------------------------------------------------------------------------

export const footer: SiteFooter = {
  /**
   * Column headings are NOT drawn in the design — the eight links sit in two
   * bare 320px columns. They are kept because `SiteFooter.columns[].heading`
   * requires them, and they earn their place as the accessible name of each
   * <nav> landmark, so a screen-reader user can tell the two lists apart.
   * They are never painted.
   * TODO(client): approve these two invisible labels, or tell us you want them
   * visible (the design has no type style for a footer column heading).
   */
  columns: [
    {
      heading: "Explore",
      links: [
        { label: "Home", href: "/" },
        { label: "Services", href: "/services/" },
        {
          label: "Products",
          href: "/products-buy-gold-silver-platinum-palladium/",
        },
        // Live site keeps press, blog and events on one index; the design's
        // single "News & Events" link maps straight onto it.
        { label: "News & Events", href: "/blogs-events-press/" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About us", href: "/about-us-gold-and-silver/" },
        { label: "FAQs", href: "/faq/" },
        // Matches the header utility link, which also targets the on-page
        // Contact section rather than the legacy /contact-us page.
        { label: "Contact Us", href: "#contact" },
        // The design gives this no button/CTA treatment even though it is the
        // primary conversion action on the live site.
        // TODO(client): confirm "Open an account" is meant to read as a plain
        // sitemap link here, and is not a missed style.
        { label: "Open an account", href: "/open-account/" },
      ],
    },
  ],

  newsletter: {
    /** Rendered uppercase by the OVERLINE style, not stored uppercase. */
    heading: "Subscribe",
    /** Doubles as the visually-hidden <label> for the email field. */
    placeholder: "Your email",
    /** Accessible name of the icon-only arrow submit. */
    cta: "Subscribe",
    consent:
      "By subscribing, you consent to receiving our newsletter, including promotional activities, updates, and other relevant content from J. Rotbart & Co.",
    // `body` intentionally unset — the design draws no supporting sentence.
  },

  /**
   * Social set is EXACTLY as designed: Instagram, Messenger, Twitter, YouTube.
   *
   * TODO(client): two flags on this set, both raised in the design spec.
   *  a) LINKEDIN IS MISSING. It is the brand's showcased channel — the
   *     homepage carries a whole LinkedIn feed section — yet it is absent
   *     here, while Messenger (which the brand does not appear to use) is
   *     present. This reads like an uncurated stock icon set. The real account
   *     is https://hk.linkedin.com/company/j.rotbart-&-co; add the entry below
   *     and we will draw it.
   *  b) MESSENGER HAS NO VERIFIED DESTINATION. No Facebook or Messenger
   *     account is linked anywhere on the current site, so the handle below is
   *     a guess. Confirm it or drop the icon — we should not ship a social
   *     icon that lands on a 404.
   *
   * `icon` is a key into the inline SVG map in SiteFooter.astro (the marks are
   * monochrome, so they are inlined and inherit currentColor for hover states
   * rather than being fetched as six separate files).
   */
  social: [
    {
      platform: "Instagram",
      href: "https://www.instagram.com/j.rotbartco/",
      icon: "instagram",
    },
    // TODO(client): unverified — see (b) above.
    { platform: "Messenger", href: "https://m.me/j.rotbartco", icon: "messenger" },
    // The design uses the legacy Twitter bird, not the X mark. The account
    // itself has already migrated to x.com.
    // TODO(client): confirm the bird is deliberate nostalgia and not a stale
    // icon library — every other brand touchpoint now shows X.
    { platform: "X (formerly Twitter)", href: "https://x.com/JRotbartCO", icon: "twitter" },
    {
      platform: "YouTube",
      href: "https://www.youtube.com/channel/UCXL3uluudhczwqKAS2H_hvg",
      icon: "youtube",
    },
    // TODO(client): enable to restore LinkedIn — see (a) above.
    // { platform: "LinkedIn", href: "https://hk.linkedin.com/company/j.rotbart-&-co", icon: "linkedin" },
  ],

  legalLinks: [
    { label: "Privacy Policy", href: "/privacy-policy-statement/" },
    // The design labels this "Terms of Use"; the live page is titled and
    // slugged "Terms and Conditions".
    // TODO(client): pick one. Renaming the label without renaming the page
    // makes the link and its destination disagree.
    { label: "Terms of Use", href: "/terms-and-conditions/" },
  ],

  /**
   * `{year}` is substituted at render time. The live site hardcodes 2024 on a
   * page last modified in 2026; the design hardcodes 2026. Neither survives a
   * new year, so the token is the fix.
   *
   * TODO(client): brand spelling is inconsistent in the design itself —
   * "J.Rotbart™" here versus "J. Rotbart & Co." in the consent line one row
   * above. Kept design-faithful for now. Pick one.
   */
  copyright: "Copyright © {year} J.Rotbart™. All rights reserved.",
};
