"use client";

import { useState, useCallback } from "react";
import { useAccess } from "@/contexts/AccessContext";

/** Compact code entry for the top bar */
export default function CodeEntry() {
  const { hasAccess, loading, clearAccess } = useAccess();
  const [showForm, setShowForm] = useState(false);

  if (loading) return null;

  if (hasAccess) {
    return (
      <button
        onClick={() => clearAccess()}
        className="text-xs font-medium text-stone-500 hover:text-stone-700 px-2 py-1 rounded-md hover:bg-stone-100 transition-colors"
      >
        Lock access
      </button>
    );
  }

  if (showForm) {
    return <CodeForm compact onClose={() => setShowForm(false)} />;
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="text-xs font-semibold text-amber-700 hover:text-amber-800 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
    >
      Enter code
    </button>
  );
}

/** Code entry form — used in both compact (top bar) and block (paywall) mode */
export function CodeForm({ compact, onClose }: { compact?: boolean; onClose?: () => void }) {
  const { redeemCode } = useAccess();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "checking" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!code.trim() || status === "checking") return;
      setStatus("checking");
      setErrorMsg("");
      const { error } = await redeemCode(code.trim());
      if (error) {
        setErrorMsg(error);
        setStatus("error");
      }
      // If success, AccessContext updates hasAccess and the UI will re-render
    },
    [code, status, redeemCode]
  );

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Access code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-36 sm:w-44 text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
          autoFocus
        />
        {status === "error" ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-red-600 font-medium whitespace-nowrap max-w-[140px] truncate" title={errorMsg}>
              {errorMsg}
            </span>
            <button type="button" onClick={() => handleSubmit()} className="text-xs text-stone-500 hover:text-teal-600 font-medium whitespace-nowrap transition-colors">
              Retry
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={status === "checking"}
            className="text-xs font-semibold text-white px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            {status === "checking" ? "Checking..." : "Unlock"}
          </button>
        )}
        {onClose && (
          <button type="button" onClick={onClose} className="text-stone-400 hover:text-stone-600 p-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </form>
    );
  }

  // Block mode — larger, centered
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-3">
      <input
        type="text"
        placeholder="Enter your access code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full text-sm px-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-center tracking-wider"
        autoFocus
      />
      {status === "error" && (
        <p className="text-xs text-red-600 font-medium text-center">{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === "checking"}
        className="w-full py-3 px-4 bg-amber-600 text-white text-sm font-semibold rounded-xl hover:bg-amber-700 disabled:opacity-50 transition-colors"
      >
        {status === "checking" ? "Checking..." : "Unlock Course"}
      </button>
    </form>
  );
}
