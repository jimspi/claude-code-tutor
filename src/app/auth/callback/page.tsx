"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-stone-500">Signing you in...</p>
      </div>
    </div>
  );
}

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attempted = useRef(false);
  const [debug, setDebug] = useState<string[]>([]);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    const log = (msg: string) => {
      console.log("[auth callback]", msg);
      setDebug((prev) => [...prev, msg]);
    };

    const code = searchParams.get("code");
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");
    const returnTo = searchParams.get("returnTo") || "/";
    const hash = window.location.hash;

    log(`URL params: code=${code ? "yes" : "no"}, token_hash=${tokenHash ? "yes" : "no"}, type=${type || "none"}`);
    log(`Hash fragment: ${hash ? "present" : "none"}`);
    log(`Return to: ${returnTo}`);

    const supabase = createClient();

    async function handleAuth() {
      // Flow 1: PKCE code exchange
      if (code) {
        log("Attempting PKCE code exchange...");
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          log("PKCE exchange succeeded!");
          router.replace(returnTo);
          return;
        }
        log(`PKCE exchange failed: ${error.message}`);
      }

      // Flow 2: token_hash verification (non-PKCE magic link)
      if (tokenHash && type) {
        log("Attempting token_hash verification...");
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as "email" | "magiclink",
        });
        if (!error) {
          log("Token hash verification succeeded!");
          router.replace(returnTo);
          return;
        }
        log(`Token hash verification failed: ${error.message}`);
      }

      // Flow 3: Hash fragment (implicit flow — Supabase client auto-detects)
      if (hash && hash.includes("access_token")) {
        log("Hash fragment detected, waiting for Supabase to pick it up...");
        // The Supabase client auto-detects hash fragments via detectSessionInUrl
        // Wait for onAuthStateChange to fire
        await new Promise<void>((resolve) => {
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            log(`Auth state change: ${event}`);
            if (event === "SIGNED_IN") {
              subscription.unsubscribe();
              resolve();
            }
          });
          // Timeout after 5 seconds
          setTimeout(() => {
            subscription.unsubscribe();
            resolve();
          }, 5000);
        });

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          log("Signed in via hash fragment!");
          router.replace(returnTo);
          return;
        }
        log("Hash fragment auth failed");
      }

      // Flow 4: Maybe already signed in (session exists from another mechanism)
      log("Checking for existing session...");
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        log(`Already signed in as ${user.email}`);
        router.replace(returnTo);
        return;
      }

      // All flows failed
      log("All auth flows failed");
    }

    handleAuth();
  }, [searchParams, router]);

  // Show debug info so we can see what's happening
  if (debug.length > 0 && debug[debug.length - 1]?.includes("failed")) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-4">
            <h2 className="text-lg font-bold text-red-800 mb-2">Sign-in failed</h2>
            <p className="text-sm text-red-600 mb-4">
              Please go back and request a new magic link. Make sure to click it in the same browser where you entered your email.
            </p>
            <button
              onClick={() => router.replace("/")}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to home
            </button>
          </div>
          <details className="text-xs text-stone-400">
            <summary className="cursor-pointer hover:text-stone-600">Debug info</summary>
            <pre className="mt-2 p-3 bg-stone-100 rounded-lg overflow-x-auto whitespace-pre-wrap">
              {debug.join("\n")}
              {"\nFull URL: " + (typeof window !== "undefined" ? window.location.href : "N/A")}
            </pre>
          </details>
        </div>
      </div>
    );
  }

  return <Spinner />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <CallbackHandler />
    </Suspense>
  );
}
