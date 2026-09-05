import { Button } from "@/components/ui/button";
import { ChartFrame } from "@/components/chart-frame";
import { CheckoutButton } from "@/components/checkout-button";

export function Hero() {
  return (
    <section className="pt-[116px] sm:pt-[152px]">
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="mx-auto flex max-w-[720px] flex-col items-center gap-[22px] text-center">
          <h1 className="text-[clamp(32px,5.6vw,48px)] leading-[1.1] font-[350] tracking-[-0.015em]">
            Spend less time marking charts.
          </h1>

          <p className="max-w-[640px] text-[18px] leading-[1.6] text-tx2">
            A suite of TradingView indicators built to automatically map time, price, liquidity and market
            relationships directly onto your charts.
          </p>

          <div className="mt-1.5 flex flex-wrap justify-center gap-3">
            <CheckoutButton
              label="Get Access"
              className="h-[52px] rounded-full px-6 text-base font-normal"
            />
            <Button asChild size="lg" variant="outline" className="h-[52px] rounded-full border-[1.5px] border-forest bg-snow px-6 text-base font-normal hover:bg-transparent">
              <a href="#indicators">Explore Indicators</a>
            </Button>
          </div>

          <p className="font-mono text-[11.5px] tracking-[0.02em] text-tx3">
            $29/month forever · All updates and future indicators included
          </p>
        </div>

        <div className="mt-11 sm:mt-16">
          <ChartFrame
            chart="hero"
            symbol="NQ1! · 5m"
            names={["PO3 Ranges", "GB Time", "Sessions & Liquidity", "SMT"]}
            status="SCANNING"
          />
        </div>
      </div>
    </section>
  );
}
