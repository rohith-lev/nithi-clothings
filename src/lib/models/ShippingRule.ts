import mongoose, { Schema } from "mongoose";

const shippingRuleSchema = new Schema({
  id: { type: String, required: true, unique: true },
  state: { type: String, default: "All India" },
  category: { type: String, default: "All Categories" },
  product: { type: String, default: "All Products" },
  minQty: { type: Number, default: 1 },
  maxQty: { type: Number, default: 999 },
  minOrderValue: { type: Number, default: 0 },
  paymentMethod: { type: String, default: "All" },
  shippingType: {
    type: String,
    enum: ["FREE", "FIXED", "PER_ITEM"],
    default: "FREE",
  },
  charge: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
});

const ShippingRule =
  mongoose.models.ShippingRule ||
  mongoose.model("ShippingRule", shippingRuleSchema);
export default ShippingRule;
