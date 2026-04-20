"use client";

import { useState, useRef, useEffect } from "react";

interface SearchBarProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
  autoFocus?: boolean;
}

export function SearchBar({ onSubmit, isLoading, autoFocus }: SearchBarProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  };

  return (
    <div className="border-t border-[#e8ecf0] bg-gradient-to-t from-white via-white to-white/80 px-4 pb-4 pt-3">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-end gap-2 rounded-2xl border border-[#e2e8f0] bg-white px-4 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-200 focus-within:border-[#0A0A0A]/40 focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.06),0_2px_12px_rgba(0,0,0,0.04)]">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Ask about tax incentives, privatization, treaties, land…"
            rows={1}
            className="max-h-[150px] min-h-[28px] flex-1 resize-none bg-transparent text-[0.9rem] leading-relaxed text-[#0f1f14] placeholder-[#a0aec0] outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0A0A0A] text-white transition-all duration-200 hover:bg-[#1a1a1a] active:scale-95 disabled:bg-[#e2e8f0] disabled:text-[#a0aec0]"
          >
            {isLoading ? (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-[#94a3b8]">
          Atlas AI provides information from verified sources. Always verify critical details.
        </p>
      </div>
    </div>
  );
}
