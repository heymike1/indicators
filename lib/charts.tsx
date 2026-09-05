import {
  type Bar, series, swing, hhmm,
  liftHigh, capHigh, dropLow, raiseLow, hiIdx, loIdx, hiVal, loVal,
} from "./ohlc";
import { Sketch, mkPanel, GridAndAxis, Candles, shiftBar, type Panel } from "./chart-parts";

export type ChartKey = "hero" | "po3" | "gbtime" | "ssmt" | "qt" | "smt" | "sessions";

/** price axis width — wide enough for "20,173.25" in 10px mono */
const GUTTER = 66;

/** Advanced PO3 Ranges draws in its own colours; these are lifted from the
 *  indicator rather than the site's teal, so the visual is the real product. */
const PO3 = {
  high: "#c2453c",   // range high zone
  low: "#2f8f5b",    // range low zone
  eq: "#c8791f",     // equilibrium
  fcl: "#8d929a",    // fair correction level bands
  fractal: "#6b7078", // fractal equilibrium, one step darker so it reads
  ink: "#15171a",
};

/* A 243 range divides into three 81 blocks. The FCLs sit on the block
   boundaries, the fractal EQ in the middle of the outer blocks, and the
   ERD/IRD band runs a third of a block either side of each range boundary.
   Only the labels carry the scale; the geometry below is the same set of
   fractions of the half-range whichever level of the hierarchy is shown: */
/** Quarterly Theory colours a quarter by its position in its cycle. The
 *  colour of a cycle's own label is therefore which quarter it is of the
 *  cycle above it, which is what makes the nesting readable. */
const QT_Q = ["#8d929a", "#d64545", "#2f8f5b", "#3d7fbf"];
const QT_CYCLES: [string, number][] = [
  ["NYAM Q1", 0],
  ["NYAM Q2", 1],
  ["NYAM Q3", 2],
  ["NYAM Q4", 3],
];

/** QT SSMT draws its cycle comparison in a single violet. */
const QT = { line: "#6d5bd0", rule: "#c9ccc6" };

/** GB Time marks each timing point in its own colour. */
const GB = {
  x: "#d64545",    // the anchor
  se: "#3d7fbf",   // session events
  num: "#dda13a",  // remaining points in the sequence
  ink: "#15171a",
  rule: "#c9ccc6",
  tint: "#3d7fbf",
};

/** The sequence as the indicator lists it. On a one-minute chart the offset
 *  from the anchor is the minute on the label, so the two are one number. */
const GB_MARKS: [number, keyof typeof GB][] = [
  [0, "x"], [3, "se"], [7, "se"], [14, "num"], [23, "num"], [29, "se"], [44, "num"],
];
/** the point in the sequence that runs the anchor's liquidity */
const GB_SWEEP = 7;

const GB_TABLE: { label: string; cells: string[] }[] = [
  { label: "Algo 1", cells: ["0", "11(14)", "41(44)", "3(7)", "17(23)", "29(35)|71(77)", "Next → 17:03"] },
  { label: "Algo 2", cells: ["3(7)", "59(65)", "17(23)", "11(14)", "47(50)|53(56)", "29(35)", ""] },
  { label: "Clock", cells: ["3(7)", "11(14)", "17(23)", "29(35)", "41(44)", "47(50)|53(56)", "59(65)"] },
];
/** cells that light up once the active window forms */
const GB_LIVE = new Set(["0-2", "0-3", "2-5"]);

const P = {
  dev: 2 / 9,    // 81  — ERD / IRD either side of the range boundary
  fcl: 1 / 3,    // 243 — block boundary
  fractal: 2 / 3, // mid-point of the outer 243 block
};


type Meta = Record<string, number | number[][]>;

type Spec = {
  seed: number; seed2?: number;
  base: number; base2?: number;
  vol: number; vol2?: number;
  drift: number;
  dec: number; dec2?: number;
  t0: number; step: number; every: number;
  n: { lg: number; sm: number };
  /** extra headroom above the candles, for chart furniture drawn on top */
  padT?: { lg: number; sm: number };
  /** vertical slack around the price range, as a fraction of it */
  vpad?: number;
  /** right-hand strip reserved for level labels, as the indicator draws them */
  labelW?: { lg: number; sm: number };
  /** strip reserved below the time axis, for an indicator's own panel */
  footer?: { lg: number; sm: number };
  /** label the first bar too, when the axis starts on a boundary */
  axisFromZero?: boolean;
  /** body width as a share of the slot; a denser chart needs a little more
   *  to read like the rest of the set */
  body?: number;
  /** print the candles left to right, like a replay on fast forward */
  print?: { step: number; start: number };
  /** use a deliberate shape instead of the random walk */
  swing?: { path?: [number, number][]; amp?: number; chop?: number; noise?: number };
  dual?: boolean;
  labels?: [string, string];
  alt: string;
  shapeOne?: (d: Bar[], sp: Spec) => Meta;
  shapeTwo?: (a: Bar[], b: Bar[], sp: Spec) => Meta;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  draw: (p: any, s: Sketch, small: boolean, W: number, H: number, m: any) => void;
};

export const SPECS: Record<ChartKey, Spec> = {
  /* ---------- hero: NQ 5m, the whole suite at once ---------- */
  hero: {
    seed: 91741, base: 20128, vol: 9.5, drift: 0.35, dec: 2,
    t0: 9 * 60 + 30, step: 5, every: 12,
    n: { lg: 72, sm: 48 },
    alt: "NQ1! 5-minute chart with a New York session band, a Power of Three range, GB Time verticals and a swept buy-side liquidity level.",
    shapeOne(d, sp) {
      const n = d.length;
      const sh = hiIdx(d, Math.round(n * 0.3), Math.round(n * 0.58));
      const sw = Math.min(n - 5, Math.round(n * 0.84));
      for (let i = sh + 1; i < sw; i++) capHigh(d, i, d[sh].h - sp.vol * 0.5);
      liftHigh(d, sw, d[sh].h + sp.vol * 0.45);
      return { sh, sw };
    },
    draw(p: Panel, s, small, W, H, m) {
      const n = p.n;

      // NY AM session band
      const a = Math.round(n * 0.25), b = Math.round(n * 0.56);
      s.band(p.x(a) - p.slot / 2, p.x(b) + p.slot / 2, p.boxTop, p.boxBot, { op: 0.028, delay: 0.15 });
      s.text(p.x(a) + 6, p.boxTop + 16, "NY AM", { delay: 0.3, skipSmall: true });

      // PO3 range with equilibrium
      const q0 = Math.round(n * 0.36), q1 = Math.round(n * 0.75);
      const hi = hiVal(p.data, q0, q1), lo = loVal(p.data, q0, q1), eq = (hi + lo) / 2;
      s.box(p.x(q0) - p.slot / 2, p.y(hi), p.x(q1) + p.slot / 2, p.y(lo), { dash: "4 3", delay: 0.8 });
      s.line(p.x(q0) - p.slot / 2, p.y(eq), p.x(q1) + p.slot / 2, p.y(eq), { dash: "2 3", delay: 1.15 });
      s.text(p.x(q0) + 4, p.y(eq) - 6, "PO3 · EQ", { delay: 1.3, skipSmall: true });

      // two GB time verticals
      [Math.round(n * 0.44), Math.round(n * 0.66)].forEach((i, k) => {
        s.line(p.x(i), p.boxTop + 4, p.x(i), p.boxBot - 4, { dash: "3 4", delay: 1.6 + k * 0.3 });
        s.text(p.x(i) + 5, p.boxBot - 6, hhmm(SPECS.hero.t0 + i * 5), { delay: 1.75 + k * 0.3, skipSmall: true });
      });

      // buy-side liquidity level: swing high → the candle that sweeps it
      const yh = p.y(p.data[m.sh].h);
      s.line(p.x(m.sh), yh, p.x(m.sw), yh, { acc: true, w: 1.2, draw: true, delay: 2.3 });
      s.text(p.x(m.sh) + 6, yh - 7, "BSL", { acc: true, delay: 2.8, skipSmall: true });

      // targeting node on the sweep candle
      const sx = p.x(m.sw), sy = p.y(p.data[m.sw].h);
      s.corners(sx, sy, 11);
      s.node(sx, sy);
      s.text(sx + 16, sy - 10, "SMT · sweep", { acc: true, late: true, skipSmall: true });

      s.sweep(p, H, 11);
    },
  },

  /* ---------- 01 Advanced PO3 Ranges: ES 15m ---------- */
  po3: {
    seed: 30518, base: 20335.5, vol: 5.5, drift: 0.3, dec: 2,
    t0: 8 * 60, step: 1, every: 12,
    n: { lg: 66, sm: 44 },
    padT: { lg: 20, sm: 16 },
    // zoomed out so the full level structure, ERD bands included, sits inside
    vpad: 0.28,
    labelW: { lg: 118, sm: 0 },
    print: { step: 0.05, start: 0 },
    swing: {
      // steps down and back up rather than a clean arc, so each leg leaves a
      // swing high or low behind and the retracements are legible
      path: [
        [0, 0.35], [0.06, 0.72], [0.09, 0.5], [0.13, 1],
        [0.19, 0.42], [0.24, 0.7], [0.3, 0.12], [0.35, 0.4],
        [0.42, -0.3], [0.47, -0.05], [0.53, -0.62], [0.57, -0.4], [0.61, -1],
        [0.67, -0.45], [0.72, -0.72], [0.78, -0.1], [0.83, -0.38],
        [0.89, 0.42], [0.93, 0.2], [1, 1],
      ],
      amp: 8.5,
      chop: 1.15,
    },
    alt: "NQ 1-minute chart with the Power of Three range high and low zones, equilibrium, fair correction levels and fractal equilibrium plotted as price develops.",
    shapeOne(d) {
      const n = d.length;
      // the early peak sets the range high; the late rally comes back to it
      const hiI = hiIdx(d, 0, Math.round(n * 0.35));
      const loI = loIdx(d, Math.round(n * 0.4), Math.round(n * 0.88));
      const rHigh = d[hiI].h;
      const rLow = d[loI].l;
      const eq = (rHigh + rLow) / 2;

      // close the tape on the range high, without printing through it
      const tail = Math.round(n * 0.88);
      for (let i = tail; i < n; i++) {
        shiftBar(d[i], (rHigh - d[i].c) * ((i - tail + 1) / (n - tail)) * 0.85);
        capHigh(d, i, rHigh);
      }
      // the final bar touches the level exactly, so the node sits on its wick
      liftHigh(d, n - 1, rHigh);
      capHigh(d, n - 1, rHigh);
      return { rHigh, rLow, eq, hiI, loI };
    },
    draw(p: Panel, s, small, W, H, m) {
      // every level is a third of the half-range: FCL at 1/3, fractal EQ at
      // 2/3, the range boundary at 1, with the ERD/IRD zone straddling it
      const h = (m.rHigh - m.rLow) / 2;
      const at = (k: number) => p.y(m.eq + k * h);
      const L = p.left;
      const R = p.right;                     // levels stop at the plot edge
      const lx = small ? 0 : R + 8;          // labels live in the margin beyond it
      const line = (k: number, o: Parameters<typeof s.line>[4]) => s.line(L, at(k), R, at(k), o);
      // centred on its own level, so the whole stack mirrors about EQ
      const tag = (k: number, text: string, color: string, delay: number, size?: number) =>
        s.text(lx, at(k) + 3.4, text, { color, delay, size, skipSmall: true });

      // --- range boundaries: a zone either side, the level through it ---
      // the low zone carries more fill than the high one: at equal opacity a
      // pale green reads far weaker on white than a pale red
      ([
        [1, PO3.high, "Range High (243)", 0.9, 0.09],
        [-1, PO3.low, "Range Low (243)", 2.5, 0.12],
      ] as [number, string, string, number, number][]).forEach(
        ([dir, color, label, delay, op]) => {
          s.band(L, R, at(dir * (1 + P.dev)), at(dir * (1 - P.dev)), { color, op, delay });
          line(dir, { color, w: 1.2, delay });
          tag(dir, label, color, delay + 0.25);
          tag(dir * (1 + P.dev), "(ERD)", PO3.fcl, delay + 0.25, 8.5);
          tag(dir * (1 - P.dev), "(IRD)", PO3.fcl, delay + 0.25, 8.5);
        }
      );

      // --- equilibrium of the whole range ---
      line(0, { color: PO3.eq, w: 1.2, dash: "2 3", delay: 3.1 });
      tag(0, "EQ: 243", PO3.eq, 3.35);

      if (!small) {
        // --- fair correction levels on the 243 block boundaries ---
        ([[1, "Upper FCL: 81"], [-1, "Lower FCL: 81"]] as [number, string][]).forEach(([dir, label], i) => {
          const delay = 3.5 + i * 0.25;
          const k = dir * P.fcl;
          s.band(L, R, at(k + 0.075), at(k - 0.075), { color: PO3.ink, op: 0.035, delay });
          [k + 0.075, k, k - 0.075].forEach((y) => line(y, { color: PO3.fcl, w: 1, op: 0.85, delay }));
          tag(k, label, PO3.ink, delay + 0.2);
        });

        // --- fractal EQ: the mid-point of each outer 243 block ---
        [P.fractal, -P.fractal].forEach((k, i) => {
          const delay = 4.0 + i * 0.2;
          line(k, { color: PO3.fractal, w: 1.1, dash: "2 3", delay });
          tag(k, "Fractal EQ", PO3.ink, delay + 0.2);
        });
      }

      // --- price rallies back to retest the range high ---
      s.node(p.x(p.n - 1), at(1), { color: PO3.high });
    },
  },

  /* ---------- 02 GB Time: NQ 5m, New York ---------- */
  gbtime: {
    seed: 60223, base: 20340, vol: 5.5, drift: 0, dec: 2,
    t0: 7 * 60 + 30, step: 1, every: 12,
    n: { lg: 80, sm: 46 },
    vpad: 0.13,
    padT: { lg: 34, sm: 22 },
    footer: { lg: 92, sm: 0 },
    print: { step: 0.035, start: 0 },
    // Climbs in a staircase of higher lows into the anchor, holds near it
    // through the sweep, then drops away sharply. The sequence marks bars 0,
    // 3, 7, 14, 23, 29 and 44 after the anchor, and the shape puts a peak on
    // each of them; shapeOne then guarantees it against the ripple.
    swing: {
      path: [
        [0, -0.55], [0.05, -0.12], [0.085, -0.36], [0.14, 0.28], [0.175, 0.02],
        [0.225, 0.66], [0.25, 0.44], [0.275, 1],
        [0.295, 0.62], [0.3125, 0.93], [0.34, 0.58], [0.3625, 0.97],
        [0.39, 0.05], [0.45, 0.5],
        [0.485, -0.2], [0.5625, 0.26],
        [0.585, -0.42], [0.6375, -0.04],
        [0.685, -0.68], [0.73, -0.42], [0.765, -0.85], [0.825, -0.46],
        [0.88, -0.92], [1, -0.98],
      ],
      amp: 9,
      chop: 1.05,
    },
    alt: "NQ 1-minute chart with the GB Time sequence marked on price and the Algo 1, Algo 2 and Clock schedule listed below.",
    shapeOne(d, sp) {
      const n = d.length;
      // fixed, so every marked bar is known: searching for it let the ripple
      // move the anchor and drag the whole sequence off its peaks
      const anchor = Math.round(n * 0.275);
      const sweep = anchor + GB_SWEEP;
      const hi = d[anchor].h;

      // nothing between the two touches the anchor high, so the sweep reads
      for (let i = anchor + 1; i < sweep; i++) capHigh(d, i, hi - sp.vol * 0.55);

      if (sweep < n) {
        // the sweep bar runs the high by a little and closes back underneath
        const was = d[sweep].c;
        const b = d[sweep];
        b.o = d[sweep - 1].c;
        b.h = hi + sp.vol * 0.32;
        b.c = hi - sp.vol * 1.05;
        b.l = b.c - sp.vol * 0.35;
        // carry the rejection through, so the tape stays continuous
        const drop = b.c - was;
        for (let i = sweep + 1; i < n; i++) shiftBar(d[i], drop);
        for (let i = sweep + 1; i < n; i++) capHigh(d, i, hi - sp.vol * 0.5);
      }

      // Every GB time has to sit on a swing high. Rather than lift the marked
      // bars — which would fight the caps above — press their neighbours down,
      // so each marked bar is the highest within two bars either side.
      // Shift the neighbour down bodily rather than capping its high: capHigh
      // pulls the open and close only part of the way, and the bar's own high
      // is then restored to whichever of the three is highest, so a large cap
      // does not bite.
      const marked = new Set(GB_MARKS.map(([off]) => anchor + off));
      for (const i of marked) {
        if (i >= n) continue;
        for (const j of [i - 2, i - 1, i + 1, i + 2]) {
          if (j < 0 || j >= n || marked.has(j)) continue;
          const excess = d[j].h - (d[i].h - sp.vol * 0.4);
          if (excess > 0) shiftBar(d[j], -excess);
        }
      }
      return { anchor, sweep, hi };
    },
    draw(p: Panel, s, small, W, H, m) {
      const anchor: number = m.anchor;

      // --- the anchor's price, carried across as a reference ---
      s.line(p.left, p.y(p.data[0].o), p.right, p.y(p.data[0].o), {
        color: GB.rule, w: 1, dash: "1 3", delay: 0.5,
      });

      // --- each timing point appears as its candle prints ---
      const sweep: number = m.sweep;
      const step = SPECS.gbtime.print!.step;
      GB_MARKS.forEach(([off, kind]) => {
        const i = anchor + off;
        if (i >= p.n) return;
        const delay = 0.15 + i * step;
        // the sweep bar carries the targeting mark, so its label steps up
        const lift = i === sweep ? 17 : 0;
        const top = p.y(p.data[i].h) - lift;
        const color = GB[kind];
        if (kind === "x" || kind === "se") {
          s.text(p.x(i), top - 22, kind === "x" ? "X" : "SE", {
            anchor: "middle", color, size: 9, delay,
          });
        }
        s.text(p.x(i), top - 10, String(off), { anchor: "middle", color, size: 10.5, delay });
      });

      // --- the anchor high, and the bar that takes it ---
      if (sweep < p.n) {
        const hiY = p.y(m.hi);
        const seen = 0.15 + anchor * step;      // the moment the 0 prints
        const taken = 0.1 + sweep * step;       // the moment the 7 prints
        s.line(p.x(anchor), hiY, p.x(sweep) + p.slot, hiY, { color: GB.x, w: 1.2, delay: seen });
        // sniper mark on the bar that runs it
        const sx = p.x(sweep);
        const sy = p.y(p.data[sweep].h);
        s.corners(sx, sy, 11, { color: GB.x, late: false, delay: taken + 0.25 });
        s.node(sx, sy, { color: GB.x, late: false, delay: taken + 0.25 });
      }

      if (small) return;

      // --- the sequence table: known ahead, so it lands early ---
      const rowH = 24;
      const ty = H - 88;
      const tx = 150;
      const labelW = 62;
      const colW = 78;
      const tw = labelW + colW * 7;

      GB_TABLE.forEach((row, r) => {
        const y = ty + r * rowH;
        s.band(tx, tx + labelW, y, y + rowH, { color: GB.ink, op: 0.04, delay: 0.4 });
        s.text(tx + 8, y + rowH / 2 + 3.4, row.label, { color: GB.ink, size: 9.5, delay: 0.55 });

        row.cells.forEach((cell, c) => {
          if (!cell) return;
          const cx = tx + labelW + c * colW;
          const live = GB_LIVE.has(`${r}-${c}`);
          if (live) {
            // the active window, highlighted once it forms
            s.band(cx, cx + colW, y, y + rowH, { color: GB.tint, op: 0.28, late: true });
          }
          s.text(cx + colW / 2, y + rowH / 2 + 3.4, cell, {
            anchor: "middle", color: GB.ink, size: 9, delay: 0.55 + c * 0.05,
          });
        });
      });

      // table rules
      [0, 1, 2, 3].forEach((r) =>
        s.line(tx, ty + r * rowH, tx + tw, ty + r * rowH, { color: GB.rule, w: 1, delay: 0.4 })
      );
      Array.from({ length: 9 }, (_, c) => (c === 0 ? tx : tx + labelW + (c - 1) * colW)).forEach((x) =>
        s.line(x, ty, x, ty + rowH * 3, { color: GB.rule, w: 1, delay: 0.4 })
      );
    },
  },

  /* ---------- 03 QT SSMT Detection: cycle against cycle ---------- */
  ssmt: {
    seed: 44190, base: 5712.5, vol: 2.3, drift: 0, dec: 2,
    t0: 6 * 60, step: 5, every: 16,
    n: { lg: 84, sm: 52 },
    vpad: 0.14,
    padT: { lg: 22, sm: 16 },
    print: { step: 0.018, start: 0 },
    // opens on the 90M high, sells off, rallies to a lower Nano high, fails
    swing: {
      // sets the 90M low early, rallies in steps, tops out through the
      // middle, leaves a nearer swing low on the way down, then runs both
      // of them on the Nano cycle
      path: [
        [0, -0.55], [0.05, -0.9],
        [0.14, -0.3], [0.2, 0.1], [0.26, -0.1], [0.32, 0.5],
        [0.38, 0.25], [0.44, 0.85], [0.5, 1],
        [0.57, 0.42], [0.605, -0.35], [0.635, -0.98], [0.665, -0.32], [0.7, -0.55],
        [0.76, -1], [0.85, -0.25], [1, 0.55],
      ],
      amp: 9,
      chop: 1,
    },
    alt: "ES 5-minute chart where the Nano cycle runs the previous 90-minute cycle low, flagging SSMT on the sweep.",
    shapeOne(d, sp) {
      const n = d.length;
      const first = loIdx(d, 0, Math.round(n * 0.12));           // the 90M low
      const near = loIdx(d, Math.round(n * 0.58), Math.round(n * 0.7)); // the nearer swing
      const second = loIdx(d, Math.round(n * 0.72), Math.round(n * 0.86));
      const peak = hiIdx(d, Math.round(n * 0.42), Math.round(n * 0.56));

      // The sweep runs both references at once. The ripple riding on the
      // shape is worth several points either way, so drop the whole decline
      // to land it marginally below the 90M low, easing in from the peak so
      // the tape has no step in it.
      const target = d[first].l - sp.vol * 0.55;
      const delta = target - d[second].l;
      for (let i = peak; i < n; i++) {
        shiftBar(d[i], delta * Math.min(1, (i - peak) / 8));
      }
      // The nearer swing sits a fixed step above the 90M low rather than
      // wherever the ripple leaves it, so the Nano line has a predictable
      // slope. Nothing before the sweep touches either level.
      for (let i = first + 1; i < second; i++) raiseLow(d, i, d[first].l + sp.vol * 0.5);
      raiseLow(d, near, d[first].l + sp.vol * 0.55);
      dropLow(d, near, d[first].l + sp.vol * 0.75);
      for (let i = second + 1; i < n; i++) raiseLow(d, i, d[second].l + sp.vol * 0.3);
      return { first, near, second };
    },
    draw(p: Panel, s, small, W, H, m) {
      const a: number = m.first;
      const b: number = m.second;
      const nr: number = m.near;
      const ay = p.y(p.data[a].l);
      const ny = p.y(p.data[nr].l);
      const by = p.y(p.data[b].l);
      // nothing is flagged until the tape has finished printing: the last
      // candle lands at n * step, plus the fade it takes to appear
      const printed = p.n * SPECS.ssmt.print!.step + 0.4;

      // the level the rally left behind
      const hi = hiVal(p.data, Math.round(p.n * 0.35), Math.round(p.n * 0.55));
      s.line(p.left, p.y(hi), p.right, p.y(hi), { color: QT.rule, w: 1, dash: "1 3", delay: 0.6 });

      // both cycle lows run by the same move
      s.line(p.x(a), ay, p.x(b), by, { color: QT.line, w: 1.4, draw: true, fast: true, delay: printed });
      s.line(p.x(nr), ny, p.x(b), by, { color: QT.line, w: 1.1, draw: true, fast: true, delay: printed + 0.15 });

      // each label rides below its own line, which slopes
      s.text((p.x(a) + p.x(nr)) / 2, (ay + ny) / 2 + 15, "90M ES1!", {
        anchor: "middle", color: QT.line, size: 9.5, delay: printed + 0.4, skipSmall: true,
      });
      s.text((p.x(nr) + p.x(b)) / 2, (ny + by) / 2 + 15, "Nano ES1!", {
        anchor: "middle", color: QT.line, size: 9.5, delay: printed + 0.55, skipSmall: true,
      });

      // the sweep, flagged as it confirms
      s.node(p.x(b), by, { color: QT.line, late: false, delay: printed + 0.65 });
      s.text(p.x(b) + 12, by - 6, "SSMT", {
        color: QT.line, size: 9.5, delay: printed + 0.8, skipSmall: true,
      });
    },
  },

  /* ---------- 04 Quarterly Theory Cycles: three nested cycles ---------- */
  qt: {
    seed: 12907, base: 5688.75, vol: 1.5, drift: 0, dec: 2,
    // On 1-minute bars the 90m cycle is the one that fits: its four 22.5m
    // quarters are 22.5 bars each. The AM session's own 90m quarters would
    // need 360 candles to show, which is far past legible.
    t0: 6 * 60, step: 1, every: 23,
    axisFromZero: true,
    body: 0.7,               // the densest chart in the set
    n: { lg: 90, sm: 46 },   // four quarters of 22.5 bars
    vpad: 0.12,
    padT: { lg: 30, sm: 18 },
    print: { step: 0.026, start: 0 },
    swing: {
      // a turn roughly every three bars: each impulse gives back a third of
      // itself before the next one, so the retracements read without the
      // legs losing their direction
      path: [
        [0, 0.2],
        [0.04, 0.45], [0.07, 0.34],
        [0.11, 0.62], [0.145, 0.44],
        [0.185, 0.55], [0.225, 0.24],
        [0.26, 0.42], [0.295, 0.18],
        [0.33, 0.3], [0.37, -0.02],
        [0.405, 0.1], [0.44, -0.22],
        [0.475, -0.1], [0.51, -0.42],
        [0.545, -0.3], [0.58, -0.66],
        [0.615, -1], [0.645, -0.76],
        [0.675, -0.88], [0.71, -0.52],
        [0.745, -0.64],
        [0.775, -0.3], [0.795, -0.42],
        [0.82, -0.12], [0.84, -0.24],
        [0.862, 0.1], [0.878, 0],
        [0.9, 0.34], [0.918, 0.24],
        [0.938, 0.56], [0.952, 0.46],
        [0.972, 0.84], [0.985, 0.74], [1, 0.95],
      ],
      amp: 9,
      chop: 0.9,
    },
    alt: "ES 5-minute chart with the four NYAM quarters boxed, each split again into its own four quarters.",
    draw(p: Panel, s) {
      const per = p.n / 16;              // bars in one quarter
      const range = (a: number, b: number) => {
        let hi = -Infinity, lo = Infinity;
        for (let i = a; i <= b && i < p.n; i++) {
          if (p.data[i].h > hi) hi = p.data[i].h;
          if (p.data[i].l < lo) lo = p.data[i].l;
        }
        return [hi, lo];
      };
      const step = SPECS.qt.print!.step;

      // the true open the whole session is measured from
      s.line(p.left, p.y(p.data[0].o), p.right, p.y(p.data[0].o), {
        color: QT.rule, w: 1, dash: "1 3", delay: 0.4,
      });

      QT_CYCLES.forEach(([label, tone], c) => {
        const from = Math.round(c * per * 4);
        const to = Math.round((c + 1) * per * 4) - 1;
        const x1 = p.x(from) - p.slot / 2;
        const x2 = p.x(Math.min(to, p.n - 1)) + p.slot / 2;
        const [hi, lo] = range(from, to);
        const pad = (hi - lo) * 0.06;
        const top = p.y(hi + pad);
        const bot = p.y(lo - pad);
        // a cycle is only known once it has closed
        const shown = 0.2 + Math.min(to, p.n - 1) * step;

        s.band(x1, x2, top, bot, { color: QT_Q[tone], op: 0.022, delay: shown });
        s.box(x1, top, x2, bot, { color: QT_Q[tone], w: 1, dash: "1 3", op: 0.7, delay: shown });
        s.text(x1 + 8, top - 7, label, {
          color: QT_Q[tone], size: 9.5, delay: shown + 0.2, skipSmall: true,
        });

        // and each of its four quarters, as each of them closes
        for (let q = 0; q < 4; q++) {
          const qa = Math.round(from + q * per);
          const qb = Math.round(from + (q + 1) * per) - 1;
          if (qa >= p.n) break;
          const [qh, ql] = range(qa, qb);
          const qx1 = p.x(qa) - p.slot / 2;
          const qx2 = p.x(Math.min(qb, p.n - 1)) + p.slot / 2;
          const qPad = (qh - ql) * 0.08;
          const qDelay = 0.2 + Math.min(qb, p.n - 1) * step;
          s.band(qx1, qx2, p.y(qh + qPad), p.y(ql - qPad), { color: QT_Q[q], op: 0.05, delay: qDelay });
          s.box(qx1, p.y(qh + qPad), qx2, p.y(ql - qPad), {
            color: QT_Q[q], w: 1, dash: "1 3", op: 0.75, delay: qDelay,
          });
        }
      });
    },
  },

  /* ---------- 05 SMT Detection: NQ / ES 5m ---------- */
  smt: {
    dual: true, labels: ["NQ", "ES"],
    seed: 55832, seed2: 21470,
    base: 20268, base2: 5666.25, vol: 8.6, vol2: 2.5, drift: -0.2, dec: 2, dec2: 2,
    t0: 10 * 60, step: 5, every: 12,
    n: { lg: 60, sm: 40 },
    alt: "NQ and ES 5-minute panels inside a 90-minute window, with SMT flagged between the two lows.",
    shapeTwo(a, b, sp) {
      const n = a.length;
      const e = Math.round(n * 0.5), l = Math.round(n * 0.83);
      const aE = a[e].l, bE = b[e].l;
      for (let i = 0; i < n; i++) if (i !== e && i !== l) raiseLow(a, i, aE + sp.vol * 0.55);
      for (let i = 0; i < n; i++) if (i !== e && i !== l) raiseLow(b, i, bE + sp.vol2! * 0.55);
      dropLow(a, l, aE - sp.vol * 0.7);      // NQ takes the low out
      raiseLow(a, l, aE - sp.vol * 0.8);
      raiseLow(b, l, bE + sp.vol2! * 0.7);   // ES holds
      dropLow(b, l, bE + sp.vol2! * 0.6);
      return { e, l };
    },
    draw(ps: Panel[], s, small, W, H, m) {
      const wx1 = ps[0].x(m.e) - ps[0].slot * 2;
      const wx2 = ps[0].x(m.l) + ps[0].slot * 2;
      s.band(wx1, wx2, ps[0].boxTop, ps[1].boxBot, { acc: true, op: 0.04, delay: 0.3 });
      s.text(wx1 + 6, ps[0].boxTop + 13, "90m", { acc: true, delay: 0.5, skipSmall: true });

      ps.forEach((p, k) => {
        const y1 = p.y(p.data[m.e].l), y2 = p.y(p.data[m.l].l);
        const top = Math.min(y1, y2) - 14, bot = Math.max(y1, y2) + 18;
        s.wipe(
          { x: p.x(m.e) - 6, y: top, w: p.x(m.l) - p.x(m.e) + 12, h: bot - top },
          1.3 + k * 0.5,
          <path d={`M${p.x(m.e)} ${y1}L${p.x(m.l)} ${y2}`} fill="none" strokeWidth={1.2} strokeDasharray="4 3" className="cx-acc" />
        );
      });

      s.text(ps[0].x(m.l) + 10, ps[0].y(ps[0].data[m.l].l) + 12, "LL", { acc: true, late: true });
      s.text(ps[1].x(m.l) + 10, ps[1].y(ps[1].data[m.l].l) + 12, "HL · SMT", { acc: true, late: true });
      s.node(ps[1].x(m.l), ps[1].y(ps[1].data[m.l].l));
    },
  },

  /* ---------- 06 Sessions & Liquidity: EURUSD 15m ---------- */
  sessions: {
    seed: 83015, base: 1.08442, vol: 0.00058, drift: 0.1, dec: 5,
    t0: 0, step: 15, every: 14,
    n: { lg: 68, sm: 46 },
    alt: "EURUSD 15-minute chart with Asia, London and New York session bands, an unswept London low and a swept Asia high.",
    shapeOne(d, sp) {
      const n = d.length;
      const ah = hiIdx(d, Math.round(n * 0.04), Math.round(n * 0.26));
      const sw = Math.min(n - 4, Math.round(n * 0.66));
      for (let i = ah + 1; i < sw; i++) capHigh(d, i, d[ah].h - sp.vol * 0.5);
      liftHigh(d, sw, d[ah].h + sp.vol * 0.4);
      return { ah, sw };
    },
    draw(p: Panel, s, small, W, H, m) {
      const n = p.n;
      const segs = [
        { a: 0.03, b: 0.27, name: "ASIA", tint: true },
        { a: 0.29, b: 0.51, name: "LONDON", tint: false },
        { a: 0.53, b: 0.75, name: "NY AM", tint: true },
        { a: 0.77, b: 0.98, name: "NY PM", tint: false },
      ];
      segs.forEach((sg, k) => {
        const x1 = p.x(Math.round(n * sg.a)) - p.slot / 2;
        const x2 = p.x(Math.round(n * sg.b)) + p.slot / 2;
        if (sg.tint) s.band(x1, x2, p.boxTop, p.boxBot, { op: 0.03, delay: 0.2 + k * 0.35 });
        s.line(x1, p.boxTop + 2, x1, p.boxBot - 2, { op: 0.7, delay: 0.2 + k * 0.35 });
        s.text(x1 + 5, p.boxTop + 13, sg.name, { delay: 0.32 + k * 0.35, skipSmall: true });
      });

      const lLo = loVal(p.data, Math.round(n * 0.29), Math.round(n * 0.51));
      s.line(p.x(Math.round(n * 0.33)), p.y(lLo), p.right, p.y(lLo), { dash: "4 3", delay: 1.9 });
      s.text(p.x(Math.round(n * 0.33)) + 6, p.y(lLo) + 13, "London low", { delay: 2.1, skipSmall: true });

      const y = p.y(p.data[m.ah].h);
      s.line(p.x(m.ah), y, p.x(m.sw), y, { acc: true, w: 1.2, draw: true, delay: 2.4 });
      s.text(p.x(m.ah) + 6, y - 7, "Asia high · swept", { acc: true, late: true, skipSmall: true });
      s.node(p.x(m.sw), p.y(p.data[m.sw].h));

      s.sweep(p, H, 9);
    },
  },
};

/* ============================================================
   <ChartSvg /> — server-rendered, deterministic, no client JS
   ============================================================ */

export function ChartSvg({ chart, size }: { chart: ChartKey; size: "lg" | "sm" }) {
  const sp = SPECS[chart];
  const small = size === "sm";
  const W = small ? 560 : chart === "hero" ? 960 : 880;
  const H = small ? 330 : chart === "hero" ? 440 : 520;
  const axisH = small ? 18 : 22;
  const n = small ? sp.n.sm : sp.n.lg;
  const plotW = W - GUTTER;
  // some indicators reserve a strip on the right for their level labels
  const labelW = sp.labelW ? (small ? sp.labelW.sm : sp.labelW.lg) : 0;
  const candleW = plotW - labelW;
  const footer = sp.footer ? (small ? sp.footer.sm : sp.footer.lg) : 0;
  const print = small ? undefined : sp.print;

  const s = new Sketch(`${chart}-${size}`, small);

  let panels: Panel[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let meta: any;

  if (sp.dual) {
    const da = series(sp.seed, n, sp.base, sp.vol, sp.drift);
    const db = series(sp.seed2!, n, sp.base2!, sp.vol2!, sp.drift);
    meta = sp.shapeTwo!(da, db, sp);
    const ph = small ? 141 : (H - axisH) / 2;
    panels = [
      mkPanel(da, { x: 0, y: 0, w: plotW, h: ph }, { padT: 14, padB: 8, pad: 0.1 }),
      mkPanel(db, { x: 0, y: ph, w: plotW, h: ph }, { padT: 12, padB: 10, pad: 0.1 }),
    ];
    sp.draw(panels, s, small, W, H, meta);
  } else {
    const d = sp.swing
      ? swing(sp.seed, n, sp.base, sp.vol, sp.swing)
      : series(sp.seed, n, sp.base, sp.vol, sp.drift);
    meta = sp.shapeOne ? sp.shapeOne(d, sp) : {};
    const padT = sp.padT ? (small ? sp.padT.sm : sp.padT.lg) : 14;
    panels = [mkPanel(d, { x: 0, y: 0, w: candleW, h: H - axisH - footer }, { padT, padB: 12, pad: sp.vpad })];
    sp.draw(panels[0], s, small, W, H, meta);
  }

  const ticks = small ? 2 : sp.dual ? 2 : 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img">
      <title>{sp.alt}</title>
      <defs>{s.defs}</defs>

      {panels.map((p, i) => (
        <GridAndAxis key={i} p={p} dec={i === 0 ? sp.dec : sp.dec2 ?? sp.dec} ticks={ticks} xEnd={plotW} />
      ))}

      {sp.dual && (
        <g>
          <line x1={0} y1={panels[1].boxTop} x2={plotW} y2={panels[1].boxTop} stroke="var(--hair)" strokeWidth={1} />
          {sp.labels!.map((lb, i) => (
            <text key={lb} x={8} y={panels[i].boxTop + 14} className="chart-label">{lb}</text>
          ))}
        </g>
      )}

      {s.back}
      {panels.map((p, i) => <Candles key={i} p={p} print={print} body={sp.body} />)}

      {print && (
        <line
          x1={0} y1={0} x2={0} y2={H - axisH}
          stroke={PO3.eq} strokeWidth={1} className="a-playhead"
          style={{
            ["--pw" as string]: `${candleW}px`,
            ["--pd" as string]: `${(print.start + n * print.step + 0.4).toFixed(2)}s`,
          }}
        />
      )}

      <g>
        {Array.from({ length: Math.floor((panels[0].n - 2) / sp.every) + 1 }, (_, k) => {
          const i = (sp.axisFromZero ? k : k + 1) * sp.every;
          if (i >= panels[0].n - 2) return null;
          const first = i === 0;
          return (
            <text
              key={i}
              x={first ? 2 : panels[0].x(i)}
              y={H - footer - 7}
              textAnchor={first ? "start" : "middle"}
              className="chart-axis"
            >
              {hhmm(sp.t0 + i * sp.step)}
            </text>
          );
        })}
      </g>

      {s.front}

      {/* frame */}
      <line x1={plotW} y1={0} x2={plotW} y2={H - footer} stroke="var(--hair)" strokeWidth={1} />
      <line x1={0} y1={H - axisH - footer} x2={plotW} y2={H - axisH - footer} stroke="var(--hair)" strokeWidth={1} />
      <rect x={0.5} y={0.5} width={W - 1} height={H - 1} fill="none" stroke="var(--hair)" strokeWidth={1} />
    </svg>
  );
}
