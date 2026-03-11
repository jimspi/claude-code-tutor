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
    <div className="-mt-[57px]"> {/* offset the TopBar */}
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,200,190,0.15),transparent)]" />
        <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-20 sm:pt-36 sm:pb-28 text-center">
          <p className="text-teal-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">
            An interactive course for complete beginners
          </p>
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6">
            Learn to build real software
            <br />
            <span className="text-teal-400">with AI</span>
          </h1>
          <p className="text-lg sm:text-xl text-stone-300 max-w-2xl mx-auto leading-relaxed mb-10">
            Claude Code is the tool that turns your ideas into working apps.
            This course teaches you how to use it — no coding experience needed.
            Go from zero to deploying real projects.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/level/1/1-1"
              className="px-8 py-3.5 bg-teal-500 text-white font-semibold text-sm rounded-xl hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/25"
            >
              Try the Free Lesson
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-3.5 bg-white/10 text-white font-semibold text-sm rounded-xl hover:bg-white/20 transition-colors border border-white/20"
            >
              Unlock Full Course — $100
            </Link>
          </div>
          <p className="text-stone-500 text-sm">
            {totalLessons} lessons &middot; {totalHours}+ hours &middot; Lifetime access
          </p>
        </div>
      </section>

      {/* What you'll learn */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            What you&apos;ll learn
          </h2>
          <p className="text-stone-500 max-w-lg mx-auto">
            Five levels that take you from &ldquo;what is a terminal?&rdquo; to deploying
            your own apps on the internet.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {levels.map((level) => (
            <div
              key={level.id}
              className="p-6 rounded-2xl border border-stone-200 bg-white hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
                  Level {level.number}
                </span>
                <span className="text-xs text-stone-400">&middot; {level.lessons.length} lessons</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-slate-900 mb-1">
                {level.title}
              </h3>
              <p className="text-sm text-stone-500">{level.subtitle}</p>
            </div>
          ))}
          {/* Extras card */}
          <div className="p-6 rounded-2xl border border-stone-200 bg-white hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Bonus
              </span>
            </div>
            <h3 className="font-heading text-lg font-bold text-slate-900 mb-1">
              Tools &amp; Resources
            </h3>
            <p className="text-sm text-stone-500">
              Prompt playground, cheat sheet, glossary, and interactive terminal exercises.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-stone-100 border-y border-stone-200">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 text-center mb-14">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                title: "Read & interact",
                desc: "Bite-sized lessons with demos, code examples, and interactive terminal simulators.",
              },
              {
                step: "02",
                title: "Practice with prompts",
                desc: "Use the Prompt Playground to craft real instructions and see how Claude responds.",
              },
              {
                step: "03",
                title: "Build for real",
                desc: "Follow along and deploy actual projects — a portfolio site, a quiz app, and more.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-teal-100 text-teal-700 font-heading font-extrabold text-sm flex items-center justify-center">
                  {item.step}
                </div>
                <h3 className="font-heading text-base font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
          One price. Everything included.
        </h2>
        <p className="text-stone-500 max-w-lg mx-auto mb-8">
          No subscriptions, no upsells. Pay once and get every lesson, every tool,
          and every future update.
        </p>
        <div className="inline-block p-8 rounded-2xl border border-stone-200 bg-white shadow-xl mb-8">
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-5xl font-extrabold text-slate-900">$100</span>
            <span className="text-stone-400 text-sm">one-time</span>
          </div>
          <p className="text-xs text-stone-400 mb-6">Lifetime access. 30-day money-back guarantee.</p>
          <Link
            href="/pricing"
            className="inline-block px-8 py-3.5 bg-teal-600 text-white font-semibold text-sm rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200"
          >
            Get Started
          </Link>
        </div>
        <p className="text-sm text-stone-400">
          Or <Link href="/level/1/1-1" className="text-teal-600 font-medium hover:text-teal-700">try the first lesson free</Link> — no account required.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-stone-50">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center text-sm text-stone-400">
          <p>Claude Code Academy &middot; Built to help anyone learn to build with AI.</p>
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
