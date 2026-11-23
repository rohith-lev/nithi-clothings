import mongoose, { Schema } from "mongoose";

const AssignedGiftSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    couponCode: { type: String, default: "" },
    value: { type: Number, default: 0 },
    status: { type: String, enum: ["ACTIVE", "REDEEMED", "EXPIRED"], default: "ACTIVE" },
    assignedAt: { type: Date, default: Date.now },
    assignedBy: { type: String, default: "Super Admin" },
    notes: { type: String, default: "" },
  },
  { _id: false }
);

const CustomerSchema = new Schema(
  {
    customerId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    addressLine: { type: String, default: "" },
    areaLocality: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    creditPoints: { type: Number, default: 0 },
    spendMilestoneTarget: { type: Number, default: 25000 },
    assignedGifts: { type: [AssignedGiftSchema], default: [] },
    registrationDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["ACTIVE", "INACTIVE", "BLOCKED"], default: "ACTIVE" },
    notes: { type: String, default: "" },
    passwordHash: { type: String, default: "" },
    resetOtp: { type: String, default: "" },
    resetOtpExpires: { type: Date },
  },
  { timestamps: true }
);

const Customer = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
export default Customer;
