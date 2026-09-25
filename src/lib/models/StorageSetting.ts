import mongoose, { Schema } from "mongoose";

const StorageSettingSchema = new Schema(
  {
    id: { type: String, default: "storage_config_main", unique: true },
    quotaMB: { type: Number, default: 500 },
    warningThresholdPercent: { type: Number, default: 90 },
    criticalThresholdPercent: { type: Number, default: 95 },
    alertEmail: { type: String, default: "admin@nithicollection.com" },
    emailNotificationsEnabled: { type: Boolean, default: true },
    smtpHost: { type: String, default: process.env.SMTP_HOST || "" },
    smtpPort: { type: Number, default: Number(process.env.SMTP_PORT) || 587 },
    smtpUser: { type: String, default: process.env.SMTP_USER || "" },
    smtpPass: { type: String, default: process.env.SMTP_PASS || "" },
    smtpFrom: { type: String, default: process.env.SMTP_FROM || "no-reply@nithicollection.com" },
    whatsappApiEnabled: { type: Boolean, default: false },
    whatsappWebhookUrl: { type: String, default: "" },
    lastAlertSentAt: { type: Date, default: null },
    alertCooldownMinutes: { type: Number, default: 60 },
  },
  { timestamps: true }
);

const StorageSetting =
  mongoose.models.StorageSetting ||
  mongoose.model("StorageSetting", StorageSettingSchema);
export default StorageSetting;
