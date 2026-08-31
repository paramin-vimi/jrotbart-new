import type { HeroBlock } from "@content/types";

/**
 * Homepage hero — Figma node 9813:5485 (1366 × 700).
 *
 * COPY SOURCE
 * The Figma frame is not lorem here: every string below exists verbatim in the
 * design. Where the design and the current live site disagree, the note on the
 * field says which one won and why.
 *
 * IMAGES
 * All sources are Figma exports converted to WebP. The rasters in `/figma/` are
 * exported at 4x the size the design draws them at, which is why the
 * width/height below (the design size) is much smaller than the file's own
 * pixel dimensions — that headroom is what makes the marks sharp on retina.
 *
 * LAYER SIMPLIFICATION (see Hero.astro for the rendering side)
 * The Figma composition is six stacked layers: a full team photo that supplies a
 * grey studio wash, a pale chart illustration at 80% opacity, three flat scrims,
 * and a transparent-PNG cutout of the same team laid back over the scrims so the
 * people stay crisp. The live site already ships a single transparent PNG that
 * has the chart baked in behind the cut-out team — visually the union of Figma
 * layers 2 and 6 — so the build uses that one asset and reproduces the wash and
 * the three scrims with CSS gradients built from theme tokens. `media.photo` and
 * `media.chart` are therefore recorded here for the eventual Figma export but are
 * NOT rendered today; see the report.
 */
export const hero: HeroBlock = {
  _key: "home-hero",
  _type: "hero",
  theme: "tinted",

  /* Roman line, then the italic muted line. Two fields rather than one rich
     string because the break is deliberate and line 2 carries its own style.
     Identical wording to the live site's H1 (which uses a hard <br>). */
  headingLead: "Protect Your Wealth,",
  headingAccent: "Secure Your Future",

  /* Figma wording. The live site says "Buy Gold and Silver …"; the design
     tightens it to an ampersand. Design wins — this is new approved copy. */
  body: "Buy Gold & Silver Bullion, Bars, and Coins — Safely and Discreetly",

  cta: {
    label: "Talk to Our Value Expert",
    // TODO(client): confirm the destination. The live site's equivalent hero
    // button ("Talk to our precious metals experts") points at the on-page
    // #contact anchor; no URL is annotated in Figma.
    href: "#contact",
    style: "solid",
  },

  quickLinks: [
    {
      label: "Buy Gold",
      sublabel: "LBMA-Certified",
      // TODO(client): the live site links these tiles to /gold-bars-coins/ and
      // /silver-bars-coins/, but the main menu points at /buy-gold/ and
      // /buy-silver/. Two URLs for one destination — pick one before launch.
      href: "/gold-bars-coins/",
      icon: {
        /* Figma "image 129" — a gold medallion stamped GOLD. Drawn 24 x 24,
           exported at 96 px so it survives a 4x screen. */
        src: "/figma/image-129--10085-17896.webp",
        alt: "",
        decorative: true,
        width: 24,
        height: 24,
      },
    },
    {
      // Figma renders this label lowercase ("Buy silver"), which reads as a
      // typo against "Buy Gold" directly beside it — but the design is the
      // contract, so it ships verbatim.
      // TODO(client): confirm this is intentional; if not, it becomes "Buy Silver".
      label: "Buy silver",
      sublabel: "LBMA-Certified",
      href: "/silver-bars-coins/",
      icon: {
        /* Figma "image 130" — the same medallion in silver. */
        src: "/figma/image-130--10085-17902.webp",
        alt: "",
        decorative: true,
        width: 24,
        height: 24,
      },
    },
  ],

  /* Source text is "Member of:"; the OVERLINE style uppercases it in CSS, so
     the stored string keeps its natural casing. */
  accreditationLabel: "Member of:",

  accreditations: [
    {
      name: "Singapore Bullion Market Association",
      image: {
        /* Figma "image 177" — the SBMA lion-and-wordmark lockup, transparent.
           60 x 40 is the design size; Hero.astro reads this 1.5 aspect ratio to
           pick the landscape box rather than the 44 x 44 circle the two seals
           get. The old live PNG was 109 x 89, a different crop with a white
           matte baked in. */
        src: "/figma/image-177--10749-10938.webp",
        alt: "Singapore Bullion Market Association",
        width: 60,
        height: 40,
      },
    },
    {
      // The live site ships these two as certified2/certified3 with empty alt
      // and non-descriptive filenames. The Figma layers identify them.
      // TODO(client): confirm the exact registered names before launch.
      name: "Hong Kong Jewellery & Jade Manufacturers Association",
      image: {
        /* Figma "image 169" — a red circular seal. Now that it is sharp the
           mark is readable: it carries the acronym JGAHK over the Chinese name
           香港珠寶首飾業商會. That does not obviously expand to the English name
           held above — hence the open question on the name field. */
        src: "/figma/image-169--10749-10939.webp",
        alt: "Hong Kong Jewellery & Jade Manufacturers Association",
        width: 44,
        height: 44,
      },
    },
    {
      /* Name and alt now transcribe the seal's own ring, which the sharp
         export makes legible: "THE KOWLOON PEARLS, PRECIOUS STONES, JADE, GOLD
         AND SILVER ORNAMENT MERCHANTS ASSOCIATION". The previous string was a
         shortened paraphrase written when the mark was too small to read. */
      name: "The Kowloon Pearls, Precious Stones, Jade, Gold and Silver Ornament Merchants Association",
      image: {
        /* Figma "image 170" — the black-and-gold sunburst seal with a diamond
           at its foot. */
        src: "/figma/image-170--10749-10940.webp",
        alt: "The Kowloon Pearls, Precious Stones, Jade, Gold and Silver Ornament Merchants Association",
        width: 44,
        height: 44,
      },
    },
  ],

  media: {
    /* Figma composes the hero from independently placed layers. We now export
       and place them separately instead of using one pre-composited plate from
       the old site — that plate fixed the chart's position relative to the
       people, and it did not match the design.

       Geometry below is the Figma frame (1366 x 700), used verbatim by
       Hero.astro as percentages of the 1366 canvas. */

    /* Figma "jrt 1" — the cut-out team. Placed x 541.01, y 138, 790 x 548. */
    cutout: {
      src: "/hero/team.webp",
      // TODO(client): confirm. The live site ships this with an empty alt;
      // a twenty-person team photograph is content, not decoration.
      alt: "The J. Rotbart & Co. team photographed together",
      width: 790,
      height: 548,
    },

    /* Figma "image 194" — the pale candlestick chart BEHIND the team and
       UNDER the top scrim. Placed x 619.57, y 143, 651.6 x 403.7, opacity 0.8. */
    chart: {
      src: "/hero/chart.webp",
      alt: "",
      decorative: true,
      width: 652,
      height: 404,
    },

    /* Figma layer 1 — the full plate including its grey studio backdrop.
       It sits UNDER the three scrims, which is why it reads as a soft wash on
       the ground rather than a second copy of the photograph. The design does
       genuinely place the same shot twice: this one casts the wash, the cutout
       above restores crisp people over the scrims.
       3.2 MB as a PNG, 25 KB as WebP at 1266 wide — and since it is almost
       entirely low-frequency wash under a scrim, the compression is invisible. */
    photo: {
      src: "/hero/backdrop.webp",
      alt: "",
      decorative: true,
      width: 1266,
      height: 722,
    },
  },
};
