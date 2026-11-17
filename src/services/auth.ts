import { useState, useEffect } from "react";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Store Manager" | "Inventory Admin";
  avatar: string;
  twoFactorEnabled: boolean;
  token?: string;
}

const DEMO_ADMINS: AdminUser[] = [
  {
    id: "adm-1",
    name: "Nithi (Founder & Owner)",
    email: "admin@nithicollection.com",
    role: "Super Admin",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    twoFactorEnabled: true,
  },
  {
    id: "adm-2",
    name: "Ramesh Kumar",
    email: "manager@nithicollection.com",
    role: "Store Manager",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    twoFactorEnabled: false,
  },
  {
    id: "adm-3",
    name: "Sundar Raj",
    email: "inventory@nithicollection.com",
    role: "Inventory Admin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    twoFactorEnabled: false,
  },
];

const AUTH_STORAGE_KEY = "nithi_admin_session_auth_v1";

function isTokenExpired(token: string): boolean {
  if (!token) return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      // Non-JWT token (e.g. dev token)
      return false;
    }
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.exp && typeof payload.exp === "number") {
      return Date.now() >= payload.exp * 1000;
    }
    return false;
  } catch {
    return false;
  }
}

type AuthListener = (user: AdminUser | null) => void;
const authListeners: Set<AuthListener> = new Set();

export const authService = {
  getCurrentUser(): AdminUser | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") return null;

      // Verify that token is present and not expired
      if (!parsed.token || typeof parsed.token !== "string" || isTokenExpired(parsed.token)) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  },

  async login(email: string, password?: string, twoFactorCode?: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    const cleanEmail = email.toLowerCase().trim();

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password })
      });
      
      const contentType = res.headers.get("content-type") || "";
      let data: any = {};
      if (contentType.includes("application/json")) {
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch {}
      }
      
      if (data && data.success && data.token) {
        // Store both user and token
        const fullUser: AdminUser = { ...data.user, token: data.token };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fullUser));
        authListeners.forEach((fn) => fn(fullUser));
        return { success: true, user: fullUser };
      } else {
        return { success: false, error: data?.error || 'Authentication failed' };
      }
    } catch (err) {
      console.error("Login fetch error:", err);
      // Fallback for demo users if backend is totally down
      const found = DEMO_ADMINS.find((a) => a.email.toLowerCase() === cleanEmail);
      if (cleanEmail === "admin" || cleanEmail === "admin@nithi.com" || found) {
        const user = found || DEMO_ADMINS[0];
        const fullUser: AdminUser = { ...user, token: "nithi_dev_session_token" };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(fullUser));
        authListeners.forEach((fn) => fn(fullUser));
        return { success: true, user: fullUser };
      }
      return { success: false, error: 'Could not reach authentication server.' };
    }
  },

  logout() {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      fetch('/api/login', { method: 'DELETE' }).catch(() => {});
      document.cookie = "nithi_admin_token=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    } catch {}
    authListeners.forEach((fn) => fn(null));
  },

  subscribe(fn: AuthListener) {
    authListeners.add(fn);
    return () => authListeners.delete(fn);
  },

  getAvailableAccounts() {
    return DEMO_ADMINS;
  },
};

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(() => authService.getCurrentUser());

  useEffect(() => {
    const unsub = authService.subscribe((newUser) => {
      setUser(newUser);
    });
    return () => { unsub(); };
  }, []);

  return {
    user,
    isAuthenticated: Boolean(user && user.token),
    login: authService.login,
    logout: authService.logout,
    demoAccounts: DEMO_ADMINS,
  };
}
