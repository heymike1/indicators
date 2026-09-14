import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

// a static export builds this once, at build time
export const dynamic = "force-static";

export const alt = "243 Indicators - Spend less time marking charts.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* The share card: the mark and the name, the headline, and the one line
   that says what it costs. Same palette as the page. */
export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public", "logo.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#fcfcf7",
          color: "#15171a",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img src={src} width={64} height={64} alt="" style={{ borderRadius: 14 }} />
          <div style={{ fontSize: 34, fontWeight: 400, letterSpacing: -0.5 }}>{SITE_NAME}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ fontSize: 88, fontWeight: 300, lineHeight: 1.05, letterSpacing: -2.5, maxWidth: 980 }}>
            Spend less time marking charts.
          </div>
          <div style={{ fontSize: 30, color: "#6b7078", lineHeight: 1.4, maxWidth: 900 }}>
            Seven TradingView indicators for time, price, liquidity and market relationships.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 56,
              padding: "0 28px",
              borderRadius: 999,
              background: "#03438c",
              color: "#fcfcf7",
              fontSize: 24,
            }}
          >
            $29/month forever
          </div>
          <div style={{ fontSize: 22, color: "#6b7078" }}>All updates and future indicators included</div>
        </div>
      </div>
    ),
    size,
  );
}
