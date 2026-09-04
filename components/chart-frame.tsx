import { ChartSvg, type ChartKey } from "@/lib/charts";
import { SPECS } from "@/lib/charts";

type Props = {
  chart: ChartKey;
  size?: "lg" | "sm";
  symbol: string;
  names: string[];
  /** right-hand status: text, or the SMT timeframe chips */
  status?: string;
  chips?: { label: string; on?: boolean }[];
  /** drop in an .mp4/.webm/.gif/.png/.jpg to replace the generated chart */
  media?: string;
};

function Media({ src, alt }: { src: string; alt: string }) {
  if (/\.(mp4|webm|mov)$/i.test(src)) {
    return (
      <video
        className="block h-auto w-full"
        src={src}
        autoPlay loop muted playsInline preload="metadata"
        aria-label={alt}
      />
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="block h-auto w-full" src={src} alt={alt} loading="lazy" decoding="async" />;
}

export function ChartFrame({ chart, size = "lg", symbol, names, status, chips, media }: Props) {
  return (
    <figure className="overflow-hidden rounded-md border border-hair bg-card">
      <figcaption className="flex items-center justify-between gap-4 border-b border-hair px-3.5 py-[11px] font-mono text-[11px] leading-none text-tx4">
        <span className="flex min-w-0 flex-wrap items-center gap-3">
          <span className="font-medium text-foreground">{symbol}</span>
          {/* indicator names are detail, not identity — they step aside on narrow screens */}
          <span className="hidden flex-wrap gap-3 sm:flex">
            {names.map((nm) => <span key={nm}>{nm}</span>)}
          </span>
        </span>
        {chips ? (
          <span className="flex shrink-0 items-center gap-1.5">
            {chips.map((c) => (
              <span
                key={c.label}
                className={
                  c.on
                    ? "rounded-sm border border-acc px-1.5 py-[3px] leading-none text-acc"
                    : "rounded-sm border border-hair px-1.5 py-[3px] leading-none text-tx3"
                }
              >
                {c.label}
              </span>
            ))}
          </span>
        ) : status ? (
          <span className="inline-flex shrink-0 items-center gap-[7px] whitespace-nowrap">
            <span className="size-[5px] shrink-0 rounded-full bg-acc" aria-hidden="true" />
            {status}
          </span>
        ) : null}
      </figcaption>
      {media ? <Media src={media} alt={SPECS[chart].alt} /> : <ChartSvg chart={chart} size={size} />}
    </figure>
  );
}
