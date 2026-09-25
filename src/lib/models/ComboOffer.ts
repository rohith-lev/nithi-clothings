import mongoose, { Schema } from "mongoose";

const comboOfferSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  productIds: { type: [String], default: [] },
  category: { type: String, default: "Nighty" },
  requiredQuantity: { type: Number, default: 3 },
  discountType: {
    type: String,
    enum: ["percentage", "fixed", "combo_price"],
    default: "combo_price",
  },
  discountValue: { type: Number, default: 298 },
  comboPrice: { type: Number, default: 1499 },
  normalTotal: { type: Number, default: 1797 },
  freeShipping: { type: Boolean, default: true },
  startDate: { type: String, default: "" },
  endDate: { type: String, default: "" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
});

const ComboOffer =
  mongoose.models.ComboOffer || mongoose.model("ComboOffer", comboOfferSchema);
export default ComboOffer;
