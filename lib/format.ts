// Shared formatting helpers used across the storefront and admin dashboard.
// Centralized here so currency/locale formatting stays consistent in one
// place instead of being redefined per-component.

/** Formats a Naira amount, e.g. 30000 -> "₦30,000". */
export function formatNaira(value: number): string {
  return `₦${value.toLocaleString("en-NG")}`;
}
