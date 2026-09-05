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

export function Pricing() {
  return (
    <section
      id="pricing"
      className="mt-[110px] scroll-mt-24 bg-brand py-[96px] text-snow sm:mt-[150px]"
    >
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="flex flex-wrap gap-10 lg:gap-16">
          <div className="flex flex-[1_1_320px] flex-col gap-[18px]">
            <Kicker>Pricing</Kicker>
            <h2 className="text-[clamp(28px,4.4vw,40px)] leading-[1.1] font-[350] tracking-[-0.01em]">
              One price. Everything included.
            </h2>
            <p className="max-w-[34ch] text-[15px] text-snow/70">
              Your price stays the same for as long as your subscription remains active.
            </p>
          </div>

          <div className="min-w-0 flex-[1_1_520px]">
            <p className="flex items-baseline gap-2.5">
              <span className="text-[clamp(74px,13vw,132px)] leading-[0.9] font-light tracking-[-0.045em]">$29</span>
              <span className="text-[20px] text-snow/70">/month</span>
            </p>

            <p className="mt-6 flex items-center gap-4">
              <span className="rounded-full bg-lime px-2 py-1.5 font-mono text-[12px] leading-none font-medium tracking-[0.015em] text-brand">
                FOREVER
              </span>
              <span className="h-px flex-1 bg-snow/25" aria-hidden="true" />
            </p>

            <p className="mt-6 text-[24px] font-[350] tracking-[-0.02em]">Lock in $29/month forever.</p>
            <ul className="mt-3 flex flex-col gap-1 text-base text-snow/70">
              <li>All updates included.</li>
              <li>All future indicators included.</li>
            </ul>

            <ul className="mt-8 grid grid-cols-1 gap-x-9 sm:grid-cols-2">
              {INCLUDED.map((item) => (
                <li key={item} className="border-t border-snow/25 py-[11px] text-sm text-snow/70">{item}</li>
              ))}
              <li className="border-t border-snow/25 py-[11px] text-sm text-snow">All indicator updates</li>
              <li className="border-t border-snow/25 py-[11px] text-sm text-snow">All future indicators</li>
            </ul>

            <div className="mt-9 flex flex-col items-start gap-3.5">
              <CheckoutButton
                label="Get Access for $29/month"
                className="h-[52px] w-full max-w-[340px] rounded-full bg-snow px-7 text-base font-normal text-brand hover:bg-snow/90"
              />
              <p className="font-mono text-[12px] tracking-[0.015em] text-snow/60">
                Cancel anytime. Subscription managed through TradeUniv. Indicators delivered on TradingView.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
