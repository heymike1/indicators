import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "EULA - 243 Trading",
  description: "End User License Agreement for 243 Trading.",
};

export default function EulaPage() {
  return (
    <LegalPage title="EULA" lastUpdated="Aug 22, 2026">
      <h2>1. License Grant</h2>
      <p>
        243 Trading grants you a{" "}
        <strong>
          limited, non-exclusive, non-transferable, revocable license
        </strong>{" "}
        to use the indicators on your own TradingView account, for personal,
        non-commercial use only.
      </p>

      <h2>2. Ownership</h2>
      <p>
        The indicators and their source code remain the exclusive intellectual
        property of 243 Trading.
      </p>
      <p>No ownership rights are granted.</p>

      <h2>3. Restrictions</h2>
      <p>You may not:</p>
      <ul>
        <li>Share or resell the indicators</li>
        <li>Use the indicators commercially</li>
        <li>Share your account credentials or TradingView username</li>
        <li>
          Copy, decompile, reverse engineer, or redistribute the indicators or
          their source code
        </li>
      </ul>

      <h2>4. Confidentiality</h2>
      <p>
        The source code of the indicators is confidential. Unauthorized
        disclosure constitutes a material breach.
      </p>

      <h2>5. Termination</h2>
      <p>
        243 Trading may revoke this license at any time without notice.
      </p>
      <p>Termination does not entitle you to a refund.</p>

      <h2>6. Disclaimer</h2>
      <p>
        Content is provided <strong>“AS IS”</strong> without warranties or
        guarantees.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        243 Trading is not liable for damages arising from use of the
        indicators or the platform.
      </p>

      <h2>8. Governing Law</h2>
      <p>
        This Agreement is governed by the laws of{" "}
        <strong>The Netherlands</strong>.
      </p>
    </LegalPage>
  );
}
