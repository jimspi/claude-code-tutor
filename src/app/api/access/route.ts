import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const MASTER_CODE = process.env.MASTER_ACCESS_CODE!;

export async function POST(req: NextRequest) {
  try {
    const { code, sessionId } = await req.json();

    // --- Validate an existing session ---
    if (sessionId && !code) {
      // Check if this session is tied to a code
      const { data } = await supabase
        .from("access_codes")
        .select("code")
        .eq("session_id", sessionId)
        .single();

      if (data) {
        return NextResponse.json({ valid: true });
      }
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    // --- Redeem a code ---
    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const trimmedCode = code.trim().toLowerCase();

    // Master code — always works, creates a new session each time
    if (trimmedCode === MASTER_CODE.toLowerCase()) {
      const newSessionId = crypto.randomUUID();

      // Upsert master code row (reuse the same row, just update session)
      await supabase
        .from("access_codes")
        .upsert({
          code: "__master__",
          session_id: newSessionId,
          redeemed_at: new Date().toISOString(),
          email: "master",
        }, { onConflict: "code" });

      return NextResponse.json({ valid: true, sessionId: newSessionId });
    }

    // Regular code — check if it exists
    const { data: codeRow } = await supabase
      .from("access_codes")
      .select("*")
      .eq("code", trimmedCode)
      .single();

    if (!codeRow) {
      return NextResponse.json({ error: "Invalid access code" }, { status: 401 });
    }

    // If already redeemed with a different session, and caller has no matching session
    if (codeRow.session_id) {
      if (sessionId && codeRow.session_id === sessionId) {
        // Same session — allow re-entry
        return NextResponse.json({ valid: true, sessionId });
      }
      // Different session — code already used
      return NextResponse.json(
        { error: "This code has already been used" },
        { status: 403 }
      );
    }

    // Code is valid and unredeemed — assign a session
    const newSessionId = crypto.randomUUID();
    await supabase
      .from("access_codes")
      .update({
        session_id: newSessionId,
        redeemed_at: new Date().toISOString(),
      })
      .eq("code", trimmedCode);

    return NextResponse.json({ valid: true, sessionId: newSessionId });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
