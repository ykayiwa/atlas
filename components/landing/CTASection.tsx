import Link from "next/link";

export function CTASection() {
  return (
    <section
      className="relative overflow-hidden px-6 py-28 text-center text-white"
      style={{
        background: "linear-gradient(150deg, #0A0A0A 0%, #1a1a1a 55%, #3a2a00 100%)",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#000] via-[#FCDC04] to-[#D90000]"
      />
      <h2 className="relative text-[clamp(1.9rem,4vw,2.75rem)] font-extrabold tracking-[-0.025em]">
        Uganda is open for business —{" "}
        <span className="text-[#FCDC04]">even when the doors are closed.</span>
      </h2>
      <p className="relative mx-auto mb-10 mt-4 max-w-[560px] text-[1.1rem] leading-relaxed opacity-85">
        Ask Atlas the questions you&apos;d bring to the Minister&apos;s Office. Get policy-grounded,
        cited answers — instantly, in your language, at any hour.
      </p>
      <Link
        href="/chat"
        className="relative inline-flex min-h-[56px] items-center gap-2.5 rounded-xl bg-[#FCDC04] px-10 py-[17px] text-base font-bold text-[#0A0A0A] shadow-[0_4px_20px_rgba(252,220,4,0.35)] transition-all hover:-translate-y-[3px] hover:shadow-[0_10px_32px_rgba(252,220,4,0.45)]"
      >
        Ask Your First Question
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>
    </section>
  );
}
