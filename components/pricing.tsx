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
    <section id="pricing" className="scroll-mt-24 pt-[110px] sm:pt-[150px]">
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="flex flex-wrap gap-10 border-t border-hair pt-14 lg:gap-16">
          <div className="flex flex-[1_1_320px] flex-col gap-[18px]">
            <Kicker>Pricing</Kicker>
            <h2 className="text-[clamp(27px,4.4vw,40px)] leading-[1.14] font-medium tracking-[-0.022em]">
              One price. Everything included.
            </h2>
            <p className="max-w-[34ch] text-[15px] text-tx2">
              Your price stays the same for as long as your subscription remains active.
            </p>
          </div>

          <div className="min-w-0 flex-[1_1_520px]">
            <p className="flex items-baseline gap-2.5">
              <span className="text-[clamp(74px,13vw,132px)] leading-[0.9] font-light tracking-[-0.045em]">$29</span>
              <span className="text-[20px] text-tx3">/month</span>
            </p>

            <p className="mt-6 flex items-center gap-4">
              <span className="font-mono text-[11px] font-medium tracking-[0.22em] text-acc">FOREVER</span>
              <span className="h-px flex-1 bg-hair" aria-hidden="true" />
            </p>

            <p className="mt-6 text-[22px] font-medium tracking-[-0.018em]">Lock in $29/month forever.</p>
            <ul className="mt-3 flex flex-col gap-1 text-base text-tx2">
              <li>All updates included.</li>
              <li>All future indicators included.</li>
            </ul>

            <ul className="mt-8 grid grid-cols-1 gap-x-9 sm:grid-cols-2">
              {INCLUDED.map((item) => (
                <li key={item} className="border-t border-hair py-[11px] text-sm text-tx2">{item}</li>
              ))}
              <li className="border-t border-hair py-[11px] text-sm text-foreground">All indicator updates</li>
              <li className="border-t border-hair py-[11px] text-sm text-foreground">All future indicators</li>
            </ul>

            <div className="mt-9 flex flex-col items-start gap-3.5">
              <CheckoutButton
                label="Get Access for $29/month"
                className="h-12 w-full max-w-[340px] rounded px-6 text-[15px] font-semibold hover:bg-black"
              />
              <p className="font-mono text-[11.5px] tracking-[0.02em] text-tx3">
                Cancel anytime. Subscription managed through TradeUniv. Indicators delivered on TradingView.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
