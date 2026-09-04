# Trading Indicators

One-page marketing site for a suite of six invite-only TradingView indicators
sold as a single $29/month subscription.

Next.js (App Router, static export) · Tailwind CSS v4 · shadcn/ui (Radix).

## Run

```bash
npm run dev      # http://localhost:3000
npm run build    # static site in ./out
```

Requires Node 20+. This machine's default `node` is Herd's 18.x, which
Next.js rejects — run `nvm use` first (see `.nvmrc`), or prefix commands with
`PATH=/usr/local/bin:$PATH`.

## Charts

Every product visual is inline SVG generated from seeded pseudo-random OHLC
data, rendered **on the server** — the charts ship as static markup and all
motion is CSS, so no JavaScript runs to draw them. Same seed, same chart,
every load.

- `lib/ohlc.ts` — seeded RNG, OHLC generation, and the shaping helpers that
  guarantee each setup (a sweep, a divergence, a retest) is actually present
  in the data.
- `lib/chart-parts.tsx` — panel geometry, candles, grid/axis, and the
  `Sketch` builder that collects overlay elements.
- `lib/charts.tsx` — one spec per indicator: seed, symbol, and the overlay
  drawing that demonstrates what the indicator does over an 8-second loop.

The detection vocabulary (pulsing node, expanding ring, teal level, dashed
divergence, slow sweep) and its keyframes live in `app/globals.css`.
`prefers-reduced-motion` freezes every loop at its end state.

## Knobs

| What | Where |
| --- | --- |
| Checkout URL (all CTAs) | `CHECKOUT_URL` in `lib/site.ts` |
| Slow radar sweep on/off | `SWEEP_ENABLED` in `lib/site.ts` |
| Accent colour | `--acc` in `app/globals.css` |
| Copy, bullets, FAQ | `lib/indicators.ts` |

### Swapping a chart for a recording

Each showcase accepts a video or image in place of the generated SVG. Drop the
file in `public/` and set `media` on that indicator in `lib/indicators.ts`:

```ts
{ slug: "po3", /* … */ media: "/clips/po3.mp4" }
```

`.mp4`, `.webm` and `.mov` render as an autoplaying muted loop; `.gif`, `.png`,
`.jpg` and `.webp` render as an image. Both inherit the chart's alt text.

### Contrast

The specified palette puts three tones below WCAG AA 4.5:1 for normal-size
text: muted `#7a7f87` (3.76:1), muted `#8d929a` (2.92:1) and the teal accent
(3.17:1). Add `data-contrast="aa"` to `<html>` to swap in the same hues
darkened to pass — see the note in `app/globals.css`.
# indicators
