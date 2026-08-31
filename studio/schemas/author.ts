import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "role", type: "string", title: "Role or title" }),
    defineField({
      name: "bio",
      type: "text",
      rows: 3,
      description: "One or two sentences, shown as a byline on the post.",
      validation: (Rule) => Rule.max(400),
    }),
    defineField({
      name: "portrait",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "linkedin",
      type: "url",
      title: "LinkedIn profile",
    }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "portrait" } },
});
