"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChatWindow } from "@/components/chat/ChatWindow";
import type { ChatMessage } from "@/types/chat";
import Link from "next/link";
import { UgandaFlag } from "@/components/shared/UgandaFlag";
import { authClient } from "@/lib/auth-client";

interface SessionItem {
  id: string;
  title: string | null;
  created_at: string;
}

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string>("");

  // Check auth (non-blocking — chat works without login)
  useEffect(() => {
    authClient
      .getSession()
      .then((res) => {
        if (res.data) {
          setUserName(res.data.user?.name ?? "");
          setIsLoggedIn(true);
        }
        setAuthChecked(true);
      })
      .catch(() => {
        setAuthChecked(true);
      });
  }, []);

  const loadSessions = useCallback(() => {
    fetch("/api/sessions")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSessions(data);
      })
      .catch(() => {});
  }, []);

  const loadSessionMessages = useCallback(async (sessionId: string) => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}/messages`);
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        const chatMessages: ChatMessage[] = data.map(
          (m: { id: string; role: "user" | "assistant"; content: string; sources?: Array<{ title: string; url: string }> | null }) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            sources: m.sources ?? undefined,
          })
        );
        setMessages(chatMessages);
        setCurrentSessionId(sessionId);
      }
    } catch {
      console.error("Failed to load session messages");
    }
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
      };

      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            sessionId: currentSessionId ?? undefined,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response");
        }

        // Get session ID from response (new session created on first message)
        const newSessionId = response.headers.get("X-Session-Id");
        if (newSessionId && !currentSessionId) {
          setCurrentSessionId(newSessionId);
          // Refresh sessions list
          loadSessions();
        }

        const sourcesHeader = response.headers.get("X-Sources");
        const sources = sourcesHeader
          ? JSON.parse(decodeURIComponent(sourcesHeader))
          : [];

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "",
          sources,
        };

        setMessages([...newMessages, assistantMsg]);

        let fullContent = "";
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            fullContent += chunk;
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last.role === "assistant") {
                updated[updated.length - 1] = {
                  ...last,
                  content: fullContent,
                };
              }
              return updated;
            });
          }
        }
      } catch (error) {
        console.error("Chat error:", error);
        const errorMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "I apologize, but I encountered an error processing your request. Please try again.",
        };
        setMessages([...newMessages, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, currentSessionId, loadSessions]
  );

  useEffect(() => {
    const q = searchParams.get("q");
    if (q && messages.length === 0 && authChecked) {
      const query = q.replace(/-[a-z0-9]{4,6}$/, "").replace(/-/g, " ");
      sendMessage(query);
    }
  }, [authChecked]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (authChecked && isLoggedIn) {
      loadSessions();
    }
  }, [authChecked, isLoggedIn, loadSessions]);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/auth");
  };

  const groupSessions = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayStr = today.toDateString();
    const yesterdayStr = yesterday.toDateString();

    const groups: Record<string, SessionItem[]> = {
      Today: [],
      Yesterday: [],
      Previous: [],
    };

    for (const s of sessions) {
      const d = new Date(s.created_at).toDateString();
      if (d === todayStr) groups.Today.push(s);
      else if (d === yesterdayStr) groups.Yesterday.push(s);
      else groups.Previous.push(s);
    }

    return groups;
  };

  const grouped = groupSessions();

  if (!authChecked) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fafbfc]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-[2.5px] border-[#0A0A0A]/20 border-t-[#0A0A0A]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-[#fafbfc]">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[272px] flex-shrink-0 border-r border-[#e8ecf0] bg-white transition-transform duration-300 ease-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="p-4 pb-3">
            <Link href="/" className="mb-4 flex items-center gap-2.5">
              <UgandaFlag size={30} />
              <div className="leading-tight">
                <span className="block text-[0.95rem] font-bold tracking-tight text-[#0A0A0A]">
                  Atlas AI
                </span>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">
                  National AI Platform
                </span>
              </div>
            </Link>
            <button
              onClick={() => {
                setMessages([]);
                setCurrentSessionId(null);
                setSidebarOpen(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A0A0A] px-4 py-2.5 text-[0.85rem] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#1a1a1a] hover:shadow active:scale-[0.98]"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              New Chat
            </button>
          </div>

          {/* Divider */}
          <div className="mx-4 h-px bg-[#f0f2f5]" />

          {/* Session history */}
          <div className="flex-1 overflow-y-auto px-2 py-2">
            {isLoggedIn ? (
              Object.entries(grouped).map(
                ([label, items]) =>
                  items.length > 0 && (
                    <div key={label} className="mb-3">
                      <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">
                        {label}
                      </p>
                      {items.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => {
                            loadSessionMessages(s.id);
                            setSidebarOpen(false);
                          }}
                          className={`group flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[0.83rem] transition-all duration-150 ${
                            currentSessionId === s.id
                              ? "bg-[#0A0A0A]/8 font-medium text-[#0A0A0A]"
                              : "text-[#475569] hover:bg-[#f5f7fa] hover:text-[#0f1f14]"
                          }`}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`shrink-0 ${
                              currentSessionId === s.id
                                ? "text-[#0A0A0A]"
                                : "text-[#cbd5e1] group-hover:text-[#94a3b8]"
                            }`}
                          >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          <span className="truncate">
                            {s.title ?? "New conversation"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
              )
            ) : (
              <div className="flex flex-col items-center px-3 py-8 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFFBEB]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <p className="text-[0.8rem] leading-relaxed text-[#64748b]">
                  Sign in to save your<br />chat history
                </p>
                <Link
                  href="/auth"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#0A0A0A]/8 px-4 py-2 text-[0.8rem] font-semibold text-[#0A0A0A] transition-colors hover:bg-[#0A0A0A]/15"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar footer */}
          <div className="border-t border-[#f0f2f5] p-3">
            {isLoggedIn ? (
              <div className="flex items-center justify-between rounded-lg px-1">
                <div className="flex items-center gap-2.5 truncate">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0A0A0A] to-[#1a1a1a] text-xs font-bold text-white shadow-sm">
                    {userName ? userName[0].toUpperCase() : "U"}
                  </div>
                  <span className="truncate text-[0.85rem] font-medium text-[#1e293b]">
                    {userName || "User"}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  title="Sign out"
                  className="rounded-lg p-2 text-[#94a3b8] transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="flex items-center justify-center gap-2 rounded-xl border border-[#e8ecf0] px-4 py-2.5 text-[0.83rem] font-medium text-[#475569] transition-all hover:border-[#0A0A0A]/20 hover:bg-[#FFFBEB] hover:text-[#0A0A0A]"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Sign In / Sign Up
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* Main area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-[#e8ecf0] bg-white/80 px-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#64748b] transition-colors hover:bg-[#f5f7fa] hover:text-[#0f1f14] lg:hidden"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12h18" />
                <path d="M3 6h18" />
                <path d="M3 18h18" />
              </svg>
            </button>
            <span className="text-[0.85rem] font-medium text-[#475569]">
              {messages.length > 0
                ? messages[0].content.slice(0, 50) +
                  (messages[0].content.length > 50 ? "..." : "")
                : "New conversation"}
            </span>
          </div>
          {!isLoggedIn && (
            <Link
              href="/auth"
              className="flex items-center gap-1.5 rounded-lg bg-[#0A0A0A] px-4 py-2 text-[0.8rem] font-semibold text-white shadow-sm transition-all hover:bg-[#1a1a1a] active:scale-[0.97]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Sign In
            </Link>
          )}
        </div>

        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSend={sendMessage}
        />
      </main>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatContent />
    </Suspense>
  );
}
