"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthButton() {
  const { user, loading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [showForm, setShowForm] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Countdown timer — reset to idle when cooldown expires
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          setStatus("idle");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Reset form state whenever the form is opened
  useEffect(() => {
    if (showForm) {
      setStatus("idle");
      setCooldown(0);
    }
  }, [showForm]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim() || status === "sending" || cooldown > 0) return;
      setStatus("sending");
      const { error } = await signIn(email.trim());
      if (error) {
        // Rate limited — show the "check your email" message since a link
        // was already sent recently, and start a short cooldown
        setStatus("sent");
        setCooldown(30);
      } else {
        setStatus("sent");
        setCooldown(60);
      }
    },
    [email, status, cooldown, signIn]
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
        onChange={(e) => setEmail(e.target.value)}
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
          disabled={status === "sending"}
          className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {status === "sending" ? "Sending..." : "Send link"}
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          setShowForm(false);
          setEmail("");
        }}
        className="text-stone-400 hover:text-stone-600 p-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </form>
  );
}
