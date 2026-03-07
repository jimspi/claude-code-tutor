"use client";

import { useState, useEffect } from "react";
import { isLessonComplete, toggleLessonComplete, loadProgress, getLevelProgress } from "@/lib/progress";
import { levels } from "@/lib/levels";
import { lessonRecaps } from "@/data/lessonRecaps";
import LevelCelebration from "./LevelCelebration";

interface LessonCompleteProps {
  lessonId: string;
}

function getLevelForLesson(lessonId: string): string | null {
  for (const level of levels) {
    if (level.lessons.some((l) => l.id === lessonId)) {
      return level.id;
    }
  }
  return null;
}

export default function LessonComplete({ lessonId }: LessonCompleteProps) {
  const [complete, setComplete] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [showRecap, setShowRecap] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationLevelId, setCelebrationLevelId] = useState<string | null>(null);

  const recap = lessonRecaps[lessonId];

  useEffect(() => {
    setComplete(isLessonComplete(lessonId));
    setShowRecap(false);
  }, [lessonId]);

  const handleToggle = () => {
    // Check level progress BEFORE toggling so we can detect completion
    const levelId = getLevelForLesson(lessonId);
    const wasLevelComplete = levelId ? getLevelProgress(levelId) === 100 : false;

    const updated = toggleLessonComplete(lessonId);
    const nowComplete = updated.completedLessons.includes(lessonId);
    setComplete(nowComplete);

    if (nowComplete) {
      setAnimating(true);
      setShowRecap(true);
      setTimeout(() => setAnimating(false), 600);

      // Check if this completion triggered a level completion
      if (levelId && !wasLevelComplete) {
        const nowLevelComplete = getLevelProgress(levelId) === 100;
        if (nowLevelComplete) {
          // Delay celebration to let recap show first
          setCelebrationLevelId(levelId);
          setTimeout(() => setShowCelebration(true), 1500);
        }
      }
    } else {
      setShowRecap(false);
    }

    window.dispatchEvent(new Event("progress-update"));
  };

  return (
    <>
      <div>
        <button
          onClick={handleToggle}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
            complete
              ? "bg-teal-100 text-teal-800 hover:bg-teal-200 border border-teal-200"
              : "bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg"
          } ${animating ? "scale-105" : "scale-100"}`}
        >
          <span
            className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
              complete ? "border-teal-600 bg-teal-600" : "border-white/50"
            }`}
          >
            {complete && (
              <svg
                className="w-3 h-3 text-white"
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
          {complete ? "Completed — click to undo" : "Mark as complete"}
        </button>

        {/* Lesson Recap */}
        {showRecap && recap && (
          <div className="mt-5 p-5 rounded-xl bg-teal-50 border border-teal-200 animate-[fadeIn_0.4s_ease-out]">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-3">
              What you learned
            </p>
            <ul className="space-y-2 mb-4">
              {recap.takeaways.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-teal-900">
                  <svg className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
            <p className="text-sm font-medium text-teal-700 italic">
              {recap.encouragement}
            </p>
          </div>
        )}
      </div>

      {/* Level Celebration Modal */}
      {showCelebration && celebrationLevelId && (
        <LevelCelebration
          levelId={celebrationLevelId}
          onClose={() => setShowCelebration(false)}
        />
      )}
    </>
  );
}
