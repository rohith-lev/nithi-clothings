import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string; index: string }> }
) {
  try {
    await connectToDatabase();
    const { id, index: indexStr } = await context.params;
    
    const product = await Product.findOne({ id });
    const index = parseInt(indexStr, 10);

    if (!product || !product.images || !product.images[index]) {
      return new NextResponse('Image not found', { status: 404 });
    }

    const imageUrl = product.images[index];
    return NextResponse.redirect(imageUrl);
  } catch (error) {
    console.error('Error fetching image:', error);
    return new NextResponse('Error fetching image', { status: 500 });
  }
}
