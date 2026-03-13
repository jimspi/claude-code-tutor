"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const SESSION_KEY = "cca_session_id";

interface AccessContextValue {
  hasAccess: boolean;
  loading: boolean;
  redeemCode: (code: string) => Promise<{ error: string | null }>;
  clearAccess: () => void;
}

const AccessContext = createContext<AccessContextValue>({
  hasAccess: false,
  loading: true,
  redeemCode: async () => ({ error: null }),
  clearAccess: () => {},
});

// Lesson 1-1 is free for everyone as a teaser
export const FREE_LESSONS = ["1-1"];

export function AccessProvider({ children }: { children: React.ReactNode }) {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      setLoading(false);
      return;
    }

    fetch("/api/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setHasAccess(data.valid === true);
      })
      .catch(() => {
        setHasAccess(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const redeemCode = useCallback(async (code: string) => {
    const sessionId = localStorage.getItem(SESSION_KEY);
    try {
      const res = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, sessionId }),
      });
      const data = await res.json();

      if (data.valid && data.sessionId) {
        localStorage.setItem(SESSION_KEY, data.sessionId);
        setHasAccess(true);
        return { error: null };
      }

      return { error: data.error || "Invalid code" };
    } catch {
      return { error: "Failed to verify code" };
    }
  }, []);

  const clearAccess = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setHasAccess(false);
  }, []);

  return (
    <AccessContext.Provider value={{ hasAccess, loading, redeemCode, clearAccess }}>
      {children}
    </AccessContext.Provider>
  );
}

export function useAccess() {
  return useContext(AccessContext);
}
