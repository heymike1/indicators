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

/** Cosine ease between two values; flat at both ends, so segments joined
 *  end-to-end stay smooth through the joins. */
const ease = (from: number, to: number, u: number) =>
  from + ((to - from) * (1 - Math.cos(Math.PI * Math.min(Math.max(u, 0), 1)))) / 2;

/** A deliberate shape rather than a random walk. `path` is a list of
 *  [position, level] waypoints — position 0→1 across the chart, level −1→1
 *  across the price range — eased between, so the joins stay smooth. `amp`
 *  is the full range in volatility units and `chop` scales the ripple and
 *  noise riding on top. */
export function swing(
  seed: number,
  n: number,
  base: number,
  vol: number,
  {
    path = [[0, 0.3], [0.12, 1], [0.62, -1], [1, 0]] as [number, number][],
    amp = 9,
    chop = 1,
    noise = 0.95,
  } = {}
): Bar[] {
  const r = rng(seed);
  const out: Bar[] = [];
  const half = (amp * vol) / 2;

  const level = (t: number) => {
    for (let i = 1; i < path.length; i++) {
      if (t <= path[i][0]) {
        const [t0, s0] = path[i - 1];
        const [t1, s1] = path[i];
        return ease(s0, s1, (t - t0) / (t1 - t0));
      }
    }
    return path[path.length - 1][1];
  };

  for (let i = 0; i < n; i++) {
    const s = level(i / (n - 1));
    // three non-harmonic ripples plus noise, so the shape still reads as a
    // market rather than a drawn curve
    const ripple =
      (Math.sin(i / 13.5 + 1) * 0.9 +
        Math.sin(i / 5.5 + (seed % 7)) * 0.6 +
        Math.sin(i / 3.1 + 2.3) * 0.35) *
      vol *
      chop;
    const c = base + half * s + ripple + (r() - 0.5) * vol * noise * chop;
    const o = i ? out[i - 1].c : c - (r() - 0.5) * vol * 0.4;
    // squaring the draw keeps most wicks short and lets a few run long
    out.push({
      o, c,
      h: Math.max(o, c) + r() * r() * vol * 1.3 * chop,
      l: Math.min(o, c) - r() * r() * vol * 1.3 * chop,
    });
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
