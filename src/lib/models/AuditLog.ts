import mongoose, { Schema } from "mongoose";

const auditLogSchema = new Schema({
  id: { type: String, required: true },
  timestamp: { type: String, required: true },
  adminName: { type: String, default: "Super Admin" },
  action: { type: String, required: true },
  targetType: { type: String, default: "PRODUCT" },
  targetId: { type: String, default: "" },
  targetName: { type: String, default: "" },
  oldValue: { type: String, default: "" },
  newValue: { type: String, default: "" },
  reason: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const AuditLog =
  mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
