"use client";

import { levels, getTotalLessons } from "./levels";
import { createClient } from "./supabase/client";

const STORAGE_KEY = "claude-academy-progress";

export interface ProgressData {
  completedLessons: string[];
  earnedBadges: string[];
}

// Module-level cache — keeps all reads synchronous
let cachedProgress: ProgressData | null = null;
let currentUserId: string | null = null;

function getDefaultProgress(): ProgressData {
  return {
    completedLessons: [],
    earnedBadges: [],
  };
}

function recalculateBadges(completedLessons: string[]): string[] {
  const badges: string[] = [];
  for (const level of levels) {
    const allDone = level.lessons.every((l) =>
      completedLessons.includes(l.id)
    );
    if (allDone) {
      badges.push(level.badge);
    }
  }
  return badges;
}

function loadFromLocalStorage(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultProgress();
    return JSON.parse(raw) as ProgressData;
  } catch {
    return getDefaultProgress();
  }
}

/**
 * Initialize progress for a user. Called once on mount and on auth state changes.
 * - If userId is provided, loads from Supabase and merges with localStorage on first sign-in.
 * - If userId is null (guest), loads from localStorage.
 */
export async function initProgress(userId: string | null): Promise<void> {
  currentUserId = userId;

  if (!userId) {
    // Guest mode — always start fresh (don't inherit previous user's localStorage)
    cachedProgress = getDefaultProgress();
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  // Authenticated — load from Supabase
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_progress")
    .select("completed_lessons, earned_badges")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    // New user — start with empty progress (don't inherit localStorage from previous account)
    cachedProgress = getDefaultProgress();
    await supabase.from("user_progress").upsert({
      user_id: userId,
      completed_lessons: [],
      earned_badges: [],
    });
  } else {
    // Existing user — load their progress from DB
    cachedProgress = {
      completedLessons: data.completed_lessons ?? [],
      earnedBadges: data.earned_badges ?? [],
    };
  }

  // Overwrite localStorage with this user's actual progress
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedProgress));
}

export function loadProgress(): ProgressData {
  if (typeof window === "undefined") return getDefaultProgress();
  // Return from cache if available, otherwise fall back to localStorage
  if (cachedProgress) return cachedProgress;
  cachedProgress = loadFromLocalStorage();
  return cachedProgress;
}

export function saveProgress(data: ProgressData): void {
  if (typeof window === "undefined") return;
  cachedProgress = data;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

  // Fire-and-forget Supabase upsert if authenticated
  if (currentUserId) {
    const supabase = createClient();
    supabase
      .from("user_progress")
      .upsert({
        user_id: currentUserId,
        completed_lessons: data.completedLessons,
        earned_badges: data.earnedBadges,
      })
      .then(({ error }) => {
        if (error) console.error("Failed to sync progress to Supabase:", error);
      });
  }
}

export function toggleLessonComplete(lessonId: string): ProgressData {
  const progress = loadProgress();
  const idx = progress.completedLessons.indexOf(lessonId);
  if (idx >= 0) {
    progress.completedLessons.splice(idx, 1);
  } else {
    progress.completedLessons.push(lessonId);
  }
  progress.earnedBadges = recalculateBadges(progress.completedLessons);
  saveProgress(progress);
  return progress;
}

export function markLessonComplete(lessonId: string): ProgressData {
  const progress = loadProgress();
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
  }
  progress.earnedBadges = recalculateBadges(progress.completedLessons);
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
  cachedProgress = null;
  localStorage.removeItem(STORAGE_KEY);

  // Also clear from Supabase if authenticated
  if (currentUserId) {
    const supabase = createClient();
    supabase
      .from("user_progress")
      .delete()
      .eq("user_id", currentUserId)
      .then(({ error }) => {
        if (error) console.error("Failed to reset progress in Supabase:", error);
      });
  }
}
