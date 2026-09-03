import type { Paragraph, TextRun } from "@content/types";

/**
 * The `Paragraph` content type, normalised for rendering.
 *
 * A `Paragraph` is either a plain string or `{ runs, tone }` where every run is
 * a string or a `{ text, strong, em, href }` object. Components never inspect
 * that union themselves: they call `paragraphRuns()` and map the result to
 * <strong> / <em> / <a> (see src/components/primitives/Paragraph.astro), which
 * keeps `set:html` out of every block and keeps the three permitted marks the
 * only marks there are.
 */
export interface ParagraphRun {
  text: string;
  strong: boolean;
  em: boolean;
  href?: string;
}

const normaliseRun = (run: TextRun): ParagraphRun =>
  typeof run === "string"
    ? { text: run, strong: false, em: false }
    : { text: run.text, strong: run.strong === true, em: run.em === true, href: run.href };

/** The paragraph as a flat list of marked runs. A plain string is one unmarked run. */
export function paragraphRuns(paragraph: Paragraph): ParagraphRun[] {
  if (typeof paragraph === "string") return [normaliseRun(paragraph)];
  return paragraph.runs.map(normaliseRun);
}

/** "accent" = the brand-red tonal override (the HK registration paragraph). */
export function paragraphTone(paragraph: Paragraph): "default" | "accent" {
  return typeof paragraph === "string" ? "default" : (paragraph.tone ?? "default");
}

/** Plain text, marks dropped — for structured data, aria names and excerpts. */
export function paragraphText(paragraph: Paragraph): string {
  return paragraphRuns(paragraph)
    .map((run) => run.text)
    .join("");
}

/** Plain text of several paragraphs, separated by a space. */
export function paragraphsText(paragraphs: Paragraph[]): string {
  return paragraphs.map(paragraphText).join(" ");
}
