import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service - Trading Indicators",
  description: "Terms and Conditions governing your use of Trading Indicators.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" lastUpdated="Mar 23, 2026">
      <h2>Terms and Conditions</h2>
      <p>
        This Terms and Conditions shall govern your use of our platform. By
        using our platform, you accept this Terms and Conditions in full.
        Accordingly, if you disagree with this Terms and Conditions or any part
        of these terms and conditions, you must not use our platform.
      </p>

      <h2>Income Disclaimer</h2>
      <h3>No Investment Advice Provided:</h3>
      <p>
        Any opinions, news, research, analysis, prices, or other information
        contained on this platform or plotted by the indicators are provided as
        general market information only, and do not constitute investment
        advice. The platform should not be relied upon as a substitute for
        extensive independent market research before making your actual trading
        decisions. Opinions, market data, recommendations or any other content
        is subject to change at any time without notice. Trading Indicators will
        not accept liability for any loss or damage, including without
        limitation any loss of profit, which may arise directly or indirectly
        from use of or reliance on such information.
      </p>
      <p>
        We do not recommend the use of technical analysis as a sole means of
        trading decisions. We do not recommend making hurried trading decisions.
      </p>
      <p>
        You should always understand that past performance is not necessarily
        indicative of future results.
      </p>

      <h2>Suspension and Cancellation of Your Subscription</h2>
      <p>
        Trading Indicators reserves the right to suspend or cancel your
        subscription without any further notice nor refund where you:
      </p>
      <ul>
        <li>
          Share, resell, or otherwise redistribute access to the indicators.
        </li>
        <li>
          Share your account credentials or TradingView username with any other
          person.
        </li>
        <li>
          Attempt to copy, decompile, reproduce, or reverse engineer the
          indicators or their source code.
        </li>
      </ul>
      <p>
        Violation of any of these terms will result in a permanent ban without
        any room to dispute nor receive a refund.
      </p>

      <h2>Disclaimer &amp; Non-Refundable Policy</h2>
      <p>
        <strong>Before deciding to make an investment</strong>, you should
        carefully understand the risks involved and consider your investment
        objectives, level of experience, and risk appetite. Past performance is
        not indicative of future results. The possibility exists that you could
        sustain a loss of some or all of your initial investment and therefore
        you should not invest money that you cannot afford to lose.
      </p>
      <p>
        <strong>
          Trading Indicators does not issue a refund under any circumstance.
        </strong>{" "}
        All service is sold “as is” with no guarantee of positive results. You
        assume the responsibility for your purchase, and no refunds will be
        issued.
      </p>
      <p>
        <strong>Technical Malfunction:</strong> Trading Indicators doesn’t
        compensate for technical malfunctions on our systems that might prevent
        your use of our services.
      </p>

      <h2>Limitations on Investment Guidance and Advice</h2>
      <p>
        Trading Indicators is not intended to provide legal, tax or investment
        advice. You are solely responsible for determining whether any
        investment, investment strategy or related transaction is appropriate
        for you based on your personal investment objectives, financial
        circumstances and risk tolerance. You should consult your legal, tax
        professional or investment advisor regarding your specific situation.
        From time to time we may, at our discretion, provide incidental
        information, general advice and recommendation on our own initiative.
        However, we shall not be under any obligation to provide on-going
        general advice in relation to the management of your investment.
      </p>
      <p>
        Where we do provide general trading recommendations, market commentary,
        guidance or other information, it is provided solely to enable you to
        make your own investment decisions and does not amount to a personal
        recommendation or to advice.
      </p>
      <p>
        We give no representation, warranty or guarantee as to the accuracy or
        completeness of such information or as to the legal, tax or accountancy
        consequences of any transaction.
      </p>
      <p>
        Where information is in the form of a document containing a restriction
        on the person or category of persons for whom that document is intended
        or to whom it is distributed, you agree that you will not pass it on
        contrary to that restriction.
      </p>
      <p>
        We do not provide specific investment advice and will not advise on the
        merits or otherwise of your trades or transactions.
      </p>
      <p>
        The decision to place a trade is yours alone. You are responsible for
        the effect a trade might have on any account or open positions. Such
        information may not be consistent with our proprietary investments if
        any, or those of our associates, directors, employees or agents.
      </p>

      <h2>Breaches of These Terms and Conditions</h2>
      <p>
        Without prejudice to our other rights under these Terms and Conditions,
        if you breach these Terms and Conditions in any way, or if we reasonably
        suspect that you have breached these Terms and Conditions in any way, we
        reserve the right to:
      </p>
      <ul>
        <li>Send you one or more formal warnings;</li>
        <li>Temporarily suspend your access to our platform;</li>
        <li>Permanently prohibit you from accessing our platform;</li>
        <li>
          Block computers using your IP address from accessing our platform;
        </li>
        <li>
          Contact any or all of your internet service providers and request that
          they block your access to our platform;
        </li>
        <li>
          Commence legal action against you, whether for breach of contract or
          otherwise; and/or
        </li>
        <li>Suspend or delete your account on our platform.</li>
      </ul>
      <p>
        Where we suspend or prohibit or block your access to our platform or a
        part of our platform, you must not take any action to circumvent such
        suspension or prohibition or blocking including without limitation,
        creating and/or using a different account.
      </p>

      <h2>Entire Agreement</h2>
      <p>
        These Terms and Conditions, together with our Privacy Policy, End User
        License Agreement and Return Policy, shall constitute the entire
        agreement between you and us in relation to your use of our platform and
        shall supersede all previous agreements between you and us in relation
        to your use of our platform.
      </p>

      <h2>Amendments</h2>
      <p>
        We may update this Terms and Conditions from time to time by publishing
        a new version on our website. You should check this page occasionally to
        ensure you are happy with any changes to our agreement. All current
        users will be provided with an updated privacy policy email, providing
        access to this page.
      </p>

      <h2>Third Party Links</h2>
      <p>
        You might find links to third party websites on our platform. These
        websites should have their own privacy policies, which you should check.
        We do not accept any responsibility or liability for their policies
        whatsoever as we have no control over them.
      </p>
    </LegalPage>
  );
}
