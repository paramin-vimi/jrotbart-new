import type {
  Cta,
  LocationMapBlock,
  Office,
  OfficeCardGridBlock,
  OfficeVisitBlock,
  SectionHeading,
  TeamGridBlock,
  Vault,
} from "@content/types";
import { featuredTeamMember, teamByOffice } from "@content/team";
import { numberWord } from "@lib/geo";

/**
 * Shared copy and block builders for the office pages — the labels every
 * office page (Figma 10784:11826, Hong Kong) and the office listing
 * (10980:11772) print regardless of which office they are about. Per-office
 * copy (the hero, the services intro, the steps, the FAQ answers…) lives in
 * `src/content/officePages/<office>.ts`; the office FACTS (address, phone,
 * hours, vault partner) come from `src/content/offices.ts` and are never
 * repeated here.
 *
 * Every builder returns one typed block, so a page module reads as the
 * ordered block list it is meant to be.
 */

/* ------------------------------------------------------------------------ */
/* Office listing — officeCardGrid (10980:12676)                              */
/* ------------------------------------------------------------------------ */

export const officeCardLabels = {
  rowLabels: { phone: "Phone", vaultPartner: "Vault partner" },
  /** 10980:12834 — drawn on Hong Kong only (`Office.headquarters`). TODO(client): confirm the chip is wanted. */
  headquartersBadge: "Headquarters",
  /** I10980:12690;5207:2578 "Visit the Hong Kong desk". */
  deskLink: (city: string) => `Visit the ${city} desk`,
} as const;

/**
 * `routes` maps an office `_id` to the href of its BUILT page. Only those
 * offices get the desk link; the frame draws one on every card, but two
 * offices have no page yet. TODO(client): desk links for the Philippines and
 * Israel once their pages exist (or a contact anchor in the meantime).
 */
export function officeCardGridBlock(input: {
  _key: string;
  offices: Office[];
  routes: Partial<Record<Office["_id"], string>>;
  header?: SectionHeading;
  theme?: OfficeCardGridBlock["theme"];
  seam?: OfficeCardGridBlock["seam"];
}): OfficeCardGridBlock {
  const cards: OfficeCardGridBlock["cards"] = {};
  for (const office of input.offices) {
    const href = input.routes[office._id];
    cards[office._id] = {
      ...(href
        ? { cta: { label: officeCardLabels.deskLink(office.city), href, style: "arrow" } satisfies Cta }
        : {}),
      ...(office.headquarters ? { badge: officeCardLabels.headquartersBadge } : {}),
    };
  }
  return {
    _type: "officeCardGrid",
    _key: input._key,
    theme: input.theme,
    seam: input.seam,
    header: input.header,
    offices: input.offices,
    cards,
    rowLabels: officeCardLabels.rowLabels,
  };
}

/* ------------------------------------------------------------------------ */
/* Office listing — locationMap (10980:13178)                                 */
/* ------------------------------------------------------------------------ */

export const locationMapLabels = {
  overline: "Where you'll find us",
  legend: { office: "Office", vault: "Vault" },
  /** 10980:13467 "Office · Vault" is the drawn caption; the other two are derived from it. */
  captions: { officeAndVault: "Office · Vault", office: "Office", vault: "Vault" },
  /** 10980:13182 "Five Offices. Fifteen Vaults." — the counts are derived, see below. */
  heading: (offices: number, vaults: number): SectionHeading => {
    const lead = `${numberWord(offices, true)} Offices. `;
    const accent = `${numberWord(vaults, true)} Vaults.`;
    return {
      overline: locationMapLabels.overline,
      heading: `${lead}${accent}`,
      headingRuns: [{ text: lead }, { text: accent, accent: true }],
    };
  },
} as const;

/**
 * The heading counts default to `offices.length` / `vaults.length`, and either
 * can be overridden where the design's own number differs from our data.
 *
 * The vault count is genuinely unsettled — FOUR numbers exist for it: the frame
 * writes "Fifteen" in this heading and "15" in the hero stat, the frame's own
 * map draws ELEVEN vault dots, the live site's FAQ says eleven, and vaults.ts
 * lists sixteen cities. The listing page overrides to the frame's 15 so the page
 * reads as designed.
 * TODO(client): settle the vault count (15 written / 11 drawn / 11 live / 16 in
 * our data) and the Bangkok office — see offices.ts and vaults.ts.
 */
export function locationMapBlock(input: {
  _key: string;
  offices: Office[];
  vaults: Vault[];
  /** Override the number the heading prints, when the design's differs. */
  officeCount?: number;
  vaultCount?: number;
  theme?: LocationMapBlock["theme"];
  seam?: LocationMapBlock["seam"];
}): LocationMapBlock {
  return {
    _type: "locationMap",
    _key: input._key,
    theme: input.theme,
    seam: input.seam,
    header: locationMapLabels.heading(
      input.officeCount ?? input.offices.length,
      input.vaultCount ?? input.vaults.length,
    ),
    legend: locationMapLabels.legend,
    // "filter" would need a selected state the frame does not draw. TODO(client).
    control: "legend",
    offices: input.offices,
    vaults: input.vaults,
    captions: locationMapLabels.captions,
  };
}

/* ------------------------------------------------------------------------ */
/* Office page — teamGrid (11041:15863)                                       */
/* ------------------------------------------------------------------------ */

export const teamLabels = {
  /** 11041:16388 — drawn "THE Team"; `eyebrow` upper-cases it anyway. */
  overline: "THE Team",
  /** 11041:16389 "Your Team in *Hong Kong*". */
  heading: (city: string): SectionHeading => ({
    overline: teamLabels.overline,
    heading: `Your Team in ${city}`,
    headingRuns: [{ text: "Your Team in " }, { text: city, accent: true }],
  }),
  /**
   * Accessible names for the icon-only links; "%s" is the member's name.
   * The frame draws the three icons on every card with no data behind them,
   * so no row renders today (team.ts). TODO(client): per-person links.
   */
  linkLabels: {
    linkedin: "%s on LinkedIn",
    email: "Email %s",
    phone: "Call %s",
  },
} as const;

/** The office's roster from team.ts; the featured member (if any) leads. */
export function teamGridBlock(input: {
  _key: string;
  office: Office;
  theme?: TeamGridBlock["theme"];
  seam?: TeamGridBlock["seam"];
}): TeamGridBlock {
  const roster = teamByOffice(input.office._id);
  const featuredId = featuredTeamMember[input.office._id];
  const featured = roster.find((member) => member._id === featuredId);
  return {
    _type: "teamGrid",
    _key: input._key,
    theme: input.theme ?? "tinted",
    seam: input.seam,
    header: teamLabels.heading(input.office.city),
    featured,
    members: roster.filter((member) => member !== featured),
    linkLabels: teamLabels.linkLabels,
  };
}

/* ------------------------------------------------------------------------ */
/* Office page — officeVisit (11041:16507)                                    */
/* ------------------------------------------------------------------------ */

export const visitLabels = {
  /** 11120:15928 */
  overline: "Our Office",
  /** 11120:15940 — rendered only for offices with `appointmentOnly`. */
  appointmentNote: "By appointment only",
  /** I11120:15942 "Book an Appointment". TODO(client): destination — three "speak with…" CTAs exist site-wide. */
  cta: { label: "Book an Appointment", href: "#contact", style: "solid" } satisfies Cta,
  /** Not drawn; the map panel has no artwork yet, so the link IS the map. */
  directionsLabel: "Get directions",
} as const;

/**
 * `heading` and `body` are per-office copy ("Visit Us in Sheung Wan", the
 * MTR paragraph) from the office page module. `map` is optional: an office
 * without static map artwork renders the panel flat, with the marker card and
 * the directions link.
 * NOTE Hong Kong currently passes the FRAME's panel (11120:15943), which is a
 * drawing of SINGAPORE — shipped on the client's instruction to match the
 * design, and flagged in that module and in its alt text.
 * TODO(assets): a real Hong Kong static map.
 */
export function officeVisitBlock(input: {
  _key: string;
  office: Office;
  heading: string;
  body: string | string[];
  map?: OfficeVisitBlock["map"]["image"];
  theme?: OfficeVisitBlock["theme"];
  seam?: OfficeVisitBlock["seam"];
}): OfficeVisitBlock {
  return {
    _type: "officeVisit",
    _key: input._key,
    theme: input.theme,
    seam: input.seam,
    header: { overline: visitLabels.overline, heading: input.heading, body: input.body },
    office: input.office,
    appointmentNote: input.office.appointmentOnly ? visitLabels.appointmentNote : undefined,
    cta: visitLabels.cta,
    map: { image: input.map, directionsLabel: visitLabels.directionsLabel },
  };
}

/* ------------------------------------------------------------------------ */
/* Office page — labels the other blocks on the template print               */
/* (texts/office-hk.txt). The page module composes them into its blocks.     */
/* ------------------------------------------------------------------------ */

export const officePageLabels = {
  /** 11043:18250 — the pageHero accreditation row. */
  memberOf: "Member of:",
  /** 11036:17624 — the services featureGrid overline. */
  services: "Services",
  /** 11039:18705 — the processSteps overline. */
  howItWorks: "How it works",
  /** 11120:16075 — the proseSection overline. */
  whatWeOffer: "What we Offer",
  faq: {
    /** 11041:16433 / 16434 */
    overline: "People also asked",
    heading: "Frequently Asked Questions",
    footer: {
      /** 11120:16167 */
      heading: "Have a Question We Haven’t Answered Here?",
      /** 11120:16168. TODO(client): "1 business day" here vs "24 hours" in the contact section. */
      body: "Speak with our Value Experts — Your enquiry will be treated in strict confidence and answered within 1 business day.",
      /** I11138:16026 */
      cta: { label: "Speak With a Value Expert", href: "#contact", style: "solid" } satisfies Cta,
    },
  },
} as const;
