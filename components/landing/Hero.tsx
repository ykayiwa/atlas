"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const SUGGESTIONS = [
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    label: "Tax incentives",
    query: "What tax incentives are available for a $10M textile manufacturing investment in Eastern Uganda?",
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
      </svg>
    ),
    label: "Special Economic Zones",
    query: "What is the process for acquiring land in a Special Economic Zone in Uganda?",
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" /><path d="M7 14l4-4 4 4 5-5" />
      </svg>
    ),
    label: "Privatization pipeline",
    query: "Which state enterprises are currently in Uganda's privatization pipeline and what sectors do they cover?",
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
    label: "Bilateral treaties",
    query: "What bilateral investment treaties does Uganda have with Gulf Cooperation Council countries?",
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
    label: "Compare protections",
    query: "Compare Uganda's investor protections with Kenya's for a foreign-owned energy project.",
  },
  {
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      </svg>
    ),
    label: "Investment Code Act",
    query: "Summarise the investor protections under Uganda's Investment Code Act 2019.",
  },
];

export function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toSlug = (text: string) => {
    const slug = text.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");
    const id = Math.random().toString(36).slice(2, 7);
    return `${slug}-${id}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/chat?q=${toSlug(query)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "56px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 120) + "px";
    }
  }, [query]);

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pb-16 pt-32 text-center"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 50% -10%, rgba(252,220,4,0.18) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 90% 80%, rgba(217,0,0,0.06) 0%, transparent 60%),
          #ffffff
        `,
      }}
    >
      <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#FFFBEB] px-[18px] py-[7px] text-[0.8rem] font-semibold text-[#0A0A0A]">
        <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-[#D90000]" />
        Office of the Hon. State Minister of Finance · Investment &amp; Privatization · Uganda
      </div>

      <h1 className="max-w-[860px] text-[clamp(2.6rem,6.5vw,4.75rem)] font-extrabold leading-[1.08] tracking-[-0.035em] text-[#0A0A0A]">
        Ask anything about investing in{" "}
        <span className="relative inline-block">
          <span className="relative z-10">Uganda</span>
          <span className="absolute inset-x-0 bottom-1 -z-0 h-[0.35em] bg-[#FCDC04]" aria-hidden />
        </span>
      </h1>

      <p className="mx-auto mt-6 max-w-[620px] text-[1.15rem] leading-[1.7] text-[#475569]">
        Instant, policy-grounded answers on tax incentives, the PERD Act, bilateral treaties,
        Uganda&apos;s privatization portfolio, and the regulatory framework — from the
        Minister&apos;s Office, 24 hours a day, in English, Mandarin, Arabic, or French.
      </p>

      <div className="mt-10 w-full max-w-[720px]">
        <form onSubmit={handleSubmit}>
          <div
            className={`relative rounded-2xl border bg-white transition-all duration-300 ${
              isFocused
                ? "border-[#0A0A0A]/40 shadow-[0_0_0_3px_rgba(252,220,4,0.4),0_8px_40px_rgba(0,0,0,0.08)]"
                : "border-[#e2e8f0] shadow-[0_2px_20px_rgba(0,0,0,0.06)]"
            }`}
          >
            <textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about incentives, privatization opportunities, land acquisition, tax treaties…"
              rows={1}
              className="w-full resize-none rounded-2xl bg-transparent px-5 pb-3 pt-[18px] text-[1.05rem] leading-[1.6] text-[#0A0A0A] placeholder-[#94a3b8] outline-none"
              style={{ minHeight: "56px", maxHeight: "120px" }}
            />

            <div className="flex items-center justify-between border-t border-[#f1f5f9] px-4 py-2.5">
              <div className="flex items-center gap-1.5 text-[0.75rem] text-[#94a3b8]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
                  <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
                </svg>
                <span className="hidden sm:inline">Answers grounded in Ugandan investment law &amp; approved policy</span>
                <span className="sm:hidden">Policy-grounded answers</span>
              </div>
              <button
                type="submit"
                disabled={!query.trim()}
                className={`flex items-center gap-2 rounded-xl px-5 py-2 text-[0.875rem] font-semibold transition-all duration-200 ${
                  query.trim()
                    ? "bg-[#0A0A0A] text-[#FCDC04] shadow-sm hover:bg-black active:scale-[0.97]"
                    : "bg-[#f1f5f9] text-[#94a3b8] cursor-not-allowed"
                }`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                </svg>
                <span>Ask Atlas</span>
              </button>
            </div>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              onClick={() => router.push(`/chat?q=${toSlug(s.query)}`)}
              className="group flex items-center gap-1.5 rounded-full border border-[#e8ecf0] bg-white/80 px-3.5 py-2 text-[0.8rem] text-[#475569] backdrop-blur-sm transition-all duration-200 hover:-translate-y-[1px] hover:border-[#0A0A0A]/30 hover:bg-[#FFFBEB] hover:text-[#0A0A0A] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            >
              <span className="opacity-50 transition-opacity group-hover:opacity-80">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-16 flex w-full max-w-[620px] overflow-hidden rounded-2xl border border-[#e8ecf0] bg-white/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)] backdrop-blur-sm">
        {[
          { num: "24/7", label: "Investor desk\nnever closes" },
          { num: "4", label: "Languages\nEN · ZH · AR · FR" },
          { num: "0", label: "Hallucinated\npolicy" },
        ].map((stat, i) => (
          <div key={stat.num} className={`relative flex-1 py-5 text-center ${i > 0 ? "before:absolute before:left-0 before:top-4 before:bottom-4 before:w-px before:bg-[#e8ecf0]" : ""}`}>
            <div className="text-[1.75rem] font-extrabold leading-tight text-[#0A0A0A]">
              {stat.num}
            </div>
            <div className="mt-1 whitespace-pre-line text-[0.73rem] font-medium leading-snug text-[#94a3b8]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
