"use client";

import { useState } from "react";

interface MythRealityProps {
  myth: string;
  reality: string;
}

export default function MythReality({ myth, reality }: MythRealityProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="my-4 rounded-xl border border-stone-200 overflow-hidden shadow-sm">
      <button
        onClick={() => setRevealed(!revealed)}
        className="w-full p-4 text-left bg-white hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
            Myth
          </span>
          <p className="text-sm font-medium text-slate-800">{myth}</p>
        </div>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          revealed ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 border-t border-stone-100 bg-teal-50/50">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 px-2 py-0.5 rounded-md bg-teal-100 text-teal-700 text-xs font-bold uppercase tracking-wider">
                Reality
              </span>
              <p className="text-sm text-stone-700 leading-relaxed">
                {reality}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
