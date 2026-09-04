import Image from "next/image";
import { cn } from "cn";

/** The brand mark. Decorative: every placement sits beside the wordmark,
 *  so it is hidden from assistive tech rather than announced twice. */
export function LogoMark({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/logo.png"
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={cn("block shrink-0 rounded-[5px]", className)}
    />
  );
}
