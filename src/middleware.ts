import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Read returnTo from query params (preserved from signIn redirect URL)
  const returnTo = request.nextUrl.searchParams.get("returnTo");

  // Helper: build redirect URL after successful auth
  function buildAuthRedirectUrl() {
    const url = request.nextUrl.clone();
    url.searchParams.delete("code");
    url.searchParams.delete("token_hash");
    url.searchParams.delete("type");
    url.searchParams.delete("returnTo");
    // Redirect to returnTo path, or home
    url.pathname = returnTo || "/";
    return url;
  }

  // Handle auth code exchange (PKCE magic link flow)
  const code = request.nextUrl.searchParams.get("code");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const url = buildAuthRedirectUrl();
      const redirectResponse = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie);
      });
      return redirectResponse;
    }
    // PKCE exchange failed (e.g., opened in different browser, expired code).
    // Redirect to home with an error hint so the user knows to try again.
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "?auth_error=link_expired";
    return NextResponse.redirect(url);
  }

  // Handle token_hash flow (non-PKCE magic links)
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "email" | "magiclink",
    });
    if (!error) {
      const url = buildAuthRedirectUrl();
      const redirectResponse = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie);
      });
      return redirectResponse;
    }
    // Token verification failed
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "?auth_error=link_expired";
    return NextResponse.redirect(url);
  }

  // Refresh the session — important for Server Components
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and images
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
