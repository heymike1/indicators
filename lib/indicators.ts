import type { ChartKey } from "./charts";

export type Category = "time" | "price" | "correlation" | "sessions";

export type Indicator = {
  num: string;
  slug: string;              // showcase anchor
  chart: ChartKey;
  title: string;
  category: Category;
  /** one line, for the script library card */
  blurb: string;
  /** full paragraph, for the showcase row */
  description: string;
  bullets: [string, string, string];
  /** chart header strip */
  symbol: string;
  detail: string;
  /** drop in an .mp4/.webm/.gif/.png to replace the generated SVG */
  media?: string;
};

export const INDICATORS: Indicator[] = [
  {
    num: "01",
    slug: "po3",
    chart: "po3",
    title: "Advanced PO3 Ranges",
    category: "price",
    blurb: "Single or stacked Power of Three ranges, plotted automatically across timeframes.",
    description:
      "Automatically plot single or multiple Power of Three ranges across markets and timeframes, removing the need to calculate and draw each range manually.",
    bullets: ["Single or stacked ranges", "Any timeframe, any market", "Range highs, lows and equilibrium"],
    symbol: "ES1! · 15",
    detail: "3 ranges",
  },
  {
    num: "02",
    slug: "gb-time",
    chart: "gbtime",
    title: "GB Time",
    category: "time",
    blurb: "The complete GB Time sequence on the chart, with the active window highlighted.",
    description:
      "Automatically plot the complete GB Time sequence directly onto your chart, helping you anticipate important timing windows and potential turning points.",
    bullets: ["Full sequence, plotted ahead of price", "Active window highlighted as it forms", "Timezone aware"],
    symbol: "NQ1! · 5",
    detail: "New York",
  },
  {
    num: "03",
    slug: "ssmt",
    chart: "ssmt",
    title: "QT SSMT & Hidden SSMT",
    category: "correlation",
    blurb: "SSMT between current and previous Quarterly Theory cycles, across markets.",
    description:
      "Automatically detect SSMT between current and previous Quarterly Theory cycles across different markets and timeframes.",
    bullets: ["Intraday and cycle-level relationships", "Hidden SSMT flagged separately", "Any correlated pair"],
    symbol: "NQ1! / ES1! · 5",
    detail: "Q2 → Q2",
  },
  {
    num: "04",
    slug: "qt-cycles",
    chart: "qt",
    title: "Quarterly Theory Cycles",
    category: "time",
    blurb: "Every cycle and quarter mapped onto the chart. Show or hide any level.",
    description:
      "Automatically map every cycle and quarter within Quarterly Theory onto the chart. Fully customisable.",
    bullets: ["Nested cycles, quarters and sub-quarters", "True opens marked", "Show or hide any level of the hierarchy"],
    symbol: "ES1! · 5",
    detail: "90m · 22.5m",
  },
  {
    num: "05",
    slug: "smt",
    chart: "smt",
    title: "SMT Detection",
    category: "correlation",
    blurb: "SMT across 10m, 30m, 90m and higher timeframe structures, flagged as it confirms.",
    description:
      "Detect SMT forming across 10-minute, 30-minute, 90-minute and higher timeframe structures. Works across different markets and timeframes.",
    bullets: ["10m · 30m · 90m · HTF", "Highs and lows, flagged as they confirm", "Choose the comparison market"],
    symbol: "NQ1! / ES1! · 5",
    detail: "",
  },
  {
    num: "06",
    slug: "sessions",
    chart: "sessions",
    title: "Sessions & Liquidity",
    category: "sessions",
    blurb: "30m and 90m sessions, Forex Killzones and liquidity levels, tracked until swept.",
    description:
      "Automatically map 30-minute sessions, 90-minute sessions, Forex Killzones and liquidity levels directly onto price.",
    bullets: ["30m and 90m sessions", "Forex Killzones", "Session highs and lows tracked until swept"],
    symbol: "EURUSD · 15",
    detail: "Killzones on",
  },
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: "What do I get access to?",
    a: "All six indicators: Advanced PO3 Ranges, GB Time, QT SSMT & Hidden SSMT, Quarterly Theory Cycles, SMT Detection and Sessions & Liquidity. You also get every update and every indicator released while you are subscribed.",
  },
  {
    q: "Will my $29/month price ever increase?",
    a: "No. The price you subscribe at is locked for as long as your subscription stays active, regardless of what new subscribers pay later.",
  },
  { q: "Are future indicators included?", a: "Yes. Anything we release is added to your access at no extra cost." },
  { q: "Are updates included?", a: "Yes. Updates ship directly through TradingView; there is nothing to install and nothing to re-purchase." },
  {
    q: "How is my subscription managed?",
    a: "Through TradeUniv. Billing, invoices, plan changes and cancellation all live in your TradeUniv account. TradingView is only where the indicators themselves are delivered and run.",
  },
  {
    q: "Where do the indicators work?",
    a: "On TradingView, on any plan including the free tier. They are invite-only scripts added to your account.",
  },
  {
    q: "Which markets can I use them on?",
    a: "Any symbol TradingView charts: index futures, forex, commodities, equities and crypto. Correlation-based tools let you pick the comparison market.",
  },
  {
    q: "Can I customise the indicators?",
    a: "Yes. Colours, line styles, timeframes, sessions, timezones and which elements are shown are all configurable in each indicator's settings.",
  },
  {
    q: "How do I receive access?",
    a: "Checkout runs on TradeUniv, and your subscription is managed there. After you pay, you enter your TradingView username. Access is granted to that account, usually within a few minutes, and the indicators appear under Invite-only scripts.",
  },
  {
    q: "Can I cancel?",
    a: "Any time, from your account on TradeUniv, where your subscription is managed. Access continues until the end of the paid period. Note that resubscribing later is at the then-current price.",
  },
];
