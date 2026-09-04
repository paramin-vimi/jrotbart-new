/**
 * Keyboard access for horizontal scroll containers.
 *
 * A region that scrolls but contains nothing focusable is unreachable by
 * keyboard: there is no element to Tab to, so the arrow keys never get a scroll
 * target and whatever is past the fold cannot be read at all. That is WCAG
 * 2.1.1 Keyboard (Level A), and axe reports it as
 * `scrollable-region-focusable`.
 *
 * Two components hit this on the Phase 2 pages, both measured:
 *   - the ProcessSteps rail at 768 hid 756px of content (steps 3-5 of 5);
 *   - the ComparisonTable wrapper at 768 clipped 48px of the highlighted
 *     "J. Rotbart & Co." column.
 *
 * WHY A SHARED HELPER. LogoStrip.astro solved this first and its script is the
 * precedent this file generalises — including the non-obvious part, that
 * removing `tabindex` from the element which currently HAS focus silently drops
 * the caret to <body>. LogoStrip keeps its own copy deliberately: it ships on
 * the homepage, which is held byte-identical, so it is not worth re-rendering
 * to share code. New callers use this.
 *
 * THE TABINDEX IS ADDED HERE, NOT IN THE MARKUP — the opposite of LogoStrip.
 * Both rails contain real text but no controls, and both stop scrolling at
 * wide viewports (ProcessSteps becomes a 5-up grid at 1200, ComparisonTable
 * fits above ~816). Shipping the attribute would leave a permanent dead tab
 * stop on every desktop view. With JavaScript off the content is still fully
 * readable at those widths, so the fail-safe direction differs from
 * LogoStrip's, where logos 3 and 4 would have been unreachable outright.
 */

/** Elements that take keyboard focus on their own. */
const FOCUSABLE = "a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1'])";

/**
 * Give every matching element a tab stop while — and only while — it actually
 * overflows and holds nothing focusable of its own.
 *
 * @param selector  CSS selector for the scroll containers.
 * @param label     Accessible name applied alongside the tab stop. Omitted when
 *                  the element already names itself (aria-label / -labelledby).
 */
export function syncScrollableRegions(selector: string, label?: string): void {
  const regions = Array.from(document.querySelectorAll<HTMLElement>(selector));
  if (regions.length === 0) return;

  /* Deferred removal: blurring the focused element would drop the caret to
     <body> mid-page. Keeping a tab stop one resize longer is the harmless
     direction of the two. */
  const drop = (el: HTMLElement) => {
    if (document.activeElement !== el) {
      el.removeAttribute("tabindex");
      return;
    }
    el.addEventListener("blur", () => el.removeAttribute("tabindex"), { once: true });
  };

  const sync = (el: HTMLElement) => {
    /* +1 absorbs sub-pixel rounding — a 720.4px row in a 720px box is not
       real overflow. */
    const scrolls = el.scrollWidth > el.clientWidth + 1;
    const hasFocusable = el.querySelector(FOCUSABLE) !== null;

    if (scrolls && !hasFocusable) {
      el.setAttribute("tabindex", "0");
      if (label && !el.hasAttribute("aria-label") && !el.hasAttribute("aria-labelledby")) {
        el.setAttribute("aria-label", label);
      }
    } else {
      drop(el);
    }
  };

  /* ResizeObserver rather than a window resize listener: it fires on the
     element's own box, which also covers the breakpoint where the layout
     changes shape (the rail becomes a grid) without the viewport resizing.
     Mutating tabindex has no layout effect, so this cannot loop. */
  const observer = new ResizeObserver((entries) => {
    entries.forEach((entry) => sync(entry.target as HTMLElement));
  });

  regions.forEach((el) => {
    sync(el);
    observer.observe(el);
  });
}
