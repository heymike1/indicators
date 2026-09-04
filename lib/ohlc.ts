/* Deterministic OHLC generation. Same seed → same chart, every load,
   on the server and in the browser. */

export type Bar = { o: number; h: number; l: number; c: number };

export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

/** A level path (random walk + two slow waves) turned into OHLC bars.
 *  Each open equals the previous close, so the tape reads continuously. */
export function series(seed: number, n: number, base: number, vol: number, drift = 0): Bar[] {
  const r = rng(seed);
  const lvl: number[] = [];
  const out: Bar[] = [];
  let acc = 0;

  for (let i = 0; i < n; i++) {
    acc += (r() - 0.5) * vol * 1.15 + drift * vol * 0.12;
    lvl.push(base + acc + Math.sin(i / 9.5 + (seed % 5)) * vol * 1.1 + Math.sin(i / 23.5 + 2) * vol * 1.9);
  }
  for (let i = 0; i < n; i++) {
    const o = i ? out[i - 1].c : lvl[0];
    const c = lvl[i] + (r() - 0.5) * vol * 0.35;
    out.push({ o, c, h: Math.max(o, c) + r() * vol * 0.55, l: Math.min(o, c) - r() * vol * 0.55 });
  }
  return out;
}

/* --- shaping helpers: nudge bars so a setup is actually present --- */

const fix = (b: Bar) => { b.h = Math.max(b.h, b.o, b.c); b.l = Math.min(b.l, b.o, b.c); };

export function liftHigh(d: Bar[], i: number, t: number) {
  const b = d[i]; if (b.h >= t) return;
  const k = t - b.h; b.h = t; b.c += k * 0.6; b.o += k * 0.25; fix(b);
}
export function capHigh(d: Bar[], i: number, t: number) {
  const b = d[i]; if (b.h <= t) return;
  const k = b.h - t; b.h = t; b.c -= k * 0.5; b.o -= k * 0.2; fix(b);
}
export function dropLow(d: Bar[], i: number, t: number) {
  const b = d[i]; if (b.l <= t) return;
  const k = b.l - t; b.l = t; b.c -= k * 0.6; b.o -= k * 0.25; fix(b);
}
export function raiseLow(d: Bar[], i: number, t: number) {
  const b = d[i]; if (b.l >= t) return;
  const k = t - b.l; b.l = t; b.c += k * 0.5; b.o += k * 0.2; fix(b);
}
export function hiIdx(d: Bar[], a: number, b: number) {
  let k = a; for (let i = a; i <= b; i++) if (d[i].h > d[k].h) k = i; return k;
}
export function loIdx(d: Bar[], a: number, b: number) {
  let k = a; for (let i = a; i <= b; i++) if (d[i].l < d[k].l) k = i; return k;
}
export const hiVal = (d: Bar[], a: number, b: number) => d[hiIdx(d, a, b)].h;
export const loVal = (d: Bar[], a: number, b: number) => d[loIdx(d, a, b)].l;

/* --- formatting --- */

export function money(v: number, dec: number) {
  const [int, frac] = v.toFixed(dec).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return frac ? `${grouped}.${frac}` : grouped;
}
export function hhmm(mins: number) {
  const m = ((mins % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}
