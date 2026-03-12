"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/** Compact sign-in for the navbar header */
export default function AuthButton() {
  const { user, loading, signInWithGoogle, signInWithEmail, signOut } = useAuth();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (showEmailForm) {
      setEmailStatus("idle");
      setErrorMsg("");
    }
  }, [showEmailForm]);

  const handleEmailSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!email.trim() || emailStatus === "sending") return;
      setEmailStatus("sending");
      setErrorMsg("");
      const { error } = await signInWithEmail(email.trim());
      if (error) {
        setErrorMsg(error);
        setEmailStatus("error");
      } else {
        setEmailStatus("sent");
      }
    },
    [email, emailStatus, signInWithEmail]
  );

  if (loading) return null;

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-stone-500 hidden sm:inline truncate max-w-[150px]">
          {user.email}
        </span>
        <button
          onClick={() => signOut()}
          className="text-xs font-medium text-stone-500 hover:text-stone-700 px-2 py-1 rounded-md hover:bg-stone-100 transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  if (showEmailForm) {
    return (
      <form onSubmit={handleEmailSubmit} className="flex items-center gap-2">
        <input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-40 sm:w-48 text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          autoFocus
        />
        {emailStatus === "error" ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-600 font-medium whitespace-nowrap max-w-[180px] truncate" title={errorMsg}>
              {errorMsg || "Failed to send"}
            </span>
            <button type="button" onClick={() => handleEmailSubmit()} className="text-xs text-stone-500 hover:text-teal-600 font-medium whitespace-nowrap transition-colors">
              Retry
            </button>
          </div>
        ) : emailStatus === "sent" ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-600 font-medium whitespace-nowrap">Check your email!</span>
            <button type="button" onClick={() => handleEmailSubmit()} className="text-xs text-stone-500 hover:text-teal-600 font-medium whitespace-nowrap transition-colors">
              Resend
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={emailStatus === "sending"}
            className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {emailStatus === "sending" ? "Sending..." : "Send link"}
          </button>
        )}
        <button
          type="button"
          onClick={() => { setShowEmailForm(false); setEmail(""); }}
          className="text-stone-400 hover:text-stone-600 p-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => signInWithGoogle()}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-white hover:bg-stone-50 border border-stone-300 transition-colors"
      >
        <GoogleIcon className="w-3.5 h-3.5" />
        Sign in
      </button>
      <button
        onClick={() => setShowEmailForm(true)}
        className="text-xs text-stone-400 hover:text-stone-600 transition-colors hidden sm:inline"
      >
        Use email
      </button>
    </div>
  );
}

/** Larger sign-in block for the paywall / pricing page */
export function AuthSignInBlock() {
  const { loading, user, signInWithGoogle, signInWithEmail } = useAuth();
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleEmailSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!email.trim() || emailStatus === "sending") return;
      setEmailStatus("sending");
      setErrorMsg("");
      const { error } = await signInWithEmail(email.trim());
      if (error) {
        setErrorMsg(error);
        setEmailStatus("error");
      } else {
        setEmailStatus("sent");
      }
    },
    [email, emailStatus, signInWithEmail]
  );

  if (loading || user) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => signInWithGoogle()}
        className="flex items-center justify-center gap-2.5 w-full max-w-xs px-5 py-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors shadow-sm"
      >
        <GoogleIcon className="w-5 h-5" />
        Sign in with Google
      </button>

      <div className="flex items-center gap-3 w-full max-w-xs">
        <div className="flex-1 h-px bg-stone-200" />
        <span className="text-xs text-stone-400">or</span>
        <div className="flex-1 h-px bg-stone-200" />
      </div>

      {showEmailForm ? (
        <form onSubmit={handleEmailSubmit} className="w-full max-w-xs space-y-2">
          <input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full text-sm px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            autoFocus
          />
          {emailStatus === "error" ? (
            <div className="flex items-center justify-between">
              <span className="text-xs text-red-600 font-medium truncate max-w-[200px]" title={errorMsg}>
                {errorMsg || "Failed to send link"}
              </span>
              <button type="button" onClick={() => handleEmailSubmit()} className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                Retry
              </button>
            </div>
          ) : emailStatus === "sent" ? (
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-600 font-medium">Check your email for the link!</span>
              <button type="button" onClick={() => handleEmailSubmit()} className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                Resend
              </button>
            </div>
          ) : (
            <button
              type="submit"
              disabled={emailStatus === "sending"}
              className="w-full py-2.5 px-4 bg-amber-600 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 disabled:opacity-50 transition-colors"
            >
              {emailStatus === "sending" ? "Sending..." : "Send magic link"}
            </button>
          )}
        </form>
      ) : (
        <button
          onClick={() => setShowEmailForm(true)}
          className="text-sm text-stone-500 hover:text-stone-700 font-medium transition-colors"
        >
          Sign in with email instead
        </button>
      )}
    </div>
  );
}
