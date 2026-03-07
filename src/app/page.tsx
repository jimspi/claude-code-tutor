"use client";

import { useEffect, useState } from "react";
import { levels } from "@/lib/levels";
import { getOverallProgress, getLevelProgress, loadProgress } from "@/lib/progress";
import ProgressBar from "@/components/ProgressBar";
import Badge from "@/components/Badge";
import Link from "next/link";
import WelcomeModal, { hasSeenWelcome } from "@/components/WelcomeModal";
import QuickReview from "@/components/QuickReview";

function getContinueLink(completedLessons: string[]): { levelId: string; lessonId: string; label: string } | null {
  // Find the first incomplete lesson
  for (const level of levels) {
    for (const lesson of level.lessons) {
      if (!completedLessons.includes(lesson.id)) {
        return {
          levelId: level.id,
          lessonId: lesson.id,
          label: `Level ${level.number}: ${lesson.title}`,
        };
      }
    }
  }
  return null; // All complete
}

function getTotalMinutes(): number {
  return levels.reduce(
    (sum, level) =>
      sum + level.lessons.reduce((s, l) => s + l.estimatedMinutes, 0),
    0
  );
}

export default function HomePage() {
  const [overall, setOverall] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [levelProgresses, setLevelProgresses] = useState<Record<string, number>>({});
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const update = () => {
      setOverall(getOverallProgress());
      const progress = loadProgress();
      setEarnedBadges(progress.earnedBadges);
      setCompletedLessons(progress.completedLessons);
      const lp: Record<string, number> = {};
      levels.forEach((l) => {
        lp[l.id] = getLevelProgress(l.id);
      });
      setLevelProgresses(lp);
    };
    update();

    // Show welcome modal for first-time visitors
    if (!hasSeenWelcome()) {
      setShowWelcome(true);
    }

    window.addEventListener("progress-update", update);
    return () => window.removeEventListener("progress-update", update);
  }, []);

  const continueLink = getContinueLink(completedLessons);
  const totalMinutes = getTotalMinutes();
  const totalHours = Math.round(totalMinutes / 60);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Welcome Modal */}
      {showWelcome && (
        <WelcomeModal onClose={() => setShowWelcome(false)} />
      )}

      {/* Hero */}
      <div className="mb-12">
        <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
          Welcome to <br className="sm:hidden" />
          Claude Code Academy
        </h1>
        <p className="text-lg text-stone-600 mt-4 max-w-2xl leading-relaxed">
          Learn to build real software by having conversations with AI. No
          coding experience needed. Start from zero and become a confident
          builder, one lesson at a time.
        </p>
        <p className="text-sm text-stone-400 mt-2">
          {levels.reduce((s, l) => s + l.lessons.length, 0)} lessons &middot; About {totalHours} hours total
        </p>

        {/* Overall progress */}
        <div className="mt-8 p-5 bg-white rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-900">
              Your Progress
            </span>
            <span className="text-sm font-bold text-amber-600">
              {overall}%
            </span>
          </div>
          <ProgressBar percentage={overall} size="lg" color="gold" />
          {earnedBadges.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {earnedBadges.map((badge) => (
                <Badge key={badge} title={badge} earned size="sm" />
              ))}
            </div>
          )}
        </div>

        {/* Continue where you left off */}
        {continueLink && completedLessons.length > 0 && (
          <Link
            href={`/level/${continueLink.levelId}/${continueLink.lessonId}`}
            className="mt-4 flex items-center justify-between p-4 rounded-xl bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors group"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-0.5">
                Continue where you left off
              </p>
              <p className="text-sm font-medium text-teal-900">
                {continueLink.label}
              </p>
            </div>
            <svg
              className="w-5 h-5 text-teal-400 group-hover:text-teal-600 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      {/* Levels */}
      <div className="space-y-6">
        {levels.map((level) => {
          const progress = levelProgresses[level.id] || 0;
          const isComplete = progress === 100;
          const totalMins = level.lessons.reduce((s, l) => s + l.estimatedMinutes, 0);

          return (
            <Link
              key={level.id}
              href={`/level/${level.id}`}
              className="block group"
            >
              <div
                className={`relative p-6 rounded-2xl border transition-all duration-300 ${
                  isComplete
                    ? "border-teal-200 bg-teal-50/50 hover:shadow-md"
                    : "border-stone-200 bg-white hover:shadow-lg hover:border-stone-300"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                        Level {level.number}
                      </span>
                      <span className="text-xs text-stone-400">
                        {level.subtitle}
                      </span>
                    </div>
                    <h2 className="font-heading text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {level.title}
                    </h2>
                    <p className="text-sm text-stone-500 mt-1">
                      {level.lessons.length} lessons &middot; ~{totalMins} min
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    <Badge
                      title={level.badge}
                      earned={earnedBadges.includes(level.badge)}
                      size="sm"
                    />
                    <div className="w-24">
                      <ProgressBar
                        percentage={progress}
                        size="sm"
                        color={isComplete ? "teal" : "gold"}
                      />
                    </div>
                  </div>
                </div>
                <svg
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-300 group-hover:text-teal-500 transition-colors hidden sm:block"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Review flashcards */}
      <QuickReview completedLessons={completedLessons} />

      {/* Footer note */}
      <div className="mt-12 text-center text-sm text-stone-400">
        <p>
          Built with care to help anyone learn Claude Code.
          <br />
          Your progress is saved locally in your browser.
        </p>
      </div>
    </div>
  );
}
