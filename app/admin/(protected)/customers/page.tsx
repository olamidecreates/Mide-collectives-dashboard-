"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Mail, Phone, ChevronDown } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { listOrders, type OrderRecord } from "@/lib/orders";
import { formatNaira, formatDate } from "@/lib/admin/utils";

type Customer = {
  email: string;
  fullName: string;
  phone: string;
  city: string;
  state: string;
  orders: OrderRecord[];
  totalSpent: number;
};

function buildCustomers(orders: OrderRecord[]): Customer[] {
  const map = new Map<string, Customer>();
  for (const order of orders) {
    const key = order.customer.email.toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.orders.push(order);
      existing.totalSpent += order.total;
    } else {
      map.set(key, {
        email: order.customer.email,
        fullName: order.customer.fullName,
        phone: order.customer.phone,
        city: order.customer.city,
        state: order.customer.state,
        orders: [order],
        totalSpent: order.total,
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setCustomers(buildCustomers(listOrders()));
    setLoaded(true);
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter(
      (c) => c.fullName.toLowerCase().includes(term) || c.email.toLowerCase().includes(term)
    );
  }, [customers, search]);

  return (
    <div>
      <PageHeader
        title="Customers"
        description={`${customers.length} customers on record, derived from order history.`}
      />

      <div className="mb-5 flex items-center gap-2 border border-ink/20 bg-paper px-4 py-2.5">
        <Search size={15} className="shrink-0 text-smoke" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink/30 focus:outline-none"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((customer) => {
          const isOpen = expanded === customer.email;
          return (
            <div key={customer.email} className="rounded-card border border-ink/10 bg-paper">
              <button
                onClick={() => setExpanded(isOpen ? null : customer.email)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-paper">
                    {customer.fullName.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold uppercase tracking-tight text-ink">
                      {customer.fullName}
                    </p>
                    <p className="flex items-center gap-1 font-mono text-[10px] text-smoke">
                      <Mail size={11} /> {customer.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden text-right sm:block">
                    <p className="font-mono text-xs text-ink">{customer.orders.length} order(s)</p>
                    <p className="font-mono text-xs text-volt">{formatNaira(customer.totalSpent)}</p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-smoke transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-ink/10 px-6 py-5">
                  <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest2 text-smoke">Phone</p>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-ink">
                        <Phone size={13} /> {customer.phone}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest2 text-smoke">
                        Location
                      </p>
                      <p className="mt-1 text-sm text-ink">
                        {customer.city}, {customer.state}
                      </p>
                    </div>
                  </div>

                  <p className="mb-3 font-mono text-[10px] uppercase tracking-widest2 text-smoke">
                    Order History
                  </p>
                  <div className="divide-y divide-ink/5">
                    {customer.orders.map((order) => (
                      <div key={order.reference} className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-mono text-xs text-ink">{order.orderId}</p>
                          <p className="font-mono text-[10px] text-smoke">
                            {formatDate(order.paymentDate)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-xs text-ink">
                            {formatNaira(order.total)}
                          </span>
                          <StatusBadge status={order.status ?? "Pending"} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {loaded && filtered.length === 0 && (
          <p className="rounded-card border border-ink/10 bg-paper px-6 py-12 text-center text-sm text-smoke">
            No customers yet — they'll appear here once orders are placed.
          </p>
        )}
      </div>
    </div>
  );
}
