import Link from "next/link";
import { LogoMark } from "@/components/logo-mark";

const COLS: { label: string; links: { href: string; label: string }[] }[] = [
  {
    label: "Site",
    links: [
      { href: "/#indicators", label: "Indicators" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    label: "Legal",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/eula", label: "EULA" },
      { href: "/return-policy", label: "Return Policy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-[110px] border-t border-hair sm:mt-[150px]">
      <div className="mx-auto max-w-[1200px] px-8">
        <div className="flex flex-wrap gap-14 pt-14 pb-11">
          <div className="flex flex-[1_1_340px] flex-col gap-4">
            <Link
              href="/#top"
              className="inline-flex items-center gap-2.5 text-sm font-medium tracking-[-0.01em]"
            >
              <LogoMark size={28} />
              Trading Indicators
            </Link>
            <p className="max-w-[38ch] text-sm text-tx2">
              TradingView indicators built to automate time, price, liquidity
              and market relationship analysis.
            </p>
            <a
              href="https://x.com/interbankguy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 text-[13.5px] text-tx2 transition-colors hover:text-foreground"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-[13px] shrink-0 fill-current"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              @interbankguy
              <span className="sr-only"> on X (opens in a new tab)</span>
            </a>
          </div>

          <div className="flex flex-[1_1_300px] flex-wrap justify-start gap-12 sm:gap-16 lg:justify-end">
            {COLS.map((col) => (
              <nav
                key={col.label}
                aria-label={col.label}
                className="flex flex-col gap-[11px]"
              >
                {col.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="text-[13.5px] text-tx2 transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
            ))}
          </div>
        </div>

        <div id="disclaimer" className="border-t border-hair pt-[22px] pb-11">
          <p className="mb-6 text-xs leading-[1.6] text-warn/80">
            We do not provide education or training.
          </p>
          <div className="flex flex-wrap items-start gap-10">
            <p className="shrink-0 text-xs leading-[1.6] text-tx4">
              © 2026 Trading Indicators
            </p>
            <p className="max-w-[76ch] flex-[1_1_480px] text-xs leading-[1.6] text-tx4">
              Trading futures, forex and other leveraged products involves
              substantial risk of loss and is not suitable for every investor.
              These indicators are analysis tools, not financial advice, and do
              not guarantee any outcome. Past performance is not indicative of
              future results.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
