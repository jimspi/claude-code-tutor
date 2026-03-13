"use client";

import Link from "next/link";

export default function PaymentSuccessPage() {
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="font-heading text-2xl font-bold text-slate-900 mb-3">
        You&apos;re in!
      </h1>
      <p className="text-stone-600 leading-relaxed mb-2">
        Payment confirmed. Check your email for your unique access code.
        Enter it on the site to unlock all lessons.
      </p>
      <p className="text-sm text-stone-400 mb-8">
        The code is yours forever — one-time use, lifetime access.
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-slate-900 text-white font-semibold text-sm rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
      >
        Enter Your Code
      </Link>
    </div>
  );
}
