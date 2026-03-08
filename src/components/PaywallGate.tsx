"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthButton from "./AuthButton";

export default function PaywallGate() {
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout error:", data.error);
        setIsLoading(false);
      }
    } catch {
      console.error("Checkout request failed");
      setIsLoading(false);
    }
  };

  if (loading) return null;

  // Not signed in — show sign-in prompt first
  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
          <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h2 className="font-heading text-xl font-bold text-slate-900 mb-2">
          Sign in to continue
        </h2>
        <p className="text-sm text-stone-500 mb-6">
          Create a free account, then unlock the full course.
        </p>
        <div className="inline-flex">
          <AuthButton />
        </div>
      </div>
    );
  }

  // Signed in but not paid — show paywall
  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="rounded-2xl border border-stone-200 bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-teal-400 mb-3">
            Full Course Access
          </p>
          <h2 className="font-heading text-3xl font-extrabold text-white mb-2">
            Claude Code Academy
          </h2>
          <p className="text-stone-400 text-sm max-w-md mx-auto leading-relaxed">
            Go from zero coding knowledge to building and deploying real projects
            with AI — in hours, not months.
          </p>
        </div>

        {/* Price */}
        <div className="px-8 py-8 text-center border-b border-stone-100">
          <div className="flex items-baseline justify-center gap-1 mb-1">
            <span className="text-4xl font-extrabold text-slate-900">$100</span>
            <span className="text-stone-400 text-sm">one-time</span>
          </div>
          <p className="text-xs text-stone-400">Lifetime access. No subscriptions. No hidden fees.</p>
        </div>

        {/* Features */}
        <div className="px-8 py-6">
          <ul className="space-y-3">
            {[
              "27 lessons across 5 levels — beginner to advanced",
              "Interactive terminal simulators and exercises",
              "Prompt Playground with real-time scoring",
              "Step-by-step projects: portfolio, landing page, quiz app",
              "GitHub, Vercel, and deployment walkthroughs",
              "Cheat sheet, glossary, and flashcard review",
              "All future lessons and updates included",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-stone-700">
                <svg className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="px-8 py-6 bg-stone-50 border-t border-stone-100">
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full py-3.5 px-6 bg-teal-600 text-white font-semibold text-sm rounded-xl hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-lg shadow-teal-200"
          >
            {isLoading ? "Opening checkout..." : "Unlock the Full Course — $100"}
          </button>
          <p className="text-[11px] text-stone-400 text-center mt-3">
            Secure payment via Stripe. 30-day money-back guarantee.
          </p>
        </div>
      </div>
    </div>
  );
}
