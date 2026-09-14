import { FAQ, INDICATORS } from "@/lib/indicators";
import { CHECKOUT_URL, SITE_NAME, SITE_URL } from "@/lib/site";

const DESCRIPTION =
  "Seven TradingView indicators that map time, price, liquidity and market relationships onto your charts. One subscription, $29/month forever.";

const organization = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: ["https://x.com/interbankguy"],
};

const website = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

/* What is sold: one subscription to the whole set, billed monthly and
   delivered inside TradingView. */
const product = {
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#product`,
  name: SITE_NAME,
  description: DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  applicationCategory: "FinanceApplication",
  operatingSystem: "TradingView",
  featureList: INDICATORS.map((i) => i.title),
  brand: { "@id": `${SITE_URL}/#organization` },
  offers: {
    "@type": "Offer",
    url: CHECKOUT_URL,
    price: "29",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: "29",
      priceCurrency: "USD",
      billingIncrement: 1,
      unitCode: "MON",
    },
  },
};

const faq = {
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#faq`,
  mainEntity: FAQ.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const graph = { "@context": "https://schema.org", "@graph": [organization, website, product, faq] };

/** One JSON-LD block for the home page. `<` is escaped so no content can
 *  close the script element early. */
export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
