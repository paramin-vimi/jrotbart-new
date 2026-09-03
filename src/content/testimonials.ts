import type { Testimonial, TestimonialBandBlock } from "./types";

/**
 * Testimonial documents and the two dark-red testimonial bands (Figma
 * "Featured", nodes 10369:8974 and 10369:8987).
 *
 * Site-wide, not homepage-scoped: every page frame draws the Albert Cheng band
 * (two or three times each), so the documents live here and the pages
 * reference them. The `_key`s are kept from the homepage module they moved out
 * of; a page that draws the same band twice gives each instance its own key.
 *
 * Sources: quotes, names, organisations and video IDs are VERBATIM from the
 * current live homepage (jrotbart.com, captured 2026-08-30). The Figma renders
 * the same two quotes, so nothing here is invented. The two portraits are the
 * Figma exports of the 320x320 video cards (nodes I10369:8974 and I10369:8987).
 *
 * TODO(client): every other page frame repeats THIS band in every testimonial
 * slot. A second and third testimonial are needed before those pages read as
 * anything but a placeholder.
 */

// ---------------------------------------------------------------------------
// Testimonials (referenced documents — reused by the schema layer)
// ---------------------------------------------------------------------------

export const albertCheng: Testimonial = {
  _id: "albert-cheng-sbma",
  // Live site renders three author line-breaks here; Figma renders one
  // paragraph that wraps naturally to four lines at the 758px measure.
  // Figma wins — hard breaks at authored positions do not survive a
  // narrower measure.
  quote:
    "Since joining the Singapore Bullion Market Association in 2017, J. Rotbart & Co. has been an invaluable part of our community. Congratulations on your 10th anniversary. A remarkable milestone reflecting the trust you have built with high net worth clients worldwide.",
  name: "Albert Cheng",
  organisation: "SBMA",
  portrait: {
    src: "/figma/frame-1686562793--I10369-8974_10369-8854.webp",
    alt: "Albert Cheng, CEO of the Singapore Bullion Market Association, photographed against a background of gold bars, beside the J. Rotbart & Co. 10 years lockup.",
    width: 320,
    height: 320,
  },
  video: {
    youtubeId: "DskL_tMoXIk",
    // Portrait Short — the lightbox sizes itself from this.
    aspect: "9/16",
    // TODO(client): confirm this against the real YouTube title — it is used
    // verbatim in the VideoObject structured data.
    title: "Albert Cheng, SBMA, on ten years of J. Rotbart & Co.",
    poster: {
      src: "/figma/frame-1686562793--I10369-8974_10369-8854.webp",
      alt: "Albert Cheng, CEO of the Singapore Bullion Market Association, photographed against a background of gold bars.",
      width: 320,
      height: 320,
    },
  },
};

export const euKim: Testimonial = {
  _id: "eu-kim-alvarez-marsal",
  // The newline is authored — Figma shows an explicit break after "years."
  // TestimonialBand preserves it as a real <br>.
  quote:
    "Congratulations to J. Rotbart & Co. on 10 remarkable years.\nA testament to your excellence, integrity, and the incredible team; including Joshua, Lakh, Marco, and Elly.",
  name: "Eu Kim",
  // TODO(client): the Figma spec transcribes this band's attribution as
  // "EU KIM, ALVAREZ AND MARSAL" (comma) while the SBMA band is
  // "ALBERT CHENG - SBMA" (hyphen). TestimonialBand renders one separator for
  // both — a hyphen, matching the band that was measured verbatim. Confirm
  // whether the second band really uses a comma; if so the separator has to
  // become a per-testimonial field in types.ts.
  organisation: "Alvarez and Marsal",
  portrait: {
    src: "/figma/frame-1686562793--I10369-8987_10369-8854.webp",
    alt: "Eu Kim of Alvarez and Marsal, photographed against a background of gold bars, beside the J. Rotbart & Co. 10 years lockup.",
    width: 320,
    height: 320,
  },
  video: {
    youtubeId: "XLSnajMWpno",
    // Portrait Short — the lightbox sizes itself from this.
    aspect: "9/16",
    // TODO(client): confirm against the real YouTube title.
    title: "Eu Kim, Alvarez and Marsal, on ten years of J. Rotbart & Co.",
    poster: {
      src: "/figma/frame-1686562793--I10369-8987_10369-8854.webp",
      alt: "Eu Kim of Alvarez and Marsal, photographed against a background of gold bars.",
      width: 320,
      height: 320,
    },
  },
};

export const testimonials: Testimonial[] = [albertCheng, euKim];

// ---------------------------------------------------------------------------
// Testimonial bands — the same component, two instances, different content
// ---------------------------------------------------------------------------

/** First band. Figma 10369:8974, sits directly under the product grid. */
export const testimonialOne: TestimonialBandBlock = {
  _key: "testimonial-sbma",
  _type: "testimonialBand",
  theme: "dark",
  testimonial: albertCheng,
};

/** Second band. Figma 10369:8987 — identical component, different content. */
export const testimonialTwo: TestimonialBandBlock = {
  _key: "testimonial-alvarez-marsal",
  _type: "testimonialBand",
  theme: "dark",
  testimonial: euKim,
};
