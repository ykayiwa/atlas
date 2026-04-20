const SOURCES = [
  {
    name: "Ministry of Finance,\nPlanning & Economic Dev.",
    iconBg: "#FFFBEB",
    iconColor: "#0A0A0A",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    name: "Uganda Investment\nAuthority (UIA)",
    iconBg: "#FEF3F2",
    iconColor: "#D90000",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
    ),
  },
  {
    name: "Uganda Revenue\nAuthority (URA)",
    iconBg: "#F0F9FF",
    iconColor: "#0369A1",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    name: "Uganda Law\nReform Commission",
    iconBg: "#F5F3FF",
    iconColor: "#6D28D9",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    name: "Bank of\nUganda",
    iconBg: "#ECFDF5",
    iconColor: "#047857",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  {
    name: "Privatisation &\nUtility Sector Reform",
    iconBg: "#FEFCE8",
    iconColor: "#854D0E",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M3 3v18h18" /><path d="M7 14l4-4 4 4 5-5" />
      </svg>
    ),
  },
];

export function DataSources() {
  return (
    <section id="sources" className="border-y border-[#e2e8f0] bg-[#f8fafc] px-6 py-24 scroll-mt-20">
      <div className="mx-auto max-w-[1120px]">
        <div className="mb-11 text-center">
          <span className="mb-3 inline-block rounded-full bg-[#FFFBEB] px-3 py-1 text-[0.74rem] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]">
            Trusted knowledge
          </span>
          <h2 className="text-[2.1rem] font-extrabold leading-tight tracking-[-0.025em] text-[#0A0A0A]">
            Grounded in Uganda&apos;s authoritative sources
          </h2>
          <p className="mx-auto mt-3 max-w-[540px] text-[1.05rem] leading-relaxed text-[#64748b]">
            Every answer is built from gazetted law, approved Ministry directives, and verified
            institutional data — never generic internet content.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-5">
          {SOURCES.map((source) => (
            <div
              key={source.name}
              className="flex items-center gap-3 rounded-[14px] border-[1.5px] border-[#e2e8f0] bg-white px-[22px] py-4 text-[0.84rem] font-semibold leading-snug text-[#0f1f14] transition-all hover:border-[#0A0A0A] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px]"
                style={{ background: source.iconBg, color: source.iconColor }}
              >
                {source.icon}
              </div>
              <div className="whitespace-pre-line">{source.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
