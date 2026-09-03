import type {
  ContactFormBlock,
  ImageRef,
  Link,
  MintStripBlock,
} from "@content/types";
import { offices, primaryEmail } from "@content/offices";
import { perthMint, royalCanadianMint, royalMint, saMint, usMint } from "@content/mints";
import { mapHref } from "@lib/maps";

/**
 * The mint provenance strip (Figma `10369:9011`) and the Contact section
 * (Figma `10369:8261`).
 *
 * Site-wide, not homepage-scoped: every page frame ends with this pair (the
 * "tail" that SiteLayout renders), so the module lives at the content root and
 * keeps the `_key`s it had on the homepage — `ContactSection` namespaces every
 * form id by `_key`, and one instance per page is fine.
 *
 * Source of truth for geometry: Figma `MkPRW1BKlldItk3pnHgcW3`, frame
 * `9813:5482`. Source of truth for COPY: the rendered Figma pixels, cross-checked
 * against the live site (jrotbart.com, captured 2026-08-30). Figma layer names in
 * this area are stale and were ignored — e.g. the heading layer is named
 * "Request a confidential meeting." but renders "Schedule Your Private
 * Consultation Today".
 *
 * ---------------------------------------------------------------------------
 * LOCAL TYPE EXTENSIONS
 * ---------------------------------------------------------------------------
 * Every field this section needs beyond `ContactFormBlock` is declared here. All
 * of it is additive and can be folded into types.ts (and the Sanity schema) in
 * one pass later — each extension carries the reason it exists.
 */

// ---------------------------------------------------------------------------
// Local type extensions — form
// ---------------------------------------------------------------------------

/**
 * `ContactFormBlock` models the attribution radio group and the consent line but
 * not the input fields themselves ("fixed schema, not editable" in the CMS spec).
 * They still have to live in content rather than in the component, because the
 * labels, the required-field policy and the validation messages are all copy.
 */
export interface ContactField {
  /** Wire name. Matches the live b2blead form so the CRM mapping survives. */
  name: string;
  label: string;
  type: "text" | "email" | "tel";
  /** WHATWG autocomplete token. Never omit — it is the cheapest a11y win here. */
  autocomplete: string;
  required: boolean;
  /** Renders a <textarea> instead of an <input>. */
  multiline?: boolean;
  rows?: number;
  /** Optional client-side pattern, mirrored server-side by the Worker. */
  pattern?: string;
  inputmode?: "text" | "email" | "tel";
  /** Shown when the field is empty but required. */
  missingMessage: string;
  /** Shown when the value is present but malformed. Omit for plain text fields. */
  invalidMessage?: string;
}

export interface AttributionOption {
  /** Visible label. */
  label: string;
  /** Value posted to the CRM. Explicit, never derived — analytics depends on it. */
  value: string;
}

/**
 * `ContactFormBlock["attribution"].options` is `string[]`, which cannot carry the
 * CRM value separately from the visible label. Widened here.
 */
export interface Attribution {
  label: string;
  /** Wire name for the whole group. */
  name: string;
  options: AttributionOption[];
}

/**
 * The design draws a reCAPTCHA v2 screenshot. `.env.example` already commits the
 * project to Cloudflare Turnstile instead (no Google cookie, no 300 KB payload,
 * and it degrades to a managed non-interactive challenge). The widget only
 * mounts when a site key exists, so nothing renders until the client supplies
 * one — a permanently-empty 302x76 hole is worse than no hole.
 */
export interface CaptchaSlot {
  provider: "turnstile";
  /** TODO(client): supply TURNSTILE_SITE_KEY (see .env.example). */
  siteKey?: string;
  /** Accessible name for the widget container. */
  label: string;
}

/** Copy for the form's live regions. Never rendered until something happens. */
export interface FormFeedback {
  /** role="alert" — client-side validation failed. */
  invalid: string;
  /** role="status" — shown only when the server redirects back with `successParam`. */
  success: string;
  /** Query parameter the Worker sets on the success redirect. */
  successParam: string;
  /** role="alert" — the server rejected the submission. */
  failure: string;
  /** Query parameter the Worker sets on the failure redirect. */
  failureParam: string;
}

// ---------------------------------------------------------------------------
// Local type extensions — directory
// ---------------------------------------------------------------------------

export type DirectoryIcon = "pin" | "email" | "document";

export interface DirectoryLine {
  /** Plain text rendered before the (possibly linked) value, e.g. "Tel: ". */
  prefix?: string;
  text: string;
  /** Turns `text` into a link. */
  href?: string;
  external?: boolean;
  /** Figma "Subtitle" token — 16/24 weight 600, text-primary. Licence numbers. */
  strong?: boolean;
}

/**
 * The directory is six rows in the design: four offices, an email row and a DBA
 * / licensing row. `ContactFormBlock` only carries `offices: Office[]`, which
 * cannot express the last two, nor the two visually separated licence groups
 * inside the DBA row. Modelled as `bodyGroups[]` exactly as the CMS spec asks.
 */
export interface DirectoryItem {
  _key: string;
  icon: DirectoryIcon;
  title: string;
  /** Visually separated groups, 8px apart. Only the DBA row has two. */
  groups: DirectoryLine[][];
  /** Wraps the body in <address>. True for anything that is contact detail. */
  contactInfo?: boolean;
}

export interface Directory {
  heading: string;
  items: DirectoryItem[];
}

// ---------------------------------------------------------------------------
// Local type extensions — map
// ---------------------------------------------------------------------------

export interface MapPin {
  label: string;
  /**
   * Position as a PERCENTAGE of the map frame, not the Figma's absolute pixels.
   * The Figma places each pin at a hand-measured offset inside a 1174x560 frame
   * that itself crops a 1667x1060 SVG at (-567, -414); any scaling of that frame
   * desyncs every pin. Percentages scale with the frame as one unit.
   * TODO: migrate to `projectMercator` (src/lib/geo.ts) once `Office.geo`
   * carries real coordinates — the office-listing map already projects.
   */
  x: number;
  y: number;
  href?: string;
  external?: boolean;
}

export interface MapBand {
  /** Accessible name for the region. */
  label: string;
  /** TODO(assets): Figma export pending — see the note on `map` below. */
  image?: ImageRef;
  pins: MapPin[];
}

// ---------------------------------------------------------------------------
// The section type
// ---------------------------------------------------------------------------

export interface ContactFormSection extends Omit<ContactFormBlock, "attribution"> {
  fieldRows: ContactField[][];
  attribution: Attribution;
  consentLink: Link;
  captcha: CaptchaSlot;
  feedback: FormFeedback;
  directory: Directory;
  map: MapBand;
  /**
   * Opening line written into the message field when a product page renders
   * the form with `prefill={{ product }}`. "%s" is the product's short name.
   * A line of text, not a hidden field — see the `prefill` prop note in
   * ContactSection.astro.
   */
  prefillTemplate: string;
}

// ---------------------------------------------------------------------------
// Form destination
// ---------------------------------------------------------------------------

/**
 * ⚠️ THE BACKEND IS NOT WIRED YET.
 *
 * This is the documented target for the contact form, not a live endpoint.
 * `workers/` currently contains `spot-price.ts` and nothing else — there is no
 * `contact.ts` Worker, and posting this form today will 404.
 *
 * What the Worker has to do when it is written:
 *   1. Accept `application/x-www-form-urlencoded` POST (the no-JS path must work
 *      — the form is deliberately a real HTML form, not a fetch() wrapper).
 *   2. Reject when the `company` honeypot field is non-empty.
 *   3. Verify the Turnstile token (`cf-turnstile-response`) against
 *      TURNSTILE_SECRET_KEY.
 *   4. Re-validate every field server-side. Client-side validation is a courtesy,
 *      never a guarantee.
 *   5. Forward to HubSpot (HUBSPOT_PORTAL_ID / HUBSPOT_FORM_GUID, portal
 *      7115897 per .env.example), mapping `source` to the attribution property.
 *   6. 303-redirect back to `/?{successParam}=1#contact` on success and
 *      `/?{failureParam}=1#contact` on failure, so the browser's own navigation
 *      shows the result with no JavaScript involved.
 *
 * TODO(client): confirm the destination — HubSpot, or keep the incumbent
 * b2blead.ai form (`frm_83263af103934df77e3d157dcbbd1a500903`). The live site
 * posts to b2blead and stores nothing in WordPress.
 */
export const CONTACT_ENDPOINT = "/api/contact";

// ---------------------------------------------------------------------------
// Section A — mint provenance strip (Figma 10369:9011)
// ---------------------------------------------------------------------------

/**
 * Trust bar: the sovereign mints whose bullion J. Rotbart sells.
 *
 * The five logos are the Mint documents' own (`src/content/mints.ts`), so the
 * strip and the product hero eyebrows name the same institutions. Figma draws
 * them opaque with white backgrounds baked in — the white is keyed out from the
 * image EDGES only, a global "make white transparent" would punch holes in the
 * Royal Mint crest and the Perth Mint swan.
 *
 * TODO(client): no logo links anywhere in the design. `LogoItem.href` is
 * supported if these should be outbound links to each mint.
 */
export const mintStrip: MintStripBlock = {
  _key: "home-mint-strip",
  _type: "mintStrip",
  theme: "light",
  label: "Product minted by",
  // Drawn order, left to right.
  logos: [saMint, royalMint, perthMint, royalCanadianMint, usMint].map((mint) => ({
    name: mint.name,
    image: mint.logo!,
  })),
};

// ---------------------------------------------------------------------------
// Section B — contact (Figma 10369:8261)
// ---------------------------------------------------------------------------

/**
 * The directory heading uses the office's COUNTRY for Manila and Tel Aviv
 * ("Philippines", "Israel") but its CITY for the other two, exactly as the
 * design renders it. Rather than distort `offices.ts` — which is shared with the
 * office grid, the footer and the LocalBusiness schema — the two overrides live
 * here.
 *
 * TODO(client): confirm. Listing two offices by city and two by country is
 * inconsistent; "Hong Kong / Singapore / Manila / Tel Aviv" would be uniform.
 */
const directoryTitles: Record<string, string> = {
  philippines: "Philippines",
  israel: "Israel",
};

/**
 * DIRECTORY ADDRESS LINES — transcribed from the rendered Figma pixels.
 *
 * `offices.ts` is the shared record for the office grid, the footer and the
 * LocalBusiness schema, and splits every address into its structured parts. The
 * design sets FEWER lines, and line breaking is a design decision: Hong Kong,
 * Singapore and the Philippines are three lines each (108px items) and Israel
 * two (84px). Deriving them from `office.address` produced a four-line block
 * for the first three and a three-line block for Israel — 96px of extra height
 * in the right column. The drawn lines therefore win HERE, without disturbing
 * `offices.ts` and its three other consumers.
 *
 * The wording differs from `offices.ts` in four places, all of them the
 * design's, all transcribed verbatim:
 *   • "287-291 Des Voeux Road Central" — `offices.ts` omits "Central".
 *   • "37 Sheerit Israel St." — abbreviated; "Tel-Aviv" — hyphenated.
 *   • Philippine and Israeli phone digits are ungrouped ("+63 9669575118",
 *     "+972 54 6363228") where the live site groups them.
 *
 * TODO(client): rule on those four. "Des Voeux Road Central" looks like a
 * correction that belongs back in `offices.ts`; the ungrouped phone digits look
 * like a design slip and are less readable, though the `tel:` href carries the
 * dialable number either way and is unaffected.
 */
const drawnAddresses: Record<string, { lines: string[]; phone: string }> = {
  "hong-kong": {
    lines: [
      "Suite 1503, Champion Building,",
      "287-291 Des Voeux Road Central, Sheung Wan, Hong Kong",
    ],
    phone: "+852 2104 9255",
  },
  singapore: {
    lines: ["Six Battery Road,", "Level 3, Room 369, Singapore 049909"],
    phone: "+65 6980 2968",
  },
  philippines: {
    lines: [
      "The Penthouse, PNB Makati Center Ayala Avenue",
      "Makati City 1203, Philippines",
    ],
    phone: "+63 9669575118",
  },
  israel: {
    lines: ["37 Sheerit Israel St. Tel-Aviv 6816522, Israel"],
    phone: "+972 54 6363228",
  },
};

const officeItems: DirectoryItem[] = offices.map((office) => {
  /* Falls back to the structured address for any office the design never drew,
     so a fifth office added to `offices.ts` still renders. */
  const drawn = drawnAddresses[office._id];
  const lines = drawn ? drawn.lines : office.address;
  const phone = drawn ? drawn.phone : office.phone;

  return {
    _key: `office-${office._id}`,
    icon: "pin" as const,
    title: directoryTitles[office._id] ?? office.city,
    contactInfo: true,
    groups: [
      [
        ...lines.map((line) => ({ text: line })),
        ...(phone
          ? [
              {
                prefix: "Tel: ",
                text: phone,
                href: `tel:${office.phoneHref ?? phone.replace(/[^+\d]/g, "")}`,
              },
            ]
          : []),
      ],
    ],
  };
});

export const contact: ContactFormSection = {
  _key: "home-contact",
  _type: "contactForm",
  anchorId: "contact",
  theme: "light",

  header: {
    overline: "Contact us",
    heading: "Schedule Your",
    /** Rendered italic + text-tertiary by SectionHeader. */
    headingAccent: "Private Consultation Today",
    body: "Our experts are ready to help you with anything you need. We always aim to reply within 24 hours.",
  },

  /**
   * Kept for the CMS contract and for any consumer that wants the raw documents;
   * the rendered directory is built from the same array in `directory` below.
   */
  offices,

  /**
   * Three rows, matching the three arrangements the design draws: full-width,
   * a 2-up split, then full-width again.
   *
   * ⚠️ REQUIRED-FIELD FLAG. The Figma marks ONLY `MESSAGE*` with an asterisk.
   * That is a design error: the live site's form requires name, email AND
   * message, and a lead with no name or reply address is not a lead. Name and
   * Email are therefore required here and carry the asterisk too. Phone stays
   * optional, as on the live site.
   * TODO(client): confirm this correction.
   */
  fieldRows: [
    [
      {
        name: "name",
        label: "Name",
        type: "text",
        autocomplete: "name",
        required: true,
        missingMessage: "Please enter your name.",
      },
    ],
    [
      {
        name: "email",
        label: "Email address",
        type: "email",
        autocomplete: "email",
        inputmode: "email",
        required: true,
        missingMessage: "Please enter your email address.",
        invalidMessage: "Please enter a valid email address, e.g. name@company.com.",
      },
      {
        name: "phone",
        label: "Phone (+XX XXXX XXXX)",
        type: "tel",
        autocomplete: "tel",
        inputmode: "tel",
        required: false,
        /* Same pattern the live form uses: 7–20 digits, punctuation allowed. */
        pattern: "(?=(?:\\D*\\d){7,20}\\D*$)\\+?[0-9\\s().-]+",
        missingMessage: "Please enter your phone number.",
        invalidMessage: "Please enter a valid phone number, including the country code.",
      },
    ],
    [
      {
        name: "message",
        label: "Message",
        type: "text",
        autocomplete: "off",
        required: true,
        multiline: true,
        rows: 3,
        missingMessage: "Please tell us how we can help.",
      },
    ],
  ],

  /**
   * Net-new versus the live site — this is a marketing-attribution field with no
   * current destination.
   * TODO(client): confirm it is single-select (radios, as drawn) rather than
   * multi-select, and name the CRM property the `value`s should land in.
   */
  attribution: {
    label: "What brought you here?",
    name: "source",
    options: [
      { label: "Event / Webinar", value: "event-webinar" },
      { label: "Linkedin / Other Social Media", value: "social" },
      { label: "Referral / Friend", value: "referral" },
      { label: "Online Ad", value: "online-ad" },
      { label: "Google / Other search", value: "search" },
    ],
  },

  /**
   * Verbatim from the design, including the curly quotes. The design uses
   * implied consent (a sentence, not a checkbox) — as does the live site, whose
   * vendor config records `consent: {enabled:false, required:false}`.
   * TODO(client): legal review. Implied consent leaves no recorded artefact; if
   * GDPR/PDPA coverage is required this needs an explicit opt-in checkbox.
   */
  consent: "By clicking the “Submit” button you agree to our ",
  consentLink: {
    label: "Privacy Policy terms",
    href: "/privacy-policy-statement/",
  },

  submitLabel: "Submit",

  // TODO(client): wording of the product-enquiry opener. Nothing is drawn for
  // it — the product frames (11136:25475) only show the "Request a private
  // quote" band, so this line is our draft.
  prefillTemplate: "I would like to enquire about the %s.",

  captcha: {
    provider: "turnstile",
    label: "Human verification",
    // siteKey: TODO(client) — see .env.example (TURNSTILE_SITE_KEY).
  },

  feedback: {
    invalid: "Please check the highlighted fields and try again.",
    /* The live site's own success copy, kept so the wording does not change. */
    success: "Thanks, we will be in touch.",
    successParam: "sent",
    failure:
      "Sorry — we could not send your message. Please try again, or email info@jrotbart.com.",
    failureParam: "error",
  },

  directory: {
    heading: "Global Presence.",
    items: [
      ...officeItems,
      {
        _key: "email",
        icon: "email",
        title: "Email",
        contactInfo: true,
        groups: [[{ text: primaryEmail, href: `mailto:${primaryEmail}` }]],
      },
      {
        /**
         * REGULATED DISCLOSURE — legally reviewed copy. Do not paraphrase,
         * reorder or restyle. Transcribed verbatim from the design.
         * TODO(client): the design reads "Hongkong" (one word) and "License"
         * (US spelling) while the rest of the site uses "Hong Kong" and
         * "Licence". Confirm whether the registry wording is authoritative —
         * if it is, these stay exactly as they are.
         */
        _key: "dba",
        icon: "document",
        title: "DBA",
        groups: [
          [
            { text: "J. Rotbart & Co. is a registered trade mark and the brand name of:" },
            { text: "Strategic Transactions Limited Trading As J.Rotbart & Co. (Hongkong)" },
            { text: "Certificate of Registration for Category B Registrant" },
            { text: "License No: B-B-23-11-02937", strong: true },
          ],
          [
            { text: "Strategic Transactions (Singapore) Pte. Ltd." },
            { text: "Registration of Precious Stones and Precious Metals Dealers" },
            { text: "License No: PS20210002149", strong: true },
          ],
        ],
      },
    ],
  },

  /**
   * The map band.
   *
   * The Figma draws a 1667x1060 world SVG dropped at (-567, -414) inside a
   * 1174x560 frame and clipped, with four pins at hand-measured absolute pixel
   * offsets. That construction cannot survive a responsive layout: change the
   * frame width and every pin lands in the sea. Pins are therefore stored as
   * percentages of the frame and the artwork is a single background image, so
   * frame and pins scale as one unit. Each pin is also a real link, so the map
   * carries no information that is only available by looking at it.
   */
  map: {
    label: "J. Rotbart & Co. office locations",
    // Figma "Group 1" inside the map frame, rasterised. It is a flat two-tone
    // world map, so WebP crushes it; the SVG export was 1.5MB.
    // The group is 1667x1060 sitting in a 1174x560 frame — i.e. drawn at 142%
    // of the frame and offset -567/-414. The component reproduces that crop,
    // which is what keeps the four pin percentages landing on their countries.
    image: {
      src: "/figma/world-map.webp",
      alt: "",
      decorative: true,
      width: 1668,
      height: 1061,
    },
    // Read straight off the Figma pin instances. `y` is where the marker's
    // POINT lands, as a percentage of the 1174x560 frame — the x values were
    // already right, the y values were 4-5% high because they had been eyeballed
    // against a map that was not yet on the page.
    pins: [
      { label: "Israel", x: 32.28, y: 32.14, href: mapHref(offices[3]!), external: true },
      { label: "Hong Kong", x: 63.63, y: 40.07, href: mapHref(offices[0]!), external: true },
      { label: "Philippines", x: 67.97, y: 52.57, href: mapHref(offices[2]!), external: true },
      { label: "Singapore", x: 59.54, y: 57.5, href: mapHref(offices[1]!), external: true },
    ],
  },
};
