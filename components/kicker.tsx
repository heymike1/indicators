import { cn } from "cn";

export function Kicker({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("inline-flex w-fit items-center rounded-full bg-lime px-2 py-1.5 font-mono text-[12px] leading-none font-medium tracking-[0.015em] text-forest uppercase", className)}>
      {children}
    </p>
  );
}
