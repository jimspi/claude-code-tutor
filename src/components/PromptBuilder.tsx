"use client";

import { useState } from "react";

interface PromptBuilderProps {
  scenario: string;
  sections: {
    label: string;
    placeholder: string;
    options?: string[];
  }[];
  examplePrompt: string;
}

export default function PromptBuilder({
  scenario,
  sections,
  examplePrompt,
}: PromptBuilderProps) {
  const [values, setValues] = useState<Record<number, string>>({});
  const [showExample, setShowExample] = useState(false);

  const filledCount = Object.values(values).filter((v) => v && v.length > 0).length;
  const isComplete = filledCount === sections.length;

  const assembledPrompt = sections
    .map((s, i) => values[i] || `[${s.label}: ${s.placeholder}]`)
    .join(" ");

  return (
    <div className="my-6 rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-teal-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
            Build Your Prompt
          </span>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
            isComplete
              ? "bg-teal-100 text-teal-700"
              : "bg-stone-100 text-stone-500"
          }`}
        >
          {filledCount} of {sections.length} sections
        </span>
      </div>

      <div className="p-5">
        {/* Scenario */}
        <p className="text-sm text-stone-600 mb-5 leading-relaxed">
          <span className="font-semibold text-slate-800">Scenario:</span>{" "}
          {scenario}
        </p>

        {/* Sections */}
        <div className="space-y-4 mb-6">
          {sections.map((section, i) => (
            <div
              key={i}
              className="rounded-lg border border-stone-200 p-4"
            >
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                {section.label}
              </label>
              {section.options ? (
                <select
                  value={values[i] || ""}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [i]: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">Choose an option...</option>
                  {section.options.map((opt, j) => (
                    <option key={j} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <textarea
                  value={values[i] || ""}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [i]: e.target.value }))
                  }
                  placeholder={section.placeholder}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm text-slate-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                />
              )}
            </div>
          ))}
        </div>

        {/* Live Preview */}
        <div className="mb-5">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
            Your Prompt Preview
          </p>
          <div className="rounded-xl bg-slate-950 p-4 font-mono text-sm text-stone-300 leading-relaxed min-h-[60px]">
            {sections.map((s, i) => {
              const filled = values[i] && values[i].length > 0;
              return (
                <span key={i}>
                  {i > 0 && " "}
                  <span className={filled ? "text-teal-400" : "text-stone-600"}>
                    {filled ? values[i] : `[${s.label}]`}
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Example reveal */}
        <div className="border-t border-stone-100 pt-4">
          {!showExample ? (
            <button
              onClick={() => setShowExample(true)}
              className="w-full p-3 text-center text-sm font-medium text-teal-700 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors"
            >
              See a great example
            </button>
          ) : (
            <div className="rounded-lg bg-teal-50/60 p-4">
              <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">
                Expert Example
              </p>
              <p className="text-sm text-stone-700 leading-relaxed italic">
                &quot;{examplePrompt}&quot;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
