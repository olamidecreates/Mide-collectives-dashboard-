// Demo-mode admin authentication.
//
// This is intentionally simple: a single hardcoded credential pair and a
// localStorage session with an expiry. There is no real backend, password
// hashing, or server-side session validation here — swap this out for a
// proper auth provider before handling real admin access control.

const SESSION_KEY = "mide-collectives-admin-session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export const DEMO_ADMIN_USERNAME = "admin";
export const DEMO_ADMIN_PASSWORD = "MideAdmin2026";

type AdminSession = {
  user: string;
  issuedAt: number;
  expiresAt: number;
};

export function login(username: string, password: string): boolean {
  const validUsername = username.trim().toLowerCase() === DEMO_ADMIN_USERNAME;
  const validPassword = password === DEMO_ADMIN_PASSWORD;
  if (!validUsername || !validPassword) return false;

  const now = Date.now();
  const session: AdminSession = {
    user: username.trim(),
    issuedAt: now,
    expiresAt: now + SESSION_TTL_MS,
  };

  try {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Storage may be unavailable — the login still "succeeds" for this tick,
    // but the session won't persist across reloads.
  }
  return true;
}

export function logout(): void {
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // no-op
  }
}

export function getSession(): AdminSession | null {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    if (!session.expiresAt || session.expiresAt < Date.now()) {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null;
}

export { SESSION_KEY };
