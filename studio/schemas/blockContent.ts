import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Body copy.
 *
 * Portable Text with a RESTRICTED set of marks and blocks. This is the single
 * most important schema in the project: it is what guarantees a published post
 * cannot break the design.
 *
 * There is no raw-HTML block and there never will be. The moment an editor can
 * paste HTML, every guarantee about the design holding is void — that is how
 * the WordPress site ended up shipping 620KB of markup per page.
 */
export const blockContent = defineType({
  name: "blockContent",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      // Only the levels the post template actually styles. The page <h1> is the
      // post title, so body headings start at h2.
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bulleted", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({
                name: "href",
                type: "url",
                title: "URL",
                validation: (Rule) =>
                  Rule.required().uri({ scheme: ["http", "https", "mailto", "tel"] }),
              }),
            ],
          }),
        ],
      },
    }),

    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
          validation: (Rule) => Rule.required().min(5),
        }),
        defineField({ name: "caption", type: "string", title: "Caption" }),
      ],
    }),

    defineArrayMember({
      name: "youtube",
      type: "object",
      title: "Video",
      fields: [
        defineField({
          name: "url",
          type: "url",
          title: "YouTube URL",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "title",
          type: "string",
          title: "Video title",
          description: "Used as the accessible name for the player.",
          validation: (Rule) => Rule.required(),
        }),
      ],
      preview: { select: { title: "title", subtitle: "url" } },
    }),

    defineArrayMember({
      name: "callout",
      type: "object",
      title: "Callout",
      description: "A highlighted note. Use sparingly.",
      fields: [
        defineField({
          name: "text",
          type: "text",
          rows: 3,
          validation: (Rule) => Rule.required(),
        }),
      ],
      preview: {
        select: { title: "text" },
        prepare: ({ title }) => ({ title: title?.slice(0, 60), subtitle: "Callout" }),
      },
    }),
  ],
});
