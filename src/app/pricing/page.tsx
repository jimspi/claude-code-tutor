"use client";

import Link from "next/link";
import PaywallGate from "@/components/PaywallGate";
import { useAuth } from "@/contexts/AuthContext";

export default function PricingPage() {
  const { paid } = useAuth();

  if (paid) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center">
          <svg className="w-7 h-7 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-heading text-xl font-bold text-slate-900 mb-2">
          You already have full access
        </h2>
        <p className="text-sm text-stone-500 mb-6">
          Your course is unlocked. Go learn something.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-slate-900 text-white font-semibold text-sm rounded-xl hover:bg-slate-800 transition-colors"
        >
          Back to Course
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 pt-12 pb-4 text-center">
        <nav className="mb-8">
          <Link href="/" className="text-sm text-stone-400 hover:text-teal-600 transition-colors">
            &larr; Back to course
          </Link>
        </nav>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
          Invest in yourself for $100
        </h1>
        <p className="text-stone-600 max-w-xl mx-auto leading-relaxed">
          Claude Code is the magic wand that turns your ideas into real software.
          This course teaches you to use it — from your first conversation to a
          live site on the internet. Small price to pay for a superpower.
        </p>
      </div>
      <PaywallGate />
    </div>
  );
}
