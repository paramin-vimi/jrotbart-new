import { offices, primaryEmail } from "@content/offices";
import type { Faq, Seo, VideoRef } from "@content/types";

const SITE = "https://jrotbart.com";
const ORG_ID = `${SITE}/#organization`;

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

export function localBusinessNodes() {
  return offices.map((office) => ({
    "@type": "FinancialService",
    "@id": `${SITE}/#office-${office._id}`,
    name: `J. Rotbart & Co. — ${office.city}`,
    parentOrganization: { "@id": ORG_ID },
    url: SITE,
    ...(office.phone ? { telephone: office.phone } : {}),
    ...(office.email ? { email: office.email } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: office.address.slice(0, -1).join(", ") || office.address[0],
      addressLocality: office.city,
      addressCountry: office.country,
    },
    // `geo` intentionally omitted until real per-office coordinates are supplied.
    ...(office.openingHours ? { openingHours: office.openingHours } : {}),
  }));
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
    thumbnailUrl: v.poster.src,
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

export function webPageNode(seo: Seo, url: string) {
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: seo.title,
    description: seo.description,
    isPartOf: { "@id": `${SITE}/#website` },
    about: { "@id": ORG_ID },
  };
}

export function buildGraph(nodes: Array<object | null>) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}
