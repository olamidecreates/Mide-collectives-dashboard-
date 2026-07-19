import { NextRequest, NextResponse } from "next/server";
import { initializeTransaction } from "@/lib/paystack";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const rawBody: unknown = await request.json();
    const body = (rawBody && typeof rawBody === "object" ? rawBody : {}) as Record<
      string,
      unknown
    >;
    const { email, name, amount, orderId, reference } = body;

    if (typeof email !== "string" || !emailPattern.test(email.trim())) {
      return NextResponse.json(
        { status: false, message: "A valid customer email is required." },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { status: false, message: "Customer name is required." },
        { status: 400 }
      );
    }

    if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { status: false, message: "A valid amount is required." },
        { status: 400 }
      );
    }

    if (typeof reference !== "string" || reference.trim().length === 0) {
      return NextResponse.json(
        { status: false, message: "A transaction reference is required." },
        { status: 400 }
      );
    }

    const result = await initializeTransaction({
      email: email.trim(),
      amountNaira: amount,
      reference: reference.trim(),
      metadata: {
        order_id: orderId ?? null,
        customer_name: name.trim(),
      },
    });

    return NextResponse.json({
      status: true,
      message: "Transaction initialized.",
      data: {
        access_code: result.data.access_code,
        authorization_url: result.data.authorization_url,
        reference: result.data.reference,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to initialize payment.";
    return NextResponse.json({ status: false, message }, { status: 500 });
  }
}
