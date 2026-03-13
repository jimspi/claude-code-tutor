"use client";

import Link from "next/link";
import { useAccess } from "@/contexts/AccessContext";
import { CodeForm } from "./CodeEntry";

export default function PaywallGate() {
  const { loading } = useAccess();

  if (loading) return null;

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
        <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
      <h2 className="font-heading text-xl font-bold text-slate-900 mb-2">
        Enter your access code
      </h2>
      <p className="text-sm text-stone-500 mb-6">
        Enter the code you received to unlock the full course.
      </p>
      <div className="flex justify-center">
        <CodeForm />
      </div>
      <p className="text-xs text-stone-400 mt-6">
        Don&apos;t have a code?{" "}
        <Link href="/pricing" className="text-teal-600 hover:text-teal-700 font-medium">
          Get one here
        </Link>
      </p>
    </div>
  );
}
