"use client";

import { useEffect, useRef, useState } from "react";

/** Fades and rises a section in once, when it first comes into view. */
export function Reveal({ id, children, className }: { id?: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    // no observer: reveal immediately by setting the attribute the CSS reads
    if (!("IntersectionObserver" in window)) { el.dataset.in = "true"; return; }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { setSeen(true); io.disconnect(); }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);

  return (
    <div id={id} ref={ref} data-in={seen} className={`reveal scroll-mt-24 ${className ?? ""}`}>
      {children}
    </div>
  );
}
