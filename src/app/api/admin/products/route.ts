import { NextResponse } from 'next/server';
import { addProduct, updateProduct, deleteProduct, getAllProducts } from '@/backend/db';
import { requireAdmin } from '@/backend/lib/auth';
import { Product } from '@/frontend/shared';

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch products.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { product } = body;

    if (!product || !product.name || !product.price) {
      return NextResponse.json({ error: 'Invalid product information provided.' }, { status: 400 });
    }

    const newProd: Product = {
      ...product,
      id: product.id || `prod-${Date.now()}`,
    };

    const saved = await addProduct(newProd);
    return NextResponse.json({ success: true, product: saved });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Forbidden: Administrator access required.' },
      { status: 403 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { product } = body;

    if (!product || !product.id) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    const updated = await updateProduct(product);
    if (!updated) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Forbidden: Administrator access required.' },
      { status: 403 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    const deleted = await deleteProduct(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted.' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Forbidden: Administrator access required.' },
      { status: 403 }
    );
  }
}
