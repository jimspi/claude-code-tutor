"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function PaymentSuccessPage() {
  const { user, refreshUser } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Give the webhook a moment to process, then refresh user data
    const timer = setTimeout(async () => {
      await refreshUser();
      setReady(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [refreshUser]);

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-teal-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h1 className="font-heading text-2xl font-bold text-slate-900 mb-3">
        You&apos;re in!
      </h1>
      <p className="text-stone-600 leading-relaxed mb-2">
        Payment confirmed. You now have lifetime access to every lesson,
        exercise, and tool in Claude Code Academy.
      </p>
      <p className="text-sm text-stone-400 mb-8">
        Welcome to the team, {user?.email?.split("@")[0] || "builder"}.
      </p>
      {ready ? (
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-slate-900 text-white font-semibold text-sm rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
        >
          Start Learning
        </Link>
      ) : (
        <div className="flex items-center justify-center gap-2 text-sm text-stone-400">
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
          </svg>
          Activating your account...
        </div>
      )}
    </div>
  );
}
