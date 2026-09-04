import type { ChartKey } from "./charts";

export type Category = "time" | "price" | "correlation" | "sessions";

export type Indicator = {
  num: string;
  slug: string;              // showcase anchor
  chart: ChartKey;
  title: string;
  category: Category;
  /** the indicator's description, shown on the card and the showcase */
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
    description:
      "Plot single or multiple ranges across markets and timeframes, fully customisable.",
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
    description:
      "Our GB Time indicator automatically plots the sequence for you, to help you anticipate turning points.",
    bullets: ["Full sequence, plotted ahead of price", "Active window highlighted as it forms", "Timezone aware"],
    symbol: "NQ1! · 5",
    detail: "New York",
  },
  {
    num: "03",
    slug: "ssmt",
    chart: "ssmt",
    title: "QT SSMT Detection",
    category: "correlation",
    description:
      "Spot SSMT between current and previous cycles across different markets and timeframes.",
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
    description:
      "Customisable indicator covering every cycle and quarter within Quarterly Theory.",
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
    description:
      "See SMT forming between lower timeframe and higher timeframe sessions and intervals, across different markets and timeframes.",
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
    description:
      "See 30 and 90-minute cycles, sessions, killzones and liquidity.",
    bullets: ["30m and 90m sessions", "Forex Killzones", "Session highs and lows tracked until swept"],
    symbol: "EURUSD · 15",
    detail: "Killzones on",
  },
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: "What do I get access to?",
    a: "All six indicators: Advanced PO3 Ranges, GB Time, QT SSMT Detection, Quarterly Theory Cycles, SMT Detection and Sessions & Liquidity. You also get every update and every indicator released while you are subscribed.",
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
