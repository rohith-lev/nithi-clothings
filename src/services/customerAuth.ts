import { useState, useEffect } from "react";

export interface CustomerUser {
  customerId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  addressLine?: string;
  areaLocality?: string;
  city?: string;
  state?: string;
  pincode?: string;
  createdAt?: string;
}

const CUSTOMER_SESSION_KEY = "nithi_customer_session_v1";
const CUSTOMER_TOKEN_KEY = "nithi_customer_token_v1";

type CustomerAuthListener = (user: CustomerUser | null) => void;
const listeners: Set<CustomerAuthListener> = new Set();

export const customerAuthService = {
  getCurrentCustomer(): CustomerUser | null {
    if (typeof window === "undefined") return null;
    try {
      const data = localStorage.getItem(CUSTOMER_SESSION_KEY);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(CUSTOMER_TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async loginWithPhoneOrEmail(identifier: string, name?: string): Promise<{ success: boolean; customer?: CustomerUser; error?: string }> {
    const clean = identifier.trim();
    if (!clean) {
      return { success: false, error: "Please enter your mobile number or email address." };
    }

    try {
      const res = await fetch("/api/customers/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: clean, name: name?.trim() }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.success) {
        return { success: false, error: json.error || "Sign in failed. Please check your credentials." };
      }

      const customerUser: CustomerUser = json.customer;
      if (json.token) {
        localStorage.setItem(CUSTOMER_TOKEN_KEY, json.token);
      }
      localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(customerUser));
      listeners.forEach((fn) => fn(customerUser));
      return { success: true, customer: customerUser };
    } catch (e: any) {
      console.warn("API customer auth failed, falling back to local session:", e);
      const isEmail = clean.includes("@");
      const phone = !isEmail ? clean.replace(/[^0-9]/g, "") : "";
      const customerUser: CustomerUser = {
        customerId: `CUST-${phone ? phone.slice(-8) : Date.now().toString().slice(-6)}`,
        name: name || (isEmail ? clean.split("@")[0] : `Customer ${clean.slice(-4)}`),
        phone: phone,
        email: isEmail ? clean : "",
        state: "Tamil Nadu",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(customerUser));
      listeners.forEach((fn) => fn(customerUser));
      return { success: true, customer: customerUser };
    }
  },

  async updateProfile(updated: Partial<CustomerUser>): Promise<{ success: boolean; customer?: CustomerUser; error?: string }> {
    const token = this.getToken();
    try {
      const res = await fetch("/api/customers/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updated),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        return { success: false, error: json.error || "Failed to update profile." };
      }

      const merged: CustomerUser = {
        ...this.getCurrentCustomer(),
        ...json.data,
      };

      localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(merged));
      listeners.forEach((fn) => fn(merged));
      return { success: true, customer: merged };
    } catch (e: any) {
      // Local fallback
      const current = this.getCurrentCustomer();
      if (!current) return { success: false, error: "Not logged in" };
      const merged: CustomerUser = { ...current, ...updated };
      localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(merged));
      listeners.forEach((fn) => fn(merged));
      return { success: true, customer: merged };
    }
  },

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(CUSTOMER_SESSION_KEY);
      localStorage.removeItem(CUSTOMER_TOKEN_KEY);
      listeners.forEach((fn) => fn(null));
    }
  },

  subscribe(fn: CustomerAuthListener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export function useCustomerAuth() {
  const [customer, setCustomer] = useState<CustomerUser | null>(() => customerAuthService.getCurrentCustomer());

  useEffect(() => {
    const unsub = customerAuthService.subscribe((u) => setCustomer(u));
    return () => {
      unsub();
    };
  }, []);

  return {
    customer,
    isLoggedIn: !!customer,
    login: customerAuthService.loginWithPhoneOrEmail.bind(customerAuthService),
    updateProfile: customerAuthService.updateProfile.bind(customerAuthService),
    logout: customerAuthService.logout.bind(customerAuthService),
  };
}
