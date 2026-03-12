"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  paid: boolean;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signInWithEmail: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  paid: false,
  signInWithGoogle: async () => ({ error: null }),
  signInWithEmail: async () => ({ error: null }),
  signOut: async () => {},
  refreshUser: async () => {},
});

// Lesson 1-1 is free for everyone as a teaser
export const FREE_LESSONS = ["1-1"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const paid = user?.user_metadata?.paid === true;

  const refreshUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }, [supabase]);

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInWithGoogle = useCallback(async () => {
    const returnTo = window.location.pathname;
    const redirectUrl = new URL("/auth/callback", window.location.origin);
    if (returnTo && returnTo !== "/") {
      redirectUrl.searchParams.set("returnTo", returnTo);
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl.toString(),
      },
    });
    return { error: error?.message ?? null };
  }, [supabase]);

  const signInWithEmail = useCallback(
    async (email: string) => {
      const returnTo = window.location.pathname;
      const redirectUrl = new URL("/auth/callback", window.location.origin);
      if (returnTo && returnTo !== "/") {
        redirectUrl.searchParams.set("returnTo", returnTo);
      }
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl.toString(),
        },
      });
      return { error: error?.message ?? null };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ user, loading, paid, signInWithGoogle, signInWithEmail, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
