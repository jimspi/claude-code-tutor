"use client";

import { useState } from "react";
import Link from "next/link";
import { CodeForm } from "@/components/CodeEntry";
import { useAccess } from "@/contexts/AccessContext";

export default function PricingPage() {
  const { hasAccess } = useAccess();
  const [buying, setBuying] = useState(false);

  async function handleBuy() {
    setBuying(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
        setBuying(false);
      }
    } catch {
      alert("Something went wrong");
      setBuying(false);
    }
  }

  if (hasAccess) {
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
    <div className="max-w-lg mx-auto px-4 py-12">
      <nav className="mb-8 text-center">
        <Link href="/" className="text-sm text-stone-400 hover:text-teal-600 transition-colors">
          &larr; Back to course
        </Link>
      </nav>

      {/* Buy section */}
      <div className="text-center mb-10">
        <h1 className="font-heading text-3xl font-extrabold text-slate-900 mb-3">
          Get Full Course Access
        </h1>
        <p className="text-stone-600 leading-relaxed mb-6">
          One-time payment. Lifetime access to all lessons, exercises, and future updates.
        </p>
        <button
          onClick={handleBuy}
          disabled={buying}
          className="px-8 py-3 bg-teal-600 text-white font-semibold text-sm rounded-xl hover:bg-teal-700 transition-colors shadow-lg disabled:opacity-50"
        >
          {buying ? "Redirecting to checkout…" : "Buy Now — $100"}
        </button>
        <p className="text-xs text-stone-400 mt-3">
          Secure checkout via Stripe &middot; 30-day money-back guarantee
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-stone-200" />
        <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">
          Already have a code?
        </span>
        <div className="flex-1 h-px bg-stone-200" />
      </div>

      {/* Code entry */}
      <CodeForm />
    </div>
  );
}
