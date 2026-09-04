import { offices, primaryEmail } from "@content/offices";
import type { Faq, Office, ProductDetail, Seo, VideoRef } from "@content/types";
import { paragraphText } from "./paragraph";

// Derived from `site` + `base` in astro.config.mjs rather than duplicating the
// origin here, so a preview build cannot assert production @ids from a host
// that does not own them. An @id is an entity identifier: a preview emitting
// "https://jrotbart.com/#organization" is claiming to BE the production entity.
// In production `import.meta.env.SITE` is exactly "https://jrotbart.com" and
// BASE_URL is "/", so this evaluates to the identical string it always did.
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, "");
export const SITE = import.meta.env.SITE.replace(/\/+$/, "") + BASE;
const ORG_ID = `${SITE}/#organization`;

/** A root-relative asset path made absolute from SITE; absolute URLs pass through. */
export const absoluteUrl = (path: string): string =>
  /^https?:\/\//.test(path) ? path : `${SITE}${path.startsWith("/") ? "" : "/"}${path}`;

/**
 * Structured data.
 *
 * The current site emits only WebPage / ImageObject / BreadcrumbList / WebSite —
 * no Organization, no LocalBusiness for four offices, no FAQPage for five
 * on-page Q&As, no VideoObject for six videos. All of that is free once content
 * is structured, so we emit it from the same documents that render the page.
 */

export function organizationNode() {
  return {
    "@type": ["Organization", "FinancialService"],
    "@id": ORG_ID,
    name: "J. Rotbart & Co.",
    alternateName: "J.Rotbart & Co",
    url: SITE,
    email: primaryEmail,
    description:
      "Boutique family-owned bullion house specialising in buying, selling, storing, shipping and financing physical gold, silver, platinum and palladium.",
    areaServed: ["Hong Kong", "Singapore", "Philippines", "Israel"],
    sameAs: [] as string[], // TODO(client): supply LinkedIn / Instagram / X / YouTube / Facebook profile URLs
    subOrganization: offices.map((o) => ({ "@id": `${SITE}/#office-${o._id}` })),
  };
}

/**
 * Offices whose page (`/${office.slug}/`) is BUILT by this site. A LocalBusiness
 * node's `url` points at its own page only when one exists; otherwise at the
 * site root. Add a slug here in the same change that adds its route
 * (src/pages/<slug>.astro) — the two must move together.
 */
const OFFICE_ROUTES: ReadonlySet<Office["slug"]> = new Set<string>([
  // src/pages/buy-gold-hong-kong.astro
  "buy-gold-hong-kong",
]);

const DAY_NAMES: Record<string, string> = {
  Mo: "Monday",
  Tu: "Tuesday",
  We: "Wednesday",
  Th: "Thursday",
  Fr: "Friday",
  Sa: "Saturday",
  Su: "Sunday",
};
const DAY_ORDER = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/**
 * "Mo-Fr 09:30-17:30" → an OpeningHoursSpecification. The schema.org
 * `openingHours` shorthand is itself valid, but the expanded form is what the
 * rich-result tooling reads reliably, and the parse is trivial. Returns null
 * for a string it cannot read, so a typo cannot emit half a specification.
 */
export function openingHoursSpecification(schema: string) {
  const match = /^([A-Z][a-z])(?:-([A-Z][a-z]))?\s+(\d{2}:\d{2})-(\d{2}:\d{2})$/.exec(schema.trim());
  if (!match) return null;
  const [, from, to, opens, closes] = match;
  const start = DAY_ORDER.indexOf(from!);
  const end = to ? DAY_ORDER.indexOf(to) : start;
  if (start < 0 || end < 0) return null;
  // A range may wrap past the end of the ISO week: "Su-Th" is the Israeli
  // working week (Sunday to Thursday), not a typo.
  const days =
    end >= start
      ? DAY_ORDER.slice(start, end + 1)
      : [...DAY_ORDER.slice(start), ...DAY_ORDER.slice(0, end + 1)];
  return {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: days.map((d) => DAY_NAMES[d]),
    opens,
    closes,
  };
}

export function localBusinessNodes() {
  return offices.map((office) => {
    const hours = office.openingHours ? openingHoursSpecification(office.openingHours.schema) : null;
    return {
      "@type": "FinancialService",
      "@id": `${SITE}/#office-${office._id}`,
      name: `J. Rotbart & Co. — ${office.city}`,
      parentOrganization: { "@id": ORG_ID },
      url: OFFICE_ROUTES.has(office.slug) ? `${SITE}/${office.slug}/` : SITE,
      ...(office.phone ? { telephone: office.phone } : {}),
      ...(office.email ? { email: office.email } : {}),
      address: {
        "@type": "PostalAddress",
        streetAddress: office.address.slice(0, -1).join(", ") || office.address[0],
        addressLocality: office.city,
        addressCountry: office.country,
      },
      // `geo` intentionally omitted until real per-office coordinates are supplied.
      ...(office.mapUrl ? { hasMap: office.mapUrl } : {}),
      ...(hours ? { openingHoursSpecification: [hours] } : {}),
    };
  });
}

/** The nodes every page carries: the organisation, its offices, the website. */
export function siteGraph() {
  return [organizationNode(), ...localBusinessNodes(), webSiteNode()];
}

export function faqPageNode(faqs: Faq[]) {
  if (faqs.length === 0) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer.join(" ") },
    })),
  };
}

export function videoNodes(videos: VideoRef[]) {
  return videos.map((v) => ({
    "@type": "VideoObject",
    name: v.title,
    // Absolute: a root-relative thumbnailUrl is invalid in structured data.
    thumbnailUrl: absoluteUrl(v.poster.src),
    embedUrl: `https://www.youtube.com/embed/${v.youtubeId}`,
    uploadDate: undefined, // TODO(client): publication dates per video
  }));
}

export function webSiteNode() {
  return {
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    url: SITE,
    name: "J. Rotbart & Co.",
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

export function webPageNode(
  seo: Seo,
  url: string,
  options: { type?: "WebPage" | "CollectionPage" | "ItemPage"; about?: { "@id": string } } = {},
) {
  return {
    "@type": options.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: seo.title,
    description: seo.description,
    isPartOf: { "@id": `${SITE}/#website` },
    about: options.about ?? { "@id": ORG_ID },
  };
}

export function breadcrumbNode(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function serviceNode(service: {
  url: string;
  name: string;
  description: string;
  serviceType: string;
  areaServed: string[];
}) {
  return {
    "@type": "Service",
    "@id": `${service.url}#service`,
    url: service.url,
    name: service.name,
    description: service.description,
    serviceType: service.serviceType,
    areaServed: service.areaServed,
    provider: { "@id": ORG_ID },
  };
}

export function itemListNode(url: string, items: { name: string; url: string }[]) {
  return {
    "@type": "ItemList",
    "@id": `${url}#list`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

/**
 * A Product node WITHOUT an Offer: the site quotes privately and shows no
 * prices, and an Offer with no price is worse than none. `relatedUrls` are the
 * absolute URLs of the "Often held alongside" products that have pages.
 */
export function productNode(product: ProductDetail, url: string, relatedUrls: string[] = []) {
  return {
    "@type": "Product",
    "@id": `${url}#product`,
    url,
    name: product.name,
    image: [product.image, ...product.gallery].map((img) => absoluteUrl(img.src)),
    description: product.summary,
    ...(product.sku ? { sku: product.sku } : {}),
    brand: { "@type": "Organization", name: product.mint.name },
    manufacturer: { "@type": "Organization", name: product.mint.name },
    material: product.metal,
    additionalProperty: product.specGroups.flatMap((group) =>
      group.rows.map((row) => ({
        "@type": "PropertyValue",
        name: row.label,
        value: row.value,
      })),
    ),
    ...(relatedUrls.length ? { isRelatedTo: relatedUrls.map((u) => ({ "@id": `${u}#product` })) } : {}),
  };
}

/** Plain-text body for descriptions built from Paragraph content. */
export const plainText = paragraphText;

export function buildGraph(nodes: Array<object | null>) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}
