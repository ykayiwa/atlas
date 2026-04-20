"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { UgandaFlag } from "./UgandaFlag";
import { authClient } from "@/lib/auth-client";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    authClient.getSession().then((res) => {
      if (res.data) setIsLoggedIn(true);
    }).catch(() => {});
  }, []);

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-black/[0.06] bg-white/[0.94] px-6 backdrop-blur-[16px] sm:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-[1.2rem] font-extrabold tracking-[-0.3px] text-[#0A0A0A]">
          <UgandaFlag size={34} />
          Atlas AI
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 sm:flex">
          <Link href="#topics" className="text-[0.9rem] font-medium text-[#64748b] transition-colors hover:text-[#0A0A0A]">Topics</Link>
          <Link href="#how" className="text-[0.9rem] font-medium text-[#64748b] transition-colors hover:text-[#0A0A0A]">How it works</Link>
          <Link href="#sources" className="text-[0.9rem] font-medium text-[#64748b] transition-colors hover:text-[#0A0A0A]">Sources</Link>
          {isLoggedIn ? (
            <Link
              href="/chat"
              className="inline-flex min-h-[44px] items-center rounded-[9px] bg-[#0A0A0A] px-[22px] py-[10px] text-[0.9rem] font-semibold text-white transition-all hover:-translate-y-px hover:bg-[#1a1a1a]"
            >
              Open Chat →
            </Link>
          ) : (
            <Link
              href="/chat"
              className="inline-flex min-h-[44px] items-center rounded-[9px] bg-[#0A0A0A] px-[22px] py-[10px] text-[0.9rem] font-semibold text-white transition-all hover:-translate-y-px hover:bg-[#1a1a1a]"
            >
              Open Chat
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-[#FFFBEB] sm:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="fixed left-0 right-0 top-16 z-40 flex flex-col gap-1 border-b border-[#e2e8f0] bg-white px-6 pb-5 pt-3 shadow-[0_8px_24px_rgba(0,0,0,0.08)] sm:hidden">
          <Link href="#topics" onClick={() => setMobileOpen(false)} className="flex min-h-[44px] items-center rounded-lg px-3 text-base font-medium text-[#0f1f14] transition-colors hover:bg-[#FFFBEB] hover:text-[#0A0A0A]">
            Topics
          </Link>
          <Link href="#how" onClick={() => setMobileOpen(false)} className="flex min-h-[44px] items-center rounded-lg px-3 text-base font-medium text-[#0f1f14] transition-colors hover:bg-[#FFFBEB] hover:text-[#0A0A0A]">
            How it works
          </Link>
          <Link href="#sources" onClick={() => setMobileOpen(false)} className="flex min-h-[44px] items-center rounded-lg px-3 text-base font-medium text-[#0f1f14] transition-colors hover:bg-[#FFFBEB] hover:text-[#0A0A0A]">
            Sources
          </Link>
          {isLoggedIn ? (
            <Link href="/chat" onClick={() => setMobileOpen(false)} className="mt-2 flex min-h-[44px] items-center justify-center rounded-lg bg-[#0A0A0A] text-base font-semibold text-white transition-colors hover:bg-[#1a1a1a]">
              Open Chat →
            </Link>
          ) : (
            <Link href="/chat" onClick={() => setMobileOpen(false)} className="mt-2 flex min-h-[44px] items-center justify-center rounded-lg bg-[#0A0A0A] text-base font-semibold text-white transition-colors hover:bg-[#1a1a1a]">
              Open Chat
            </Link>
          )}
        </div>
      )}
    </>
  );
}
