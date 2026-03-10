import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Middleware handles the code exchange and cookie transfer.
  // If we reach here, the exchange already happened or failed — redirect home.
  const { origin } = new URL(request.url);
  return NextResponse.redirect(origin);
}
