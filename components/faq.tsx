"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Kicker } from "@/components/kicker";
import { FAQ } from "@/lib/indicators";

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 pt-[110px] sm:pt-[150px]">
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="flex flex-wrap gap-10 border-t border-hair pt-14 lg:gap-16">
          <div className="flex flex-[1_1_300px] flex-col gap-[18px] self-start">
            <Kicker>FAQ</Kicker>
            <h2 className="text-[clamp(28px,4.4vw,40px)] leading-[1.1] font-[350] tracking-[-0.01em]">
              Questions
            </h2>
          </div>

          <div className="min-w-0 flex-[1_1_560px]">
            <Accordion type="single" collapsible defaultValue="q-0">
              {FAQ.map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`q-${i}`}
                  className="border-t border-b-0 border-hair last:border-b last:border-hair"
                >
                  <AccordionTrigger className="items-center rounded-none py-[22px] text-[17px] font-normal tracking-[-0.012em] hover:no-underline [&_[data-slot=accordion-trigger-icon]]:size-[13px]">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="max-w-[64ch] pb-6 text-[15px] leading-[1.62] text-tx2">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
