import { cn } from "cn";

/** Four charcoal candlesticks — bearish, small base, two higher closes —
 *  with one thin teal level running behind them and past both edges. */
export function LogoMark({ className }: { className?: string }) {
  const bars = [
    { cx: 4.5, wickTop: 2, wickBot: 17, top: 4, bot: 13, down: true },
    { cx: 10, wickTop: 10, wickBot: 20, top: 14, bot: 18, down: false },
    { cx: 15.5, wickTop: 6, wickBot: 17, top: 8, bot: 15, down: false },
    { cx: 21, wickTop: 2, wickBot: 13, top: 3, bot: 10, down: false },
  ];
  return (
    <svg
      viewBox="0 0 26 22"
      className={cn("block h-auto w-[22px] shrink-0", className)}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <line x1={0} y1={12.5} x2={26} y2={12.5} className="cx-acc" strokeWidth={1} />
      {bars.map((b) => (
        <g key={b.cx}>
          <line x1={b.cx} y1={b.wickTop} x2={b.cx} y2={b.wickBot} stroke="var(--ink)" strokeWidth={1} />
          <rect
            x={b.cx - 1.5} y={b.top} width={3} height={b.bot - b.top}
            fill={b.down ? "var(--ink)" : "var(--surface)"}
            stroke="var(--ink)" strokeWidth={1.2}
          />
        </g>
      ))}
    </svg>
  );
}
