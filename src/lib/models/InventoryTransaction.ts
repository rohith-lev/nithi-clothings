import mongoose, { Schema } from "mongoose";

const inventoryTransactionSchema = new Schema({
  id: { type: String, required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  date: { type: String, required: true },
  action: {
    type: String,
    enum: ["ADD", "REMOVE", "SET", "ORDER_RESERVED", "ORDER_FULFILLED"],
    required: true,
  },
  quantity: { type: Number, required: true },
  previousStock: { type: Number, required: true },
  newStock: { type: Number, required: true },
  reason: { type: String, default: "" },
  changedBy: { type: String, default: "Super Admin" },
  createdAt: { type: Date, default: Date.now },
});

const InventoryTransaction =
  mongoose.models.InventoryTransaction ||
  mongoose.model("InventoryTransaction", inventoryTransactionSchema);
export default InventoryTransaction;
