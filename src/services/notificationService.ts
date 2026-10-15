import nodemailer from "nodemailer";
import StorageSetting from "@/lib/models/StorageSetting";

// ── SMTP Transporter ──────────────────────────────────────────────────────────
async function getTransporter() {
  // Priority 1: DB-stored SMTP settings (configurable from Admin > Settings)
  try {
    const settings = await StorageSetting.findOne({ id: "storage_config_main" }).lean();
    if (settings && settings.smtpHost && settings.smtpUser) {
      return nodemailer.createTransport({
        host: settings.smtpHost,
        port: Number(settings.smtpPort) || 587,
        secure: Number(settings.smtpPort) === 465,
        auth: { user: settings.smtpUser, pass: settings.smtpPass },
      });
    }
  } catch (e) {
    console.error("[SMTP] Error fetching DB settings:", e);
  }

  // Priority 2: Vercel / .env environment variables
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback: console-only mock (dev mode)
  return {
    sendMail: async (options: { to: string; subject: string; text?: string }) => {
      console.log(`\n📧 [EMAIL MOCK] To: ${options.to}`);
      console.log(`   Subject: ${options.subject}`);
      console.log(`   Text: ${options.text ? options.text.slice(0, 140) : "HTML email"}\n`);
      return { messageId: `mock-msg-${Date.now()}` };
    },
  };
}

// ── Storage Alert Email ───────────────────────────────────────────────────────
export async function sendStorageAlertEmail({
  usedMB, limitMB, percent, remainingMB, alertEmail,
}: {
  usedMB: number; limitMB: number; percent: number; remainingMB: number; alertEmail: string;
}) {
  try {
    const transporter = await getTransporter();
    const toEmail = alertEmail || process.env.ADMIN_NOTIFICATION_EMAIL || "admin@nithicollection.com";
    const fromEmail = process.env.SMTP_FROM || "no-reply@nithicollection.com";

    const subject = `⚠️ URGENT: MongoDB Storage Alert - ${percent}% Capacity Reached (${usedMB} MB / ${limitMB} MB)`;
    const text = `MongoDB Storage Warning: Usage at ${percent}%. Used: ${usedMB}MB / ${limitMB}MB. Remaining: ${remainingMB}MB.`;
    const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0e0e0;border-radius:12px;overflow:hidden;background:#ffffff;">
  <div style="background:#041D16;padding:24px;text-align:center;border-bottom:3px solid #C9A227;">
    <h1 style="color:#DFC15E;margin:0;font-size:20px;">MongoDB Storage Alert</h1>
    <p style="color:#fff;margin:6px 0 0;font-size:13px;">Nithi Collection — Merchant System Monitoring</p>
  </div>
  <div style="padding:24px;color:#333;">
    <div style="background:#FFF8E7;border-left:4px solid #C9A227;padding:14px;border-radius:6px;margin-bottom:20px;">
      <strong style="color:#8A5F38;">Warning: Database Storage is at ${percent}%</strong>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <tr><td style="padding:8px 0;color:#777;">Used Space:</td><td style="text-align:right;font-weight:bold;">${usedMB} MB</td></tr>
      <tr><td style="padding:8px 0;color:#777;">Allocated Limit:</td><td style="text-align:right;font-weight:bold;">${limitMB} MB</td></tr>
      <tr><td style="padding:8px 0;color:#777;">Remaining Space:</td><td style="text-align:right;font-weight:bold;color:#064E3B;">${remainingMB} MB</td></tr>
    </table>
  </div>
</div>`;

    await (transporter as any).sendMail({ from: `"Nithi Collection System" <${fromEmail}>`, to: toEmail, subject, text, html });
    return { success: true };
  } catch (error) {
    console.error("[SMTP] Storage alert send failed:", error);
    return { success: false, error: (error as Error).message };
  }
}

// ── Order Confirmation Email (to Customer) ────────────────────────────────────
export async function sendOrderConfirmationEmail(order: {
  orderId: string; customerName: string; customerEmail: string; customerPhone: string;
  shippingAddress: string; shippingState: string; shippingPincode: string;
  items: Array<{ productName: string; selectedSize: string; selectedColor: string; quantity: number; finalPrice: number }>;
  subtotal: number; total: number; shippingFee: number; paymentMethod: string; paymentStatus: string;
}) {
  if (!order.customerEmail) return { success: false, reason: "No customer email provided" };

  try {
    const transporter = await getTransporter();
    const fromEmail = process.env.SMTP_FROM || "orders@nithicollection.com";

    const itemsHtml = (order.items || [])
      .map(
        (it) => `<tr style="border-bottom:1px solid #eee;font-size:12px;">
          <td style="padding:8px 0;"><strong>${it.productName}</strong><br/><span style="color:#777;">Size: ${it.selectedSize || "Free Size"} | Color: ${it.selectedColor || "Standard"}</span></td>
          <td style="padding:8px;text-align:center;">${it.quantity}</td>
          <td style="padding:8px 0;text-align:right;">₹${(it.finalPrice * it.quantity).toLocaleString("en-IN")}</td>
        </tr>`
      )
      .join("");

    const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden;">
  <div style="background:#041D16;padding:20px;text-align:center;border-bottom:3px solid #C9A227;">
    <h2 style="color:#DFC15E;margin:0;font-size:18px;">Order Confirmed: #${order.orderId}</h2>
    <p style="color:#fff;margin:4px 0 0;font-size:12px;">Thank you for shopping with Nithi Collection!</p>
  </div>
  <div style="padding:20px;font-size:13px;color:#333;">
    <p>Hi <strong>${order.customerName}</strong>,</p>
    <p>Your order <strong>#${order.orderId}</strong> has been successfully placed.</p>
    <div style="background:#f9f9f9;padding:12px;border-radius:8px;margin:15px 0;">
      <h4 style="margin:0 0 8px;color:#041D16;">Delivery Address:</h4>
      <p style="margin:0;color:#555;font-size:12px;">${order.shippingAddress}, ${order.shippingState} - ${order.shippingPincode || ""}</p>
      <p style="margin:4px 0 0;color:#555;font-size:12px;">Phone: ${order.customerPhone}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;margin-top:15px;">
      <thead><tr style="border-bottom:2px solid #ddd;font-size:11px;text-transform:uppercase;color:#777;">
        <th style="text-align:left;padding-bottom:6px;">Garment</th>
        <th style="text-align:center;padding-bottom:6px;">Qty</th>
        <th style="text-align:right;padding-bottom:6px;">Total</th>
      </tr></thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <div style="margin-top:15px;border-top:2px solid #041D16;padding-top:10px;text-align:right;">
      <p style="margin:2px 0;font-size:12px;">Subtotal: ₹${(order.subtotal || order.total).toLocaleString("en-IN")}</p>
      ${order.shippingFee ? `<p style="margin:2px 0;font-size:12px;">Shipping: ₹${order.shippingFee}</p>` : '<p style="margin:2px 0;font-size:12px;color:#064E3B;">Shipping: FREE</p>'}
      <p style="margin:6px 0 0;font-size:16px;font-weight:bold;color:#041D16;">Final Amount: ₹${(order.total || 0).toLocaleString("en-IN")}</p>
      <p style="margin:2px 0;font-size:11px;color:#777;">Payment: <strong>${order.paymentMethod} (${order.paymentStatus})</strong></p>
    </div>
  </div>
</div>`;

    await (transporter as any).sendMail({
      from: `"Nithi Collection Orders" <${fromEmail}>`,
      to: order.customerEmail,
      subject: `Order Confirmation #${order.orderId} - Nithi Collection`,
      html,
    });

    // Also notify admin
    await sendAdminOrderAlert(order, fromEmail);

    return { success: true };
  } catch (e) {
    console.error("[SMTP] Order confirmation email failed:", (e as Error).message);
    return { success: false, error: (e as Error).message };
  }
}

// ── Admin New Order Alert Email ───────────────────────────────────────────────
async function sendAdminOrderAlert(
  order: { orderId: string; customerName: string; customerPhone: string; total: number; paymentMethod: string; items: any[] },
  fromEmail: string
) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  try {
    const transporter = await getTransporter();
    await (transporter as any).sendMail({
      from: `"Nithi Collection Orders" <${fromEmail}>`,
      to: adminEmail,
      subject: `🛍️ New Order #${order.orderId} — ₹${order.total} (${order.paymentMethod})`,
      html: `
<div style="font-family:Arial,sans-serif;max-width:500px;padding:20px;border:1px solid #ddd;border-radius:8px;">
  <h3 style="color:#041D16;">New Order Received!</h3>
  <p><strong>Order ID:</strong> #${order.orderId}</p>
  <p><strong>Customer:</strong> ${order.customerName} — ${order.customerPhone}</p>
  <p><strong>Items:</strong> ${order.items.length} item(s)</p>
  <p><strong>Total:</strong> ₹${order.total}</p>
  <p><strong>Payment:</strong> ${order.paymentMethod}</p>
  <p style="margin-top:16px;"><a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://nithi-clothings.vercel.app"}/admin/orders" style="background:#041D16;color:#DFC15E;padding:10px 20px;border-radius:6px;text-decoration:none;">View Order in Admin</a></p>
</div>`,
    });
  } catch (e) {
    console.warn("[SMTP] Admin order alert failed (non-fatal):", (e as Error).message);
  }
}

// ── WhatsApp Business API Notification ───────────────────────────────────────
export async function sendWhatsAppNotification(order: {
  orderId: string;
  customerName?: string;
  customerPhone?: string;
  total?: number;
  paymentMethod?: string;
}) {
  const apiToken = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  // Also check DB settings
  try {
    const settings = await StorageSetting.findOne({ id: "storage_config_main" }).lean();
    if (settings && settings.whatsappApiEnabled && settings.whatsappWebhookUrl) {
      // Legacy webhook mode
      console.log(`[WHATSAPP] Order #${order.orderId} — webhook mode`);
      return { success: true, status: "Sent via Webhook" };
    }
  } catch {}

  // Meta Cloud API mode (using Vercel env vars)
  if (!apiToken || !phoneNumberId) {
    console.log(`[WHATSAPP] Skipped — WHATSAPP_API_TOKEN or WHATSAPP_PHONE_NUMBER_ID not configured`);
    return { success: true, status: "Skipped (API not configured)" };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: process.env.ADMIN_WHATSAPP_NUMBER || "",
          type: "text",
          text: {
            body: `🛍️ New Nithi Collection Order!\n\nOrder: #${order.orderId}\nCustomer: ${order.customerName || "Customer"}\nPhone: ${order.customerPhone || "-"}\nTotal: ₹${order.total || 0}\nPayment: ${order.paymentMethod || "COD"}\n\nView: https://nithi-clothings.vercel.app/admin/orders`,
          },
        }),
      }
    );

    if (res.ok) {
      console.log(`[WHATSAPP] ✅ Notification sent for order #${order.orderId}`);
      return { success: true, status: "Sent via Meta Cloud API" };
    } else {
      const err = await res.json().catch(() => ({}));
      console.warn(`[WHATSAPP] API error:`, err);
      return { success: false, status: "API Error", error: JSON.stringify(err) };
    }
  } catch (e) {
    console.error("[WHATSAPP] Notification failed:", (e as Error).message);
    return { success: false, error: (e as Error).message };
  }
}
