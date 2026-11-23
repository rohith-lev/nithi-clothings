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
  totalOrders?: number;
  totalSpent?: number;
  creditPoints?: number;
  spendMilestoneTarget?: number;
  assignedGifts?: Array<{
    id: string;
    title: string;
    description?: string;
    couponCode?: string;
    value?: number;
    status: string;
    assignedAt: string;
    assignedBy?: string;
    notes?: string;
  }>;
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

  async loginWithPhoneOrEmail(
    identifier: string,
    password?: string,
    name?: string,
    extra?: { phone?: string; email?: string }
  ): Promise<{ success: boolean; customer?: CustomerUser; error?: string }> {
    const clean = identifier?.trim() || "";
    const phone = (extra?.phone || (!clean.includes("@") ? clean : "")).replace(/[^0-9]/g, "").slice(-10);
    const email = (extra?.email || (clean.includes("@") ? clean : "")).trim().toLowerCase();

    if (!clean && !phone && !email) {
      return { success: false, error: "Please enter your mobile number or email address." };
    }

    try {
      const res = await fetch("/api/customers/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: clean || phone || email,
          phone,
          email,
          password: password?.trim() || "",
          name: name?.trim(),
        }),
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
      const isEmail = clean.includes("@") || Boolean(email);
      const finalPhone = phone || (!isEmail ? clean.replace(/[^0-9]/g, "") : "");
      const customerUser: CustomerUser = {
        customerId: `CUST-${finalPhone ? finalPhone.slice(-8) : Date.now().toString().slice(-6)}`,
        name: name || (isEmail ? (email || clean).split("@")[0] : `Customer ${finalPhone.slice(-4)}`),
        phone: finalPhone,
        email: email || (isEmail ? clean : ""),
        state: "Tamil Nadu",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(customerUser));
      listeners.forEach((fn) => fn(customerUser));
      return { success: true, customer: customerUser };
    }
  },

  async forgotPassword(emailOrPhone: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch("/api/customers/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "forgot-password", identifier: emailOrPhone.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        return { success: false, error: json.error || "Failed to send reset OTP." };
      }
      return { success: true, message: json.message };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to connect to authentication server." };
    }
  },

  async resetPassword(
    identifier: string,
    otp: string,
    newPassword: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch("/api/customers/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset-password",
          identifier: identifier.trim(),
          otp: otp.trim(),
          newPassword,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.success) {
        return { success: false, error: json.error || "Failed to reset password." };
      }
      return { success: true, message: json.message };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to connect to authentication server." };
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
    forgotPassword: customerAuthService.forgotPassword.bind(customerAuthService),
    resetPassword: customerAuthService.resetPassword.bind(customerAuthService),
    updateProfile: customerAuthService.updateProfile.bind(customerAuthService),
    logout: customerAuthService.logout.bind(customerAuthService),
  };
}
