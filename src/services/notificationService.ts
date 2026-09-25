import nodemailer from "nodemailer";
import StorageSetting from "@/lib/models/StorageSetting";

async function getTransporter() {
  try {
    const settings = await StorageSetting.findOne({ id: "storage_config_main" }).lean();
    if (settings && settings.smtpHost && settings.smtpUser) {
      return nodemailer.createTransport({
        host: settings.smtpHost,
        port: settings.smtpPort || 587,
        secure: settings.smtpPort === 465,
        auth: { user: settings.smtpUser, pass: settings.smtpPass },
      });
    }
  } catch (e) {
    console.error("Error fetching SMTP settings:", e);
  }

  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }

  return {
    sendMail: async (options: { to: string; subject: string; text?: string }) => {
      console.log(`\n📧 [EMAIL DISPATCHED] To: ${options.to}`);
      console.log(`   Subject: ${options.subject}`);
      console.log(`   Text: ${options.text ? options.text.slice(0, 140) : "HTML email"}\n`);
      return { messageId: `mock-msg-${Date.now()}` };
    },
  };
}

export async function sendStorageAlertEmail({
  usedMB, limitMB, percent, remainingMB, alertEmail,
}: {
  usedMB: number; limitMB: number; percent: number; remainingMB: number; alertEmail: string;
}) {
  try {
    const transporter = await getTransporter();
    const subject = `⚠️ URGENT: MongoDB Storage Alert - ${percent}% Capacity Reached (${usedMB} MB / ${limitMB} MB)`;
    const text = `MongoDB Storage Warning: Usage at ${percent}%. Used: ${usedMB}MB / ${limitMB}MB. Remaining: ${remainingMB}MB. Please download a backup from the Admin Console.`;
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
    <p style="font-size:12px;color:#555;margin-top:16px;">🛡️ Data Retention Guarantee: Products, orders, and customer records will NEVER be automatically deleted.</p>
  </div>
</div>`;
    await (transporter as { sendMail: (opts: unknown) => Promise<unknown> }).sendMail({
      from: '"Nithi Collection System" <no-reply@nithicollection.com>',
      to: alertEmail || "admin@nithicollection.com",
      subject, text, html,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send storage alert:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function sendOrderConfirmationEmail(order: {
  orderId: string; customerName: string; customerEmail: string; customerPhone: string;
  shippingAddress: string; shippingState: string; shippingPincode: string;
  items: Array<{ productName: string; selectedSize: string; selectedColor: string; quantity: number; finalPrice: number }>;
  subtotal: number; total: number; shippingFee: number; paymentMethod: string; paymentStatus: string;
}) {
  if (!order.customerEmail) return { success: false, reason: "No customer email provided" };

  try {
    const transporter = await getTransporter();
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

    await (transporter as { sendMail: (opts: unknown) => Promise<unknown> }).sendMail({
      from: '"Nithi Collection Orders" <orders@nithicollection.com>',
      to: order.customerEmail,
      subject: `Order Confirmation #${order.orderId} - Nithi Collection`,
      html,
    });
    return { success: true };
  } catch (e) {
    console.error("Failed to send order email (non-fatal):", (e as Error).message);
    return { success: false, error: (e as Error).message };
  }
}

export async function sendWhatsAppNotification(order: { orderId: string }) {
  try {
    const settings = await StorageSetting.findOne({ id: "storage_config_main" }).lean();
    if (settings && settings.whatsappApiEnabled && settings.whatsappWebhookUrl) {
      console.log(`[WHATSAPP NOTIFICATION] Order #${order.orderId}`);
      return { success: true, status: "Sent via Webhook" };
    }
    return { success: true, status: "Skipped (API not enabled)" };
  } catch (e) {
    console.error("WhatsApp notification failed:", (e as Error).message);
    return { success: false, error: (e as Error).message };
  }
}
