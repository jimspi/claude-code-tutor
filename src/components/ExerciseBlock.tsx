"use client";

import { useState } from "react";

interface ExerciseBlockProps {
  prompt: string;
  reveal: string;
}

export default function ExerciseBlock({ prompt, reveal }: ExerciseBlockProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="my-4 rounded-xl border border-stone-200 overflow-hidden shadow-sm">
      <div className="p-4 bg-white">
        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
          Rewrite this prompt
        </p>
        <p className="text-sm font-medium text-slate-800 italic">{prompt}</p>
      </div>
      <div className="border-t border-stone-100">
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="w-full p-3 text-center text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors"
          >
            Reveal a strong version
          </button>
        ) : (
          <div className="p-4 bg-teal-50/50">
            <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">
              Strong version
            </p>
            <p className="text-sm text-stone-700 leading-relaxed">{reveal}</p>
          </div>
        )}
      </div>
    </div>
  );
}
