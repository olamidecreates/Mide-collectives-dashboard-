// Server-only helpers for talking to the Paystack API.
// This file must never be imported from a "use client" component —
// it relies on process.env.PAYSTACK_SECRET_KEY, which is only
// available on the server and must never reach the browser bundle.

const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error(
      "PAYSTACK_SECRET_KEY is not set. Add it to your environment (see .env.local.example)."
    );
  }
  return key;
}

export type PaystackInitializeResponse = {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

export type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data: {
    status: "success" | "failed" | "abandoned" | string;
    reference: string;
    amount: number;
    currency: string;
    paid_at: string | null;
    customer?: {
      email: string;
    };
  };
};

/**
 * Initializes a Paystack transaction. Amount must be passed in the
 * major currency unit (Naira) — this helper converts to kobo.
 */
export async function initializeTransaction(params: {
  email: string;
  amountNaira: number;
  reference: string;
  metadata?: Record<string, unknown>;
}): Promise<PaystackInitializeResponse> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amountNaira * 100), // kobo
      currency: "NGN",
      reference: params.reference,
      metadata: params.metadata ?? {},
    }),
    cache: "no-store",
  });

  const json = (await response.json()) as PaystackInitializeResponse;

  if (!response.ok || !json.status) {
    throw new Error(json.message || "Failed to initialize Paystack transaction.");
  }

  return json;
}

/**
 * Verifies a Paystack transaction by its reference.
 */
export async function verifyTransaction(
  reference: string
): Promise<PaystackVerifyResponse> {
  const response = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getSecretKey()}`,
      },
      cache: "no-store",
    }
  );

  const json = (await response.json()) as PaystackVerifyResponse;

  if (!response.ok || !json.status) {
    throw new Error(json.message || "Failed to verify Paystack transaction.");
  }

  return json;
}
