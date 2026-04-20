import Link from "next/link";
import { UgandaFlag } from "./UgandaFlag";

interface LegalPageProps {
  title: string;
  eyebrow?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function LegalPage({ title, eyebrow, lastUpdated, children }: LegalPageProps) {
  return (
    <div className="min-h-dvh bg-[#fafbfc]">
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

      <main className="mx-auto max-w-3xl px-6 py-12">
        {eyebrow ? (
          <span className="mb-3 inline-block rounded-full bg-[#FFFBEB] px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#0A0A0A]">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="text-3xl font-bold tracking-tight text-[#0A0A0A]">{title}</h1>
        {lastUpdated ? (
          <p className="mt-2 text-[0.9rem] text-[#64748b]">Last updated: {lastUpdated}</p>
        ) : null}

        <div className="mt-10 space-y-8 text-[0.92rem] leading-relaxed text-[#334155] [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-[#0A0A0A] [&_h3]:mb-2 [&_h3]:font-semibold [&_h3]:text-[#0A0A0A] [&_a]:text-[#0A0A0A] [&_a]:underline [&_a]:decoration-[#FCDC04] [&_a]:decoration-2 [&_a]:underline-offset-2 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_strong]:text-[#0A0A0A]">
          {children}
        </div>
      </main>

      <footer className="border-t border-[#e8ecf0] bg-white py-8 text-center text-[0.8rem] text-[#94a3b8]">
        <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-6 px-6">
          <Link href="/about" className="hover:text-[#0A0A0A]">About</Link>
          <Link href="/privacy" className="hover:text-[#0A0A0A]">Privacy</Link>
          <Link href="/terms" className="hover:text-[#0A0A0A]">Terms</Link>
          <Link href="/contact" className="hover:text-[#0A0A0A]">Contact</Link>
        </div>
      </footer>
    </div>
  );
}
