"use client";

import { useRouter } from "next/navigation";
import { GlowingEffect } from "@/components/ui/glow-effect";

const TOPICS = [
  {
    title: "Tax Incentives",
    description: "Sector-specific incentives, capital allowances, VAT deferrals, and Income Tax Act provisions for qualifying investments.",
    query: "What tax incentives apply to a manufacturing investor in Uganda?",
    iconBg: "#FFFBEB",
    iconColor: "#0A0A0A",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "Privatization Portfolio",
    description: "Active divestitures, state enterprises in the pipeline, and the PERD Act framework governing divestiture.",
    query: "Which state enterprises are in Uganda's active privatization pipeline?",
    iconBg: "#FEF3F2",
    iconColor: "#D90000",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" /><path d="M7 14l4-4 4 4 5-5" />
      </svg>
    ),
  },
  {
    title: "Special Economic Zones",
    description: "Licensed SEZs, anchor sectors, land acquisition processes, and the incentive regime under the Free Zones Act.",
    query: "How does an investor acquire land in a Ugandan Special Economic Zone?",
    iconBg: "#FFFBEB",
    iconColor: "#B45309",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
      </svg>
    ),
  },
  {
    title: "Bilateral Treaties",
    description: "BITs, DTAAs, MIGA coverage, ICSID standing, and treaty-based investor protections across Uganda's counterparts.",
    query: "List Uganda's bilateral investment treaties with GCC countries.",
    iconBg: "#F0F9FF",
    iconColor: "#0369A1",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
  {
    title: "Sector Strategies",
    description: "Priority sectors: agro-processing, minerals, energy, ICT, textiles, tourism. Strategy documents and investment prospectuses.",
    query: "What are Uganda's priority sectors for foreign direct investment?",
    iconBg: "#F5F3FF",
    iconColor: "#6D28D9",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      </svg>
    ),
  },
  {
    title: "Regulatory Framework",
    description: "Investment Code Act 2019, UIA licensing, URA compliance, Capital Markets Authority, and regulatory guidance.",
    query: "Summarise the regulatory requirements for foreign-owned investors under Uganda's Investment Code Act 2019.",
    iconBg: "#F9FAFB",
    iconColor: "#0A0A0A",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Land & Licensing",
    description: "Land tenure classes, acquisition procedures for non-citizens, sector licences, and Uganda Land Commission processes.",
    query: "How can a foreign investor acquire leasehold land in Uganda?",
    iconBg: "#ECFDF5",
    iconColor: "#047857",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    title: "Comparative Intelligence",
    description: "Uganda vs Kenya, Rwanda, and Tanzania: effective tax rates, investor protections, ease-of-setup, and sector positioning.",
    query: "Compare Uganda's investor protections with Kenya's for a foreign-owned energy project.",
    iconBg: "#FEFCE8",
    iconColor: "#854D0E",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
];

function TopicCard({ topic, onClick }: { topic: typeof TOPICS[number]; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative rounded-2xl text-left transition-all hover:-translate-y-[3px]"
    >
      <GlowingEffect
        spread={40}
        glow
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={2}
      />
      <div className="relative flex h-full flex-col rounded-2xl border-[1.5px] border-[#e2e8f0] bg-white p-7 transition-colors">
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ background: topic.iconBg, color: topic.iconColor }}
        >
          {topic.icon}
        </div>
        <h3 className="mb-[7px] text-base font-bold text-[#0A0A0A]">{topic.title}</h3>
        <p className="text-[0.85rem] leading-relaxed text-[#64748b]">{topic.description}</p>
      </div>
    </button>
  );
}

function toSlug(text: string) {
  const slug = text.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, "-");
  const id = Math.random().toString(36).slice(2, 7);
  return `${slug}-${id}`;
}

export function TopicsGrid() {
  const router = useRouter();

  return (
    <section id="topics" className="mx-auto max-w-[1120px] px-6 py-24 scroll-mt-20">
      <div className="mb-12 text-center">
        <span className="mb-3 inline-block rounded-full bg-[#FFFBEB] px-3 py-1 text-[0.74rem] font-bold uppercase tracking-[0.12em] text-[#0A0A0A]">
          Explore by domain
        </span>
        <h2 className="text-[2.1rem] font-extrabold leading-tight tracking-[-0.025em] text-[#0A0A0A]">
          Every question an investor can ask about Uganda
        </h2>
        <p className="mx-auto mt-3 max-w-[560px] text-[1.05rem] leading-relaxed text-[#64748b]">
          From the Investment Code Act to the active privatization pipeline — Atlas AI covers the
          information that determines whether capital moves to Uganda or somewhere else.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TOPICS.map((topic) => (
          <TopicCard key={topic.title} topic={topic} onClick={() => router.push(`/chat?q=${toSlug(topic.query)}`)} />
        ))}
      </div>
    </section>
  );
}
