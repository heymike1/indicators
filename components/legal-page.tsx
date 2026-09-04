import type { ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteNav />
      <main className="mx-auto w-full max-w-[820px] px-8 pt-[124px] pb-24">
        <h1 className="text-[clamp(30px,5vw,44px)] leading-[1.1] font-semibold tracking-[-0.025em]">
          {title}
        </h1>
        <p className="mt-3 font-mono text-[11.5px] tracking-[0.02em] text-tx3">
          Last updated: {lastUpdated}
        </p>
        <hr className="mt-10 border-hair" />
        <div className="legal mt-10">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
