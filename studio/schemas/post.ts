import { defineField, defineType } from "sanity";

/**
 * Post — the one document type the marketing team creates.
 *
 * Scope note: the CMS manages blog posts only. Page content (homepage sections,
 * services, offices, FAQ, navigation, footer) lives in version-controlled typed
 * modules in the site repo and is edited by a developer.
 *
 * Every rule below exists to stop a published post breaking the design or the
 * SEO. There is deliberately no raw-HTML field and no free-form layout.
 */
export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "meta", title: "Publishing" },
    { name: "seo", title: "SEO & sharing" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) =>
        Rule.required()
          .min(10)
          .max(120)
          .warning("Titles over ~70 characters get truncated in Google results."),
    }),

    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      group: "content",
      description:
        "The web address for this post, e.g. jrotbart.com/why-gold-holds-value. " +
        "Changing it after publishing breaks existing links — ask a developer to add a redirect first.",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      group: "content",
      // The WordPress data proves this is a clean partition: across all 463
      // posts, not one belongs to more than one category.
      description: "Every post belongs to exactly one category.",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      group: "content",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "featuredImage",
      title: "Featured image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      description:
        "Shown on cards, archives and when the post is shared. Landscape works best. " +
        "Use the hotspot to set what stays visible when the image is cropped.",
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          description:
            "Describe the image for people using a screen reader, and for search engines. " +
            "Required — 71 of 76 images on the old site had none.",
          validation: (Rule) => Rule.required().min(5).max(160),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      group: "content",
      description:
        "One or two sentences shown on cards and archive pages. Written, not auto-truncated.",
      validation: (Rule) => Rule.required().min(40).max(280),
    }),

    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "downloads",
      title: "Downloads",
      type: "array",
      group: "content",
      description:
        "PDFs attached to this post — Golden Minutes, quarterly reports, press clippings.",
      of: [
        defineField({
          name: "download",
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              title: "Label",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "file",
              type: "file",
              title: "File",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "isCurrent",
              type: "boolean",
              title: "Current version",
              initialValue: true,
              description:
                "Uncheck when a newer version supersedes this file. Superseded files are " +
                "hidden from the site rather than deleted, so old links do not 404.",
            }),
          ],
          preview: { select: { title: "label" } },
        }),
      ],
    }),

    defineField({
      name: "publishedAt",
      title: "Publish date",
      type: "datetime",
      group: "meta",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "meta",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
      description:
        "Optional. Keep it to a handful of established tags — the old site had 564 tags " +
        "for 463 posts, 283 of them used exactly once, which helped nobody.",
      validation: (Rule) => Rule.max(6).unique(),
    }),

    defineField({
      name: "featured",
      title: "Feature on the homepage",
      type: "boolean",
      group: "meta",
      initialValue: false,
      description:
        "The homepage normally shows the three most recent posts automatically. " +
        "Tick this to pin a post there instead.",
    }),

    // ---- SEO -------------------------------------------------------------
    defineField({
      name: "metaTitle",
      title: "Search engine title",
      type: "string",
      group: "seo",
      description: "Leave blank to use the post title. Aim for under 60 characters.",
      validation: (Rule) =>
        Rule.max(60).warning("Over 60 characters will be truncated in search results."),
    }),

    defineField({
      name: "metaDescription",
      title: "Search engine description",
      type: "text",
      rows: 2,
      group: "seo",
      description:
        "The grey text under the title in Google. Leave blank to use the excerpt. " +
        "Aim for 120–155 characters.",
      validation: (Rule) =>
        Rule.max(155).warning("Over 155 characters will be truncated in search results."),
    }),

    defineField({
      name: "ogImage",
      title: "Social sharing image",
      type: "image",
      group: "seo",
      options: { hotspot: true },
      description: "Optional. Falls back to the featured image.",
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
    }),

    defineField({
      name: "noindex",
      title: "Hide from search engines",
      type: "boolean",
      group: "seo",
      initialValue: false,
      description:
        "The post stays live at its URL but asks Google not to list it. " +
        "Used for event pages that have passed.",
    }),
  ],

  orderings: [
    {
      title: "Newest first",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],

  preview: {
    select: {
      title: "title",
      category: "category.title",
      date: "publishedAt",
      media: "featuredImage",
    },
    prepare({ title, category, date, media }) {
      const when = date
        ? new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "No date";
      return { title, subtitle: [category, when].filter(Boolean).join(" · "), media };
    },
  },
});
