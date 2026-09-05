import { Kicker } from "@/components/kicker";
import { ChartFrame } from "@/components/chart-frame";
import { Reveal } from "@/components/reveal";
import { INDICATORS } from "@/lib/indicators";

export function Showcases() {
  return (
    <section id="indicators" className="scroll-mt-24 pt-[110px] sm:pt-[150px]">
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="flex max-w-[640px] flex-col gap-[18px] border-b border-hair pb-13">
          <Kicker>The indicators</Kicker>
          <h2 className="text-[clamp(28px,4.4vw,40px)] leading-[1.1] font-[350] tracking-[-0.01em]">
            Everything you need on the chart.
          </h2>
          <p className="text-[18px] leading-[1.6] text-tx2">
            Six indicators built to automate repetitive chart work and keep the concepts you already trade visible.
          </p>
        </div>

        <div className="mt-20 flex flex-col gap-18 lg:gap-24">
          {INDICATORS.map((ind, i) => (
            <Reveal key={ind.slug} id={ind.slug}>
              <article
                className={`flex flex-col items-center gap-7 lg:gap-13 ${i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"}`}
              >
                {/* chart is always first in the DOM, so it stays on top when stacked */}
                <div className="w-full min-w-0 lg:flex-[1_1_560px]">
                  <ChartFrame
                    chart={ind.chart}
                    symbol={ind.symbol}
                    names={[ind.title]}
                    status={ind.detail || undefined}
                    chips={
                      ind.chart === "smt"
                        ? [{ label: "10m" }, { label: "30m" }, { label: "90m", on: true }]
                        : undefined
                    }
                    media={ind.media}
                  />
                </div>

                <div className="flex w-full min-w-0 flex-col gap-3.5 lg:flex-[1_1_300px]">
                  <p className="font-mono text-[11px] tracking-[0.1em] text-tx4">{ind.num}</p>
                  <h3 className="text-[clamp(21px,3vw,24px)] leading-[1.2] font-[350] tracking-[-0.02em]">
                    {ind.title}
                  </h3>
                  <p className="text-base leading-[1.6] text-tx2">{ind.description}</p>
                  <ul className="mt-2.5">
                    {ind.bullets.map((b) => (
                      <li key={b} className="border-t border-hair py-[11px] text-[13px] text-tx3">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
