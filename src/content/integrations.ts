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

/**
 * Gleap — in-page feedback and bug reporting widget.
 *
 * Loaded on every page from BaseLayout. The snippet is the vendor's own: it
 * stubs `window.Gleap`, queues any calls made before the SDK arrives, then
 * appends their script to <head> and initialises it.
 *
 * The `sdkKey` is a PUBLIC client-side identifier — Gleap's own installation
 * instructions put it in the page source, and it is visible to anyone viewing
 * any site that uses Gleap. It is not a secret and does not belong in an
 * environment variable. (Note this repository is public, which changes nothing
 * for this value but would for a server-side key.)
 *
 * NOTE(privacy): like b2blead and Elfsight above, this is a third-party script
 * that can set cookies and identify visitors — Gleap records sessions and
 * captures screenshots when a user files feedback. It is listed here so the
 * consent layer this site still needs has one place to gate against, and so it
 * is obvious what the pages load from other people's servers.
 */
export const gleap = {
  sdkKey: "EjBOLbqdda0qiiofhByGzpY8WPMCfR0T",

  /** The vendor snippet, verbatim apart from the key being interpolated. */
  get snippet() {
    return `!function(){if(!(window.Gleap=window.Gleap||[]).invoked){window.GleapActions=[];var e=new Proxy({invoked:!0},{get:function(e,n){return"invoked"===n?e.invoked:function(){var e=Array.prototype.slice.call(arguments);window.GleapActions.push({e:n,a:e})}},set:function(e,n,t){return e[n]=t,!0}});window.Gleap=e;var n=document.getElementsByTagName("head")[0],t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src="https://sdk.gleap.io/latest/index.js",n.appendChild(t),window.Gleap.initialize("${this.sdkKey}")}}();`;
  },
} as const;
