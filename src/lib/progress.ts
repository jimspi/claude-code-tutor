"use client";

import { levels, getTotalLessons } from "./levels";

const STORAGE_KEY = "claude-academy-progress";

export interface ProgressData {
  completedLessons: string[];
  earnedBadges: string[];
}

function getDefaultProgress(): ProgressData {
  return {
    completedLessons: [],
    earnedBadges: [],
  };
}

export function loadProgress(): ProgressData {
  if (typeof window === "undefined") return getDefaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    return JSON.parse(raw) as ProgressData;
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(data: ProgressData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function toggleLessonComplete(lessonId: string): ProgressData {
  const progress = loadProgress();
  const idx = progress.completedLessons.indexOf(lessonId);
  if (idx >= 0) {
    progress.completedLessons.splice(idx, 1);
  } else {
    progress.completedLessons.push(lessonId);
  }
  // Recalculate badges
  progress.earnedBadges = [];
  for (const level of levels) {
    const allDone = level.lessons.every((l) =>
      progress.completedLessons.includes(l.id)
    );
    if (allDone) {
      progress.earnedBadges.push(level.badge);
    }
  }
  saveProgress(progress);
  return progress;
}

export function markLessonComplete(lessonId: string): ProgressData {
  const progress = loadProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }
  // Recalculate badges
  progress.earnedBadges = [];
  for (const level of levels) {
    const allDone = level.lessons.every((l) =>
      progress.completedLessons.includes(l.id)
    );
    if (allDone) {
      progress.earnedBadges.push(level.badge);
    }
  }
  saveProgress(progress);
  return progress;
}

export function isLessonComplete(lessonId: string): boolean {
  return loadProgress().completedLessons.includes(lessonId);
}

export function getLevelProgress(levelId: string): number {
  const level = levels.find((l) => l.id === levelId);
  if (!level) return 0;
  const progress = loadProgress();
  const completed = level.lessons.filter((l) =>
    progress.completedLessons.includes(l.id)
  ).length;
  return Math.round((completed / level.lessons.length) * 100);
}

export function getOverallProgress(): number {
  const total = getTotalLessons();
  if (total === 0) return 0;
  const progress = loadProgress();
  return Math.round((progress.completedLessons.length / total) * 100);
}

export function getCurrentBadge(): string | null {
  const progress = loadProgress();
  if (progress.earnedBadges.length === 0) return null;
  return progress.earnedBadges[progress.earnedBadges.length - 1];
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
