"use client";

import { useState, useEffect } from "react";
import { getOverallProgress, getCurrentBadge } from "@/lib/progress";
import ProgressBar from "./ProgressBar";
import Badge from "./Badge";

interface TopBarProps {
  onMenuClick: () => void;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const [progress, setProgress] = useState(0);
  const [badge, setBadge] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      setProgress(getOverallProgress());
      setBadge(getCurrentBadge());
    };

    update();
    window.addEventListener("progress-update", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("progress-update", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <svg
              className="w-5 h-5 text-stone-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="hidden sm:flex items-center gap-4 min-w-0">
            <div className="w-32 lg:w-48">
              <ProgressBar percentage={progress} size="sm" color="gold" />
            </div>
            <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">
              {progress}% complete
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {badge && <Badge title={badge} earned size="sm" />}
        </div>
      </div>
    </header>
  );
}
