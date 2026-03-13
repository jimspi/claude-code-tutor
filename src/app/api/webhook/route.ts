import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/** Generate a short, readable access code like "cca-a7f3-x9k2" */
function generateCode(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789"; // no ambiguous chars
  const segment = () =>
    Array.from(crypto.randomBytes(4))
      .map((b) => chars[b % chars.length])
      .join("");
  return `cca-${segment()}-${segment()}`;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email || session.customer_email || "unknown";

    const code = generateCode();

    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin.from("access_codes").insert({
      code,
      email,
      stripe_session_id: session.id,
    });

    if (error) {
      console.error("Failed to insert access code:", error);
      return NextResponse.json(
        { error: "Failed to create access code" },
        { status: 500 }
      );
    }

    console.log(`Access code ${code} created for ${email} (session: ${session.id})`);
  }

  return NextResponse.json({ received: true });
}
