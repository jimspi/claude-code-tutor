"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { levels } from "@/lib/levels";
import Badge from "./Badge";

interface LevelCelebrationProps {
  levelId: string;
  onClose: () => void;
}

const levelMessages: Record<string, { headline: string; body: string }> = {
  "1": {
    headline: "You've got the basics down!",
    body: "You know what Claude Code is, how to install it, how to talk to it, and how the terminal works. That's a real foundation.",
  },
  "2": {
    headline: "You're a prompt crafter now!",
    body: "You know how to write effective prompts, iterate on them, and use magic phrases that get great results. This skill transfers to everything.",
  },
  "3": {
    headline: "You just built real things!",
    body: "A portfolio, a landing page, an interactive app — you've proven you can build with Claude Code. That's not a tutorial, that's a skill.",
  },
  "4": {
    headline: "You're leveling up fast!",
    body: "CLAUDE.md files, multi-file projects, APIs, shortcuts — you're working like someone who's been doing this for months.",
  },
  "5": {
    headline: "You've graduated!",
    body: "Automated workflows, GitHub, custom commands, power user tips — you have everything you need. Go build something real.",
  },
};

export default function LevelCelebration({ levelId, onClose }: LevelCelebrationProps) {
  const [show, setShow] = useState(false);
  const level = levels.find((l) => l.id === levelId);
  const nextLevel = levels.find((l) => l.id === String(Number(levelId) + 1));
  const message = levelMessages[levelId];

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setShow(true));
  }, []);

  if (!level || !message) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-500 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />

      {/* Card */}
      <div
        className={`relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 ${
          show ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Decorative top bar */}
        <div className="h-2 bg-gradient-to-r from-amber-400 via-teal-400 to-amber-400" />

        <div className="p-8 text-center">
          {/* Badge - large */}
          <div className={`inline-block mb-6 transition-all duration-700 delay-300 ${
            show ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}>
            <Badge title={level.badge} earned size="lg" />
          </div>

          {/* Level complete label */}
          <p className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-2">
            Level {level.number} Complete
          </p>

          {/* Headline */}
          <h2 className="font-heading text-2xl font-bold text-slate-900 mb-3">
            {message.headline}
          </h2>

          {/* Body */}
          <p className="text-stone-600 text-sm leading-relaxed mb-8">
            {message.body}
          </p>

          {/* Actions */}
          {nextLevel ? (
            <div className="space-y-3">
              <Link
                href={`/level/${nextLevel.id}`}
                onClick={onClose}
                className="block w-full py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors text-center"
              >
                Continue to Level {nextLevel.number}: {nextLevel.title}
              </Link>
              <button
                onClick={onClose}
                className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
              >
                Back to dashboard
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link
                href="/playground"
                onClick={onClose}
                className="block w-full py-3 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition-colors text-center"
              >
                Try the Playground
              </Link>
              <button
                onClick={onClose}
                className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
              >
                Back to dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
