import type { GlobalNavigation, NavItem } from "./types";

/**
 * Global navigation.
 *
 * Menu labels and order come from the new Figma design (node 9898:11787), which
 * draws a caret on Services / Products / News & Events but does NOT draw the
 * panels behind them. The only mega menu in the file sits on the "Old" page —
 * it is the CURRENT live site, a dark three-column panel — so the panels here
 * are ours, rebuilt in the new design's light visual language.
 *
 * The item labels and one-line descriptions are the real ones from the live
 * site's mega menu, so nothing is invented copy.
 *
 * TODO(client): confirm these panels, and whether the descriptions should be
 * rewritten — several are terse to the point of being generic.
 */

const menu: NavItem[] = [
  { label: "Home", href: "/" },

  {
    label: "Services",
    href: "/services/",
    panelLabel: "What we do",
    columns: 2,
    children: [
      {
        label: "Buy & Sell Precious Metals",
        href: "/buying-precious-metals/",
        description: "Trade gold, silver, platinum and palladium securely",
        icon: "exchange",
      },
      {
        label: "Global Storage",
        href: "/global-storage/",
        description: "Insured vaults worldwide",
        icon: "vault",
      },
      {
        label: "Global Shipping",
        href: "/global-shipping/",
        description: "Secure, insured delivery",
        icon: "shipping",
      },
      {
        label: "Lending & Finance",
        href: "/lending-and-finance/",
        description: "Loans backed by your metals",
        icon: "lending",
      },
      {
        label: "Consultation & Advisory",
        href: "/consultation-and-advisory/",
        description: "Expert investment advice",
        icon: "advisory",
      },
      {
        label: "Authentication & Assaying",
        href: "/authentication-and-assaying/",
        description: "Verify purity and authenticity",
        icon: "authenticate",
      },
      {
        label: "Wealth Preservation",
        href: "/wealth-preservation/",
        description: "Protect your assets across generations",
        icon: "preserve",
      },
      {
        label: "Safe Deposit Box",
        href: "/safe-deposit-box-storage/",
        description: "Private, individual secure storage",
        icon: "box",
      },
    ],
    feature: {
      eyebrow: "Not sure where to start?",
      heading: "Talk to our value expert",
      body: "A short conversation is usually faster than reading eight service pages.",
      cta: { label: "Book a consultation", href: "/#contact" },
      theme: "red",
    },
  },

  {
    label: "Products",
    href: "/products-buy-gold-silver-platinum-palladium/",
    panelLabel: "Metals we deal in",
    columns: 2,
    children: [
      { label: "Gold", href: "/buy-gold/", description: "Safe. Liquid. Trusted.", icon: "bar-gold" },
      { label: "Silver", href: "/buy-silver/", description: "Accessible. Versatile. Valuable.", icon: "bar-silver" },
      {
        label: "Platinum",
        href: "/products-buy-gold-silver-platinum-palladium/#platinum",
        description: "Rare. Industrial. Resilient.",
        icon: "bar-platinum",
      },
      {
        label: "Palladium",
        href: "/products-buy-gold-silver-platinum-palladium/#palladium",
        description: "Clean. Powerful. Essential.",
        icon: "bar-palladium",
      },
    ],
    feature: {
      eyebrow: "LBMA-certified",
      heading: "Bars and coins from the world's leading refiners",
      body: "Heraeus, Argor-Heraeus, Metalor, Valcambi, PAMP and the Royal Canadian Mint.",
      cta: { label: "See all products", href: "/products-buy-gold-silver-platinum-palladium/" },
      theme: "tinted",
    },
  },

  {
    label: "News & Events",
    href: "/blogs-events-press/",
    panelLabel: "Insight and coverage",
    columns: 2,
    children: [
      { label: "Resources", href: "/resources/", description: "Guides and market analysis", icon: "resources" },
      { label: "News", href: "/news/", description: "Latest updates from the desk", icon: "news" },
      { label: "Events", href: "/events/", description: "Forums, talks and appearances", icon: "events" },
      { label: "Press", href: "/press/", description: "Media coverage and releases", icon: "press" },
    ],
    feature: {
      eyebrow: "Monthly",
      heading: "Golden Minutes",
      body: "Our monthly read on the precious metals market, sent straight to your inbox.",
      cta: { label: "Subscribe", href: "/subscribe-here/" },
      theme: "tinted",
    },
  },

  { label: "About us", href: "/about-us-gold-and-silver/" },
  { label: "FAQs", href: "/faq/" },
];

export const navigation: GlobalNavigation = {
  utilityLinks: [
    { label: "Contact Us", href: "#contact", icon: "mail" },
    { label: "Open an account", href: "/open-account/", icon: "account" },
  ],
  // The switcher mirrors the live site's: English plus the three alternates it
  // offers. These are NOT locales in an i18n sense — Hebrew is a separate
  // domain, Chinese is a single legacy page, and Singapore is an English
  // location page. They are links, which is what the live site does too.
  //
  // TODO(client): three known problems inherited from the current site —
  //   • /home-hebrew/ 301s off to jrotbart.co.il, so this leaves the site
  //   • the Chinese page declares lang="en-US" and has no hreflang
  //   • "Singapore" sits in a language menu but is an English page
  // Worth deciding whether this is a language switcher or a region switcher.
  // TODO(assets): the flags come from the live site — Figma's icon set only
  // ships US and TH, so there is no Israel, China or Singapore mark to export.
  languages: [
    { label: "English", href: "/", current: true, flag: "/flags/english.svg" },
    { label: "Hebrew", href: "https://jrotbart.co.il/", external: true, flag: "/flags/hebrew.svg" },
    { label: "Chinese", href: "/2012-2-%e4%b8%ad%e6%96%87/", flag: "/flags/chinese.svg" },
    { label: "Singapore", href: "/buy-gold-singapore/", flag: "/flags/singapore.svg" },
  ],
  menu,
  showPriceTicker: true,
};
