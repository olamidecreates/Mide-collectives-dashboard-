"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Check, Instagram, Facebook, Twitter } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { getSettings, saveSettings, type StoreSettings } from "@/lib/admin/settings-store";

const inputClasses =
  "w-full border border-ink/20 bg-paper px-4 py-3 text-sm text-ink placeholder:text-ink/30 transition-colors duration-300 focus:border-ink focus:outline-none";
const labelClasses = "mb-2 block font-mono text-[11px] uppercase tracking-widest2 text-smoke";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  function update<K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);
  }

  function updateSocial(key: keyof StoreSettings["socials"], value: string) {
    setSettings((prev) => (prev ? { ...prev, socials: { ...prev.socials, [key]: value } } : prev));
    setSaved(false);
  }

  function updateFee(key: keyof StoreSettings["deliveryFees"], value: number) {
    setSettings((prev) =>
      prev ? { ...prev, deliveryFees: { ...prev.deliveryFees, [key]: value } } : prev
    );
    setSaved(false);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!settings) return;
    saveSettings(settings);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  if (!settings) {
    return <p className="font-mono text-xs uppercase tracking-widest2 text-smoke">Loading…</p>;
  }

  return (
    <div>
      <PageHeader title="Settings" description="Manage your store information and preferences." />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-card border border-ink/10 bg-paper p-6">
          <h2 className="mb-5 font-display text-sm font-extrabold uppercase tracking-tight text-ink">
            Store Information
          </h2>
          <div className="mb-5">
            <label className={labelClasses}>Store Name</label>
            <input
              value={settings.storeName}
              onChange={(e) => update("storeName", e.target.value)}
              className={inputClasses}
            />
          </div>
          <div className="mb-5">
            <label className={labelClasses}>Tagline</label>
            <input
              value={settings.tagline}
              onChange={(e) => update("tagline", e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Address</label>
            <input
              value={settings.address}
              onChange={(e) => update("address", e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="rounded-card border border-ink/10 bg-paper p-6">
          <h2 className="mb-5 font-display text-sm font-extrabold uppercase tracking-tight text-ink">
            Contact Information
          </h2>
          <div className="mb-5">
            <label className={labelClasses}>Support Email</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => update("supportEmail", e.target.value)}
              className={inputClasses}
            />
          </div>
          <div className="mb-5">
            <label className={labelClasses}>Support Phone</label>
            <input
              value={settings.supportPhone}
              onChange={(e) => update("supportPhone", e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>WhatsApp Number</label>
            <input
              value={settings.whatsapp}
              onChange={(e) => update("whatsapp", e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="rounded-card border border-ink/10 bg-paper p-6">
          <h2 className="mb-5 font-display text-sm font-extrabold uppercase tracking-tight text-ink">
            Social Links
          </h2>
          <div className="mb-5">
            <label className={`${labelClasses} flex items-center gap-1.5`}>
              <Instagram size={12} /> Instagram
            </label>
            <input
              value={settings.socials.instagram}
              onChange={(e) => updateSocial("instagram", e.target.value)}
              className={inputClasses}
            />
          </div>
          <div className="mb-5">
            <label className={labelClasses}>TikTok</label>
            <input
              value={settings.socials.tiktok}
              onChange={(e) => updateSocial("tiktok", e.target.value)}
              className={inputClasses}
            />
          </div>
          <div className="mb-5">
            <label className={`${labelClasses} flex items-center gap-1.5`}>
              <Twitter size={12} /> Twitter / X
            </label>
            <input
              value={settings.socials.twitter}
              onChange={(e) => updateSocial("twitter", e.target.value)}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={`${labelClasses} flex items-center gap-1.5`}>
              <Facebook size={12} /> Facebook
            </label>
            <input
              value={settings.socials.facebook}
              onChange={(e) => updateSocial("facebook", e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>

        <div className="rounded-card border border-ink/10 bg-paper p-6">
          <h2 className="mb-5 font-display text-sm font-extrabold uppercase tracking-tight text-ink">
            Delivery Fees
          </h2>
          <div className="mb-5">
            <label className={labelClasses}>Standard Delivery (₦)</label>
            <input
              type="number"
              min="0"
              value={settings.deliveryFees.standard}
              onChange={(e) => updateFee("standard", Number(e.target.value))}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Express Delivery (₦)</label>
            <input
              type="number"
              min="0"
              value={settings.deliveryFees.express}
              onChange={(e) => updateFee("express", Number(e.target.value))}
              className={inputClasses}
            />
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-widest2 text-smoke/70">
            Demo mode — reference values only, not yet wired into checkout.
          </p>
        </div>

        <div className="lg:col-span-2">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-ink px-8 py-3.5 font-mono text-[12px] uppercase tracking-widest2 text-paper transition-colors duration-300 hover:bg-volt"
          >
            {saved && <Check size={15} />}
            {saved ? "Saved" : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
