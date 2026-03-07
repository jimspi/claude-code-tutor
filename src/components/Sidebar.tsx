"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { levels } from "@/lib/levels";
import { loadProgress, getLevelProgress } from "@/lib/progress";
import ProgressBar from "./ProgressBar";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [levelProgresses, setLevelProgresses] = useState<Record<string, number>>({});

  const refreshProgress = () => {
    const progress = loadProgress();
    setCompletedLessons(progress.completedLessons);
    const lp: Record<string, number> = {};
    levels.forEach((level) => {
      lp[level.id] = getLevelProgress(level.id);
    });
    setLevelProgresses(lp);
  };

  useEffect(() => {
    refreshProgress();

    window.addEventListener("storage", refreshProgress);
    window.addEventListener("progress-update", refreshProgress);
    return () => {
      window.removeEventListener("storage", refreshProgress);
      window.removeEventListener("progress-update", refreshProgress);
    };
  }, []);

  // Refresh on pathname change
  useEffect(() => {
    refreshProgress();
  }, [pathname]);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-stone-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo area */}
          <div className="p-5 border-b border-stone-200">
            <Link href="/" onClick={onClose} className="block">
              <h1 className="font-heading text-lg font-bold text-slate-900">
                Claude Code Academy
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Learn to build with AI
              </p>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-5">
            {levels.map((level) => {
              const levelProgress = levelProgresses[level.id] || 0;
              const isCurrentLevel = pathname.includes(`/level/${level.id}`);

              return (
                <div key={level.id}>
                  <Link
                    href={`/level/${level.id}`}
                    onClick={onClose}
                    className="block mb-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-bold uppercase tracking-wider ${
                          isCurrentLevel ? "text-teal-600" : "text-stone-400"
                        }`}
                      >
                        Level {level.number}
                      </span>
                      {levelProgress === 100 && (
                        <span className="text-xs font-semibold text-amber-600">
                          Complete
                        </span>
                      )}
                    </div>
                    <h3
                      className={`text-sm font-semibold ${
                        isCurrentLevel ? "text-slate-900" : "text-stone-600"
                      }`}
                    >
                      {level.title}
                    </h3>
                    <div className="mt-1.5">
                      <ProgressBar percentage={levelProgress} size="sm" />
                    </div>
                  </Link>

                  <div className="space-y-0.5 mt-2">
                    {level.lessons.map((lesson) => {
                      const isActive =
                        pathname === `/level/${level.id}/${lesson.id}`;
                      const isDone = completedLessons.includes(lesson.id);

                      return (
                        <Link
                          key={lesson.id}
                          href={`/level/${level.id}/${lesson.id}`}
                          onClick={onClose}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive
                              ? "bg-teal-50 text-teal-800 font-medium"
                              : isDone
                              ? "text-stone-500 hover:bg-stone-50"
                              : "text-stone-600 hover:bg-stone-50"
                          }`}
                        >
                          <span
                            className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isDone
                                ? "border-teal-500 bg-teal-500"
                                : isActive
                                ? "border-teal-500"
                                : "border-stone-300"
                            }`}
                          >
                            {isDone && (
                              <svg
                                className="w-2.5 h-2.5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </span>
                          <span className="truncate">{lesson.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Resource links */}
          <div className="p-4 border-t border-stone-200 space-y-0.5">
            <Link
              href="/playground"
              onClick={onClose}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/playground"
                  ? "bg-teal-50 text-teal-800"
                  : "text-stone-600 hover:bg-stone-50 hover:text-slate-900"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Playground
            </Link>
            <Link
              href="/cheatsheet"
              onClick={onClose}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/cheatsheet"
                  ? "bg-teal-50 text-teal-800"
                  : "text-stone-600 hover:bg-stone-50 hover:text-slate-900"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Cheat Sheet
            </Link>
            <Link
              href="/glossary"
              onClick={onClose}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === "/glossary"
                  ? "bg-teal-50 text-teal-800"
                  : "text-stone-600 hover:bg-stone-50 hover:text-slate-900"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Glossary
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
