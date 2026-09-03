/**
 * Map projection for the office / vault location map.
 *
 * The Figma world map (10980:13190, a 1174×660 band) is a plain Mercator
 * drawing. Fitting the five drawn office pins gave the affine Mercator below
 * with a residual of at most 1px:
 *
 *   x_px = kx · lon + x0
 *   y_px = −ky · ln(tan(π/4 + lat/2)) + y0
 *
 * Pins are therefore placed from real coordinates instead of hand-measured
 * pixel offsets, and they stay correct whenever the band scales because the
 * result is a PERCENTAGE of the band, not a pixel.
 */
export interface MercatorFit {
  kx: number;
  x0: number;
  ky: number;
  y0: number;
}

export interface Band {
  w: number;
  h: number;
}

export interface MapPoint {
  /** Percentage of the band width, 0–100. */
  xPct: number;
  /** Percentage of the band height, 0–100. */
  yPct: number;
  /** Pixel position on the reference band, for checks against the drawing. */
  x: number;
  y: number;
}

/** The band the Figma office map is drawn on (10980:13190). */
export const OFFICE_MAP_BAND: Band = { w: 1174, h: 660 };

/** Fit on the five drawn office pins, from the office-listing inventory. */
export const OFFICE_MAP_FIT: MercatorFit = { kx: 3.588, x0: 485.3, ky: 195.8, y0: 413.5 };

const DEG = Math.PI / 180;

/** Returns a projector from (lat, lng) degrees to a point on `band`. */
export function projectMercator(band: Band, fit: MercatorFit) {
  return (lat: number, lng: number): MapPoint => {
    const x = fit.kx * lng + fit.x0;
    const y = -fit.ky * Math.log(Math.tan(Math.PI / 4 + (lat * DEG) / 2)) + fit.y0;
    return { x, y, xPct: (x / band.w) * 100, yPct: (y / band.h) * 100 };
  };
}

/** The projector for the office map, ready to use. */
export const projectOfficeMap = projectMercator(OFFICE_MAP_BAND, OFFICE_MAP_FIT);

/**
 * Number → word, for the headings and stats that quote a count of offices or
 * vaults ("Four Offices. Sixteen Vaults.", "Five offices. Owner-operated,
 * everywhere."). The Figma frames hard-code "Five" / "Fifteen"; the content
 * derives them from `offices.length` / `vaults.length` so there is one place
 * to correct when Bangkok or a vault is added — hence it lives beside the map
 * projection that draws the same pins. Covers 0–20 (the design range); larger
 * numbers fall back to digits, which is still correct copy.
 */
const NUMBER_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen",
  "nineteen", "twenty",
] as const;

/** "four", "sixteen"; `capitalise` for sentence / heading position. */
export function numberWord(n: number, capitalise = false): string {
  const word = Number.isInteger(n) && n >= 0 && n < NUMBER_WORDS.length ? NUMBER_WORDS[n]! : String(n);
  return capitalise ? word.charAt(0).toUpperCase() + word.slice(1) : word;
}
