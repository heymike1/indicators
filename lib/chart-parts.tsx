import type { CSSProperties, ReactElement, ReactNode } from "react";
import { type Bar, money } from "./ohlc";
import { SWEEP_ENABLED } from "./site";

/* ---------- panel geometry ---------- */

export type Panel = {
  data: Bar[]; n: number; min: number; max: number; slot: number;
  left: number; right: number; top: number; bot: number;
  boxTop: number; boxBot: number;
  x: (i: number) => number;
  y: (p: number) => number;
};

type Box = { x: number; y: number; w: number; h: number };

/** 2dp is sub-pixel at these viewBox sizes and keeps the markup small. */
const r2 = (v: number) => Math.round(v * 100) / 100;

export function mkPanel(
  data: Bar[],
  box: Box,
  opt: { padT?: number; padB?: number; pad?: number } = {}
): Panel {
  const padT = opt.padT ?? 12;
  const padB = opt.padB ?? 10;
  let min = Infinity, max = -Infinity;
  for (const d of data) { if (d.l < min) min = d.l; if (d.h > max) max = d.h; }
  const sp = (max - min) * (opt.pad ?? 0.07);
  min -= sp; max += sp;

  const iy = box.y + padT;
  const ih = box.h - padT - padB;
  const slot = box.w / data.length;

  return {
    data, n: data.length, min, max, slot,
    left: box.x, right: box.x + box.w, top: iy, bot: iy + ih,
    boxTop: box.y, boxBot: box.y + box.h,
    x: (i) => r2(box.x + (i + 0.5) * slot),
    y: (p) => r2(iy + ((max - p) / (max - min)) * ih),
  };
}

/* ---------- animation helpers ---------- */

export type Anim = { draw?: boolean; late?: boolean; delay?: number };

function animClass(o: Anim) {
  return o.draw ? "a-draw" : o.late ? "a-late" : "a-fade";
}
function animStyle(o: Anim): CSSProperties | undefined {
  return o.delay ? { animationDelay: `${o.delay}s` } : undefined;
}

type StrokeOpts = Anim & {
  acc?: boolean; w?: number; dash?: string; op?: number;
};
type TextOpts = Anim & {
  acc?: boolean; anchor?: "start" | "middle" | "end"; skipSmall?: boolean;
};

/* ---------- the sketch builder ----------
   Collects SVG elements for one chart. `back` is painted behind the
   candles (session/window bands), `front` on top, `defs` holds clip paths. */

export class Sketch {
  back: ReactElement[] = [];
  front: ReactElement[] = [];
  defs: ReactElement[] = [];
  private k = 0;
  constructor(private uid: string, private small: boolean) {}

  private key() { return `${this.uid}-${this.k++}`; }
  private id(kind: string) { return `${this.uid}-${kind}-${this.k++}`; }

  /** Solid or dashed geometry. `op` is stroke-opacity so it multiplies
   *  with the fade keyframes instead of being clobbered by them. */
  path(d: string, o: StrokeOpts = {}) {
    this.front.push(
      <path
        key={this.key()}
        d={d}
        fill="none"
        strokeWidth={o.w ?? 1}
        strokeDasharray={o.dash}
        strokeOpacity={o.op}
        pathLength={o.draw ? 1 : undefined}
        className={`${o.acc ? "cx-acc" : "cx-line"} ${animClass(o)}`}
        style={animStyle(o)}
      />
    );
  }

  line(x1: number, y1: number, x2: number, y2: number, o: StrokeOpts = {}) {
    this.path(`M${x1} ${y1}L${x2} ${y2}`, o);
  }

  box(x1: number, y1: number, x2: number, y2: number, o: StrokeOpts = {}) {
    this.path(`M${x1} ${y1}H${x2}V${y2}H${x1}Z`, o);
  }

  /** Session / detection band. Painted behind the candles. */
  band(x1: number, x2: number, y1: number, y2: number, o: Anim & { acc?: boolean; op?: number } = {}) {
    this.back.push(
      <rect
        key={this.key()}
        x={x1} y={y1}
        width={Math.max(0, x2 - x1)} height={Math.max(0, y2 - y1)}
        fillOpacity={o.op ?? 0.03}
        className={`${o.acc ? "cx-accf" : "cx-inkf"} ${animClass(o)}`}
        style={animStyle(o)}
      />
    );
  }

  text(x: number, y: number, str: string, o: TextOpts = {}) {
    if (this.small && o.skipSmall) return;
    this.front.push(
      <text
        key={this.key()}
        x={x} y={y}
        textAnchor={o.anchor ?? "start"}
        className={`chart-label ${o.acc ? "fill-acc" : ""} ${animClass(o)}`}
        style={animStyle(o)}
      >
        {str}
      </text>
    );
  }

  /** Pulsing detection node, optionally inside an expanding ring. */
  node(x: number, y: number, o: Anim & { ring?: boolean } = {}) {
    this.front.push(
      <g
        key={this.key()}
        className={o.late === false ? "a-fade" : "a-late"}
        style={animStyle(o)}
      >
        {o.ring !== false && (
          <circle cx={x} cy={y} r={3} fill="none" strokeWidth={1} className="cx-acc a-ring" />
        )}
        <circle cx={x} cy={y} r={3} className="cx-accf a-ping" />
      </g>
    );
  }

  /** Four corner targeting ticks. */
  corners(x: number, y: number, r: number, o: Anim = {}) {
    const t = 4;
    this.front.push(
      <g key={this.key()} className="a-late" style={animStyle(o)}>
        {([[-1, -1], [1, -1], [-1, 1], [1, 1]] as const).map(([sx, sy], i) => {
          const px = x + sx * r, py = y + sy * r;
          return (
            <path
              key={i}
              d={`M${px - sx * t} ${py}H${px}V${py - sy * t}`}
              fill="none" strokeWidth={1} className="cx-acc"
            />
          );
        })}
      </g>
    );
  }

  /** Left-to-right reveal for dashed geometry — dashes can't stroke-draw,
   *  so an animated clip rect wipes them in instead. */
  wipe(box: Box, delay: number, children: ReactNode) {
    const id = this.id("w");
    this.defs.push(
      <clipPath key={id} id={id}>
        <rect
          x={box.x} y={box.y} width={box.w} height={box.h}
          className="a-wipe"
          style={{ ["--wx" as string]: `${-box.w - 6}px`, animationDelay: delay ? `${delay}s` : undefined }}
        />
      </clipPath>
    );
    this.front.push(<g key={this.key()} clipPath={`url(#${id})`}>{children}</g>);
  }

  /** Slow translucent teal sweep, left to right. */
  sweep(p: Panel, H: number, secs: number) {
    if (!SWEEP_ENABLED) return;
    const id = this.id("s");
    const w = p.right - p.left;
    this.defs.push(
      <clipPath key={id} id={id}>
        <rect x={p.left} y={0} width={w} height={H} />
      </clipPath>
    );
    this.front.push(
      <g key={this.key()} clipPath={`url(#${id})`}>
        <g
          className="cx-sweep"
          style={{ ["--sw" as string]: `${w + 40}px`, ["--sd" as string]: `${secs}s` }}
        >
          <rect x={-34} y={0} width={34} height={H} className="cx-accf" fillOpacity={0.05} />
          <rect x={-1.2} y={0} width={1.2} height={H} className="cx-accf" fillOpacity={0.32} />
        </g>
      </g>
    );
  }
}

/* ---------- base layers ---------- */

export function GridAndAxis({ p, dec, ticks }: { p: Panel; dec: number; ticks: number }) {
  const rows = Array.from({ length: ticks + 1 }, (_, k) => k);
  return (
    <g>
      {rows.map((k) => {
        const y = r2(p.top + (p.bot - p.top) * (k / ticks));
        return (
          <line key={`l${k}`} x1={p.left} y1={y} x2={p.right} y2={y} stroke="var(--gridline)" strokeWidth={1} />
        );
      })}
      {rows.map((k) => {
        const y = r2(p.top + (p.bot - p.top) * (k / ticks));
        return (
          <text key={`t${k}`} x={p.right + 8} y={y + 3.4} className="chart-axis">
            {money(p.max - (p.max - p.min) * (k / ticks), dec)}
          </text>
        );
      })}
    </g>
  );
}

export function Candles({ p }: { p: Panel }) {
  const bw = Math.max(1.4, Math.round(p.slot * 0.58 * 100) / 100);
  return (
    <g strokeWidth={1} stroke="var(--ink)">
      {p.data.map((d, i) => {
        const cx = p.x(i);
        const x0 = Math.round((cx - bw / 2) * 100) / 100;
        const x1 = Math.round((cx + bw / 2) * 100) / 100;
        const yTop = p.y(Math.max(d.o, d.c));
        const yBot = Math.max(p.y(Math.min(d.o, d.c)), yTop + 1);
        // wick + body in one path: the wick sub-path has no area, so it
        // takes the stroke but contributes nothing to the fill
        return (
          <path
            key={i}
            d={`M${cx} ${p.y(d.h)}V${p.y(d.l)}M${x0} ${yTop}H${x1}V${yBot}H${x0}Z`}
            fill={d.c >= d.o ? "var(--surface)" : "var(--ink)"}
          />
        );
      })}
    </g>
  );
}
