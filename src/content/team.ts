import type { ImageRef, Office, TeamMember } from "./types";
import { officeById } from "./offices";

const hongKongOffice = officeById("hong-kong");

/**
 * Team members — the "Your Team in Hong Kong" roster (Figma 11041:15863).
 *
 * Names, roles and the six bios are exactly as the frame draws them
 * (texts 11041:16368–16310). Seven members have headshots in the design;
 * the other six are drawn as compact cards (name + role), which is what
 * `TeamGrid` renders when `photo` and `bio` are absent.
 *
 * TODO(client): eight of these names are not on the live About page, and
 * "Director / CFO" for Jonathan Rotbart differs from the live "Director".
 * Please confirm the roster and every role before launch.
 * LINKS — read this before trusting the icon row. The frame draws three discs
 * on every card (LinkedIn, email, a messaging app). No PER-PERSON contact data
 * exists, and inventing a LinkedIn URL or an email address for a named real
 * person is not something a build should do. On the client's instruction to
 * match the design for now, every card therefore shows the same three FIRM-level
 * destinations, defined once in `firmLinks` below: the company LinkedIn page and
 * the Hong Kong office's own published email and phone number. All three are
 * real and reach the firm; none is personal.
 * TODO(client): supply per-person LinkedIn URLs, email addresses and direct
 * lines, or confirm the firm-level fallbacks are what you want shown. Until
 * then a visitor clicking "Jonathan Rotbart" LinkedIn reaches the company page,
 * not his profile.
 * TODO(client): the seven headshots are staged photography — licence and
 * originals at ≥2× are needed.
 */
const headshot = (file: string, name: string, size = 370): ImageRef => ({
  src: `/figma/${file}`,
  alt: `${name}, J. Rotbart & Co., Hong Kong`, // TODO(client): approve alt text
  width: size,
  height: size,
});

const HK: Office["_id"] = "hong-kong";

/*
 * Firm-level contact points, shown on every team card until per-person data
 * exists (see the note above). The email and phone are the Hong Kong office's
 * published details from offices.ts — imported rather than retyped so they
 * cannot drift. The LinkedIn URL is the company page recorded in footer.ts.
 */
const firmLinks: TeamMember["links"] = {
  // TODO(client): the company LinkedIn, per the note in src/content/footer.ts.
  linkedin: "https://hk.linkedin.com/company/j.rotbart-&-co",
  email: hongKongOffice.email,
  phoneHref: hongKongOffice.phoneHref,
};

export const team: TeamMember[] = [
  {
    _id: "jonathan-rotbart",
    name: "Jonathan Rotbart",
    role: "Director / CFO",
    bio: "With an extensive background in economics and finance, Jonathan honed his analytical skills at Ernst & Young and Malca-Amit. At J. Rotbart & Co., he leverages deep industry insights to manage gemstone and commodities projects Asia-wide.",
    // Drawn 368×368 in the featured card (11041:16374).
    photo: headshot("team-jonathan-rotbart--11041-16374.webp", "Jonathan Rotbart", 368),
    office: HK,
    links: firmLinks,
  },
  {
    _id: "lakhwinder-singh",
    name: "Lakhwinder Singh",
    role: "Sales Manager",
    bio: "Specializing in precious metals and digital commodities, City University of Hong Kong alumnus Lakhwinder Singh has advised 100+ wealth management clients. At J. Rotbart & Co., he spearheads digital asset growth and delivers strategic market insights.",
    photo: headshot("team-lakhwinder-singh--11041-16077.webp", "Lakhwinder Singh"),
    office: HK,
    links: firmLinks,
  },
  {
    _id: "rayman-lai",
    name: "Rayman Lai",
    role: "Operations Manager",
    bio: "A CILT charter member with an MSc from Hong Kong Polytechnic University, Rayman brings 20+ years of supply chain leadership. At J. Rotbart & Co., he streamlines complex global operations and ensures efficient worldwide product distribution.",
    photo: headshot("team-rayman-lai--11041-16090.webp", "Rayman Lai"),
    office: HK,
    links: firmLinks,
  },
  {
    _id: "bobo-yau",
    name: "Bobo Yau",
    role: "Client Relations Manager",
    bio: "With 10+ years across trade operations, e-commerce, and client service, Bobo delivers an exceptional end-to-end customer experience, supporting high-end clients and building long-term, trusted partnerships at J. Rotbart & Co.",
    photo: headshot("team-bobo-yau--11041-16103.webp", "Bobo Yau"),
    office: HK,
    links: firmLinks,
  },
  {
    _id: "elly-choy",
    name: "Elly Choy",
    role: "Sales & Business Development Executive",
    bio: "Transitioning from real estate to precious metals, Elly advises clients on portfolio diversification across precious metals and digital commodities. At J. Rotbart & Co., she focuses on building long-term relationships and expanding the firm’s global digital presence.",
    photo: headshot("team-elly-choy--11041-16116.webp", "Elly Choy"),
    office: HK,
    links: firmLinks,
  },
  {
    _id: "indigo-lee",
    name: "Indigo Lee",
    role: "Business Development Associate",
    bio: "A University of Hong Kong graduate in Social Data Science, Indigo blends client relations and marketing expertise. At J. Rotbart & Co., he drives business development, providing tailored account servicing for precious metal investment diversification.",
    photo: headshot("team-indigo-lee--11041-16129.webp", "Indigo Lee"),
    office: HK,
    links: firmLinks,
  },
  {
    _id: "pinky-chong",
    name: "Pinky Chong",
    role: "Client Relations Executive",
    bio: "With extensive experience in banking and fintech, Pinky excels at supporting high-net-worth clients. As Client Relations Executive at J. Rotbart & Co., she delivers tailored client service and guides precious metals investment diversification.",
    photo: headshot("team-pinky-chong--11041-16142.webp", "Pinky Chong"),
    office: HK,
    links: firmLinks,
  },
  // ---- Compact cards: no headshot, no bio in the design ----
  { _id: "candice-chu", name: "Candice Chu", role: "Back office and Operations Officer, Money Lending", office: HK, links: firmLinks },
  { _id: "barbara-au", name: "Barbara Au", role: "Office and Admin Officer", office: HK, links: firmLinks },
  { _id: "man-lee", name: "Man Lee", role: "Procurement Manager, Precious Metals and Digital Assets", office: HK, links: firmLinks },
  { _id: "brenda-tang", name: "Brenda Tang", role: "Logistics Executive", office: HK, links: firmLinks },
  { _id: "gina-so", name: "Gina So", role: "Trading and Settlement Manager", office: HK, links: firmLinks },
  { _id: "faith-sin", name: "Faith Sin", role: "Logistics and Shipping Executive", office: HK, links: firmLinks },
];

/** The member drawn as the full-width featured card, per office. */
export const featuredTeamMember: Partial<Record<Office["_id"], TeamMember["_id"]>> = {
  "hong-kong": "jonathan-rotbart",
};

/** Everyone at an office, in roster order. */
export const teamByOffice = (officeId: Office["_id"]): TeamMember[] =>
  team.filter((member) => member.office === officeId);

/** Lookup by `_id`. Throws at build time on a typo, which is the point. */
export function teamMemberById(id: TeamMember["_id"]): TeamMember {
  const member = team.find((m) => m._id === id);
  if (!member) throw new Error(`[content/team] unknown team member "${id}"`);
  return member;
}
