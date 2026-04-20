"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { UgandaFlag } from "@/components/shared/UgandaFlag";

export default function AuthPage() {
  const router = useRouter();
  const isOffice = typeof window !== "undefined" && window.location.hostname.startsWith("office.");
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const result = await authClient.signIn.email({
          email,
          password,
        });
        if (result.error) {
          setError(result.error.message ?? "Login failed. Please check your credentials.");
          setLoading(false);
          return;
        }
      } else {
        const result = await authClient.signUp.email({
          email,
          password,
          name: name || email.split("@")[0],
        });
        if (result.error) {
          setError(result.error.message ?? "Sign up failed. Please try again.");
          setLoading(false);
          return;
        }
      }
      // Redirect to admin dashboard on office subdomain, otherwise to chat
      const isOffice = window.location.hostname.startsWith("office.");
      const redirectParam = new URLSearchParams(window.location.search).get("redirect");
      router.push(isOffice ? "/admin" : (redirectParam || "/chat"));
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7f5] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <UgandaFlag size={40} />
            <span className="text-2xl font-extrabold tracking-tight text-[#0A0A0A]">
              Atlas AI
            </span>
          </Link>
          <p className="mt-2 text-sm text-gray-500">
            {isLogin ? "Sign in to your account" : "Create your account"}
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-[#e0e8e0] bg-white p-8 shadow-sm">
          {/* Google Sign In — hidden on admin/office domain */}
          {!isOffice && (
            <>
              <button
                type="button"
                disabled={googleLoading}
                onClick={async () => {
                  setGoogleLoading(true);
                  setError("");
                  try {
                    const redirectParam = new URLSearchParams(window.location.search).get("redirect");
                    await authClient.signIn.social({
                      provider: "google",
                      callbackURL: redirectParam || "/chat",
                    });
                  } catch {
                    setError("Google sign in failed. Please try again.");
                    setGoogleLoading(false);
                  }
                }}
                className="mb-5 flex w-full items-center justify-center gap-3 rounded-lg border border-[#e0e8e0] bg-white px-4 py-2.5 text-sm font-semibold text-[#0f1f14] transition-colors hover:bg-[#f5f7f5] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {googleLoading ? (
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                Continue with Google
              </button>

              <div className="mb-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#e0e8e0]" />
                <span className="text-xs font-medium text-gray-400">or</span>
                <div className="h-px flex-1 bg-[#e0e8e0]" />
              </div>
            </>
          )}

          {/* Toggle — hidden on admin/office domain */}
          {!isOffice && (
            <div className="mb-6 flex rounded-lg bg-[#f5f7f5] p-1">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setError("");
                }}
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all ${
                  isLogin
                    ? "bg-white text-[#0A0A0A] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setError("");
                }}
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all ${
                  !isLogin
                    ? "bg-white text-[#0A0A0A] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-[#e0e8e0] px-4 py-2.5 text-sm text-[#0f1f14] outline-none transition-colors placeholder:text-gray-400 focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/20"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-[#e0e8e0] px-4 py-2.5 text-sm text-[#0f1f14] outline-none transition-colors placeholder:text-gray-400 focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded-lg border border-[#e0e8e0] px-4 py-2.5 text-sm text-[#0f1f14] outline-none transition-colors placeholder:text-gray-400 focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/20"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-[#0A0A0A] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <svg
                  className="h-5 w-5 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          By continuing, you agree to Atlas AI&apos;s Terms of Service.
        </p>
      </div>
    </div>
  );
}
