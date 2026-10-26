import { connection, NextResponse } from "next/server";

export async function GET() {
  await connection();
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || process.env.PAYPAL_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "PayPal client ID is missing. Set PAYPAL_CLIENT_ID or NEXT_PUBLIC_PAYPAL_CLIENT_ID in Vercel." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    { clientId },
    { headers: { "Cache-Control": "no-store" } },
  );
}
