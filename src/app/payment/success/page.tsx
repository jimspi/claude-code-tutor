"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CodeForm } from "@/components/CodeEntry";

function SuccessContent() {
  const searchParams = useSearchParams();
  const stripeSessionId = searchParams.get("session_id");
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!stripeSessionId) {
      setLoading(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;

    // Poll for the code — webhook may take a moment to fire
    const poll = async () => {
      attempts++;
      try {
        const res = await fetch(`/api/access/lookup?session_id=${stripeSessionId}`);
        if (res.ok) {
          const data = await res.json();
          setCode(data.code);
          setLoading(false);
          return;
        }
      } catch {
        // ignore, will retry
      }

      if (attempts < maxAttempts) {
        setTimeout(poll, 2000);
      } else {
        setLoading(false);
      }
    };

    poll();
  }, [stripeSessionId]);

  function handleCopy() {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

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
        Payment confirmed!
      </h1>

      {loading ? (
        <div className="mt-6">
          <div className="w-6 h-6 mx-auto border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-stone-500 mt-3">Generating your access code…</p>
        </div>
      ) : code ? (
        <>
          <p className="text-stone-600 leading-relaxed mb-6">
            Here&apos;s your unique access code. Enter it below to unlock the full course.
          </p>

          {/* Code display */}
          <div className="mb-8 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-xs text-stone-400 uppercase tracking-wider font-medium mb-2">
              Your access code
            </p>
            <button
              onClick={handleCopy}
              className="font-mono text-xl font-bold text-slate-900 tracking-wide hover:text-teal-600 transition-colors cursor-pointer"
              title="Click to copy"
            >
              {code}
            </button>
            <p className="text-xs text-stone-400 mt-1.5">
              {copied ? "Copied!" : "Click to copy"}
            </p>
          </div>

          {/* Code entry form */}
          <div className="text-left">
            <p className="text-sm text-stone-500 mb-3 text-center">
              Paste your code below to unlock access:
            </p>
            <CodeForm />
          </div>
        </>
      ) : (
        <>
          <p className="text-stone-600 leading-relaxed mb-2">
            Your payment was successful, but we&apos;re still generating your access code.
            This usually takes a few seconds.
          </p>
          <p className="text-sm text-stone-400 mb-6">
            Try refreshing this page in a moment. If the issue persists, contact support.
          </p>
        </>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-6 h-6 mx-auto border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
