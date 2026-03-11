"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

const COOLDOWN_SECONDS = 60;

export default function AuthButton() {
  const { user, loading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [showForm, setShowForm] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim() || cooldown > 0) return;
      setStatus("sending");
      const { error } = await signIn(email.trim());
      if (error) {
        // Rate limit or other error — start cooldown so they don't hammer it
        setStatus("error");
        setCooldown(COOLDOWN_SECONDS);
      } else {
        setStatus("sent");
        setCooldown(COOLDOWN_SECONDS);
      }
    },
    [email, cooldown, signIn]
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

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="text-xs font-semibold text-amber-700 hover:text-amber-800 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
      >
        Sign in
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="email"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (status === "error") setStatus("idle");
        }}
        className="w-40 sm:w-48 text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
        autoFocus
      />
      {status === "sent" ? (
        <span className="text-xs text-emerald-600 font-medium whitespace-nowrap">
          Check your email!{cooldown > 0 && ` (${cooldown}s)`}
        </span>
      ) : (
        <button
          type="submit"
          disabled={status === "sending" || cooldown > 0}
          className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {status === "sending"
            ? "Sending..."
            : cooldown > 0
            ? `Wait ${cooldown}s`
            : "Send link"}
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          setShowForm(false);
          setStatus("idle");
          setEmail("");
          setCooldown(0);
        }}
        className="text-stone-400 hover:text-stone-600 p-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {status === "error" && (
        <span className="text-xs text-amber-600 whitespace-nowrap">
          Link already sent — check your email{cooldown > 0 && ` (${cooldown}s)`}
        </span>
      )}
    </form>
  );
}
