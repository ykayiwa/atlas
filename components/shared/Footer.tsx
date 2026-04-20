import Link from "next/link";
import { UgandaFlag } from "./UgandaFlag";

export function Footer() {
  return (
    <footer className="bg-[#16213e] px-6 py-12 text-white/55">
      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-2.5 text-[1.05rem] font-bold text-white">
          <UgandaFlag size={30} />
          Atlas AI
        </div>
        <nav className="flex flex-wrap gap-7">
          {["About", "Privacy", "Terms", "Contact"].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-[0.84rem] text-white/45 transition-colors hover:text-white"
            >
              {item}
            </Link>
          ))}
        </nav>
        <p className="mt-4 w-full text-center text-[0.76rem] opacity-50">
          The Ministerial Intelligence Engine &middot; &copy; {new Date().getFullYear()} Atlas AI &middot;
          Built by Africa One ePortal Ltd for the Office of the Hon. State Minister of Finance for
          Investment &amp; Privatization, Republic of Uganda. Information is sourced from gazetted
          law, approved Ministry directives, and verified institutional data.
        </p>
      </div>
    </footer>
  );
}
