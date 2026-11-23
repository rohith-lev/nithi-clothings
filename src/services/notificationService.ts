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

// ── Password Reset OTP Email (to Customer) ────────────────────────────────────
export async function sendPasswordResetOtpEmail({
  email,
  name,
  otp,
}: {
  email: string;
  name?: string;
  otp: string;
}) {
  try {
    const transporter = await getTransporter();
    const fromEmail = process.env.SMTP_FROM || "no-reply@nithicollections.com";
    const subject = `Your Password Reset OTP - Nithi Collections`;
    const text = `Hello ${name || "Customer"},\n\nYour One-Time Password (OTP) for password recovery at Nithi Collections is: ${otp}\n\nThis OTP is valid for 15 minutes. Do not share this code with anyone.\n\nWarm regards,\nNithi Collections`;
    const html = `
<div style="font-family:Arial,sans-serif;max-width:550px;margin:0 auto;border:1px solid #E8E2D5;border-radius:16px;overflow:hidden;background:#FDFBF7;">
  <div style="background:#064E3B;padding:24px;text-align:center;border-bottom:3px solid #C9A227;">
    <h1 style="color:#C9A227;margin:0;font-size:22px;letter-spacing:1px;">NITHI COLLECTIONS</h1>
    <p style="color:#FAF8F1;margin:6px 0 0;font-size:12px;">Customer Account Security</p>
  </div>
  <div style="padding:28px 24px;color:#171A18;">
    <h2 style="font-size:18px;color:#064E3B;margin-top:0;">Password Recovery Code</h2>
    <p style="font-size:13px;line-height:1.6;color:#5C635E;">
      Hello <strong>${name || "Customer"}</strong>, we received a request to reset your password for your Nithi Collections account. Please enter the verification code below:
    </p>
    <div style="text-align:center;margin:28px 0;">
      <div style="display:inline-block;padding:14px 28px;background:#FAF8F1;border:2px dashed #C9A227;border-radius:12px;">
        <span style="font-family:monospace;font-size:32px;font-weight:bold;letter-spacing:8px;color:#064E3B;">${otp}</span>
      </div>
      <p style="font-size:11px;color:#8A7060;margin-top:8px;">Valid for 15 minutes</p>
    </div>
    <p style="font-size:12px;color:#5C635E;line-height:1.5;">
      If you did not request this code, you can safely ignore this email. Your account remains secure.
    </p>
  </div>
  <div style="background:#FAF8F1;padding:16px;text-align:center;font-size:11px;color:#5C635E;border-top:1px solid #E8E2D5;">
    &copy; ${new Date().getFullYear()} Nithi Collections. Athani, Anthiyur – 638502, Tamil Nadu.
  </div>
</div>`;

    await (transporter as any).sendMail({
      from: `"Nithi Collections" <${fromEmail}>`,
      to: email,
      subject,
      text,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("[SMTP] Password reset OTP send failed:", error);
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
        <th style="text-align:left;padding-bottom:6px;">Product</th>
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
  paymentStatus?: string;
  shippingAddress?: string;
  shippingState?: string;
  shippingPincode?: string;
  items?: Array<{
    productName?: string;
    name?: string;
    selectedType?: string;
    selectedSize?: string;
    selectedColor?: string;
    quantity: number;
    price?: number;
    finalPrice?: number;
  }>;
}) {
  const apiToken = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const businessNumber = process.env.ADMIN_WHATSAPP_NUMBER || "918122436850";

  // Build enriched item list: product, product type, size, quantity, amount
  const itemsSummary = (order.items && order.items.length > 0)
    ? order.items
        .map((it, idx) => {
          const name = it.productName || it.name || "Product";
          const type = it.selectedType ? ` (${it.selectedType})` : "";
          const size = it.selectedSize ? ` [Size: ${it.selectedSize}]` : "";
          const price = it.finalPrice || it.price || 0;
          const lineTotal = price * (it.quantity || 1);
          return `${idx + 1}. ${name}${type}${size} - Qty: ${it.quantity} - ₹${lineTotal.toLocaleString("en-IN")}`;
        })
        .join("\n")
    : "No item details available";

  const paymentStatus = order.paymentStatus || (order.paymentMethod === "COD" ? "Pending (Cash On Delivery)" : "Verified Paid");

  const messageBody = [
    `🛍️ *NEW ORDER RECEIVED — NITHI COLLECTIONS*`,
    ``,
    `*Order ID:* #${order.orderId}`,
    `*Customer Name:* ${order.customerName || "Customer"}`,
    `*Customer Phone:* ${order.customerPhone || "-"}`,
    ``,
    `*Ordered Items:*`,
    itemsSummary,
    ``,
    `*Total Amount:* ₹${(order.total || 0).toLocaleString("en-IN")}`,
    `*Payment Method:* ${order.paymentMethod || "COD"}`,
    `*Payment Status:* ${paymentStatus}`,
    ``,
    order.shippingAddress ? `*Shipping Address:* ${order.shippingAddress}, ${order.shippingState || ""} ${order.shippingPincode || ""}` : "",
  ].filter(Boolean).join("\n");

  // Also check DB settings
  try {
    const settings = await StorageSetting.findOne({ id: "storage_config_main" }).lean();
    if (settings && settings.whatsappApiEnabled && settings.whatsappWebhookUrl) {
      // Legacy webhook mode
      console.log(`[WHATSAPP] Order #${order.orderId} dispatched to webhook: ${settings.whatsappWebhookUrl}`);
      try {
        await fetch(settings.whatsappWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.orderId, message: messageBody, order }),
        });
      } catch (err: any) {
        console.warn("[WHATSAPP Webhook] dispatch error:", err.message);
      }
      return { success: true, status: "Sent via Webhook" };
    }
  } catch {}

  // Meta Cloud API mode
  if (!apiToken || !phoneNumberId) {
    console.log(`[WHATSAPP] Business notification logged for #${order.orderId} (recipient: ${businessNumber}):\n${messageBody}`);
    return { success: true, status: "Logged (Meta WhatsApp API credentials not set in env)" };
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
          to: businessNumber.replace(/[^0-9]/g, ""),
          type: "text",
          text: {
            body: messageBody,
          },
        }),
      }
    );

    if (res.ok) {
      console.log(`[WHATSAPP] ✅ Order notification successfully delivered for order #${order.orderId}`);
      return { success: true, status: "Sent via Meta Cloud API" };
    } else {
      const err = await res.json().catch(() => ({}));
      console.warn(`[WHATSAPP] API returned error:`, err);
      return { success: false, status: "API Error", error: JSON.stringify(err) };
    }
  } catch (e) {
    console.error("[WHATSAPP] Notification exception:", (e as Error).message);
    return { success: false, error: (e as Error).message };
  }
}

// ── Shared WhatsApp Direct Dispatch Helper ────────────────────────────────────
async function dispatchWhatsAppMessage(toPhone: string, bodyText: string, label: string) {
  const cleanPhone = toPhone.replace(/[^0-9]/g, "");
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  if (!formattedPhone || formattedPhone.length < 10) {
    console.warn(`[WHATSAPP] Cannot send ${label}: Invalid phone number "${toPhone}"`);
    return { success: false, reason: "Invalid phone number" };
  }

  // 1. StorageSetting webhook if configured
  try {
    const settings = await StorageSetting.findOne({ id: "storage_config_main" }).lean();
    if (settings && settings.whatsappApiEnabled && settings.whatsappWebhookUrl) {
      console.log(`[WHATSAPP] ${label} dispatched to webhook: ${settings.whatsappWebhookUrl}`);
      try {
        await fetch(settings.whatsappWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: formattedPhone, message: bodyText, label }),
        });
      } catch (err: any) {
        console.warn("[WHATSAPP Webhook] dispatch error:", err.message);
      }
      return { success: true, status: "Sent via Webhook" };
    }
  } catch {}

  // 2. Meta Cloud API mode
  const apiToken = process.env.WHATSAPP_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!apiToken || !phoneNumberId) {
    console.log(`\n💬 [WHATSAPP ${label}] To: +${formattedPhone}\n${bodyText}\n`);
    return { success: true, status: "Logged (Meta WhatsApp API credentials not set in env)" };
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
          to: formattedPhone,
          type: "text",
          text: { body: bodyText },
        }),
      }
    );

    if (res.ok) {
      console.log(`[WHATSAPP] ✅ ${label} successfully delivered to +${formattedPhone}`);
      return { success: true, status: "Sent via Meta Cloud API" };
    } else {
      const err = await res.json().catch(() => ({}));
      console.warn(`[WHATSAPP] API returned error for ${label}:`, err);
      return { success: false, status: "API Error", error: JSON.stringify(err) };
    }
  } catch (e) {
    console.error(`[WHATSAPP] ${label} exception:`, (e as Error).message);
    return { success: false, error: (e as Error).message };
  }
}

// ── Customer Order Confirmation WhatsApp Notification ─────────────────────────
export async function sendCustomerOrderWhatsAppNotification(order: {
  orderId: string;
  customerName?: string;
  customerPhone?: string;
  subtotal?: number;
  cgst?: number;
  sgst?: number;
  tax?: number;
  total?: number;
  shippingFee?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  codAdvanceAmount?: number;
  balanceOnDelivery?: number;
  shippingAddress?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingPincode?: string;
  items?: Array<{
    productName?: string;
    name?: string;
    selectedType?: string;
    selectedSize?: string;
    quantity: number;
    price?: number;
    finalPrice?: number;
  }>;
}) {
  const phone = order.customerPhone || "";
  if (!phone) return { success: false, reason: "No customer phone provided" };

  const itemsList = (order.items && order.items.length > 0)
    ? order.items
        .map((it, idx) => {
          const name = it.productName || it.name || "Product";
          const type = it.selectedType ? ` (${it.selectedType})` : "";
          const size = it.selectedSize ? ` [${it.selectedSize}]` : "";
          const price = it.finalPrice || it.price || 0;
          return `  ${idx + 1}. ${name}${type}${size} × ${it.quantity} (₹${(price * it.quantity).toLocaleString("en-IN")})`;
        })
        .join("\n")
    : "  1. Handcrafted Garment Collection";

  const isCOD = (order.paymentMethod || "").toUpperCase() === "COD";
  let paymentText = `*Payment Method:* ${order.paymentMethod || "COD"} (${order.paymentStatus || "Confirmed"})`;
  if (isCOD && order.codAdvanceAmount && order.codAdvanceAmount > 0) {
    paymentText += `\n*10% Advance Paid/Booking:* ₹${order.codAdvanceAmount.toLocaleString("en-IN")}\n*Balance on Delivery:* ₹${(order.balanceOnDelivery ?? Math.max(0, (order.total || 0) - order.codAdvanceAmount)).toLocaleString("en-IN")}`;
  }

  const cgstVal = order.cgst !== undefined ? order.cgst : Math.round(((order.subtotal || order.total || 0) * 0.025));
  const sgstVal = order.sgst !== undefined ? order.sgst : Math.round(((order.subtotal || order.total || 0) * 0.025));

  const message = [
    `🛍️ *ORDER CONFIRMED — NITHI COLLECTIONS*`,
    ``,
    `Dear *${order.customerName || "Customer"}*,`,
    `Thank you for shopping with Nithi Collections! Your order has been placed successfully.`,
    ``,
    `*Order ID:* #${order.orderId}`,
    `*Items:*`,
    itemsList,
    ``,
    `*Price Breakdown:*`,
    `  • Subtotal: ₹${(order.subtotal || order.total || 0).toLocaleString("en-IN")}`,
    `  • CGST (2.5%): ₹${cgstVal.toLocaleString("en-IN")}`,
    `  • SGST (2.5%): ₹${sgstVal.toLocaleString("en-IN")}`,
    `  • Delivery: FREE (Complimentary)`,
    `*Total Order Amount:* ₹${(order.total || 0).toLocaleString("en-IN")}`,
    paymentText,
    ``,
    order.shippingAddress ? `*Delivery Address:* ${order.shippingAddress}${order.shippingCity ? `, ${order.shippingCity}` : ""}${order.shippingState ? `, ${order.shippingState}` : ""}${order.shippingPincode ? ` - ${order.shippingPincode}` : ""}` : "",
    ``,
    `📦 We will send you another WhatsApp message with your ST Courier tracking AWB number as soon as your parcel is dispatched.`,
    ``,
    `For any assistance, reply directly to this message or call us at 8122436850 / 9345136762.`,
  ].filter(Boolean).join("\n");

  return dispatchWhatsAppMessage(phone, message, `Customer Order #${order.orderId}`);
}

// ── Customer Courier Tracking WhatsApp Notification ───────────────────────────
export async function sendCustomerTrackingWhatsAppNotification(order: {
  orderId: string;
  customerName?: string;
  customerPhone?: string;
  courierName?: string;
  trackingId?: string;
  stCourierTrackingId?: string;
  trackingUrl?: string;
  shippingCity?: string;
  shippingState?: string;
}) {
  const phone = order.customerPhone || "";
  if (!phone) return { success: false, reason: "No customer phone provided" };
  const awb = (order.stCourierTrackingId || order.trackingId || "").trim();
  if (!awb) return { success: false, reason: "No tracking ID provided" };

  const courier = order.courierName || "ST Courier";
  const isST = courier.toLowerCase().includes("st");
  const trackingLink = order.trackingUrl || (isST
    ? `https://stcourier.com/track-consignment?awb=${encodeURIComponent(awb)}`
    : `https://www.google.com/search?q=${encodeURIComponent(`${courier} tracking ${awb}`)}`);

  const message = [
    `🚚 *YOUR ORDER HAS BEEN DISPATCHED! — NITHI COLLECTIONS*`,
    ``,
    `Dear *${order.customerName || "Customer"}*,`,
    `Exciting news! Your order *#${order.orderId}* is on its way to you.`,
    ``,
    `📦 *Courier Partner:* ${courier}`,
    `🔢 *ST Courier AWB / Tracking ID:* ${awb}`,
    `🔗 *Track ST Courier Parcel:* ${trackingLink}`,
    ``,
    `⏱️ Expected delivery within 2–4 business days across Tamil Nadu & South India.`,
    ``,
    `Thank you for choosing Nithi Collections!`,
    `Questions? Contact us at 8122436850 / 9345136762.`,
  ].join("\n");

  return dispatchWhatsAppMessage(phone, message, `Tracking #${order.orderId}`);
}
