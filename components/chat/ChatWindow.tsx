"use client";

import { useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { SearchBar } from "./SearchBar";
import { UgandaFlag } from "@/components/shared/UgandaFlag";
import type { ChatMessage } from "@/types/chat";

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSend: (message: string) => void;
}

export function ChatWindow({ messages, isLoading, onSend }: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <SuggestedQuestions onSelect={onSend} />
        ) : (
          <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                sources={msg.sources}
              />
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="mt-1 shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FFFBEB] to-[#e0f2e9] shadow-sm">
                    <UgandaFlag size={22} />
                  </div>
                </div>
                <div className="rounded-2xl rounded-tl-sm border border-[#e8ecf0] bg-white px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center gap-1.5">
                    <span className="h-[6px] w-[6px] animate-bounce rounded-full bg-[#0A0A0A]/30 [animation-delay:0ms]" />
                    <span className="h-[6px] w-[6px] animate-bounce rounded-full bg-[#0A0A0A]/30 [animation-delay:150ms]" />
                    <span className="h-[6px] w-[6px] animate-bounce rounded-full bg-[#0A0A0A]/30 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <SearchBar onSubmit={onSend} isLoading={isLoading} autoFocus />
    </div>
  );
}
