"use client";

import { useEffect, useRef } from "react";
import { useAccess } from "./AccessContext";
import { initProgress } from "@/lib/progress";

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { hasAccess, loading } = useAccess();
  const initialized = useRef(false);

  useEffect(() => {
    if (loading || initialized.current) return;
    initialized.current = true;

    // No user ID needed — progress is stored in localStorage only
    initProgress(null).then(() => {
      window.dispatchEvent(new Event("progress-update"));
    });
  }, [hasAccess, loading]);

  return <>{children}</>;
}
