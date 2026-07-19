import { NextRequest, NextResponse } from "next/server";
import { verifyTransaction } from "@/lib/paystack";

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference");

  if (!reference) {
    return NextResponse.json(
      { status: false, message: "A transaction reference is required." },
      { status: 400 }
    );
  }

  try {
    const result = await verifyTransaction(reference);

    return NextResponse.json({
      status: true,
      message: "Transaction verified.",
      data: {
        status: result.data.status,
        reference: result.data.reference,
        amount: result.data.amount / 100,
        currency: result.data.currency,
        paid_at: result.data.paid_at,
        email: result.data.customer?.email ?? null,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to verify payment.";
    return NextResponse.json({ status: false, message }, { status: 500 });
  }
}
