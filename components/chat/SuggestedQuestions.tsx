"use client";

import { UgandaFlag } from "@/components/shared/UgandaFlag";

const SUGGESTIONS = [
  {
    text: "What tax incentives apply to a $10M textile manufacturing investment in Eastern Uganda?",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    color: "#0A0A0A",
    bg: "#FFFBEB",
  },
  {
    text: "How does an investor acquire land in a Ugandan Special Economic Zone?",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
      </svg>
    ),
    color: "#B45309",
    bg: "#FFFBEB",
  },
  {
    text: "Which state enterprises are currently in Uganda's privatization pipeline?",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" /><path d="M7 14l4-4 4 4 5-5" />
      </svg>
    ),
    color: "#D90000",
    bg: "#FEF3F2",
  },
  {
    text: "What bilateral investment treaties does Uganda have with GCC countries?",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
    color: "#0369A1",
    bg: "#F0F9FF",
  },
  {
    text: "Summarise the investor protections under Uganda's Investment Code Act 2019.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    color: "#6D28D9",
    bg: "#F5F3FF",
  },
  {
    text: "Compare Uganda's investor protections with Kenya's for a foreign-owned energy project.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    color: "#dc2626",
    bg: "#fef2f2",
  },
];

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 pb-8">
      {/* Hero area */}
      <div className="mb-10 flex flex-col items-center">
        <div className="mb-5 rounded-2xl bg-gradient-to-br from-[#FFFBEB] to-[#FEF3F2] p-4 shadow-sm">
          <UgandaFlag size={48} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[#0A0A0A] sm:text-[1.7rem]">
          What would you like to know about investing in Uganda?
        </h2>
        <p className="mt-2 max-w-md text-center text-[0.9rem] leading-relaxed text-[#64748b]">
          Ask about tax incentives, privatization opportunities, land acquisition, bilateral
          treaties, or the regulatory framework. Answers are grounded in Ugandan law and Ministry
          directives.
        </p>
      </div>

      {/* Suggestion cards */}
      <div className="grid w-full max-w-[640px] grid-cols-1 gap-2.5 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.text}
            onClick={() => onSelect(s.text)}
            className="group flex items-start gap-3 rounded-xl border border-[#e8ecf0] bg-white px-4 py-3.5 text-left transition-all duration-200 hover:-translate-y-[1px] hover:border-[#0A0A0A]/25 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
          >
            <span
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors"
              style={{ backgroundColor: s.bg, color: s.color }}
            >
              {s.icon}
            </span>
            <span className="text-[0.85rem] leading-snug text-[#334155] transition-colors group-hover:text-[#0f1f14]">
              {s.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
