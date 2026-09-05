"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogoMark } from "@/components/logo-mark";
import { ChartSvg } from "@/lib/charts";
import { INDICATORS, type Category } from "@/lib/indicators";

const FILTERS: { value: "all" | Category; label: string }[] = [
  { value: "all", label: "All scripts" },
  { value: "time", label: "Time" },
  { value: "price", label: "Price" },
  { value: "correlation", label: "Correlation" },
  { value: "sessions", label: "Sessions" },
];

export function ScriptLibrary() {
  const [active, setActive] = useState<"all" | Category>("all");
  const shown = INDICATORS.filter(
    (i) => active === "all" || i.category === active,
  );

  return (
    <section aria-labelledby="library-heading" className="pt-[120px]">
      <div className="mx-auto max-w-[1200px] px-8">
        {/* the tab row carries the meaning visually; the heading keeps the
            document outline in order for screen readers */}
        <h2 id="library-heading" className="sr-only">
          Script library
        </h2>
        <Tabs
          value={active}
          onValueChange={(v) => setActive(v as "all" | Category)}
        >
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-hair">
            {/* the row scrolls rather than wraps, so the active underline
                stays welded to the hairline at every width */}
            <div className="-mb-px max-w-full overflow-x-auto no-scrollbar">
              <TabsList
                variant="line"
                className="h-auto gap-0 rounded-none p-0 text-tx2"
              >
                {FILTERS.map((f) => (
                  <TabsTrigger
                    key={f.value}
                    value={f.value}
                    className="h-auto flex-none rounded-none border-0 px-0 pb-[13px] text-sm font-normal text-tx2 not-first:ml-[26px] after:bottom-[-1px] after:h-0.5 after:bg-foreground data-active:font-medium data-active:text-foreground"
                  >
                    {f.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <p className="pb-[13px] font-mono text-[11px] tracking-[0.02em] whitespace-nowrap text-tx3">
              {shown.length} {shown.length === 1 ? "script" : "scripts"}
            </p>
          </div>

          <TabsContent value={active} className="mt-7">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-6">
              {shown.map((ind) => (
                <a
                  key={ind.slug}
                  href={`#${ind.slug}`}
                  className="group flex flex-col rounded-2xl focus-visible:outline-none"
                >
                  <Card className="flex-1 gap-0 rounded-2xl border border-hair py-0 shadow-none ring-0 transition-colors duration-200 group-hover:border-brand">
                    <div className="relative border-b border-hair">
                      <span className="absolute top-2.5 left-2.5 z-[2] rounded-full border-[1.5px] border-brand bg-snow px-2 py-[5px] font-mono text-[10px] leading-none font-medium tracking-[0.015em] text-brand">
                        {ind.category.toUpperCase()}
                      </span>
                      <ChartSvg chart={ind.chart} size="sm" />
                    </div>

                    <CardContent className="flex flex-1 flex-col gap-2 px-4 pt-4 pb-5">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="text-[18px] font-normal tracking-[-0.01em]">
                          {ind.title}
                        </h3>
                        <span className="font-mono text-[11px] text-tx4">
                          {ind.num}
                        </span>
                      </div>
                      <p className="text-[13.5px] leading-[1.5] text-tx2">
                        {ind.description}
                      </p>
                    </CardContent>

                    <CardFooter className="mt-auto flex items-center border-t border-hair px-4 py-3.5 font-mono text-[10.5px] text-tx3">
                      <span className="inline-flex items-center gap-[7px]">
                        <LogoMark size={18} />
                        243 Trading
                      </span>
                    </CardFooter>
                  </Card>
                </a>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
