import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import Customer from "@/lib/models/Customer";
import InventoryTransaction from "@/lib/models/InventoryTransaction";
import { sendOrderConfirmationEmail, sendWhatsAppNotification } from "@/services/notificationService";
import { requireAdmin, escapeRegex, checkRateLimit, getClientIp } from "@/lib/auth";

// Sanitizer for string inputs
function sanitizeString(input: unknown, maxLen = 200): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[<>]/g, "") // Remove HTML tag brackets
    .trim()
    .slice(0, maxLen);
}

export async function GET(request: NextRequest) {
  // Admin-only access to customer order logs
  const { errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const filter: Record<string, unknown> = {};
    if (status && status !== "All") {
      filter.orderStatus = sanitizeString(status, 50);
    }
    if (search) {
      const safeSearch = escapeRegex(search.trim());
      if (safeSearch) {
        const searchRegex = new RegExp(safeSearch, "i");
        filter.$or = [
          { orderId: searchRegex },
          { customerName: searchRegex },
          { customerPhone: searchRegex },
        ];
      }
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(500).lean();
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders: " + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Rate Limiting: 10 checkout orders per 5 minutes per IP
  const rateLimit = checkRateLimit(`order:${ip}`, 10, 5 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many orders submitted in a short period. Please wait a few minutes.",
      },
      { status: 429 }
    );
  }

  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));

    // Normalize and sanitize inputs
    const customerName = sanitizeString(body.customerName || body.customer?.name, 100);
    const customerPhone = sanitizeString(body.customerPhone || body.customer?.phone, 20).replace(/[^0-9+ ]/g, "");
    const customerEmail = sanitizeString(body.customerEmail || body.customer?.email, 120).toLowerCase();
    let rawAddressString = "";
    if (typeof body.shippingAddress === "string") {
      rawAddressString = body.shippingAddress;
    } else if (typeof body.shippingAddress === "object" && body.shippingAddress !== null) {
      const sa = body.shippingAddress as Record<string, string>;
      rawAddressString = [sa.addressLine, sa.areaLocality, sa.city, sa.state ? `${sa.state} - ${sa.pincode || ""}` : sa.pincode].filter(Boolean).join(", ");
    } else if (body.customer) {
      rawAddressString = `${body.customer.addressLine || body.customer.address || ""}${body.customer.city ? ", " + body.customer.city : ""}${body.customer.state ? ", " + body.customer.state : ""}${body.customer.pincode ? " - " + body.customer.pincode : ""}`;
    }
    const shippingAddress = sanitizeString(rawAddressString, 300);

    const shippingCity = sanitizeString(
      body.shippingCity || body.customer?.city || (typeof body.shippingAddress === "object" ? body.shippingAddress?.city : ""),
      80
    );
    const shippingState = sanitizeString(
      body.shippingState || body.customer?.state || (typeof body.shippingAddress === "object" ? body.shippingAddress?.state : "") || "Tamil Nadu",
      80
    );
    const shippingPincode = sanitizeString(
      body.shippingPincode || body.customer?.pincode || (typeof body.shippingAddress === "object" ? body.shippingAddress?.pincode : ""),
      10
    ).replace(/[^0-9]/g, "");
    const { items, paymentMethod, idempotencyKey, notes, paymentReference } = body;

    if (!customerName || !customerPhone || !shippingAddress || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required order fields (name, phone, address, and items)." },
        { status: 400 }
      );
    }

    if (items.length > 50) {
      return NextResponse.json(
        { success: false, error: "Exceeded maximum order item limit." },
        { status: 400 }
      );
    }

    // Idempotency check by idempotencyKey
    const safeIdempotencyKey = sanitizeString(idempotencyKey, 100);
    if (safeIdempotencyKey) {
      const existing = await Order.findOne({ idempotencyKey: safeIdempotencyKey }).lean();
      if (existing) {
        return NextResponse.json({
          success: true,
          data: existing,
          isDuplicate: true,
          message: "Order already processed.",
        });
      }
    }

    // Payment reference idempotency check to prevent duplicate order / stock deduction
    const safePaymentReference = sanitizeString(paymentReference, 100);
    if (safePaymentReference) {
      const existingWithPayment = await Order.findOne({ paymentReference: safePaymentReference }).lean();
      if (existingWithPayment) {
        return NextResponse.json({
          success: true,
          data: existingWithPayment,
          isDuplicate: true,
          message: "Order with this payment reference already exists.",
        });
      }
    }

    // Normalize payment method
    const rawMethod = sanitizeString(paymentMethod || "COD", 20).toUpperCase();
    const normalizedPaymentMethod =
      rawMethod === "ONLINE" || rawMethod === "RAZORPAY" ? "Online" : rawMethod === "COD" ? "COD" : "Online";

    // Verify Razorpay signature server-side if credentials present
    const rzpSecret = process.env.RAZORPAY_KEY_SECRET;
    const { razorpay_order_id, razorpay_signature } = body;
    if (normalizedPaymentMethod === "Online" && rzpSecret && razorpay_signature && razorpay_order_id && safePaymentReference) {
      const crypto = await import("crypto");
      const generatedSignature = crypto
        .createHmac("sha256", rzpSecret)
        .update(`${razorpay_order_id}|${safePaymentReference}`)
        .digest("hex");
      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          { success: false, error: "Payment verification failed: Razorpay signature mismatch." },
          { status: 400 }
        );
      }
    }

    // Server-Side Price & Inventory Verification
    let serverCalculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const rawProductId = sanitizeString(item.productId, 50);
      const quantity = Math.max(1, Math.min(100, parseInt(item.quantity, 10) || 1));
      const selectedSize = sanitizeString(item.selectedSize || "Free Size", 30);

      const product = await Product.findOne({ id: rawProductId });

      // Determine authentic server price
      let authenticUnitPrice = 0;
      let authenticMrp = 0;

      if (product) {
        // Check if size option price is available
        const sizeOption = Array.isArray(product.sizeOptions)
          ? product.sizeOptions.find((so: any) => so.size && so.size.toLowerCase() === selectedSize.toLowerCase())
          : null;

        const basePrice = sizeOption?.price ? Number(sizeOption.price) : Number(product.price || 0);
        const disc = Number(product.discount || 0);
        authenticUnitPrice = disc > 0
          ? Math.max(0, Math.round(basePrice * (1 - disc / 100)))
          : basePrice;
        authenticMrp = sizeOption?.mrp ? Number(sizeOption.mrp) : Number(product.mrp || basePrice);
      } else {
        // Fallback safely to verified numeric item price if product uncataloged
        authenticUnitPrice = Math.max(0, Math.min(50000, Number(item.price) || 500));
        authenticMrp = authenticUnitPrice;
      }

      const itemSubtotal = authenticUnitPrice * quantity;
      serverCalculatedSubtotal += itemSubtotal;

      validatedItems.push({
        productId: rawProductId,
        productName: product ? product.name : sanitizeString(item.productName || "Nighty Garment", 100),
        selectedColor: sanitizeString(item.selectedColor || "Standard", 30),
        selectedSize,
        quantity,
        price: authenticUnitPrice,
        mrp: authenticMrp,
        finalPrice: authenticUnitPrice,
        image: product?.coverImage || product?.images?.[0] || sanitizeString(item.image, 500),
      });

      // Deduct stock atomically and size-specifically if product exists
      if (product) {
        const previousStock = product.stock || 0;

        // Size-wise stock deduction in sizeOptions
        if (Array.isArray(product.sizeOptions) && product.sizeOptions.length > 0) {
          const matchedSizeOption = product.sizeOptions.find(
            (so: any) => so.size && so.size.toLowerCase() === selectedSize.toLowerCase()
          );

          if (matchedSizeOption) {
            if (matchedSizeOption.stock < quantity) {
              return NextResponse.json(
                { success: false, error: `Sorry, ${product.name} (Size: ${selectedSize}) is out of stock. Only ${matchedSizeOption.stock} available.` },
                { status: 400 }
              );
            }
            matchedSizeOption.stock = Math.max(0, matchedSizeOption.stock - quantity);
          } else {
            if (product.stock < quantity) {
              return NextResponse.json(
                { success: false, error: `Sorry, ${product.name} is out of stock. Only ${product.stock} available.` },
                { status: 400 }
              );
            }
            if (product.sizeOptions[0]) {
              product.sizeOptions[0].stock = Math.max(0, (product.sizeOptions[0].stock || 0) - quantity);
            }
          }

          // Recalculate total product stock accurately from sizeOptions
          product.stock = product.sizeOptions.reduce((acc: number, curr: any) => acc + (curr.stock || 0), 0);
        } else {
          if (product.stock < quantity) {
            return NextResponse.json(
              { success: false, error: `Sorry, ${product.name} is out of stock. Only ${product.stock} available.` },
              { status: 400 }
            );
          }
          product.stock = Math.max(0, previousStock - quantity);
        }

        product.soldQuantity = (product.soldQuantity || 0) + quantity;
        if (product.stock === 0) product.status = "OUT OF STOCK";
        await product.save();

        await new InventoryTransaction({
          id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          productId: product.id,
          productName: product.name,
          date: new Date().toISOString(),
          action: "ORDER_RESERVED",
          quantity,
          previousStock,
          newStock: product.stock,
          reason: `Customer Order Checkout (Size: ${selectedSize})`,
          changedBy: "Customer Checkout System",
        }).save();
      }
    }

    // Server-side calculation of shipping fee and discounts
    const totalQty = validatedItems.reduce((acc, it) => acc + it.quantity, 0);
    const shippingFee = totalQty >= 3 ? 0 : normalizedPaymentMethod === "COD" ? 70 : 50;

    // Validated coupon/combo discount
    const requestedDiscount = typeof body.discount === "number" ? Math.max(0, Math.min(serverCalculatedSubtotal, body.discount)) : 0;
    const finalServerTotal = Math.max(0, serverCalculatedSubtotal + shippingFee - requestedDiscount);

    // Verify payment status
    const isOnlinePaid = normalizedPaymentMethod === "Online" && Boolean(safePaymentReference);
    const paymentStatus = normalizedPaymentMethod === "COD" ? "Pending" : isOnlinePaid ? "Paid" : "Pending";

    const customerId = sanitizeString(body.customerId || body.customer?.customerId, 60);
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder = new Order({
      orderId,
      customerId,
      customerName,
      customerPhone,
      customerEmail: customerEmail || "",
      shippingAddress,
      shippingCity: shippingCity || "",
      shippingState: shippingState || "Tamil Nadu",
      shippingPincode: shippingPincode || "",
      items: validatedItems,
      subtotal: serverCalculatedSubtotal,
      shippingFee,
      discount: requestedDiscount,
      total: finalServerTotal,
      paymentMethod: normalizedPaymentMethod,
      paymentStatus,
      paymentReference: safePaymentReference,
      orderStatus: "Confirmed",
      idempotencyKey: safeIdempotencyKey || "",
      notes: sanitizeString(notes, 500),
      emailNotificationStatus: "Pending",
      whatsappNotificationStatus: "Pending",
    });

    await newOrder.save();

    // Upsert Customer profile
    try {
      const sanitizedPhoneDigits = customerPhone.replace(/[^0-9]/g, "").slice(-10);
      const custId = customerId || `CUST-${sanitizedPhoneDigits || Date.now().toString().slice(-8)}`;
      const existingCust = await Customer.findOne({
        $or: [
          ...(customerId ? [{ customerId }] : []),
          { phone: customerPhone },
        ],
      });
      if (existingCust) {
        existingCust.totalOrders = (existingCust.totalOrders || 0) + 1;
        existingCust.totalSpent = (existingCust.totalSpent || 0) + finalServerTotal;
        if (customerName) existingCust.name = customerName;
        if (customerEmail) existingCust.email = customerEmail;
        if (body.customer?.addressLine) existingCust.addressLine = sanitizeString(body.customer.addressLine, 200);
        if (body.customer?.areaLocality) existingCust.areaLocality = sanitizeString(body.customer.areaLocality, 150);
        if (shippingAddress) existingCust.address = shippingAddress;
        if (shippingCity) existingCust.city = shippingCity;
        if (shippingState) existingCust.state = shippingState;
        if (shippingPincode) existingCust.pincode = shippingPincode;
        await existingCust.save();
      } else {
        await new Customer({
          customerId: custId,
          name: customerName,
          phone: customerPhone,
          email: customerEmail || "",
          addressLine: sanitizeString(body.customer?.addressLine, 200),
          areaLocality: sanitizeString(body.customer?.areaLocality, 150),
          address: shippingAddress,
          city: shippingCity,
          state: shippingState || "Tamil Nadu",
          pincode: shippingPincode || "",
          totalOrders: 1,
          totalSpent: finalServerTotal,
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
      message: "Order created and verified successfully!",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Order processing failed: " + (error as Error).message },
      { status: 500 }
    );
  }
}
