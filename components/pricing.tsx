import { Kicker } from "@/components/kicker";
import { CheckoutButton } from "@/components/checkout-button";

const INCLUDED = [
  "Advanced PO3 Ranges",
  "Quarterly Theory Cycles",
  "GB Time",
  "SMT Detection",
  "QT SSMT Detection",
  "Sessions & Liquidity",
];

const ALSO = ["All indicator updates", "All future indicators"];

function Item({ label, strong }: { label: string; strong?: boolean }) {
  return (
    <li
      className={`flex gap-2.5 text-[15px] ${strong ? "text-foreground" : "text-tx2"}`}
    >
      <svg
        viewBox="0 0 16 16"
        className="mt-[3px] size-[15px] shrink-0 text-brand"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 8.5 6.2 11.7 13 4.9" />
      </svg>
      {label}
    </li>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 pt-[110px] sm:pt-[150px]">
      <div className="mx-auto max-w-[1200px] px-8">
        {/* Heading and figure meet on one rule, the section sitting on the
            page rather than inside a band. */}
        <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-8 border-b border-hair pb-10">
          <div className="flex flex-col gap-5">
            <Kicker>Pricing</Kicker>
            <h2 className="max-w-[21ch] text-[clamp(28px,4.4vw,40px)] leading-[1.1] font-[350] tracking-[-0.01em]">
              One price. Everything included.
            </h2>
          </div>
          <p className="flex items-baseline gap-2.5 pb-1">
            <span className="text-[clamp(64px,9vw,104px)] leading-[0.82] font-light tracking-[-0.045em]">
              $29
            </span>
            <span className="text-[20px] text-tx2">/month</span>
          </p>
        </div>

        {/* What it covers, held in one panel a tier above the canvas. */}
        <div className="mt-10 rounded-[24px] bg-stone p-6 sm:rounded-[32px] sm:p-8 lg:p-10">
          <ul className="grid grid-cols-1 gap-x-8 gap-y-3.5 min-[520px]:grid-cols-2 min-[1120px]:grid-cols-4">
            {INCLUDED.map((item) => (
              <Item key={item} label={item} />
            ))}
            {ALSO.map((item) => (
              <Item key={item} label={item} strong />
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-hair-hi/40 pt-8">
            <CheckoutButton
              label="Get Access for $29/month"
              className="h-[52px] w-full rounded-full px-7 text-base font-normal sm:w-auto"
            />
            <p className="max-w-[40ch] text-[15px] leading-[1.6] text-tx2">
              Your price stays the same for as long as your subscription remains
              active.
            </p>
          </div>
        </div>

        <p className="mt-5 max-w-[60ch] font-mono text-[12px] leading-[1.6] tracking-[0.015em] text-tx3">
          Cancel anytime. Subscription managed through TradeUniv. Indicators
          delivered on TradingView.
        </p>
      </div>
    </section>
  );
}
