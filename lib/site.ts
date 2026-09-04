/** Checkout. All "Get Access" CTAs point here. */
export const CHECKOUT_URL =
  "https://www.tradeuniv.com/c/the-po3-sequence/tier/all-indicators/checkout";

/** Spread onto a CTA anchor: opens checkout in a new tab, without handing
 *  the destination a reference back to this window. */
export const CHECKOUT_LINK = {
  href: CHECKOUT_URL,
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

/** Master switch for the slow radar sweep (hero + Sessions charts). */
export const SWEEP_ENABLED = true;
