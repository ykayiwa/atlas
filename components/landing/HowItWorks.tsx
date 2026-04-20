const STEPS = [
  {
    step: "1",
    title: "Ask your question",
    description: "Ask about incentives, privatization, land, tax treaties — in English, Mandarin, Arabic, or French.",
  },
  {
    step: "2",
    title: "Grounded retrieval",
    description: "Atlas searches gazetted law, approved Ministry directives, and institutional data — never generic internet content.",
  },
  {
    step: "3",
    title: "Cited, ministerial answer",
    description: "You receive a policy-grounded response with sources, and — for serious intent — a direct line to the Minister's Office.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="border-y border-[#e2e8f0] bg-[#f8fafc] px-6 py-24 scroll-mt-20">
      <div className="mx-auto max-w-[920px]">
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-full bg-[#FFFBEB] px-3 py-1 text-[0.74rem] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]">
            How it works
          </span>
          <h2 className="text-[2.1rem] font-extrabold leading-tight tracking-[-0.025em] text-[#0A0A0A]">
            From question to policy-grounded answer, in seconds
          </h2>
          <p className="mx-auto mt-3 max-w-[540px] text-[1.05rem] leading-relaxed text-[#64748b]">
            Atlas uses retrieval-augmented generation over Uganda&apos;s investment law and
            Ministry directives. No hallucinations. No invented incentives. Every claim cites
            its source.
          </p>
        </div>
        <div className="relative grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Connecting line */}
          <div className="absolute left-[calc(16.66%+12px)] right-[calc(16.66%+12px)] top-6 hidden h-px bg-gradient-to-r from-[#d1e7dd] via-[#0A0A0A] to-[#d1e7dd] sm:block" />
          {STEPS.map((s) => (
            <div key={s.step} className="text-center">
              <div className="relative z-10 mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#0A0A0A] text-[1.05rem] font-extrabold text-white shadow-[0_0_0_6px_#f8fafc,0_0_0_7px_#e2e8f0]">
                {s.step}
              </div>
              <h3 className="mb-[9px] text-base font-bold text-[#0f1f14]">{s.title}</h3>
              <p className="text-[0.87rem] leading-relaxed text-[#64748b]">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
