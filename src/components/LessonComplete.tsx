"use client";

import { useState, useEffect } from "react";
import { isLessonComplete, toggleLessonComplete } from "@/lib/progress";

interface LessonCompleteProps {
  lessonId: string;
}

export default function LessonComplete({ lessonId }: LessonCompleteProps) {
  const [complete, setComplete] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setComplete(isLessonComplete(lessonId));
  }, [lessonId]);

  const handleToggle = () => {
    const updated = toggleLessonComplete(lessonId);
    const nowComplete = updated.completedLessons.includes(lessonId);
    setComplete(nowComplete);

    if (nowComplete) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 600);
    }

    // Dispatch custom event for sidebar/topbar to pick up
    window.dispatchEvent(new Event("progress-update"));
  };

  return (
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
  );
}
