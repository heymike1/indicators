import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Return Policy - 243 Indicators",
  description: "Return Policy for 243 Indicators digital goods.",
  alternates: { canonical: "/return-policy" },
  openGraph: { title: "Return Policy - 243 Indicators", description: "Return Policy for 243 Indicators digital goods.", url: "/return-policy", images: "/opengraph-image" },
  twitter: { card: "summary_large_image", title: "Return Policy - 243 Indicators", description: "Return Policy for 243 Indicators digital goods.", images: "/opengraph-image" },
};

export default function ReturnPolicyPage() {
  return (
    <LegalPage title="Return Policy" lastUpdated="Aug 22, 2026">
      <p>
        <strong>Digital Goods – No Returns</strong>
      </p>
      <p>
        All 243 Indicators products and services are <strong>digital goods</strong> delivered immediately upon
        purchase.
      </p>

      <h2>No Refunds</h2>
      <p>Due to the nature of digital content:</p>
      <ul>
        <li>
          <strong>All sales are final</strong>
        </li>
        <li>
          <strong>No refunds, returns, or exchanges</strong> are permitted
        </li>
        <li>This includes accidental purchases, dissatisfaction, inactivity, suspension, or termination</li>
      </ul>
      <p>By purchasing, you:</p>
      <ul>
        <li>Acknowledge immediate access</li>
        <li>Confirm receipt of digital goods</li>
        <li>Waive all refund rights</li>
      </ul>

      <h2>Chargebacks</h2>
      <p>Unauthorized chargebacks are considered a breach of contract and may result in:</p>
      <ul>
        <li>Immediate account termination</li>
        <li>Permanent ban</li>
        <li>Submission of evidence to Stripe or other processors</li>
      </ul>
    </LegalPage>
  );
}
