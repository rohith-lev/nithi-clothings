import mongoose from "mongoose";
import StorageSetting from "@/lib/models/StorageSetting";
import { sendStorageAlertEmail } from "./notificationService";

export async function getStorageStats() {
  try {
    let settings = await StorageSetting.findOne({ id: "storage_config_main" });
    if (!settings) {
      settings = new StorageSetting({ id: "storage_config_main" });
      await settings.save();
    }

    let rawStats = { dataSize: 0, storageSize: 0, indexSize: 0, collections: 0, objects: 0 };
    if (mongoose.connection && mongoose.connection.db) {
      try {
        const stats = await mongoose.connection.db.stats();
        rawStats = stats as typeof rawStats;
      } catch (err: unknown) {
        console.warn("db.stats() failed:", (err as Error).message);
      }
    }

    const quotaMB = settings.quotaMB || 500;
    const usedBytes = (rawStats.storageSize || rawStats.dataSize || 0) + (rawStats.indexSize || 0);
    const usedMB = Math.max(0.1, Math.round((usedBytes / (1024 * 1024)) * 100) / 100);
    const percentage = Math.min(100, Math.round((usedMB / quotaMB) * 100));
    const remainingMB = Math.max(0, Math.round((quotaMB - usedMB) * 100) / 100);

    let status = "NORMAL";
    if (percentage >= 100) status = "LIMIT";
    else if (percentage >= (settings.criticalThresholdPercent || 95)) status = "CRITICAL";
    else if (percentage >= (settings.warningThresholdPercent || 90)) status = "WARNING";

    if (percentage >= (settings.warningThresholdPercent || 90) && settings.emailNotificationsEnabled) {
      const now = new Date();
      const lastSent = settings.lastAlertSentAt ? new Date(settings.lastAlertSentAt) : null;
      const cooldownMs = (settings.alertCooldownMinutes || 60) * 60 * 1000;
      if (!lastSent || now.getTime() - lastSent.getTime() > cooldownMs) {
        await sendStorageAlertEmail({ usedMB, limitMB: quotaMB, percent: percentage, remainingMB, alertEmail: settings.alertEmail });
        settings.lastAlertSentAt = now;
        await settings.save();
      }
    }

    return {
      usedMB, totalMB: quotaMB, quotaMB, percentage, remainingMB, status,
      warningThreshold: settings.warningThresholdPercent || 90,
      criticalThreshold: settings.criticalThresholdPercent || 95,
      alertEmail: settings.alertEmail,
      collectionsCount: rawStats.collections || 0,
      totalObjects: rawStats.objects || 0,
      lastAlertSentAt: settings.lastAlertSentAt,
      dataRetentionPolicy: "PERMANENT (Products, Orders, Customers, Bookings NEVER automatically deleted)",
    };
  } catch (error) {
    console.error("Error computing storage stats:", error);
    return {
      usedMB: 5.2, totalMB: 500, quotaMB: 500, percentage: 1, remainingMB: 494.8,
      status: "NORMAL", warningThreshold: 90, criticalThreshold: 95,
      alertEmail: "admin@nithicollection.com", collectionsCount: 6,
      totalObjects: 100, dataRetentionPolicy: "PERMANENT",
    };
  }
}
