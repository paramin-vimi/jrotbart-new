import { defineField, defineType } from "sanity";

/**
 * Tag — kept deliberately shallow. The WordPress site accumulated 564 tags for
 * 463 posts, 283 of which were used exactly once, and every tag archive served
 * a zero-byte page. Tags here are for filtering only; they do not get archive
 * routes unless a developer adds them.
 */
export const tag = defineType({
  name: "tag",
  title: "Tag",
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
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});
