"use client";

import { useState } from "react";
import Link from "next/link";
import PaywallGate from "@/components/PaywallGate";
import { useAccess } from "@/contexts/AccessContext";
import { glossaryEntries } from "@/data/glossary";

export default function GlossaryPage() {
  const { hasAccess, loading } = useAccess();
  const [search, setSearch] = useState("");

  if (!loading && !hasAccess) return <PaywallGate />;

  const filtered = search.trim()
    ? glossaryEntries.filter(
        (e) =>
          e.term.toLowerCase().includes(search.toLowerCase()) ||
          e.definition.toLowerCase().includes(search.toLowerCase())
      )
    : glossaryEntries;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <nav className="mb-6">
        <Link
          href="/"
          className="text-sm text-stone-400 hover:text-teal-600 transition-colors"
        >
          All Levels
        </Link>
        <span className="text-sm text-stone-300 mx-2">/</span>
        <span className="text-sm text-stone-600">Glossary</span>
      </nav>

      <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
        Glossary
      </h1>
      <p className="text-stone-600 mb-8">
        Every technical term from the course, explained in plain English.
      </p>

      {/* Search */}
      <div className="relative mb-8">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search terms..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-slate-800 placeholder-stone-400 outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Results count */}
      {search && (
        <p className="text-xs text-stone-400 mb-4">
          {filtered.length} {filtered.length === 1 ? "term" : "terms"} found
        </p>
      )}

      {/* Entries */}
      <div className="space-y-1">
        {filtered.map((entry, i) => (
          <div
            key={entry.term}
            className={`flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 p-4 rounded-lg ${
              i % 2 === 0 ? "bg-white" : "bg-stone-50"
            }`}
          >
            <span className="text-sm font-bold text-slate-900 sm:w-44 sm:flex-shrink-0">
              {entry.term}
            </span>
            <div className="flex-1">
              <p className="text-sm text-stone-600 leading-relaxed">
                {entry.definition}
              </p>
              {entry.usedIn && (
                <span className="inline-block mt-1 text-[10px] text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                  Used in {entry.usedIn}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-stone-400">
          <p className="text-sm">No terms match your search.</p>
        </div>
      )}
    </div>
  );
}
