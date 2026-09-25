import { useState, useEffect } from "react";

export interface CustomerUser {
  customerId: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  createdAt?: string;
}

const CUSTOMER_SESSION_KEY = "nithi_customer_session_v1";

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

  async loginWithPhoneOrEmail(identifier: string, name?: string): Promise<{ success: boolean; customer?: CustomerUser; error?: string }> {
    const clean = identifier.trim();
    if (!clean) {
      return { success: false, error: "Please enter your mobile number or email address." };
    }

    try {
      // Look up customer in MongoDB / API
      const res = await fetch(`/api/customers?search=${encodeURIComponent(clean)}`);
      const json = await res.json();

      let matchedCust: any = null;
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        matchedCust = json.data[0];
      }

      const isEmail = clean.includes("@");
      const phone = !isEmail ? clean.replace(/[^0-9]/g, "") : (matchedCust?.phone || "");
      const email = isEmail ? clean.toLowerCase() : (matchedCust?.email || "");
      const custName = name || matchedCust?.name || (isEmail ? clean.split("@")[0] : `Customer ${clean.slice(-4)}`);
      const customerId = matchedCust?.customerId || `CUST-${phone ? phone.slice(-8) : Date.now().toString().slice(-6)}`;

      const customerUser: CustomerUser = {
        customerId,
        name: custName,
        phone: phone || matchedCust?.phone || "",
        email: email || matchedCust?.email || "",
        address: matchedCust?.address || "",
        city: matchedCust?.city || "",
        state: matchedCust?.state || "Tamil Nadu",
        pincode: matchedCust?.pincode || "",
        createdAt: matchedCust?.registrationDate || new Date().toISOString(),
      };

      localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(customerUser));
      listeners.forEach((fn) => fn(customerUser));
      return { success: true, customer: customerUser };
    } catch (e) {
      console.warn("API customer search failed, falling back to local session:", e);
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

  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(CUSTOMER_SESSION_KEY);
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
    login: customerAuthService.loginWithPhoneOrEmail,
    logout: customerAuthService.logout,
  };
}
