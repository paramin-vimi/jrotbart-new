import { getClient, isSanityConfigured } from "./sanity";
import { seedPosts, seedCategories } from "@content/posts/seed";
import type { Article, ArticleCategory } from "@content/types";

/**
 * The post data layer.
 *
 * Every route and component reads posts through these functions, never through
 * the Sanity client directly. That keeps GROQ in one place and means the seed
 * fallback works everywhere without special-casing.
 */

export interface PortableTextBlock {
  _type: string;
  _key: string;
  [key: string]: unknown;
}

export interface PostImage {
  /** Resolved URL. For Sanity images this is a CDN URL with format negotiation. */
  src: string;
  srcset?: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface PostAuthor {
  name: string;
  slug: string;
  role?: string;
  bio?: string;
  portrait?: PostImage;
}

export interface PostCategory {
  title: string;
  slug: string;
  description?: string;
}

export interface PostDownload {
  label: string;
  url: string;
  isCurrent: boolean;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  category: PostCategory;
  author: PostAuthor;
  publishedAt: string;
  excerpt: string;
  featuredImage: PostImage;
  /** Portable Text. Empty for seed posts, which carry `bodyHtml` instead. */
  body: PortableTextBlock[];
  downloads: PostDownload[];
  tags: string[];
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: PostImage;
  noindex: boolean;
}

// ---------------------------------------------------------------------------
// GROQ
// ---------------------------------------------------------------------------

const POST_FIELDS = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  "category": category->{ title, "slug": slug.current, description },
  "author": author->{
    name,
    "slug": slug.current,
    role,
    bio,
    portrait
  },
  publishedAt,
  excerpt,
  featuredImage,
  body,
  "downloads": downloads[]{ label, isCurrent, "url": file.asset->url },
  "tags": tags[]->title,
  featured,
  metaTitle,
  metaDescription,
  ogImage,
  noindex
`;

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

/**
 * All published posts, newest first.
 *
 * Falls back to the seed set when Sanity is not configured, so the site builds
 * and renders before the CMS project exists.
 */
export async function getAllPosts(): Promise<Post[]> {
  const client = getClient();
  if (!client) return seedPosts;

  try {
    const posts = await client.fetch<Post[]>(
      /* groq */ `*[_type == "post" && defined(slug.current) && publishedAt <= now()]
        | order(publishedAt desc) { ${POST_FIELDS} }`
    );
    return posts.map(normalise);
  } catch (error) {
    // A CMS outage must not fail a deploy. Log loudly, ship the seed set.
    console.warn(
      "[posts] Sanity fetch failed, falling back to seed content:",
      error instanceof Error ? error.message : error
    );
    return seedPosts;
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.category.slug === categorySlug);
}

export async function getCategories(): Promise<PostCategory[]> {
  const client = getClient();
  if (!client) return seedCategories;

  try {
    return await client.fetch<PostCategory[]>(
      /* groq */ `*[_type == "category"] | order(title asc) {
        title, "slug": slug.current, description
      }`
    );
  } catch {
    return seedCategories;
  }
}

/**
 * Posts for the homepage news grid.
 *
 * Editors can pin a post with the `featured` flag; otherwise it is simply the
 * most recent N. Pinned posts sort first, then by date.
 */
export async function getHomepagePosts(limit = 3): Promise<Post[]> {
  const posts = await getAllPosts();
  return [...posts]
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.publishedAt.localeCompare(a.publishedAt);
    })
    .slice(0, limit);
}

// ---------------------------------------------------------------------------
// Adapters
// ---------------------------------------------------------------------------

/**
 * Map a Post onto the `Article` shape the homepage NewsGrid already consumes,
 * so wiring the CMS in did not change that component's signature.
 */
export function toArticle(post: Post): Article {
  const titleCase = (s: string) =>
    s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

  return {
    _id: post._id,
    title: post.title,
    category: titleCase(post.category.title) as ArticleCategory,
    date: post.publishedAt,
    excerpt: post.excerpt,
    image: {
      src: post.featuredImage.src,
      alt: post.featuredImage.alt,
      width: post.featuredImage.width,
      height: post.featuredImage.height,
    },
    href: `/${post.slug}/`,
  };
}

/** Resolve Sanity image objects to plain URLs so components stay CMS-agnostic. */
function normalise(post: Post): Post {
  return {
    ...post,
    downloads: (post.downloads ?? []).filter((d) => d.isCurrent),
    tags: post.tags ?? [],
    featured: post.featured ?? false,
    noindex: post.noindex ?? false,
  };
}

export { isSanityConfigured };
