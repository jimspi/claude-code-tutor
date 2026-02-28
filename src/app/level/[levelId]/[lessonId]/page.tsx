"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { getLevelById, getLessonById, getAdjacentLessons } from "@/lib/levels";
import { getLessonContent } from "@/lib/content";
import LessonRenderer from "@/components/LessonRenderer";
import LessonComplete from "@/components/LessonComplete";
import { useAuth } from "@/contexts/AuthContext";
import AuthButton from "@/components/AuthButton";

export default function LessonPage() {
  const params = useParams();
  const levelId = params.levelId as string;
  const lessonId = params.lessonId as string;
  const { user, loading } = useAuth();

  const level = getLevelById(levelId);
  const lesson = getLessonById(levelId, lessonId);
  const content = getLessonContent(lessonId);
  const { prev, next } = getAdjacentLessons(levelId, lessonId);

  if (!loading && !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
          <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <h2 className="font-heading text-xl font-bold text-slate-900 mb-2">
          Sign in to access lessons
        </h2>
        <p className="text-sm text-stone-500 mb-6">
          Create a free account to start learning and track your progress across devices.
        </p>
        <div className="inline-flex">
          <AuthButton />
        </div>
      </div>
    );
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

      {/* Complete button */}
      <div className="mt-12 pt-8 border-t border-stone-200">
        <LessonComplete lessonId={lessonId} />
      </div>

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
