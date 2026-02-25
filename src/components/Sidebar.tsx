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

  useEffect(() => {
    const progress = loadProgress();
    setCompletedLessons(progress.completedLessons);

    const handleStorage = () => {
      const updated = loadProgress();
      setCompletedLessons(updated.completedLessons);
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("progress-update", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("progress-update", handleStorage);
    };
  }, []);

  // Refresh on pathname change
  useEffect(() => {
    const progress = loadProgress();
    setCompletedLessons(progress.completedLessons);
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
              const levelProgress = getLevelProgress(level.id);
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

          {/* Cheat sheet link */}
          <div className="p-4 border-t border-stone-200">
            <Link
              href="/cheatsheet"
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 hover:text-slate-900 transition-colors"
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Cheat Sheet
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
