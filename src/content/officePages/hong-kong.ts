import type { OfficePageContent } from "@components/OfficePage.astro";
import type {
  CalloutBandBlock,
  Cta,
  Faq,
  FaqAccordionBlock,
  FeatureCell,
  FeatureGridBlock,
  ImageRef,
  LogoStripBlock,
  MediaWithTextBlock,
  PageHeroBlock,
  ProcessStepsBlock,
  ProseSectionBlock,
  Service,
  TestimonialBandBlock,
} from "@content/types";
import { officeById } from "@content/offices";
import { serviceById } from "@content/services";
import { vaults } from "@content/vaults";
import { testimonialOne } from "@content/testimonials";
import { hero as homepageHero } from "@content/homepage/hero";
import { logoStrip as homepageLogoStrip } from "@content/homepage/products";
import { officePageLabels, officeVisitBlock, teamGridBlock } from "@content/pages/office";

/**
 * Office page — Hong Kong → /buy-gold-hong-kong/
 *
 * Figma frame "Office - Hong Kong" 10784:11826 (1366 × 13472), page "New
 * Website". Live URL https://jrotbart.com/buy-gold-hong-kong/ captured
 * 2026-09-03 (SP/office-hk/live-hk.html) — its title is "J. Rotbart & Co. |
 * Buy Gold Bars, Bullion, Coins in Hong Kong" and none of its copy survives:
 * the frame is a full rewrite.
 *
 * COPY SOURCE: SP/build-plan/texts/office-hk.txt, full strings and the
 * bold / italic runs from SP/build-plan/nodes/office-hk.json. Nothing here is
 * lorem. The office FACTS (address, phone, hours, licence) are read from the
 * Office document — never repeated — and the roster from team.ts; the
 * template labels shared by every office page live in pages/office.ts.
 *
 * PLACEHOLDER REGISTER (plan §6, "Office HK") — each item is a TODO(client)
 * or TODO(assets) beside the field it affects:
 *   - 11039:18713 duplicate "04" → step numbers are rendered, never authored.
 *   - 11120:15939 hours "09.00 - 18.00" vs live 9:30–17:30 → the Office
 *     document's live value wins (Amendment 5); the frame value is not shipped.
 *   - 11120:15943 map panel is a drawing of Singapore → not shipped; the
 *     "Visit us" panel renders without artwork until a Hong Kong map exists.
 *   - I11041:15557 guide href, "Sell Precious Metals" / "Safe Deposit Boxes"
 *     hrefs, the "Speak With a Value Expert" destinations, the two repeated
 *     Albert Cheng bands, the FAQ open state.
 *   - Fact-checks: 11120:16000 (fees, minimum), 11120:16078 (170 firms, 150 →
 *     1,000 tonnes, July 2026 clearing), 11120:15913 (registration wording),
 *     11043:18248 "a decade" vs "since 2016", "35 countries".
 *   - Photography: hero, reception, vault viewing room and the seven
 *     headshots are staged — licence, originals ≥2×, alt text approval.
 */

const office = officeById("hong-kong");

/**
 * Every "N vault locations" in the copy derives from vaults.ts so the page
 * cannot disagree with the map (today 16 — the frame also says 16).
 * TODO(client): the live FAQ says eleven; confirm the list in vaults.ts.
 */
const vaultCount = vaults.length;

/* "Speak With a Value Expert" → the on-page enquiry form, as on the homepage.
   TODO(client): destination and wording — three variants of this CTA exist
   site-wide ("Speak With…", "Speak with…", "Talk to Our…"). */
const speakCta: Cta = { label: "Speak With a Value Expert", href: "#contact", style: "solid" };

/** I11036:17635;5207:2578 — the checklist link label, identical on all six cells. */
const learnMore = "Learn More";

/* ------------------------------------------------------------------------ */
/* Hero — 11043:18243 (split: copy on the tinted left half, photo right)     */
/* ------------------------------------------------------------------------ */

const heroImage: ImageRef = {
  // 11043:18256, drawn 683 × 560 (object-cover). Exported 1366w.
  src: "/figma/office-hk-hero--11043-18256.webp",
  // TODO(client): approve the alt text; staged photography — licence and the
  // original at ≥2× needed.
  alt: "An adviser walking a couple through their paperwork at the J. Rotbart & Co. Hong Kong office, a one-kilo gold bar in a tray on the desk and Victoria Harbour through the window behind them",
  width: 683,
  height: 560,
};

const hero: PageHeroBlock = {
  _key: "hk-hero",
  _type: "pageHero",
  theme: "tinted",
  accentTone: "brand",
  header: {
    // 11043:18246 — "Hong Kong" is the italic brand-red run. Drawn at 44/52
    // inside a 40/52 heading; rendered at the roman size (Amendment 3).
    heading: "Precious Metals Dealer in Hong Kong",
    headingRuns: [{ text: "Precious Metals Dealer in " }, { text: "Hong Kong", accent: true }],
    // 11043:18248. TODO(client): "for a decade" here vs "Since 2016" in the
    // services intro below — both are drawn; pick one framing.
    body: "Buy, sell, store, and ship gold and precious metals through our Hong Kong office, serving private clients and institutions from this city for a decade.",
  },
  accreditationLabel: officePageLabels.memberOf,
  // The same three marks as the homepage hero (11043:18251–18253 are the
  // homepage image refs). They are read from the homepage module because that
  // is where they live today; they are site-wide facts and belong in a shared
  // document (integrator request), not homepage content.
  accreditations: homepageHero.accreditations,
  cta: speakCta,
  media: { kind: "split", image: heroImage },
};

/* ------------------------------------------------------------------------ */
/* Press / endorsement strip — 11034:16530 (the homepage instance)           */
/* ------------------------------------------------------------------------ */

const logoStrip: LogoStripBlock = { ...homepageLogoStrip, _key: "hk-logo-strip" };

/* ------------------------------------------------------------------------ */
/* Services checklist — 11036:17622 (light, 2 × 3, hairline rules)           */
/* ------------------------------------------------------------------------ */

/**
 * One checklist cell. The title and teaser are this page's own copy (the
 * frame writes an office-specific line per service); the href comes from the
 * Service document so the six links cannot drift from the services pages.
 */
const serviceCell = (
  key: string,
  service: Service,
  title: string,
  body: string,
  href: string = service.href,
): FeatureCell => ({
  _key: key,
  marker: { kind: "icon", icon: "check-badge" },
  title,
  body: [body],
  link: { label: learnMore, href, style: "arrow" },
  ref: { service: service._id },
});

const buySell = serviceById("buy-sell");
const globalStorage = serviceById("global-storage");
const safeDepositBox = serviceById("safe-deposit-box");
const globalShipping = serviceById("global-shipping");
const lendingAndFinance = serviceById("lending-and-finance");

const services: FeatureGridBlock = {
  _key: "hk-services",
  _type: "featureGrid",
  theme: "light",
  layout: "stacked",
  columns: 2,
  frame: "rules",
  header: {
    overline: officePageLabels.services,
    // 11036:17625 — "Hong Kong" italic, drawn 40/48 in a 32/44 heading;
    // rendered at the roman size (Amendment 3).
    heading: "Buy, Sell and Store Gold in Hong Kong",
    headingRuns: [{ text: "Buy, Sell and Store Gold in " }, { text: "Hong Kong", accent: true }],
    // 11036:17626 is ONE text node with a soft line break before
    // "Everything…" (three lines, 72 tall). One paragraph keeps that height;
    // a second paragraph would add the primitive's 24px gap.
    // TODO(client): should the last sentence be its own paragraph?
    body: "Hong Kong is one of the best places in the world to own physical gold, and it is where J. Rotbart & Co. began. Since 2016 we have served families, family offices, and institutions from our office in Sheung Wan, a short walk from Central. Everything you might need to do with precious metals can be done here, through one team:",
  },
  cells: [
    // 11036:17633 / 17634
    serviceCell(
      "buy",
      buySell,
      "Buy precious metals",
      "Investment-grade physical gold, silver, platinum, and palladium bars and coins, sourced from accredited refiners, quoted against the live price with the premium shown separately",
    ),
    // 11036:17641 / 17642. "Sell" has no Service document of its own — the
    // buy-and-sell service covers both sides — so the cell references it and
    // links to its page. TODO(client): confirm the destination for "Sell".
    serviceCell(
      "sell",
      buySell,
      "Sell Precious Metals",
      "Two-way pricing as a standing habit. We quote a buyback with the same care as a purchase.",
    ),
    // 11036:17674 / 17675
    serviceCell(
      "storage",
      globalStorage,
      "Global Storage",
      `Segregated and allocated, insured storage in Hong Kong or any of our ${vaultCount} vault locations worldwide, recorded in your name with serial numbers.`,
    ),
    // 11036:17682 / 17683. TODO(client): the safe-deposit URL — services.ts
    // records two live URLs for this one service.
    serviceCell(
      "safe-deposit",
      safeDepositBox,
      "Safe Deposit Boxes",
      "Private, appointment-based boxes for valuables you want to hold yourself.",
    ),
    // 11036:17704 / 17705. TODO(client): "35 countries" needs sign-off
    // (services.ts carries the same figure).
    serviceCell(
      "shipping",
      globalShipping,
      "Global shipping",
      "Insured delivery to your Hong Kong address, between our vaults, or across 35 countries.",
    ),
    // 11036:17712 / 17713
    serviceCell(
      "lending",
      lendingAndFinance,
      "Lending and finance",
      "Liquidity against your metal without selling it.",
    ),
  ],
};

/* ------------------------------------------------------------------------ */
/* Testimonial bands — 11041:15467 and 11041:16391                           */
/* ------------------------------------------------------------------------ */

// The frame draws the SAME Albert Cheng band in both slots. Shipped as drawn.
// TODO(client): a second and third testimonial for the office page.
const testimonialAfterServices: TestimonialBandBlock = {
  ...testimonialOne,
  _key: "hk-testimonial-services",
};
const testimonialAfterTeam: TestimonialBandBlock = { ...testimonialOne, _key: "hk-testimonial-team" };

/* ------------------------------------------------------------------------ */
/* How it works — 11039:18655 (tinted, stacked header, five steps)           */
/* ------------------------------------------------------------------------ */

const steps: ProcessStepsBlock = {
  _key: "hk-steps",
  _type: "processSteps",
  theme: "tinted",
  headerLayout: "stacked",
  header: {
    overline: officePageLabels.howItWorks,
    // 11039:18706
    heading: "How a First Transaction Works",
  },
  // Numbers are rendered ("01"…"05"), so the frame's duplicated "04"
  // (11039:18713) cannot recur.
  steps: [
    {
      // 11039:18668 / 18669
      title: "A conversation, not a checkout page.",
      body: ["Tell us what you want to achieve and over what horizon. There is no commitment at this stage."],
    },
    {
      // 11039:18676 / 18677
      title: "A written quote.",
      body: ["You receive the live price and the premium as separate lines, in writing."],
    },
    {
      // 11039:18684 / 18685
      title: "Simple onboarding.",
      body: [
        "Identity checks proportionate to the transaction, as a serious market requires. Non-residents are welcome.",
      ],
    },
    {
      // 11039:18692 / 18693
      title: "Settlement.",
      body: ["The price locks on agreement and funds move by wire."],
    },
    {
      // 11039:18714 / 18715
      title: "Delivery or vaulting.",
      body: [
        "Your bars are verified and then delivered in Hong Kong, vaulted here in your name, or placed in any of our other jurisdictions. You receive the invoice, the serial-numbered bar list, and, if vaulted, the storage manifest.",
      ],
    },
  ],
  // I11120:15894. TODO(client): destination — see `speakCta`.
  cta: { label: "Start With a Conversation", href: "#contact", style: "solid" },
};

/* ------------------------------------------------------------------------ */
/* Why Hong Kong — the 11041:15386 frame (light, five blocks 96 apart)       */
/* ------------------------------------------------------------------------ */

const why: ProseSectionBlock = {
  _key: "hk-why",
  _type: "proseSection",
  theme: "light",
  layout: "split",
  header: {
    overline: officePageLabels.whatWeOffer,
    // 11120:16076
    heading: "Why Hong Kong Works for Gold Owners",
  },
  // 11120:16078 — one text node, four paragraphs, semibold lead-ins.
  // TODO(client): fact-check "more than 170 member firms", "150 tonnes toward
  // 1,000 tonnes" and "trial operation in July 2026" (dated claims need a
  // source and a review date).
  columns: [
    [
      "Three facts make this city unusually friendly to metal owners.",
      {
        runs: [
          { text: "The tax position is clean.", strong: true },
          " Hong Kong charges no GST, no VAT, and no sales tax on investment gold, and there is no capital gains tax on personal investments. You buy at the metal price plus a premium, and you sell without the government joining the transaction.",
        ],
      },
      {
        runs: [
          { text: "The market is deep.", strong: true },
          " The Chinese Gold and Silver Exchange has traded here since 1910 and counts more than 170 member firms. Deep markets mean competitive premiums and reliable two-way pricing, so you can sell where you bought.",
        ],
      },
      {
        runs: [
          { text: "The city is investing in gold.", strong: true },
          " The government has committed Hong Kong to becoming an international gold trading centre. The airport’s precious metals depository is expanding from 150 tonnes toward 1,000 tonnes of capacity, and a central clearing system for gold began trial operation in July 2026. Metal bought here is becoming easier to store, finance, and sell here.",
        ],
      },
    ],
  ],
};

const guide: CalloutBandBlock = {
  _key: "hk-guide",
  _type: "calloutBand",
  theme: "tinted",
  // 96 under the prose, on the same surface.
  seam: "default",
  ctaLayout: "inline",
  // I11041:15557;11010:13858
  heading:
    "For the full picture, including what to buy and what it costs, read our complete guide to buying gold in Hong Kong.",
  // The whole band is the link; the label is its accessible name only.
  // TODO(client): which guide — no URL is annotated. /resources/ is the
  // archive the guides live in; a direct post URL is better once chosen.
  cta: { label: "Read the guide to buying gold in Hong Kong", href: "/resources/", style: "arrow" },
};

const storage: MediaWithTextBlock = {
  _key: "hk-storage",
  _type: "mediaWithText",
  theme: "light",
  seam: "default",
  header: {
    // 11120:15998 — leading italic run, drawn 40/48 in a 32/44 heading;
    // rendered at the roman size (Amendment 3).
    heading: "Storing Precious Metal in Hong Kong",
    headingRuns: [{ text: "Storing Precious Metal", accent: true }, { text: " in Hong Kong" }],
  },
  // 11120:16000 — four paragraphs.
  // TODO(client): the fee schedule (0.50% → 0.26%, USD 500 minimum, insurance
  // included) is a published price and must be confirmed before launch.
  body: [
    "Where your gold is kept matters as much as where you bought it.",
    "Home safes concentrate risk and complicate insurance. Bank safe deposit boxes are scarce in Hong Kong, and the bank typically does not insure what is inside them, a gap most owners discover late.",
    "Professional allocated and segregated storage is the standard serious holders use, and Hong Kong is one of our most cost-effective locations for it. Your specific bars sit in a specialist vault in the city, identified by serial number, insured, and audited yearly. Annual fees for gold start from 0.50 percent of holding value and fall to 0.26 percent for larger holdings, with a minimum of USD 500 per year and insurance included.",
    `Your metal also does not have to stay in one place. Many clients hold part of a position in Hong Kong, for access, and part in Singapore, Zurich, or another of our ${vaultCount} locations, for jurisdictional balance. One team arranges all of it, and you read one consolidated manifest.`,
  ],
  media: {
    // 11120:15996, drawn 431 × 575. Exported 862w.
    src: "/figma/office-hk-reception--11120-15996.webp",
    // TODO(client): approve the alt text; staged photography — licence and
    // the original at ≥2× needed.
    alt: "A J. Rotbart & Co. colleague welcoming two visitors into the Hong Kong office, the harbour skyline through the window behind her",
    width: 431,
    height: 575,
  },
  mediaSide: "left",
  // 11120:15989 — image 431 @x=96, gutter 64, copy 679 @x=591; the copy
  // frame is drawn CENTER against the taller photo (400 in a 575 row).
  split: { media: 431, gap: 64, text: 679, align: "center" },
  ratio: "431/575",
};

/**
 * 11120:15913 — three paragraphs; the second is the brand-red registration
 * statement and is rendered only while the Office document carries licence
 * disclosures (a page for an office without them must not claim one).
 * TODO(client): the registration wording is compliance copy — confirm it
 * against the certificate, including "fit-and-proper" and the number.
 */
const regulationBody: MediaWithTextBlock["body"] = [
  "Precious metals dealing in Hong Kong is regulated under the Dealers in Precious Metals and Stones regime administered by the Customs and Excise Department.",
  ...(office.disclosures && office.disclosures.length > 0
    ? [
        {
          runs: [
            "J. Rotbart & Co. holds Category B registration, reflecting its compliance with applicable registration, fit-and-proper, and AML requirements. Registration No. B-B-23-11-02937.",
          ],
          tone: "accent" as const,
        },
      ]
    : []),
  "Client holdings are maintained fully allocated and segregated in the client’s name, with serial numbers recorded, appropriate insurance coverage maintained, and holdings independently verified.",
];

const regulation: MediaWithTextBlock = {
  _key: "hk-regulation",
  _type: "mediaWithText",
  theme: "light",
  seam: "default",
  header: {
    // 11120:15987 — leading italic run; see `storage`.
    heading: "Registered and Accountable in Hong Kong",
    headingRuns: [{ text: "Registered and Accountable", accent: true }, { text: " in Hong Kong" }],
  },
  body: regulationBody,
  media: {
    // 11120:15914, drawn 679 × 509. Exported 1358w.
    src: "/figma/office-hk-bar-review--11120-15914.webp",
    // TODO(client): approve the alt text; staged photography — licence and
    // the original at ≥2× needed.
    alt: "A J. Rotbart & Co. adviser and a client going through a bar list together in the vault viewing room, a gloved hand holding a tray of gold bars between them",
    width: 679,
    height: 509,
  },
  mediaSide: "right",
  // 11120:15907 — copy 431 @x=96, gutter 64, image 679 @x=591, copy CENTER
  // (396 in a 509 row). The WIDE column is the photograph here, the mirror of
  // `storage` above; drawn, not a typo.
  split: { media: 679, gap: 64, text: 431, align: "center" },
  ratio: "679/509",
};

const consult: CalloutBandBlock = {
  _key: "hk-consult",
  _type: "calloutBand",
  theme: "tinted",
  seam: "default",
  ctaLayout: "stacked",
  // I11120:15916;10753:11835
  heading: "Not sure where to begin? A consultation will help you order these decisions.",
  // I11120:15916;10753:11836;5207:2578 — drawn "Speak with a Value Expert"
  // (lower-case "with"; the hero button says "With"). Shipped as drawn.
  // TODO(client): destination and casing — see `speakCta`.
  cta: { label: "Speak with a Value Expert", href: "#contact", style: "arrow" },
};

/* ------------------------------------------------------------------------ */
/* Team — 11041:15863 (roster from team.ts, Jonathan Rotbart featured)      */
/* ------------------------------------------------------------------------ */

const team = teamGridBlock({ _key: "hk-team", office });

/* ------------------------------------------------------------------------ */
/* Visit us — 11041:16507                                                    */
/* ------------------------------------------------------------------------ */

const visit = officeVisitBlock({
  _key: "hk-visit",
  office,
  // 11120:15930
  heading: "Visit Us in Sheung Wan",
  // 11120:15932 — the frame sets "Sheung Wan MTR station Exit B and a short
  // walk from Central." in semibold. `SectionHeading.body` is plain text, so
  // the run is not bold here — recorded deviation; the fix is a Paragraph
  // body on OfficeVisitBlock (integrator request).
  body: "We are a few minutes on foot from Sheung Wan MTR station Exit B and a short walk from Central. Meetings are by appointment, so your visit is private and unhurried. If you are outside Hong Kong, the same conversation works by video call.",
  /*
     SHIPPED TO MATCH THE FRAME, at the client's explicit instruction, with the
     caveat recorded here rather than hidden.

     This artwork (11120:15943) is a map of SINGAPORE, not Hong Kong: the pin
     sits on Singapore's coastline and the marker card drawn INTO the bitmap
     reads "J. Rotbart & Co. — Singapore / Six Battery Road · Raffles Place".
     The designer copy-pasted the Singapore visit panel onto the Hong Kong page
     and updated only the text outside it.

     What ships is the map GROUP (11120:15944) cropped to the panel window, not
     the frame: the frame render has Figma's own "— Singapore, Six Battery Road"
     marker card baked into the bitmap, and our marker card is narrower, so the
     word "Singapore" showed past its edge. Cropping from the group gives clean
     artwork with our own correct Hong Kong card over it. The crop is the delta
     between the two absoluteBoundingBoxes (1672, 1492 at 1.7872 px/unit), NOT
     the group's frame-relative x/y — that mistake lands on empty ocean.

     The coastline is still the wrong one, which the alt text says plainly so a
     screen-reader user is told rather than handed a confident wrong caption.

     TODO(assets): BLOCKER before launch — a Hong Kong map for this panel.
     Until then this must not reach a public, indexable page. */
  map: {
    src: "/figma/office-hk-map--11120-15943.webp",
    alt:
      "Placeholder map from the design file. The coastline shown is the Malay " +
      "peninsula and Singapore, not Hong Kong. Awaiting Hong Kong map artwork.",
    width: 431,
    height: 574,
  },
  // Hours are the Office document's live value ("Monday to Friday, 9:30am –
  // 5:30pm HKT"), not the frame's "09.00 - 18.00" (11120:15939) — Amendment
  // 5. TODO(client): which is right (offices.ts note 6).
});

/* ------------------------------------------------------------------------ */
/* FAQ — 11041:16430 (eight questions, all drawn open)                       */
/* ------------------------------------------------------------------------ */

const faqs: Faq[] = [
  {
    _id: "hk-faq-appointment",
    // I11041:16437
    question: "Do I need an appointment to visit?",
    // The phone number is the Office document's, so it cannot drift from the
    // address card above.
    answer: [`Yes. Meetings are private and by appointment. Call ${office.phone} or use the form below.`],
  },
  {
    _id: "hk-faq-minimum",
    // I11041:16439
    question: "Is there a minimum purchase?",
    answer: [
      "No. You are welcome whether you are buying your first coin or building a position across three continents, and you receive the same pricing, care, and paperwork either way.",
    ],
  },
  {
    _id: "hk-faq-non-residents",
    // I11120:16123
    question: "Can non-residents buy gold in Hong Kong?",
    answer: [
      "Yes. Hong Kong places no restrictions on foreign ownership of bullion, and the whole process works by video call and wire transfer.",
    ],
  },
  {
    _id: "hk-faq-cash",
    // I11120:16130. TODO(client): "the registration Hong Kong requires for
    // cash payments" and "transactions of any size" are compliance claims —
    // confirm against the Category B registration's conditions.
    question: "Can I pay in cash?",
    answer: [
      "Yes. We hold the registration Hong Kong requires for cash payments, so cash is welcome for transactions of any size. Most clients simply find a bank wire more convenient.",
    ],
  },
  {
    _id: "hk-faq-buyback",
    // I11120:16137
    question: "Will you buy my metal back?",
    answer: [
      "Yes. We quote buyback prices with the same readiness as purchase prices, and we suggest you ask any dealer that question before your first purchase.",
    ],
  },
  {
    _id: "hk-faq-storage",
    // I11120:16144
    question: "Where will my metal be stored?",
    answer: [
      `In a professional vault in Hong Kong, or in any of our ${vaultCount} locations worldwide, always allocated in your name with serial numbers, insurance, and an annual independent audit.`,
    ],
  },
  {
    _id: "hk-faq-documents",
    // I11120:16151
    question: "What documents do I receive?",
    answer: [
      "The invoice, a bar list with serial numbers, and a storage manifest if your metal is vaulted. These documents make your metal a saleable asset from day one.",
    ],
  },
  {
    _id: "hk-faq-taxes",
    // I11120:16158. TODO(client): tax statements are launch-blocking legal
    // copy — confirm with counsel.
    question: "What taxes apply?",
    answer: [
      "Hong Kong charges no GST, VAT, or sales tax on investment gold, and no capital gains tax on personal investments. We are not tax advisors; for your overall position, consult your own advisor.",
    ],
  },
];

const faq: FaqAccordionBlock = {
  _key: "hk-faq",
  _type: "faqAccordion",
  theme: "tinted",
  header: {
    overline: officePageLabels.faq.overline,
    // 11041:16434 — "Asked" is the italic run, mid-string.
    heading: officePageLabels.faq.heading,
    headingAccent: "Asked",
  },
  faqs,
  footer: officePageLabels.faq.footer,
};

/* ------------------------------------------------------------------------ */
/* The page                                                                  */
/* ------------------------------------------------------------------------ */

export const hongKongPage: OfficePageContent = {
  seo: {
    // Keeps the commercial phrase the homepage hands to this URL
    // (src/pages/index.astro, NOTE(seo)). Live: "J. Rotbart & Co. | Buy Gold
    // Bars, Bullion, Coins in Hong Kong". TODO(client): sign-off — this moves
    // a primary term between two pages.
    title: "Buy Gold in Hong Kong | Bullion, Coins, Bars | J. Rotbart & Co.",
    // The hero paragraph (11043:18248). TODO(client): "for a decade" — see the
    // hero note; the live description is a different sentence.
    description: hero.header.body as string,
  },
  // "Offices" is the office listing (/offices/, P4). TODO(client): the
  // breadcrumb labels are template copy and belong in pages/office.ts
  // (integrator request).
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Offices", href: "/offices/" },
    { label: office.city, href: `/${office.slug}/` },
  ],
  // No menu item points at an office page today; "about" is where the office
  // listing sits (Amendment 19). TODO(client): nav placement.
  currentSection: "about",
  hero,
  logoStrip,
  services,
  testimonialAfterServices,
  steps,
  why,
  guide,
  storage,
  regulation,
  consult,
  team,
  testimonialAfterTeam,
  visit,
  faq,
  /* Frame 11041:16435 draws every row open, but that is a designer showing the
     copy in a frame, not a default state — so this no longer overrides the
     template, which opens one row inside an exclusive group as the homepage
     does. The live site ships its FAQ fully collapsed.
     TODO(client): one row open (current), or fully collapsed like the live
     site? Set `faqInitiallyOpen: "none"` for the latter. */
};
