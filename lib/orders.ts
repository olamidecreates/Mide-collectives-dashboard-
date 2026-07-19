import type { CartItem } from "@/lib/cart-context";

export type OrderCustomer = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
};

export type OrderDeliveryMethod = {
  id: string;
  label: string;
  eta: string;
  fee: number;
};

/** Fulfillment status, managed from the admin dashboard. */
export const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderRecord = {
  orderId: string;
  reference: string;
  customer: OrderCustomer;
  items: CartItem[];
  deliveryMethod: OrderDeliveryMethod;
  subtotal: number;
  total: number;
  paymentDate: string; // ISO timestamp
  estimatedDelivery: string; // ISO date
  /** Optional for backwards compatibility with orders saved before this field existed. */
  status?: OrderStatus;
};

const ORDER_PREFIX = "mide-collectives-order-";

/** Generates a human-friendly, reasonably unique order number. */
export function generateOrderId(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MC-${stamp}-${rand}`;
}

/** Generates a Paystack-safe unique transaction reference. */
export function generateReference(): string {
  const stamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `mc_${stamp}_${rand}`;
}

export function estimatedDeliveryDate(businessDaysFromNow: number): string {
  const date = new Date();
  let added = 0;
  while (added < businessDaysFromNow) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) {
      added += 1;
    }
  }
  return date.toISOString();
}

export function saveOrder(order: OrderRecord) {
  try {
    window.localStorage.setItem(
      `${ORDER_PREFIX}${order.reference}`,
      JSON.stringify(order)
    );
  } catch {
    // Storage may be unavailable — order can still be shown via query state.
  }
}

export function getOrder(reference: string): OrderRecord | null {
  try {
    const raw = window.localStorage.getItem(`${ORDER_PREFIX}${reference}`);
    if (!raw) return null;
    const order = JSON.parse(raw) as OrderRecord;
    return { ...order, status: order.status ?? "Pending" };
  } catch {
    return null;
  }
}

/** Lists every order saved in this browser, newest first. Used by the admin dashboard. */
export function listOrders(): OrderRecord[] {
  const orders: OrderRecord[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith(ORDER_PREFIX)) continue;
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      try {
        const order = JSON.parse(raw) as OrderRecord;
        orders.push({ ...order, status: order.status ?? "Pending" });
      } catch {
        // Skip malformed entries.
      }
    }
  } catch {
    return [];
  }
  return orders.sort(
    (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
  );
}

/** Updates the fulfillment status of an order. Used by the admin dashboard. */
export function updateOrderStatus(reference: string, status: OrderStatus): OrderRecord | null {
  const order = getOrder(reference);
  if (!order) return null;
  const updated: OrderRecord = { ...order, status };
  saveOrder(updated);
  return updated;
}
