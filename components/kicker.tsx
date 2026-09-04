import { cn } from "cn";

export function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-[9px] font-mono text-[11px] leading-none font-medium tracking-[0.14em] text-acc uppercase", className)}>
      <span className="size-[6px] shrink-0 rounded-full bg-acc" aria-hidden="true" />
      {children}
    </p>
  );
}
