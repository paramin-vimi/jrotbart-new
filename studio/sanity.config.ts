import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

/**
 * Sanity Studio for J. Rotbart & Co.
 *
 * SCOPE: blog posts only. Page content lives in the site repo as typed modules
 * and is edited by a developer — there is nothing here for homepage sections,
 * services, offices, navigation or the footer, by design.
 *
 * Deployment: `npm run deploy` publishes to <projectId>.sanity.studio.
 * Put Cloudflare Access in front of it, or use a custom domain
 * (studio.jrotbart.com) behind Access, so an unauthenticated request never
 * reaches the Studio bundle. Editors sign in with Google Workspace SSO — we
 * never create, store or reset a password.
 *
 * TODO(client): projectId comes from `sanity init`. See studio/README.md.
 */
export default defineConfig({
  name: "jrotbart",
  title: "J. Rotbart & Co.",

  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "",
  dataset: process.env.SANITY_STUDIO_DATASET ?? "production",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Posts")
              .schemaType("post")
              .child(
                S.documentTypeList("post")
                  .title("Posts")
                  .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
              ),
            S.divider(),
            // Grouped separately: these are set up once and rarely touched.
            S.listItem()
              .title("Categories")
              .schemaType("category")
              .child(S.documentTypeList("category").title("Categories")),
            S.listItem()
              .title("Authors")
              .schemaType("author")
              .child(S.documentTypeList("author").title("Authors")),
            S.listItem()
              .title("Tags")
              .schemaType("tag")
              .child(S.documentTypeList("tag").title("Tags")),
          ]),
    }),
    visionTool(),
  ],

  schema: { types: schemaTypes },

  document: {
    // Keep the Studio's "create new" menu to just posts — categories, authors
    // and tags are created from their own lists, which keeps the common path clean.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((t) => t.templateId === "post")
        : prev,
  },
});
