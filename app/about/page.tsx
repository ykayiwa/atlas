import { LegalPage } from "@/components/shared/LegalPage";

export const metadata = {
  title: "About — Atlas AI",
  description:
    "Atlas AI is the 24/7 investor engagement platform of the Office of the Hon. State Minister of Finance for Investment and Privatization, Republic of Uganda.",
};

export default function AboutPage() {
  return (
    <LegalPage eyebrow="About" title="The Ministerial Intelligence Engine">
      <section>
        <p>
          <strong>Atlas AI</strong> is the 24/7 investor engagement platform of the Office
          of the Hon. State Minister of Finance for Investment and Privatization,
          Republic of Uganda. It answers substantive questions from investors, fund
          managers, government partners, and researchers about Uganda&apos;s investment
          climate, tax incentives, privatization portfolio, and regulatory framework.
        </p>
      </section>

      <section>
        <h2>What Atlas AI does today</h2>
        <ul>
          <li>
            Responds instantly to investor queries at any hour in English, Mandarin,
            Arabic, and French.
          </li>
          <li>
            Provides consistent, authoritative answers grounded in Ugandan investment
            law, the PERD Act, tax treaties, and approved policy directives — not
            generic internet information.
          </li>
          <li>
            Operates as an always-on extension of the Minister&apos;s Office, delivering
            the same quality of response whether it is 9:00 AM on a Monday or 3:00 AM
            on a Saturday.
          </li>
        </ul>
      </section>

      <section>
        <h2>How it works</h2>
        <p>
          Atlas AI uses Retrieval-Augmented Generation (RAG), a proven AI architecture
          used by investment banks, sovereign wealth funds, and governments worldwide.
          An investor asks a question; the system searches a curated knowledge base of
          approved Ugandan investment documents, laws, and policy directives for
          relevant material; it then generates a response grounded only in those
          sources — it cannot make things up or go beyond what the approved documents
          say. Every answer is delivered with citations to the underlying law or
          policy.
        </p>
      </section>

      <section>
        <h2>Built-in safety</h2>
        <ul>
          <li>
            <strong>Cannot hallucinate policy.</strong> Answers are grounded exclusively
            in approved documents. Where information isn&apos;t in the knowledge base,
            the system says so and offers to connect the investor with a human
            official.
          </li>
          <li>
            <strong>Cannot make commitments.</strong> The system provides information,
            not binding promises. It cannot offer tax exemptions, approve investments,
            or make any commitments on behalf of the Government.
          </li>
          <li>
            <strong>Cannot be manipulated.</strong> Guardrails against prompt injection
            and adversarial queries keep the system on-mandate.
          </li>
          <li>
            <strong>Full audit trail.</strong> Every query and response is logged and
            available for review.
          </li>
        </ul>
      </section>

      <section>
        <h2>Who built Atlas AI</h2>
        <p>
          Atlas AI is built and operated by <strong>Africa One ePortal Limited</strong>,
          a Ugandan technology firm specialising in AI platforms for the public sector.
          The system is designed as multi-tenant infrastructure — the Ministry of
          Finance deployment is the first tenant, and the same platform can serve any
          Ministry, Department, or Agency that needs an intelligent, 24/7 information
          service.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          For adoption, partnership, or technical enquiries, see our{" "}
          <a href="/contact">contact page</a>.
        </p>
      </section>
    </LegalPage>
  );
}
