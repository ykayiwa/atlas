import Link from "next/link";
import { UgandaFlag } from "@/components/shared/UgandaFlag";

export const metadata = {
  title: "Privacy Policy — Atlas AI",
  description: "Atlas AI privacy policy. Learn how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-[#fafbfc]">
      {/* Header */}
      <header className="border-b border-[#e8ecf0] bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5 px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <UgandaFlag size={28} />
            <span className="text-[0.95rem] font-bold tracking-tight text-[#0A0A0A]">
              Atlas AI
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-[#0f1f14]">
          Privacy Policy
        </h1>
        <p className="mt-2 text-[0.9rem] text-[#64748b]">
          Last updated: March 21, 2026
        </p>

        <div className="mt-10 space-y-8 text-[0.9rem] leading-relaxed text-[#334155]">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-[#0f1f14]">
              1. Introduction
            </h2>
            <p>
              Atlas AI (&quot;we&quot;, &quot;our&quot;, or &quot;the Platform&quot;) is an AI
              engagement platform for the Office of the Hon. State Minister of
              Finance for Investment and Privatization, Republic of Uganda,
              operated by Africa One ePortal Limited. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our website at atlasug.com and
              office.atlasug.com (collectively, the &quot;Service&quot;).
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[#0f1f14]">
              2. Information We Collect
            </h2>
            <h3 className="mb-2 font-semibold text-[#0f1f14]">
              2.1 Information you provide
            </h3>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong>Account information:</strong> When you create an account,
                we collect your name, email address, and password. If you sign in
                with Google, we receive your name, email, and profile picture from
                Google.
              </li>
              <li>
                <strong>Chat messages:</strong> The questions you ask and
                conversations you have with Atlas AI. If you are signed in,
                these are stored to provide chat history.
              </li>
              <li>
                <strong>Feedback:</strong> Any ratings or feedback you provide on
                AI responses.
              </li>
            </ul>

            <h3 className="mb-2 mt-4 font-semibold text-[#0f1f14]">
              2.2 Information collected automatically
            </h3>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong>Usage data:</strong> Pages visited, features used, time
                spent, and interaction patterns.
              </li>
              <li>
                <strong>Device information:</strong> Browser type, operating
                system, device type, and screen resolution.
              </li>
              <li>
                <strong>IP address:</strong> Used for security, rate limiting, and
                general geographic analytics.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[#0f1f14]">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>To provide, maintain, and improve the Service</li>
              <li>To save and display your chat history when you are signed in</li>
              <li>
                To improve the quality and accuracy of AI responses using
                aggregated, anonymised data
              </li>
              <li>To prevent abuse, fraud, and ensure platform security</li>
              <li>To send important service-related communications</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[#0f1f14]">
              4. Anonymous Usage
            </h2>
            <p>
              You can use Atlas AI without creating an account. When you use
              the Service anonymously, we do not store your chat messages or
              associate your queries with any identity. Only minimal technical
              data (IP address, device type) is collected for security and rate
              limiting purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[#0f1f14]">
              5. Data Sharing
            </h2>
            <p className="mb-2">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <strong>AI service providers:</strong> Your questions are
                processed by third-party AI models to generate responses. These
                providers process data according to their own privacy policies
                and data processing agreements.
              </li>
              <li>
                <strong>Authentication providers:</strong> If you use Google
                Sign-In, Google processes your authentication data per their
                privacy policy.
              </li>
              <li>
                <strong>Legal requirements:</strong> When required by law, court
                order, or governmental authority.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[#0f1f14]">
              6. Data Storage and Security
            </h2>
            <p>
              Your data is stored on secure servers. We implement
              industry-standard security measures including encryption in
              transit (HTTPS/TLS), secure password hashing, and access controls.
              However, no method of electronic storage is 100% secure, and we
              cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[#0f1f14]">
              7. Your Rights
            </h2>
            <p className="mb-2">You have the right to:</p>
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Withdraw consent for data processing at any time</li>
              <li>Export your data in a portable format</li>
            </ul>
            <p className="mt-2">
              To exercise these rights, contact us at{" "}
              <a
                href="mailto:privacy@atlas.com"
                className="font-medium text-[#0A0A0A] underline underline-offset-2"
              >
                privacy@atlas.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[#0f1f14]">
              8. Cookies
            </h2>
            <p>
              We use essential cookies for authentication and session management.
              We do not use third-party advertising or tracking cookies. Analytics
              cookies, if used, are self-hosted and do not share data with
              external parties.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[#0f1f14]">
              9. Children&apos;s Privacy
            </h2>
            <p>
              Atlas AI is not directed at children under 13. We do not
              knowingly collect personal information from children under 13. If
              you believe a child has provided us with personal data, please
              contact us and we will delete it.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[#0f1f14]">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any material changes by posting the new policy on
              this page and updating the &quot;Last updated&quot; date. Your continued
              use of the Service after changes constitutes acceptance of the
              updated policy.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[#0f1f14]">
              11. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy, please contact us
              at:
            </p>
            <div className="mt-3 rounded-xl border border-[#e8ecf0] bg-white p-4">
              <p className="font-semibold text-[#0f1f14]">Atlas AI</p>
              <p className="mt-1">
                Email:{" "}
                <a
                  href="mailto:privacy@atlas.com"
                  className="font-medium text-[#0A0A0A] underline underline-offset-2"
                >
                  privacy@atlas.com
                </a>
              </p>
              <p>
                Website:{" "}
                <a
                  href="https://atlas.com"
                  className="font-medium text-[#0A0A0A] underline underline-offset-2"
                >
                  atlas.com
                </a>
              </p>
            </div>
          </section>
        </div>

        {/* Back link */}
        <div className="mt-12 border-t border-[#e8ecf0] pt-6">
          <Link
            href="/"
            className="text-[0.85rem] font-medium text-[#0A0A0A] underline underline-offset-2"
          >
            &larr; Back to Atlas AI
          </Link>
        </div>
      </main>
    </div>
  );
}
