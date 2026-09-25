import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    
    await connectToDatabase();

    const products = await Product.find({}).lean();
    const orders = await Order.find({}).lean();

    const totalProducts = products.length;
    const totalStock = products.reduce((acc: number, p: any) => acc + (p.stock || 0), 0);
    const outOfStockCount = products.filter((p: any) => p.stock <= 0).length;

    const lowStockCount = products.filter((p: any) => p.stock > 0 && p.stock <= 10).length;

    const todayStr = new Date().toISOString().slice(0, 10);
    
    const todayOrders = orders.filter((o: any) => {
      if (!o.createdAt) return false;
      const dateStr = o.createdAt instanceof Date ? o.createdAt.toISOString() : String(o.createdAt);
      return dateStr.startsWith(todayStr);
    });
    const pendingOrders = orders.filter((o: any) => (o.orderStatus || o.status) === "Pending" || (o.orderStatus || o.status) === "Processing");
    
    const todaySales = todayOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
    const codOrders = orders.filter((o: any) => o.paymentMethod === "COD");
    const onlineOrders = orders.filter((o: any) => o.paymentMethod === "Online" || o.paymentMethod === "UPI");

    const lowStockItems = products
      .filter((p: any) => p.stock <= 10)
      .slice(0, 5)
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        sku: p.sku || p.code,
        category: p.category,
        stock: p.stock,
        threshold: 10,
        image: p.coverImage || (p.images && p.images[0]) || "",
      }));

    const topSelling = products
      .filter((p: any) => p.isBestSeller || p.reviews > 50)
      .slice(0, 5);

    const recentOrders = orders
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalStock,
        lowStockCount,
        outOfStockCount,
        todayOrdersCount: todayOrders.length,
        pendingOrdersCount: pendingOrders.length,
        todaySales,
        codOrdersCount: codOrders.length,
        onlineOrdersCount: onlineOrders.length,
        lowStockItems,
        recentOrders,
        topSelling,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard metrics: " + (error as Error).message },
      { status: 500 }
    );
  }
}
