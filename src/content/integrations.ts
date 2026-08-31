/**
 * Third-party integrations.
 *
 * Kept in one place so it is obvious what the site loads from other people's
 * servers, and so a consent layer has a single list to gate against.
 *
 * NOTE(privacy): these are third-party scripts that can set cookies and
 * identify visitors. The site currently has no consent management platform, and
 * the audience includes the EU, UK and Israel. That was flagged in the
 * readiness report and is still outstanding — it is a launch blocker, not a
 * nice-to-have. Nothing here is gated yet.
 */

export const b2blead = {
  /**
   * Contact form. b2blead "enhance" mode takes over an existing, ordinary
   * <form> whose field names it recognises — ours are already name / email /
   * phone / message — and posts to its own endpoint. Without JavaScript the
   * form still submits natively to `submitEndpoint` below, so there is no
   * fake-submission path and no dead form.
   */
  formId: "frm_83263af103934df77e3d157dcbbd1a500903",

  /** Footer newsletter signup. Same enhance mechanism as the contact form. */
  newsletterFormId: "frm_a58966c7431f379b9e6183f413b7d4480613",

  /** Where the form posts. Same URL the deploy script uses. */
  get submitEndpoint() {
    return `https://portal.b2blead.ai/api/forms/deploy/${this.formId}`;
  },

  /** The deploy script that enhances the contact form. */
  get formScript() {
    return `https://portal.b2blead.ai/api/forms/deploy/${this.formId}`;
  },

  get newsletterSubmitEndpoint() {
    return `https://portal.b2blead.ai/api/forms/deploy/${this.newsletterFormId}`;
  },

  get newsletterScript() {
    return `https://portal.b2blead.ai/api/forms/deploy/${this.newsletterFormId}`;
  },

  /**
   * Site-wide b2blead deployment (the AI chat agent). Loaded on every page.
   * The `v=` query string is a cache-busting version stamp issued by b2blead —
   * keep it verbatim; changing it silently pins an older build.
   */
  deploymentScript:
    "https://portal.b2blead.ai/api/deployment/e3803516-e9e5-4a4d-b558-58aa2e9ebeaf?v=2026-08-10T11%3A09%3A52.945%2B00%3A00",
} as const;

/**
 * Elfsight LinkedIn Feed — the "Latest Updates" section.
 *
 * CLIENT DECISION: keep Elfsight and embed it as-is, accepting the trade-offs.
 * Worth having them written down, because they are real:
 *   • Elfsight renders the section, so it does NOT match the Figma cards.
 *   • It is client-side only, so the section is invisible to search engines —
 *     a crawler sees the heading above an empty div. The live site has the
 *     same problem today.
 *   • ~44KB of third-party JS plus their own runtime requests.
 *   • Their carousel brings its own controls, which replaces the prev/next
 *     buttons we built.
 *
 * The alternative, if any of that starts to matter, is to keep our own card
 * component and populate it from the CMS. Their post data is not reachable
 * server-side — only the widget config is — so a build-time fetch would mean
 * depending on an undocumented private endpoint.
 */
export const elfsight = {
  appId: "9468f01e-fe66-439f-89e9-5e7b7d0508f6",
  platformScript: "https://static.elfsight.com/platform/platform.js",
} as const;
