import mongoose, { Schema } from "mongoose";

const CustomerSchema = new Schema(
  {
    customerId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    registrationDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["ACTIVE", "INACTIVE", "BLOCKED"], default: "ACTIVE" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const Customer = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);
export default Customer;
