"use client";

import { Suspense, useEffect, useRef } from "react";
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
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const returnTo = searchParams.get("returnTo") || "/";
    const supabase = createClient();

    // The Supabase browser client already handles the ?code= parameter
    // automatically via detectSessionInUrl during initialization.
    // We just need to wait for the SIGNED_IN event and then redirect.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        subscription.unsubscribe();
        router.replace(returnTo);
      }
    });

    // Also check if the user is already signed in (in case the event fired
    // before our listener was registered).
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        subscription.unsubscribe();
        router.replace(returnTo);
      }
    });

    // Fallback timeout — if nothing happens after 10 seconds, redirect home
    const timeout = setTimeout(() => {
      subscription.unsubscribe();
      router.replace("/?auth_error=link_expired");
    }, 10000);

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [searchParams, router]);

  return <Spinner />;
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <CallbackHandler />
    </Suspense>
  );
}
