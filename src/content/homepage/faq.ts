// NOTE: the testimonial band that sits above this FAQ (Figma 10369:8987)
// is owned by ./testimonials.ts — a testimonial is a referenced document and
// must have exactly one definition.
import type {
  Cta,
  Faq,
  FaqAccordionBlock,
} from "../types";

/**
 * Homepage content — the second dark-red testimonial band (Figma "Featured",
 * node 10369:8987) and the FAQ accordion (Figma "FAQ", node 10216:11187).
 *
 * Sources
 *  - The testimonial is VERBATIM from the current live homepage
 *    (jrotbart.com, captured 2026-08-30); Figma renders the same quote.
 *  - The FAQ *questions* are verbatim from Figma. Figma authored exactly ONE
 *    answer (item 1). The other twelve were migrated from the company's own
 *    published copy on https://jrotbart.com/faq/ and the five-item accordion
 *    on the live homepage, matched question-by-question — every migrated
 *    answer carries a comment naming the live question it answered so the
 *    client can approve the match. Five questions have no live equivalent at
 *    all and carry a holding line plus TODO(client).
 *
 * Nothing here is lorem ipsum. Everything still needing a decision from
 * J. Rotbart is marked TODO(client); every interim image URL is TODO(assets).
 */

// ---------------------------------------------------------------------------
// Second testimonial band — Figma 10369:8987
//
// NOTE FOR THE PAGE AUTHOR: `src/content/homepage/testimonials.ts` (owned by
// the testimonial workstream) also exports a `testimonialTwo` built from the
// same live copy. They are interchangeable — import ONE of them in
// index.astro, not both, so the JSON-LD graph does not carry the video twice.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// FAQ — Figma 10216:11187
// ---------------------------------------------------------------------------

/**
 * `Faq` in types.ts has no way to say "this answer is a placeholder", and
 * types.ts is owned by another workstream, so the flag lives here. `DraftFaq`
 * extends `Faq`, so a `DraftFaq[]` is still a valid `Faq[]` for the block and
 * for `faqPageNode()`.
 */
interface DraftFaq extends Faq {
  /** true = holding line, not approved copy. Excluded from the FAQPage JSON-LD. */
  awaitingCopy?: true;
}

/**
 * Shown for questions that exist in the new design but have no answer anywhere
 * — not in Figma, not on the live site. It is deliberately a real, publishable
 * sentence rather than lorem, but it must not survive to launch.
 */
const AWAITING_COPY =
  "We are still writing the full answer to this question. In the meantime, please contact our team and we will answer it for you directly.";

/**
 * The thirteen questions, verbatim from Figma 10216:11192, in design order.
 * The live homepage carried five questions; eight of these are net-new.
 */
const faqItems: DraftFaq[] = [
  {
    _id: "faq-account-opening-time",
    question: "How long does it take to open an account?",
    // The only answer authored in Figma. Identical to the live homepage
    // accordion; the /faq/ page has a near-identical variant ("and then you
    // can begin"). Figma wins.
    answer: [
      "We can open an account within 8 hours upon receiving the necessary documents. Once approved, we will activate your account, and you can begin transacting whenever you wish.",
    ],
  },
  {
    _id: "faq-joint-account",
    question: "Can I open an account with my husband / wife / family members?",
    // Migrated verbatim from the live HOMEPAGE accordion, Q2 (the /faq/ page
    // carries an older wording of the same answer).
    answer: [
      "Yes, we offer joint accounts. The advantage is that goods can be accessed by other account holders, and in case of one account holder’s death, the other holders will still have access to the goods.",
    ],
  },
  {
    _id: "faq-how-to-buy",
    question: "How can I buy precious metals from you?",
    // Migrated verbatim from https://jrotbart.com/faq/ —
    // "I have an active account with J. Rotbart & Co. How do I purchase
    // precious metals?"
    // TODO(client): the source question assumed an account already exists.
    // The new question does not, so this answer may need a lead-in sentence
    // about opening an account first.
    answer: [
      "We will need some information from you such as which precious metal and in what form (bars or coins), how much you would like to buy, and what type of transport or storage you need. If you are unsure, we are happy to explain and assist you through this decision-making process.",
      "With this information, we prepare an order form on which you sign your approval. Once we receive the signed form and funds to our bank account, we will immediately execute your order, purchasing the precious metals you want on your behalf, transferring the title to your name, and storing it. You will then receive a storage receipt, a manifest with the bullion details, a photo of your goods, and an invoice.",
    ],
  },
  {
    _id: "faq-purchase-documentation",
    question: "What documentation will I receive for my purchase?",
    // TODO(client): no equivalent question exists on the live site. The
    // closest published copy is one sentence inside the buying-process answer
    // above — "a storage receipt, a manifest with the bullion details, a photo
    // of your goods, and an invoice" — which is a starting point, not an
    // answer. Please supply the full copy.
    answer: [AWAITING_COPY],
    awaitingCopy: true,
  },
  {
    _id: "faq-payment-methods",
    question: "What payment methods do you accept?",
    // Migrated verbatim from https://jrotbart.com/faq/ —
    // "What payment methods can I use?"
    answer: ["We accept bank wires and UnionPay."],
  },
  {
    _id: "faq-purchase-limits",
    question: "Do you have any purchase limits?",
    // Migrated verbatim from https://jrotbart.com/faq/ —
    // "Do you have set minimums or maximums for purchases?"
    answer: [
      "We truly believe that physical gold is a vital part of any well-balanced portfolio, so we have not set minimum or maximum amounts for purchases and work on an ad hoc basis.",
    ],
  },
  {
    _id: "faq-limit-orders",
    question: "Can I set the price for my precious metals purchases and sales?",
    // Migrated verbatim from https://jrotbart.com/faq/ —
    // "Do you offer precious metals purchases at predetermined prices
    // (limited orders)?"
    // TODO(client): the live answer covers PURCHASES only. The new question
    // also asks about sales — please confirm whether limit orders work on the
    // sell side and extend this answer.
    answer: [
      "Yes, we accept limit order transactions. You can set a target price, thus, guaranteeing your purchase at a predetermined price.",
    ],
  },
  {
    _id: "faq-product-range",
    question: "What types of precious metals or products do you handle?",
    // TODO(client): no single live answer covers this. Three published answers
    // on /faq/ are candidates to merge — "Where are your sources for precious
    // metals?", "Can I ask for a specific brand?" and "Can J. Rotbart & Co.
    // source numismatics and collectibles" — plus the live homepage line
    // "gold, silver, platinum, and palladium". Merging them here would be us
    // writing new marketing copy, so it is left for the client.
    answer: [AWAITING_COPY],
    awaitingCopy: true,
  },
  {
    _id: "faq-metal-pricing",
    question: "What is the price of precious metals?",
    // TODO(client): net-new question, no live equivalent. Presumably this
    // should explain the spot price + premium model and point at the live
    // ticker in the top bar.
    answer: [AWAITING_COPY],
    awaitingCopy: true,
  },
  {
    _id: "faq-buy-back",
    question: "Can I sell the precious metals I bought back to you?",
    // Migrated verbatim from https://jrotbart.com/faq/ —
    // "Do you buy back precious metals?"
    answer: [
      "Yes. As physical precious metals are highly liquid, we will be happy to assist you and buy back the precious metals we sold to you.",
    ],
  },
  {
    _id: "faq-third-party-metals",
    question: "Can I sell precious metals that I bought elsewhere to you?",
    // Migrated verbatim from https://jrotbart.com/faq/ —
    // "Do you buy metals that were not purchased through your company?"
    answer: [
      "Yes, we buy gold that wasn’t sourced from us. We may send the metals for inspection or authentication for confirmation. Once authenticated, we’ll wire you the proceeds.",
    ],
  },
  {
    _id: "faq-how-to-sell",
    question: "How can I sell precious metals to you?",
    // TODO(client): net-new. The live site documents the BUYING process in
    // detail but never the selling process end to end. Please supply the
    // sell-side equivalent (valuation, settlement, timing).
    answer: [AWAITING_COPY],
    awaitingCopy: true,
  },
  {
    _id: "faq-brokers-partnerships",
    question: "Do you work with brokers or offer business partnerships?",
    // TODO(client): net-new. Nothing on the live site addresses brokers,
    // introducers or referral arrangements.
    answer: [AWAITING_COPY],
    awaitingCopy: true,
  },
];

/**
 * Answers still awaiting client copy. Kept as a named export so the build can
 * be gated on it later; also surfaced as a build-time warning below.
 */
export const faqAwaitingCopy: readonly string[] = faqItems
  .filter((item) => item.awaitingCopy)
  .map((item) => item.question);

/**
 * The subset that is safe to emit as FAQPage structured data. Google treats
 * placeholder answers as low-quality markup, so `index.astro` should pass THIS
 * to `faqPageNode()`, not `faqAccordion.faqs`.
 */
export const faqSchemaFaqs: Faq[] = faqItems.filter((item) => !item.awaitingCopy);

/* Loud during `astro build` so the placeholders cannot ship silently. */
if (import.meta.env.PROD && faqAwaitingCopy.length > 0) {
  console.warn(
    `[content/faq] ${faqAwaitingCopy.length} FAQ answers are still TODO(client) and will render a holding line: ` +
      faqAwaitingCopy.join(" | "),
  );
}

/**
 * The bottom CTA.
 *
 * TODO(client): Figma does not give this button a destination. `#contact` is
 * the convention the rest of the homepage uses for "Talk to Our Value Expert",
 * so it is used here for consistency — confirm it should scroll to the on-page
 * contact block rather than open /contact-us/ or a modal.
 */
const footerCta: Cta = {
  label: "Talk to Our Value Expert",
  href: "#contact",
  style: "solid",
};

/**
 * `FaqAccordionBlock["footer"]` is `{ heading; cta }` — it has no body field,
 * and types.ts is owned by another workstream. The supporting paragraph is
 * therefore exported alongside the block and passed to the component as a
 * prop, the same pattern `socialFeedControls` uses in testimonials.ts.
 *
 * TODO(types): add `footer.body?: string` to `FaqAccordionBlock` and fold this
 * back into the block.
 */
export const faqFooterBody =
  "Speak with our Value Experts — Your enquiry will be treated in strict confidence and answered within 1 business day.";

export const faqAccordion: FaqAccordionBlock = {
  _key: "home-faq",
  _type: "faqAccordion",
  anchorId: "faq",
  theme: "tinted",
  header: {
    // Rendered uppercase by the .overline utility; stored sentence case so the
    // accessible text is not shouted at screen readers.
    overline: "People also asked",
    // `headingAccent` is the run WITHIN `heading` set in Playfair italic /
    // text-tertiary. Figma puts it mid-line ("Frequently *Asked* Questions"),
    // which the shared SectionHeader primitive cannot express — see the note
    // in FaqAccordion.astro. Same convention as SocialFeed.
    heading: "Frequently Asked Questions",
    headingAccent: "Asked",
  },
  faqs: faqItems,
  footer: {
    // U+2019 apostrophe, verbatim from Figma.
    heading: "Have a Question We Haven’t Answered Here?",
    cta: footerCta,
  },
};
