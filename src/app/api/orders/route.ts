import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import Customer from "@/lib/models/Customer";
import InventoryTransaction from "@/lib/models/InventoryTransaction";
import { sendOrderConfirmationEmail, sendWhatsAppNotification } from "@/services/notificationService";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const filter: Record<string, unknown> = {};
    if (status && status !== "All") filter.orderStatus = status;
    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { orderId: searchRegex },
        { customerName: searchRegex },
        { customerPhone: searchRegex },
      ];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders: " + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();

    // Normalize: frontend sends `customer: { name, phone, ... }` (nested)
    // while some callers may send flat top-level fields. Support both.
    const customerName = body.customerName || body.customer?.name;
    const customerPhone = body.customerPhone || body.customer?.phone;
    const customerEmail = body.customerEmail || body.customer?.email || "";
    const shippingAddress =
      body.shippingAddress ||
      (body.customer
        ? `${body.customer.address || ""}${body.customer.city ? ", " + body.customer.city : ""}${body.customer.state ? ", " + body.customer.state : ""}${body.customer.pincode ? " - " + body.customer.pincode : ""}`
        : "");
    const shippingCity = body.shippingCity || body.customer?.city || "";
    const shippingState = body.shippingState || body.customer?.state || "Tamil Nadu";
    const shippingPincode = body.shippingPincode || body.customer?.pincode || "";
    const { items, paymentMethod, idempotencyKey, notes } = body;

    if (!customerName || !customerPhone || !shippingAddress || !items || !items.length) {
      return NextResponse.json(
        { success: false, error: "Missing required order fields." },
        { status: 400 }
      );
    }


    // Idempotency check
    if (idempotencyKey) {
      const existing = await Order.findOne({ idempotencyKey }).lean();
      if (existing) {
        return NextResponse.json({
          success: true,
          data: existing,
          isDuplicate: true,
          message: "Order already processed.",
        });
      }
    }

    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findOne({ id: item.productId });
      const price = product ? product.finalPrice || product.price : item.price || 500;
      const itemSubtotal = price * (item.quantity || 1);
      subtotal += itemSubtotal;

      validatedItems.push({
        productId: item.productId,
        productName: product ? product.name : item.productName || "Nighty Garment",
        selectedColor: item.selectedColor || product?.color || "Standard",
        selectedSize: item.selectedSize || "Free Size",
        quantity: item.quantity || 1,
        price,
        finalPrice: price,
        image: product?.coverImage || item.image || "",
      });

      // Deduct stock if available
      if (product) {
        const previousStock = product.stock;
        product.stock = Math.max(0, product.stock - (item.quantity || 1));
        product.soldQuantity = (product.soldQuantity || 0) + (item.quantity || 1);
        if (product.stock === 0) product.status = "OUT OF STOCK";
        await product.save();

        await new InventoryTransaction({
          id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          productId: product.id,
          productName: product.name,
          date: new Date().toISOString(),
          action: "ORDER_RESERVED",
          quantity: item.quantity || 1,
          previousStock,
          newStock: product.stock,
          reason: `Customer Order Checkout`,
          changedBy: "Customer Checkout System",
        }).save();
      }
    }

    // Normalize payment method
    const rawMethod = (paymentMethod || "COD").toString().toUpperCase();
    const normalizedPaymentMethod = rawMethod === "ONLINE" ? "Online" : rawMethod === "COD" ? "COD" : rawMethod;

    // Calculate free shipping (3+ items or Tamil Nadu COD override)
    const totalQty = validatedItems.reduce((acc, it) => acc + it.quantity, 0);
    const shippingFee = typeof body.shippingFee === "number" ? body.shippingFee : (totalQty >= 3 ? 0 : normalizedPaymentMethod === "COD" ? 70 : 50);
    const discount = typeof body.discount === "number" ? body.discount : 0;
    const total = typeof body.total === "number" ? body.total : (subtotal + shippingFee - discount);

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder = new Order({
      orderId,
      customerName,
      customerPhone,
      customerEmail: customerEmail || "",
      shippingAddress,
      shippingCity: shippingCity || "",
      shippingState: shippingState || "Tamil Nadu",
      shippingPincode: shippingPincode || "",
      items: validatedItems,
      subtotal,
      shippingFee,
      discount,
      total,
      paymentMethod: normalizedPaymentMethod,
      paymentStatus: normalizedPaymentMethod === "COD" ? "Pending" : "Paid",
      orderStatus: "Confirmed",
      idempotencyKey: idempotencyKey || "",
      notes: notes || "",
      emailNotificationStatus: "Pending",
      whatsappNotificationStatus: "Pending",
    });

    await newOrder.save();

    // Upsert Customer profile
    try {
      const custId = `CUST-${customerPhone.replace(/[^0-9]/g, "").slice(-8)}`;
      const existingCust = await Customer.findOne({ phone: customerPhone });
      if (existingCust) {
        existingCust.totalOrders = (existingCust.totalOrders || 0) + 1;
        existingCust.totalSpent = (existingCust.totalSpent || 0) + total;
        existingCust.name = customerName;
        if (customerEmail) existingCust.email = customerEmail;
        await existingCust.save();
      } else {
        await new Customer({
          customerId: custId,
          name: customerName,
          phone: customerPhone,
          email: customerEmail || "",
          address: shippingAddress,
          state: shippingState || "Tamil Nadu",
          pincode: shippingPincode || "",
          totalOrders: 1,
          totalSpent: total,
        }).save();
      }
    } catch (custErr) {
      console.error("Customer upsert error:", custErr);
    }

    // Trigger Notifications asynchronously
    try {
      if (customerEmail) {
        sendOrderConfirmationEmail(newOrder)
          .then((res) => {
            Order.findOneAndUpdate(
              { orderId: newOrder.orderId },
              { $set: { emailNotificationStatus: res.success ? "Sent" : "Failed" } }
            ).catch((err) => console.error("Error saving email status:", err));
          })
          .catch((err) => console.error("Email send error:", err));
      }
      sendWhatsAppNotification(newOrder)
        .then((res) => {
          Order.findOneAndUpdate(
            { orderId: newOrder.orderId },
            { $set: { whatsappNotificationStatus: res.success ? "Sent" : "Skipped" } }
          ).catch((err) => console.error("Error saving whatsapp status:", err));
        })
        .catch((err) => console.error("WhatsApp send error:", err));
    } catch (notifErr) {
      console.error("Notification trigger error:", notifErr);
    }

    return NextResponse.json({
      success: true,
      data: newOrder,
      message: "Order created successfully!",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Order processing failed: " + (error as Error).message },
      { status: 500 }
    );
  }
}
