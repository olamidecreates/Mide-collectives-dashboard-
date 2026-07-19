const STORAGE_KEY = "mide-collectives-admin-settings";

export type StoreSettings = {
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  whatsapp: string;
  address: string;
  socials: {
    instagram: string;
    tiktok: string;
    twitter: string;
    facebook: string;
  };
  deliveryFees: {
    standard: number;
    express: number;
  };
};

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Mide Collectives",
  tagline: "Wear Your Story.",
  supportEmail: "hello@midecollectives.com",
  supportPhone: "+234 800 000 0000",
  whatsapp: "+234 800 000 0000",
  address: "Ijebu Igbo, Ogun State, Nigeria",
  socials: {
    instagram: "https://instagram.com/midecollectives",
    tiktok: "https://tiktok.com/@midecollectives",
    twitter: "https://twitter.com/midecollectives",
    facebook: "",
  },
  deliveryFees: {
    standard: 3500,
    express: 7500,
  },
};

export function getSettings(): StoreSettings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoreSettings>;
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        socials: { ...DEFAULT_SETTINGS.socials, ...parsed.socials },
        deliveryFees: { ...DEFAULT_SETTINGS.deliveryFees, ...parsed.deliveryFees },
      };
    }
  } catch {
    // fall through to defaults
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: StoreSettings): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage may be unavailable — changes won't persist this session.
  }
}
