import { useState, useEffect } from "react";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Store Manager" | "Inventory Admin";
  avatar: string;
  twoFactorEnabled: boolean;
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

type AuthListener = (user: AdminUser | null) => void;
const authListeners: Set<AuthListener> = new Set();

export const authService = {
  getCurrentUser(): AdminUser | null {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
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
      
      const data = await res.json();
      
      if (data.success && data.token) {
        // Store both user and token
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ ...data.user, token: data.token }));
        authListeners.forEach((fn) => fn(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Authentication failed' };
      }
    } catch (err) {
      console.error("Login fetch error:", err);
      // Fallback for demo users if backend is totally down (optional, but good for this template)
      const found = DEMO_ADMINS.find((a) => a.email.toLowerCase() === cleanEmail);
      if (cleanEmail === "admin" || cleanEmail === "admin@nithi.com" || found) {
        const user = found || DEMO_ADMINS[0];
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        authListeners.forEach((fn) => fn(user));
        return { success: true, user };
      }
      return { success: false, error: 'Could not reach authentication server.' };
    }
  },

  logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
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
  const [user, setUser] = useState<AdminUser | null>(authService.getCurrentUser());

  useEffect(() => {
    const unsub = authService.subscribe((newUser) => {
      setUser(newUser);
    });
    return () => { unsub(); };
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    login: authService.login,
    logout: authService.logout,
    demoAccounts: DEMO_ADMINS,
  };
}
