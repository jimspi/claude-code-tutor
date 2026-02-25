"use client";

import Link from "next/link";

interface LessonCardProps {
  levelId: string;
  lessonId: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  isComplete: boolean;
  index: number;
}

export default function LessonCard({
  levelId,
  lessonId,
  title,
  subtitle,
  estimatedMinutes,
  isComplete,
  index,
}: LessonCardProps) {
  return (
    <Link href={`/level/${levelId}/${lessonId}`} className="block group">
      <div
        className={`relative p-5 rounded-xl border transition-all duration-300 ${
          isComplete
            ? "border-teal-200 bg-teal-50/40 hover:bg-teal-50"
            : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-md"
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-heading text-sm font-bold ${
              isComplete
                ? "bg-teal-500 text-white"
                : "bg-slate-900 text-white"
            }`}
          >
            {isComplete ? (
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              index + 1
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-stone-500 mt-0.5">{subtitle}</p>
            <div className="flex items-center gap-3 mt-2.5">
              <span className="text-xs text-stone-400">
                {estimatedMinutes} min read
              </span>
              {isComplete && (
                <span className="text-xs font-semibold text-teal-600">
                  Completed
                </span>
              )}
            </div>
          </div>
          <svg
            className="flex-shrink-0 w-5 h-5 text-stone-300 group-hover:text-teal-500 transition-colors mt-2"
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
      </div>
    </Link>
  );
}
