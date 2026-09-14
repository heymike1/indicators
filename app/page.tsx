import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/hero";
import { ScriptLibrary } from "@/components/script-library";
import { Showcases } from "@/components/showcases";
import { Pricing } from "@/components/pricing";
import { Faq } from "@/components/faq";
import { SiteFooter } from "@/components/site-footer";
import { StructuredData } from "@/components/structured-data";

export default function Page() {
  return (
    <>
      <StructuredData />
      <SiteNav />
      <main id="top">
        <Hero />
        <ScriptLibrary />
        <Showcases />
        <Pricing />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}
