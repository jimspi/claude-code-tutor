"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { getLevelById } from "@/lib/levels";
import { getLevelProgress, loadProgress } from "@/lib/progress";
import ProgressBar from "@/components/ProgressBar";
import Badge from "@/components/Badge";
import LessonCard from "@/components/LessonCard";
import { useAuth } from "@/contexts/AuthContext";
import AuthButton from "@/components/AuthButton";

export default function LevelPage() {
  const params = useParams();
  const levelId = params.levelId as string;
  const level = getLevelById(levelId);
  const { user, loading } = useAuth();

  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    const update = () => {
      setProgress(getLevelProgress(levelId));
      setCompletedLessons(loadProgress().completedLessons);
    };
    update();
    window.addEventListener("progress-update", update);
    return () => window.removeEventListener("progress-update", update);
  }, [levelId]);

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

  if (!level) {
    notFound();
  }

  const isComplete = progress === 100;

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
        <span className="text-sm text-stone-600">Level {level.number}</span>
      </nav>

      {/* Level header */}
      <div className="mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
          Level {level.number} — {level.subtitle}
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
          {level.title}
        </h1>

        <div className="mt-6 p-4 bg-white rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-stone-500">
              {level.lessons.length} lessons
            </span>
            <Badge
              title={level.badge}
              earned={isComplete}
              size="sm"
            />
          </div>
          <ProgressBar
            percentage={progress}
            size="md"
            showLabel
            color={isComplete ? "teal" : "gold"}
          />
        </div>
      </div>

      {/* Lessons */}
      <div className="space-y-3">
        {level.lessons.map((lesson, idx) => (
          <LessonCard
            key={lesson.id}
            levelId={level.id}
            lessonId={lesson.id}
            title={lesson.title}
            subtitle={lesson.subtitle}
            estimatedMinutes={lesson.estimatedMinutes}
            isComplete={completedLessons.includes(lesson.id)}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
}
