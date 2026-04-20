import { LegalPage } from "@/components/shared/LegalPage";

export const metadata = {
  title: "Contact — Atlas AI",
  description:
    "Contact the Atlas AI team at Africa One ePortal Ltd for adoption, partnership, or technical enquiries.",
};

type Channel = {
  title: string;
  body: string;
  cta?: { label: string; href: string };
};

const channels: Channel[] = [
  {
    title: "Investor desk",
    body:
      "Investors, fund managers, and government partners with serious interest in Uganda should start in the chat — Atlas answers policy-grounded questions in seconds and, for qualifying enquiries, offers a direct line to the Minister's Office.",
    cta: { label: "Open the chat →", href: "/chat" },
  },
  {
    title: "Ministry of Finance — adoption enquiries",
    body:
      "For official adoption, expansion of the knowledge base, or deployment across another Ministry, Department, or Agency, contact the operator directly.",
  },
  {
    title: "Technical & partnership",
    body:
      "Integration, multi-tenant deployments, API access, and platform partnerships.",
  },
  {
    title: "Press & media",
    body:
      "Media enquiries about Atlas AI, the underlying platform, or the Minister's Office investor-engagement initiative.",
  },
];

export default function ContactPage() {
  return (
    <LegalPage eyebrow="Contact" title="Get in touch">
      <section>
        <p>
          Atlas AI is built and operated by <strong>Africa One ePortal Limited</strong>,
          a Ugandan technology firm, on behalf of the Office of the Hon. State
          Minister of Finance for Investment and Privatization, Republic of Uganda.
        </p>
      </section>

      <section>
        <h2>Primary channels</h2>
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {channels.map((c) => (
            <div
              key={c.title}
              className="rounded-xl border border-[#e8ecf0] bg-white p-5"
            >
              <h3 className="text-[0.95rem] font-semibold text-[#0A0A0A]">
                {c.title}
              </h3>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-[#475569]">
                {c.body}
              </p>
              {c.cta ? (
                <a
                  href={c.cta.href}
                  className="mt-3 inline-flex items-center gap-1 text-[0.82rem] font-semibold text-[#0A0A0A]"
                >
                  {c.cta.label}
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Direct contact</h2>
        <ul>
          <li>
            <strong>Email:</strong>{" "}
            <a href="mailto:info@africaone.com">info@africaone.com</a>
          </li>
        </ul>
      </section>

      <section>
        <h2>A note on commitments</h2>
        <p>
          Atlas AI provides information grounded in Ugandan investment law and
          approved policy. It is not a channel for granting tax exemptions, approving
          investments, or issuing binding commitments on behalf of the Government —
          those decisions rest with the Uganda Investment Authority, Uganda Revenue
          Authority, Ministry of Finance, and the relevant regulators. For serious
          enquiries, we will connect you directly with the right institution.
        </p>
      </section>
    </LegalPage>
  );
}
