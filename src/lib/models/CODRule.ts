import mongoose, { Schema } from "mongoose";

const codRuleSchema = new Schema({
  id: { type: String, required: true, unique: true },
  availableStates: {
    type: [String],
    default: ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Maharashtra"],
  },
  minQuantity: { type: Number, default: 1 },
  shippingCharge: { type: Number, default: 70 },
  freeShippingThreshold: { type: Number, default: 1500 },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

const codAdvanceRuleSchema = new Schema({
  id: { type: String, required: true, unique: true },
  category: { type: String, default: "Nighty" },
  quantityRange: { type: String, default: "1 - 3" },
  minQty: { type: Number, default: 1 },
  maxQty: { type: Number, default: 3 },
  advanceAmount: { type: Number, default: 100 },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

export const CODRule =
  mongoose.models.CODRule || mongoose.model("CODRule", codRuleSchema);
export const CODAdvanceRule =
  mongoose.models.CODAdvanceRule ||
  mongoose.model("CODAdvanceRule", codAdvanceRuleSchema);
