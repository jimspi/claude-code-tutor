"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { getLevelById, getLessonById, getAdjacentLessons } from "@/lib/levels";
import { getLessonContent } from "@/lib/content";
import LessonRenderer from "@/components/LessonRenderer";
import LessonComplete from "@/components/LessonComplete";
import TryItForReal from "@/components/TryItForReal";
import AudioReader from "@/components/AudioReader";
import PaywallGate from "@/components/PaywallGate";
import { useAccess, FREE_LESSONS } from "@/contexts/AccessContext";

export default function LessonPage() {
  const params = useParams();
  const levelId = params.levelId as string;
  const lessonId = params.lessonId as string;
  const { hasAccess, loading } = useAccess();

  const level = getLevelById(levelId);
  const lesson = getLessonById(levelId, lessonId);
  const content = getLessonContent(lessonId);
  const { prev, next } = getAdjacentLessons(levelId, lessonId);

  const isFreeLesson = FREE_LESSONS.includes(lessonId);

  // No access and not a free lesson — show code entry gate
  if (!loading && !hasAccess && !isFreeLesson) {
    return <PaywallGate />;
  }

  if (!level || !lesson || !content) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="font-heading text-2xl font-bold text-slate-900">
          Lesson not found
        </h1>
        <p className="text-stone-500 mt-2">
          This lesson doesn&apos;t exist or hasn&apos;t been created yet.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Free lesson badge */}
      {isFreeLesson && !hasAccess && (
        <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-xs font-medium text-teal-700">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Free preview
        </div>
      )}

      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link
          href="/"
          className="text-sm text-stone-400 hover:text-teal-600 transition-colors"
        >
          All Levels
        </Link>
        <span className="text-sm text-stone-300 mx-2">/</span>
        <Link
          href={`/level/${level.id}`}
          className="text-sm text-stone-400 hover:text-teal-600 transition-colors"
        >
          Level {level.number}
        </Link>
        <span className="text-sm text-stone-300 mx-2">/</span>
        <span className="text-sm text-stone-600">{lesson.title}</span>
      </nav>

      {/* Lesson meta */}
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
          Level {level.number} — {level.subtitle}
        </span>
        <p className="text-sm text-stone-500 mt-2">
          {lesson.estimatedMinutes} min read
        </p>
      </div>

      {/* Lesson content */}
      <article>
        <LessonRenderer blocks={content.blocks} />
      </article>

      {/* Try it for real nudge */}
      <TryItForReal lessonId={lessonId} />

      {/* Complete button */}
      <div className="mt-12 pt-8 border-t border-stone-200">
        <LessonComplete lessonId={lessonId} />
      </div>

      {/* Audio reader */}
      <AudioReader blocks={content.blocks} />

      {/* Upsell at bottom of free lesson */}
      {isFreeLesson && !hasAccess && (
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-center">
          <p className="text-teal-400 text-xs font-bold uppercase tracking-widest mb-2">
            Enjoying the course?
          </p>
          <p className="text-white font-heading text-lg font-bold mb-1">
            Unlock all 27 lessons for $100
          </p>
          <p className="text-stone-400 text-sm mb-4">
            One-time payment. Lifetime access.
          </p>
          <Link
            href="/pricing"
            className="inline-block px-6 py-2.5 bg-teal-600 text-white font-semibold text-sm rounded-xl hover:bg-teal-700 transition-colors"
          >
            Unlock Full Course
          </Link>
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-4">
        {prev ? (
          <Link
            href={`/level/${prev.levelId}/${prev.lessonId}`}
            className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-teal-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous lesson
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/level/${next.levelId}/${next.lessonId}`}
            className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-teal-600 transition-colors"
          >
            Next lesson
            <svg
              className="w-4 h-4"
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
          </Link>
        ) : (
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
          >
            Back to dashboard
            <svg
              className="w-4 h-4"
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
          </Link>
        )}
      </div>
    </div>
  );
}
