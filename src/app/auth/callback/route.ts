import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Middleware handles the code exchange and cookie transfer.
  // If we reach here, the exchange already happened or failed — redirect to returnTo or home.
  const url = new URL(request.url);
  const returnTo = url.searchParams.get("returnTo");
  return NextResponse.redirect(new URL(returnTo || "/", url.origin));
}
