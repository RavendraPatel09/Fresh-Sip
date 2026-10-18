import { NextResponse } from 'next/server';
import { createOrder, getAllProducts, getOrdersByUserId } from '@/backend/db';
import { getCurrentUser } from '@/backend/lib/auth';
import { Order, CartItem, ProductSize, OrderStatus } from '@/frontend/shared';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { items, customerInfo, paymentMethod, couponCode } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item.' }, { status: 400 });
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      return NextResponse.json({ error: 'Please provide all delivery details.' }, { status: 400 });
    }

    // Authoritative pricing: fetch real products from DB
    const catalogProducts = await getAllProducts();
    const productMap = new Map(catalogProducts.map((p) => [p.id, p]));

    let calculatedSubtotal = 0;
    const validatedItems: CartItem[] = [];

    for (const rawItem of items) {
      const prod = productMap.get(rawItem.product?.id || rawItem.productId);
      if (!prod) {
        return NextResponse.json(
          { error: `Product not found: ${rawItem.product?.name || 'unknown'}` },
          { status: 400 }
        );
      }

      const size: ProductSize = ['250ml', '500ml', '1L'].includes(rawItem.selectedSize)
        ? rawItem.selectedSize
        : '250ml';
      const quantity = Math.max(1, Math.floor(Number(rawItem.quantity) || 1));
      const unitPrice = prod.sizePrices[size] || prod.price;
      const itemTotal = unitPrice * quantity;

      calculatedSubtotal += itemTotal;
      validatedItems.push({
        id: `${prod.id}-${size}`,
        product: prod,
        selectedSize: size,
        quantity,
        itemTotal,
      });
    }

    // Authoritative coupon evaluation
    let discountPercent = 0;
    if (typeof couponCode === 'string') {
      const clean = couponCode.trim().toUpperCase();
      if (clean === 'FRESH20' || clean === 'SUMMER20') {
        discountPercent = 20;
      } else if (clean === 'ZESTY10') {
        discountPercent = 10;
      }
    }

    const discountAmount = Math.round((calculatedSubtotal * discountPercent) / 100);
    const deliveryFee = calculatedSubtotal > 500 ? 0 : 40;
    const finalTotal = Math.max(0, calculatedSubtotal - discountAmount + deliveryFee);

    const validPaymentMethods = ['Stripe', 'Razorpay', 'Cash on Delivery'];
    const chosenMethod = validPaymentMethods.includes(paymentMethod) ? paymentMethod : 'Cash on Delivery';

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user?.id,
      customerName: customerInfo.name.trim(),
      customerEmail: customerInfo.email.trim().toLowerCase(),
      items: validatedItems,
      subtotal: calculatedSubtotal,
      discount: discountAmount,
      deliveryFee,
      total: finalTotal,
      paymentStatus: chosenMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      paymentMethod: chosenMethod as any,
      orderStatus: 'Confirmed',
      address: {
        fullName: customerInfo.name.trim(),
        street: customerInfo.address.trim(),
        city: customerInfo.city?.trim() || 'Mumbai',
        state: customerInfo.state?.trim() || 'Maharashtra',
        zipCode: customerInfo.zip?.trim() || '400050',
        phone: customerInfo.phone.trim(),
      },
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: '30-40 mins',
    };

    const savedOrder = await createOrder(newOrder);

    return NextResponse.json({
      success: true,
      order: savedOrder,
      message: 'Order placed and confirmed successfully!',
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to place order. Please try again.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ orders: [] });
    }

    const orders = await getOrdersByUserId(user.id);
    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Fetch customer orders error:', error);
    return NextResponse.json({ error: 'Failed to retrieve orders.' }, { status: 500 });
  }
}
