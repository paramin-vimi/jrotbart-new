/**
 * Size class for an accreditation mark.
 *
 * Figma sizes the "Member of" marks individually: SBMA is a 60×40 landscape
 * lockup, the two association seals are 44×44 circles. There is no per-logo
 * size field in the content model, so the box is derived from the asset's own
 * aspect ratio — landscape gets the wide box, square gets the circle box.
 * Extracted from Hero.astro so the page heroes draw the same row.
 * (Figma says object-fit: cover for the SBMA lockup; the interim PNG is a
 * different crop, so it is contained rather than cropped until the export
 * lands — TODO(assets).)
 */
export const logoBox = (img: { width?: number; height?: number }): string =>
  img.width && img.height && img.width / img.height > 1.1
    ? "h-8 w-[54px] sm:h-10 sm:w-[60px]"
    : "h-9 w-9 sm:h-11 sm:w-11";
