import { NextResponse } from 'next/server';
import { getAllOrders, updateOrderStatus } from '@/backend/db';
import { requireAdmin } from '@/backend/lib/auth';
import { OrderStatus } from '@/frontend/shared';

export async function GET() {
  try {
    // Server-enforced administrator authorization
    await requireAdmin();

    const orders = await getAllOrders();
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Forbidden: Administrator access required.' },
      { status: 403 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    // Server-enforced administrator authorization
    await requireAdmin();

    const body = await req.json();
    const { orderId, status } = body;

    const validStatuses: OrderStatus[] = [
      'Pending',
      'Confirmed',
      'Preparing',
      'Ready',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
    ];

    if (!orderId || !status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid order ID or status provided.' }, { status: 400 });
    }

    const updated = await updateOrderStatus(orderId, status);
    if (!updated) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order: updated,
      message: `Order ${orderId} status updated to ${status}.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Forbidden: Administrator access required.' },
      { status: 403 }
    );
  }
}
