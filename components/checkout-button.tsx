import { Button } from "@/components/ui/button";
import { CHECKOUT_LINK } from "@/lib/site";

/** The one CTA. Keeps the checkout href, the new-tab behaviour and the
 *  screen-reader hint in a single place so they cannot drift apart. */
export function CheckoutButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <Button asChild size="lg" className={className}>
      <a {...CHECKOUT_LINK}>
        {label}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </Button>
  );
}
