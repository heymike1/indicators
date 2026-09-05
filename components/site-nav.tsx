"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/logo-mark";
import { CheckoutButton } from "@/components/checkout-button";

const LINKS = [
  { href: "/#indicators", label: "Indicators" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

export function SiteNav() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-stuck={stuck}
      className="fixed inset-x-0 top-0 z-50 h-16 border-b border-transparent transition-colors duration-250 data-[stuck=true]:border-hair data-[stuck=true]:bg-[rgba(252,252,247,0.85)] data-[stuck=true]:backdrop-blur-[12px]"
    >
      <div className="mx-auto grid h-16 max-w-[1200px] grid-cols-[1fr_auto] items-center gap-4 px-8 md:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/#top"
          className="inline-flex items-center gap-2.5 text-base font-normal tracking-[-0.01em]"
        >
          <LogoMark size={36} />
          243 Trading
        </Link>

        <nav
          aria-label="Primary"
          className="hidden justify-center gap-[30px] md:flex"
        >
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-normal text-tx2 transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex justify-end">
          <CheckoutButton
            label="Get Access"
            className="h-[38px] rounded-full px-5 text-[13px] font-normal"
          />
        </div>
      </div>
    </header>
  );
}
