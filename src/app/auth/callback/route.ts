import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as "email" | "magiclink" | null;
  const next = searchParams.get("next") ?? "/";

  const cookieStore = await cookies();

  // Collect cookies that Supabase wants to set
  const cookiesToSet: { name: string; value: string; options: any }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookies) {
          cookiesToSet.push(...cookies);
        },
      },
    }
  );

  let success = false;

  // Handle PKCE flow (magic link with code)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) success = true;
  }

  // Handle magic link / email OTP flow (token_hash)
  if (!success && token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });
    if (!error) success = true;
  }

  const redirectUrl = success ? `${origin}${next}` : origin;
  const response = NextResponse.redirect(redirectUrl);

  // Apply all auth cookies to the redirect response
  for (const { name, value, options } of cookiesToSet) {
    response.cookies.set(name, value, options);
  }

  return response;
}
