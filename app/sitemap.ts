import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// a static export builds this once, at build time
export const dynamic = "force-static";

/** The legal pages carry their own "last updated" date; the home page
 *  moves with the product, so it takes the build date. */
const LEGAL = new Date("2026-08-22");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/terms`, lastModified: LEGAL, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, lastModified: LEGAL, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/eula`, lastModified: LEGAL, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/return-policy`, lastModified: LEGAL, changeFrequency: "yearly", priority: 0.3 },
  ];
}
