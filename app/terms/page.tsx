import { LegalPage } from "@/components/shared/LegalPage";

export const metadata = {
  title: "Terms of Service — Atlas AI",
  description: "Terms governing use of the Atlas AI platform.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      lastUpdated="April 21, 2026"
    >
      <section>
        <h2>1. Acceptance</h2>
        <p>
          By accessing or using Atlas AI (the &quot;Service&quot;), you agree to be
          bound by these Terms. If you do not agree, do not use the Service. These
          Terms form a binding agreement between you and Africa One ePortal Limited
          (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), the operator of the
          Service, acting on behalf of the Office of the Hon. State Minister of
          Finance for Investment and Privatization, Republic of Uganda.
        </p>
      </section>

      <section>
        <h2>2. Informational only — no binding commitments</h2>
        <p>
          Atlas AI provides information drawn from Ugandan investment law, gazetted
          policy, and approved Ministry directives. Nothing returned by the Service
          constitutes:
        </p>
        <ul>
          <li>legal, tax, or investment advice;</li>
          <li>
            an offer, grant, exemption, licence, or approval by the Government of the
            Republic of Uganda or any of its agencies;
          </li>
          <li>
            a warranty that any incentive, treaty benefit, or regulatory treatment
            will apply to your specific circumstances.
          </li>
        </ul>
        <p>
          For binding determinations, you must engage the relevant authority (Uganda
          Investment Authority, Uganda Revenue Authority, Ministry of Finance, Ministry
          of Lands, Capital Markets Authority, etc.) and, where appropriate, a
          qualified Ugandan advocate or tax practitioner.
        </p>
      </section>

      <section>
        <h2>3. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>use the Service for any unlawful purpose or in violation of Ugandan law;</li>
          <li>
            attempt to reverse engineer, probe, or disrupt the Service, including
            prompt injection attacks or attempts to extract internal instructions;
          </li>
          <li>
            scrape, mirror, resell, or redistribute Atlas AI output at scale without
            written permission;
          </li>
          <li>
            impersonate officials, misrepresent affiliations, or use the Service to
            defraud investors or counterparties;
          </li>
          <li>
            upload content that is unlawful, defamatory, infringing, or contains
            personally identifiable information of third parties without a lawful
            basis.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Accuracy and reliance</h2>
        <p>
          We take reasonable steps to ground answers in approved source material, but
          the Service may still be inaccurate, incomplete, or out of date. You are
          responsible for verifying any information before acting on it. We are not
          liable for losses arising from reliance on Service output.
        </p>
      </section>

      <section>
        <h2>5. Accounts</h2>
        <p>
          If you create an account, you agree to provide accurate information and to
          keep your credentials confidential. You are responsible for activity under
          your account. We may suspend or terminate accounts that violate these Terms
          or pose risk to the integrity of the Service.
        </p>
      </section>

      <section>
        <h2>6. Intellectual property</h2>
        <p>
          The Atlas AI name, logo, design, and software are owned by Africa One
          ePortal Limited. Source laws, gazetted policy, and official Ministry
          directives remain the property of their respective authors and the
          Government of the Republic of Uganda. You retain rights in the content you
          submit; you grant us a limited licence to process that content in order to
          operate the Service.
        </p>
      </section>

      <section>
        <h2>7. Disclaimer</h2>
        <p>
          The Service is provided &quot;as is&quot; and &quot;as available&quot;, without
          warranties of any kind, express or implied, including merchantability,
          fitness for a particular purpose, or non-infringement. We do not warrant
          that the Service will be uninterrupted, error-free, or secure.
        </p>
      </section>

      <section>
        <h2>8. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by Ugandan law, we shall not be liable for
          any indirect, incidental, special, consequential, or punitive damages, or
          for loss of profits, data, goodwill, or investment opportunities, arising
          from your use of or inability to use the Service.
        </p>
      </section>

      <section>
        <h2>9. Changes to the Service and these Terms</h2>
        <p>
          We may modify or discontinue any part of the Service at any time. We may
          also update these Terms; material changes will be announced on the Service
          with a revised &quot;Last updated&quot; date. Continued use after changes
          constitutes acceptance.
        </p>
      </section>

      <section>
        <h2>10. Governing law</h2>
        <p>
          These Terms are governed by the laws of the Republic of Uganda. Disputes
          shall be subject to the exclusive jurisdiction of the courts of Uganda.
        </p>
      </section>

      <section>
        <h2>11. Contact</h2>
        <p>
          Questions about these Terms: <a href="/contact">contact us</a>.
        </p>
      </section>
    </LegalPage>
  );
}
