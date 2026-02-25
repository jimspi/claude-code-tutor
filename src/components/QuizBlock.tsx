"use client";

import { useState } from "react";

interface QuizBlockProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function QuizBlock({
  question,
  options,
  correctIndex,
  explanation,
}: QuizBlockProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (index: number) => {
    if (answered) return;
    setSelectedIndex(index);
    setAnswered(true);
  };

  const isCorrect = selectedIndex === correctIndex;

  return (
    <div className="my-6 rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 bg-stone-50 border-b border-stone-100 flex items-center gap-2">
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
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
          Quick Check
        </span>
      </div>

      {/* Question */}
      <div className="p-5">
        <p className="text-base font-semibold text-slate-900 mb-4">
          {question}
        </p>

        {/* Options */}
        <div className="space-y-2">
          {options.map((option, i) => {
            let styles = "border-stone-200 bg-white hover:border-teal-300 hover:bg-teal-50/30 cursor-pointer";

            if (answered) {
              if (i === correctIndex) {
                styles = "border-teal-500 bg-teal-50";
              } else if (i === selectedIndex) {
                styles = "border-red-400 bg-red-50";
              } else {
                styles = "border-stone-200 bg-stone-50 opacity-50";
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={answered}
                className={`w-full text-left p-3.5 rounded-lg border transition-all duration-200 flex items-start gap-3 ${styles}`}
              >
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold mt-0.5 ${
                    answered && i === correctIndex
                      ? "border-teal-500 bg-teal-500 text-white"
                      : answered && i === selectedIndex
                      ? "border-red-400 bg-red-400 text-white"
                      : "border-stone-300 text-stone-400"
                  }`}
                >
                  {answered && i === correctIndex ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : answered && i === selectedIndex && i !== correctIndex ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span className="text-sm text-slate-700">{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          answered ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`p-5 border-t text-sm leading-relaxed ${
              isCorrect
                ? "bg-teal-50/70 border-teal-100 text-teal-900"
                : "bg-amber-50/70 border-amber-100 text-amber-900"
            }`}
          >
            <p className="font-semibold mb-1">
              {isCorrect ? "Correct!" : "Not quite."}
            </p>
            <p className="text-stone-700">{explanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
