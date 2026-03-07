"use client";

import { useState } from "react";

interface TryItForRealProps {
  message: string;
  command?: string;
}

const nudges: Record<string, TryItForRealProps> = {
  "1-3": {
    message: "Ready to try this for real? Open your terminal and start your first conversation.",
    command: "claude",
  },
  "1-4": {
    message: "Open your terminal and try navigating around your computer with the five commands you just learned.",
    command: "pwd",
  },
  "3-1": {
    message: "Try building your own portfolio right now. Create a new folder and let Claude Code do the rest.",
    command: 'mkdir my-portfolio && cd my-portfolio && claude "create a personal portfolio site"',
  },
  "3-2": {
    message: "Pick a real business — a coffee shop, salon, or your own side project — and build its landing page.",
    command: 'claude "create a landing page for [your business]"',
  },
  "3-3": {
    message: "Build your own quiz about any topic you like. Make it yours.",
    command: 'claude "create a quiz app about [your topic]"',
  },
  "3-5": {
    message: "Go create a save point for any project on your computer. Practice before you need it.",
    command: "git init && git add . && git commit -m \"initial save point\"",
  },
  "4-1": {
    message: "Create a CLAUDE.md file for one of your projects right now.",
    command: "claude /init",
  },
};

export default function TryItForReal({ lessonId }: { lessonId: string }) {
  const [dismissed, setDismissed] = useState(false);
  const nudge = nudges[lessonId];

  if (!nudge || dismissed) return null;

  return (
    <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center mt-0.5">
          <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-teal-900 mb-1">
            Try it for real
          </p>
          <p className="text-sm text-teal-800 leading-relaxed">
            {nudge.message}
          </p>
          {nudge.command && (
            <code className="inline-block mt-2 px-3 py-1.5 rounded-lg bg-teal-900 text-teal-100 text-xs font-mono">
              {nudge.command}
            </code>
          )}
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 text-teal-400 hover:text-teal-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export function hasNudge(lessonId: string): boolean {
  return lessonId in nudges;
}
