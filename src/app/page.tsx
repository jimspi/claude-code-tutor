"use client";

import { useEffect, useState } from "react";
import { levels } from "@/lib/levels";
import { getOverallProgress, getLevelProgress, loadProgress } from "@/lib/progress";
import ProgressBar from "@/components/ProgressBar";
import Badge from "@/components/Badge";
import Link from "next/link";
import QuickReview from "@/components/QuickReview";
import { useAuth } from "@/contexts/AuthContext";
import AuthButton from "@/components/AuthButton";

function getContinueLink(completedLessons: string[]): { levelId: string; lessonId: string; label: string } | null {
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
  return null;
}

function getTotalMinutes(): number {
  return levels.reduce(
    (sum, level) =>
      sum + level.lessons.reduce((s, l) => s + l.estimatedMinutes, 0),
    0
  );
}

/* ─── Landing Page (guests) ─────────────────────────────── */

function LandingPage() {
  const totalLessons = levels.reduce((s, l) => s + l.lessons.length, 0);
  const totalHours = Math.round(getTotalMinutes() / 60);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top nav */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-lg font-bold text-slate-900">Claude Code Academy</h1>
            <p className="text-xs text-stone-400">Learn to build with AI</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/level/1/1-1"
              className="hidden sm:inline-block text-xs font-medium text-stone-600 hover:text-teal-600 transition-colors"
            >
              Free Lesson
            </Link>
            <AuthButton />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-[0.15em] text-teal-600 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full mb-6">
          For complete beginners
        </span>
        <h2 className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 leading-[1.1] mb-5">
          Learn to build real software{" "}
          <span className="text-teal-600">with AI</span>
        </h2>
        <p className="text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed mb-8">
          Claude Code turns your ideas into working apps. This course teaches you
          how to use it — no coding experience needed. Go from zero to deploying
          real projects, one lesson at a time.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <Link
            href="/level/1/1-1"
            className="px-7 py-3 bg-teal-600 text-white font-semibold text-sm rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
          >
            Try the Free Lesson
          </Link>
          <Link
            href="/pricing"
            className="px-7 py-3 bg-white text-slate-900 font-semibold text-sm rounded-xl hover:bg-stone-100 transition-colors border border-stone-200 shadow-sm"
          >
            Unlock Full Course — $100
          </Link>
        </div>
        <p className="text-sm text-stone-400 mb-4">
          {totalLessons} lessons &middot; ~{totalHours} hours &middot; Lifetime access
        </p>
        <div className="inline-flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-left max-w-md mx-auto">
          <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-amber-800 leading-relaxed">
            <span className="font-semibold">Note:</span> To actively build with Claude Code, you&apos;ll need a{" "}
            <span className="font-semibold">Claude Pro subscription ($20/month)</span> from Anthropic.
            This course teaches you how to use it.
          </p>
        </div>
      </section>

      {/* Course outline */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="mb-10">
          <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            What you&apos;ll learn
          </h3>
          <p className="text-stone-500 text-sm">
            Five levels that take you from &ldquo;what is a terminal?&rdquo; to deploying
            your own apps on the internet.
          </p>
        </div>
        <div className="space-y-4">
          {levels.map((level) => {
            const totalMins = level.lessons.reduce((s, l) => s + l.estimatedMinutes, 0);
            return (
              <div
                key={level.id}
                className="p-6 rounded-2xl border border-stone-200 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                        Level {level.number}
                      </span>
                      <span className="text-xs text-stone-400">
                        {level.subtitle}
                      </span>
                    </div>
                    <h4 className="font-heading text-xl font-bold text-slate-900 mb-1">
                      {level.title}
                    </h4>
                    <p className="text-sm text-stone-500">
                      {level.lessons.length} lessons &middot; ~{totalMins} min
                    </p>
                  </div>
                  <div className="flex-shrink-0 hidden sm:flex items-center gap-2 text-stone-300">
                    {level.lessons.map((lesson) => (
                      <span
                        key={lesson.id}
                        className="w-2.5 h-2.5 rounded-full border-2 border-stone-300"
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-stone-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 mb-10 text-center">
            How it works
          </h3>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Read & interact",
                desc: "Bite-sized lessons with demos, code examples, and interactive terminal simulators.",
              },
              {
                step: "02",
                title: "Practice prompts",
                desc: "Use the Prompt Playground to craft real instructions and see how Claude responds.",
              },
              {
                step: "03",
                title: "Build for real",
                desc: "Follow along and deploy actual projects — a portfolio site, a quiz app, and more.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-teal-50 border border-teal-200 text-teal-600 font-heading font-extrabold text-xs flex items-center justify-center">
                  {item.step}
                </div>
                <h4 className="font-heading text-base font-bold text-slate-900 mb-1.5">
                  {item.title}
                </h4>
                <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          One price. Everything included.
        </h3>
        <p className="text-stone-500 text-sm max-w-md mx-auto mb-8">
          No subscriptions, no upsells. Pay once and get every lesson, every tool,
          and every future update.
        </p>
        <div className="inline-block p-8 rounded-2xl border border-stone-200 bg-white shadow-sm mb-6">
          <div className="flex items-baseline justify-center gap-1 mb-1">
            <span className="font-heading text-4xl font-extrabold text-slate-900">$100</span>
            <span className="text-stone-400 text-sm">one-time</span>
          </div>
          <p className="text-xs text-stone-400 mb-5">Lifetime access &middot; 30-day money-back guarantee</p>
          <Link
            href="/pricing"
            className="inline-block px-7 py-3 bg-teal-600 text-white font-semibold text-sm rounded-xl hover:bg-teal-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
        <p className="text-sm text-stone-400">
          Or{" "}
          <Link href="/level/1/1-1" className="text-teal-600 font-medium hover:text-teal-700 transition-colors">
            try the first lesson free
          </Link>{" "}
          — no account required.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-6 text-center text-xs text-stone-400">
          Claude Code Academy &middot; Built to help anyone learn to build with AI.
        </div>
      </footer>
    </div>
  );
}

/* ─── Course Dashboard (signed-in users) ────────────────── */

function Dashboard() {
  const [overall, setOverall] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [levelProgresses, setLevelProgresses] = useState<Record<string, number>>({});

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

    window.addEventListener("progress-update", update);
    return () => window.removeEventListener("progress-update", update);
  }, []);

  const continueLink = getContinueLink(completedLessons);
  const totalMinutes = getTotalMinutes();
  const totalHours = Math.round(totalMinutes / 60);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
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
        </p>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────── */

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <LandingPage />;

  return <Dashboard />;
}
