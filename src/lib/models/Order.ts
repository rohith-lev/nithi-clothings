import mongoose, { Schema } from "mongoose";

const OrderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    sku: { type: String, default: "" },
    selectedColor: { type: String, default: "Standard" },
    selectedSize: { type: String, default: "Free Size" },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    customerId: { type: String, default: "" },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, default: "" },
    shippingAddress: { type: String, required: true },
    shippingCity: { type: String, default: "" },
    shippingState: { type: String, default: "Tamil Nadu" },
    shippingPincode: { type: String, default: "" },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["COD", "cod", "Online", "ONLINE", "online", "UPI", "upi", "CARD", "card"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "pending", "Paid", "paid", "Failed", "failed", "Refunded", "refunded", "Advance_Paid", "advance_paid"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Processing", "Packed", "Shipped", "Delivered", "Cancelled", "Returned"],
      default: "Pending",
      index: true,
    },
    paymentReference: { type: String, default: "" },
    idempotencyKey: { type: String, default: "", index: true },
    invoiceNumber: { type: String, default: "" },
    notes: { type: String, default: "" },
    emailNotificationStatus: {
      type: String,
      enum: ["Sent", "Failed", "Pending", "Skipped"],
      default: "Pending",
    },
    whatsappNotificationStatus: {
      type: String,
      enum: ["Sent", "Failed", "Pending", "Skipped"],
      default: "Skipped",
    },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;
