import { defineField, defineType } from "sanity";

/**
 * Category — a fixed, small set. Categories are created by a developer, not by
 * editors: they map to real archive URLs (/news/, /press/, /events/,
 * /resources/) and adding one means adding a route.
 */
export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      description: "Drives the archive URL, e.g. /resources/. Do not change after launch.",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      description: "Shown on the archive page and used as its meta description.",
      validation: (Rule) => Rule.max(200),
    }),
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});
