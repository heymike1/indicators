import {
  type Bar, series, hhmm,
  liftHigh, capHigh, dropLow, raiseLow, hiIdx, hiVal, loVal,
} from "./ohlc";
import { Sketch, mkPanel, GridAndAxis, Candles, type Panel } from "./chart-parts";

export type ChartKey = "hero" | "po3" | "gbtime" | "ssmt" | "qt" | "smt" | "sessions";

/** price axis width — wide enough for "20,173.25" in 10px mono */
const GUTTER = 66;

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
    seed: 30518, base: 5642.25, vol: 3.1, drift: 0.3, dec: 2,
    t0: 8 * 60, step: 15, every: 12,
    n: { lg: 66, sm: 44 },
    alt: "ES 15-minute chart with a daily range behind three stacked 4-hour Power of Three ranges and a retested range high.",
    shapeOne(d, sp) {
      const n = d.length;
      const segs = ([[0.12, 0.32], [0.34, 0.56], [0.58, 0.78]] as const).map(
        ([x, y]) => [Math.round(n * x), Math.round(n * y)] as [number, number]
      );
      const last = segs[2];
      const top = hiVal(d, last[0], last[1]);
      const rt = Math.min(n - 3, Math.round(n * 0.93));
      for (let i = last[1] + 1; i < rt; i++) capHigh(d, i, top - sp.vol * 0.9);
      liftHigh(d, rt, top - sp.vol * 0.06);
      capHigh(d, rt, top + sp.vol * 0.06);
      return { segs, top, rt };
    },
    draw(p: Panel, s, small, W, H, m) {
      const n = p.n;

      // faint daily range behind everything
      const dHi = hiVal(p.data, 2, n - 3), dLo = loVal(p.data, 2, n - 3);
      s.box(p.x(2) - p.slot / 2, p.y(dHi), p.x(n - 3) + p.slot / 2, p.y(dLo), { dash: "2 4", op: 0.45, delay: 0.15 });
      s.text(p.x(2) + 5, p.y(dHi) - 6, "Daily", { delay: 0.3, skipSmall: true });

      // three 4H ranges drawing in sequence, 0.9s apart
      (m.segs as [number, number][]).forEach((seg, k) => {
        const hi = hiVal(p.data, seg[0], seg[1]);
        const lo = loVal(p.data, seg[0], seg[1]);
        const eq = (hi + lo) / 2;
        const x1 = p.x(seg[0]) - p.slot / 2, x2 = p.x(seg[1]) + p.slot / 2;
        const t = 0.6 + k * 0.9;
        s.wipe(
          { x: x1 - 2, y: p.y(hi) - 14, w: x2 - x1 + 4, h: p.y(lo) - p.y(hi) + 28 },
          t,
          <>
            <path d={`M${x1} ${p.y(hi)}H${x2}V${p.y(lo)}H${x1}Z`} fill="none" strokeWidth={1} strokeDasharray="4 3" className="cx-line" />
            <path d={`M${x1} ${p.y(eq)}H${x2}`} fill="none" strokeWidth={1} strokeDasharray="2 3" className="cx-line" />
          </>
        );
        s.text(x1 + 4, p.y(hi) - 6, `4H · ${k + 1}`, { delay: t + 0.5, skipSmall: true });
      });

      // range high, retested
      const y = p.y(m.top);
      s.line(p.x(m.segs[2][0]), y, p.right, y, { acc: true, w: 1.2, draw: true, delay: 4.2 });
      s.text(p.x(m.segs[2][0]) + 6, y - 7, "Range high · retest", { acc: true, late: true, skipSmall: true });
      s.node(p.x(m.rt), y, { ring: false });
    },
  },

  /* ---------- 02 GB Time: NQ 5m, New York ---------- */
  gbtime: {
    seed: 60223, base: 20340, vol: 8.4, drift: -0.15, dec: 2,
    t0: 7 * 60 + 30, step: 5, every: 12,
    n: { lg: 62, sm: 42 },
    alt: "NQ 5-minute chart with the GB Time sequence plotted ahead of price and the active window highlighted at the turn.",
    shapeOne(d, sp) {
      const n = d.length;
      const turn = Math.round(n * 0.62);
      dropLow(d, turn, loVal(d, Math.round(n * 0.35), n - 1) - sp.vol * 0.5);
      for (let i = turn + 1; i < n; i++) raiseLow(d, i, d[turn].l + sp.vol * 0.45);
      return { turn };
    },
    draw(p: Panel, s, small, W, H, m) {
      const n = p.n;
      const marks = Array.from({ length: 7 }, (_, i) => Math.round(n * (0.08 + i * 0.135)));

      marks.forEach((i, k) => {
        const isTurn = Math.abs(i - m.turn) <= 2;
        s.line(p.x(i), p.boxTop + 4, p.x(i), p.boxBot - 4, {
          dash: "3 4", w: isTurn ? 1.2 : 1, acc: isTurn, delay: 0.3 + k * 0.4,
        });
        s.text(p.x(i) + 5, p.boxTop + 14, hhmm(SPECS.gbtime.t0 + i * 5), {
          acc: isTurn, delay: 0.42 + k * 0.4, skipSmall: true,
        });
      });

      s.band(p.x(m.turn) - p.slot * 2.5, p.x(m.turn) + p.slot * 3.5, p.boxTop, p.boxBot, { acc: true, op: 0.055, late: true });
      s.node(p.x(m.turn), p.y(p.data[m.turn].l), { ring: false });
      s.text(p.x(m.turn) + 14, p.y(p.data[m.turn].l) + 14, "GB · turn", { acc: true, late: true, skipSmall: true });
    },
  },

  /* ---------- 03 QT SSMT Detection: NQ / ES 5m ---------- */
  ssmt: {
    dual: true, labels: ["NQ", "ES"],
    seed: 44190, seed2: 78321,
    base: 20512, base2: 5718.5, vol: 8, vol2: 2.4, drift: 0.2, dec: 2, dec2: 2,
    t0: 6 * 60, step: 5, every: 12,
    n: { lg: 60, sm: 40 },
    alt: "NQ and ES 5-minute panels with quarter dividers, showing SSMT between the previous and current Quarterly Theory cycles.",
    shapeTwo(a, b, sp) {
      const n = a.length;
      const pv = Math.round(n * 0.28), cu = Math.round(n * 0.78);
      const aPv = a[pv].h, bPv = b[pv].h;
      for (let i = 0; i < n; i++) if (i !== pv && i !== cu) capHigh(a, i, aPv - sp.vol * 0.55);
      for (let i = 0; i < n; i++) if (i !== pv && i !== cu) capHigh(b, i, bPv - sp.vol2! * 0.55);
      liftHigh(a, cu, aPv + sp.vol * 0.7);      // NQ takes the high
      capHigh(a, cu, aPv + sp.vol * 0.8);
      liftHigh(b, cu, bPv - sp.vol2! * 0.75);   // ES fails to
      capHigh(b, cu, bPv - sp.vol2! * 0.6);
      return { pv, cu };
    },
    draw(ps: Panel[], s, small, W, H, m) {
      const span = ps[0].right - ps[0].left;

      for (let i = 1; i < 4; i++) {
        const x = ps[0].left + span * (i / 4);
        s.line(x, ps[0].boxTop, x, ps[1].boxBot, { dash: "3 4", op: 0.6, delay: 0.1 });
      }
      // centred in each quarter, so they clear the NQ/ES panel labels
      ["Q1 · prev", "Q2 · prev", "Q1", "Q2"].forEach((q, k) => {
        s.text(ps[0].left + span * (k / 4) + span / 8, ps[0].boxTop + 13, q, {
          anchor: "middle", delay: 0.2 + k * 0.1, skipSmall: true,
        });
      });

      ps.forEach((p, k) => {
        const y1 = p.y(p.data[m.pv].h), y2 = p.y(p.data[m.cu].h);
        const top = Math.min(y1, y2) - 16, bot = Math.max(y1, y2) + 16;
        s.wipe(
          { x: p.x(m.pv) - 6, y: top, w: p.x(m.cu) - p.x(m.pv) + 12, h: bot - top },
          1.4 + k * 0.5,
          <path d={`M${p.x(m.pv)} ${y1}L${p.x(m.cu)} ${y2}`} fill="none" strokeWidth={1.2} strokeDasharray="4 3" className="cx-acc" />
        );
        s.text(p.x(m.pv) - 4, y1 - 7, "PV", { anchor: "end", delay: 1.6 + k * 0.5, skipSmall: true });
      });

      s.text(ps[0].x(m.cu) + 10, ps[0].y(ps[0].data[m.cu].h) - 8, "HH", { acc: true, late: true });
      s.text(ps[1].x(m.cu) + 10, ps[1].y(ps[1].data[m.cu].h) - 8, "LH · SSMT", { acc: true, late: true });
      s.node(ps[1].x(m.cu), ps[1].y(ps[1].data[m.cu].h), { ring: false });
    },
  },

  /* ---------- 04 Quarterly Theory Cycles: ES 5m ---------- */
  qt: {
    seed: 12907, base: 5688.75, vol: 2.6, drift: 0.18, dec: 2,
    t0: 9 * 60 + 30, step: 5, every: 16,
    n: { lg: 64, sm: 40 },
    padT: { lg: 58, sm: 40 },
    alt: "ES 5-minute chart with four quarter brackets, sixteen sub-quarter ticks and the true open marked.",
    draw(p: Panel, s, small) {
      const n = p.n;
      const top = p.boxTop + 16;
      const tick = small ? 12 : 16;

      for (let k = 0; k < 4; k++) {
        const i0 = Math.round((n * k) / 4);
        const i1 = Math.round((n * (k + 1)) / 4) - 1;
        const x1 = p.x(i0) - p.slot / 2, x2 = p.x(i1) + p.slot / 2;
        s.path(`M${x1} ${top + 6}V${top}H${x2}V${top + 6}`, { delay: 0.2 + k * 0.28 });
        s.text((x1 + x2) / 2, top - 5, `Q${k + 1}`, { anchor: "middle", delay: 0.32 + k * 0.28 });
        if (k > 0) s.line(x1, top + 8, x1, p.boxBot - 4, { dash: "3 4", op: 0.6, delay: 0.32 + k * 0.28 });
      }

      for (let i = 0; i < 16; i++) {
        const xs = p.left + ((p.right - p.left) * i) / 16 + (p.right - p.left) / 32;
        s.line(xs, top + tick, xs, top + tick + (small ? 6 : 8), { op: 0.75, delay: 1.7 + i * 0.045 });
      }

      const q2 = Math.round(n / 4);
      s.line(p.x(q2) - p.slot / 2, top + 8, p.x(q2) - p.slot / 2, p.boxBot - 4, { acc: true, w: 1.2, draw: true, delay: 3.4 });
      s.text(p.x(q2) + 6, p.boxBot - 8, "True open", { acc: true, late: true, skipSmall: true });
      s.node(p.x(q2), p.y(p.data[q2].o), { ring: false });
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
  const H = small ? 300 : 440;
  const axisH = small ? 18 : 22;
  const n = small ? sp.n.sm : sp.n.lg;
  const plotW = W - GUTTER;

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
    const d = series(sp.seed, n, sp.base, sp.vol, sp.drift);
    meta = sp.shapeOne ? sp.shapeOne(d, sp) : {};
    const padT = sp.padT ? (small ? sp.padT.sm : sp.padT.lg) : 14;
    panels = [mkPanel(d, { x: 0, y: 0, w: plotW, h: H - axisH }, { padT, padB: 12 })];
    sp.draw(panels[0], s, small, W, H, meta);
  }

  const ticks = small ? 2 : sp.dual ? 2 : 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img">
      <title>{sp.alt}</title>
      <defs>{s.defs}</defs>

      {panels.map((p, i) => (
        <GridAndAxis key={i} p={p} dec={i === 0 ? sp.dec : sp.dec2 ?? sp.dec} ticks={ticks} />
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
      {panels.map((p, i) => <Candles key={i} p={p} />)}

      <g>
        {Array.from({ length: Math.floor((panels[0].n - 2) / sp.every) }, (_, k) => {
          const i = (k + 1) * sp.every;
          return i < panels[0].n - 2 ? (
            <text key={i} x={panels[0].x(i)} y={H - 7} textAnchor="middle" className="chart-axis">
              {hhmm(sp.t0 + i * sp.step)}
            </text>
          ) : null;
        })}
      </g>

      {s.front}

      {/* frame */}
      <line x1={plotW} y1={0} x2={plotW} y2={H} stroke="var(--hair)" strokeWidth={1} />
      <line x1={0} y1={H - axisH} x2={plotW} y2={H - axisH} stroke="var(--hair)" strokeWidth={1} />
      <rect x={0.5} y={0.5} width={W - 1} height={H - 1} fill="none" stroke="var(--hair)" strokeWidth={1} />
    </svg>
  );
}
