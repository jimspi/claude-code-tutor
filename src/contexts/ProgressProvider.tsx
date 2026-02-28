"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { initProgress } from "@/lib/progress";

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const prevUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (loading) return;

    const userId = user?.id ?? null;

    // Skip if the user hasn't changed
    if (prevUserId.current === userId) return;
    prevUserId.current = userId;

    initProgress(userId).then(() => {
      window.dispatchEvent(new Event("progress-update"));
    });
  }, [user, loading]);

  return <>{children}</>;
}
