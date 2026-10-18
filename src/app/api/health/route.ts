import { NextResponse } from 'next/server';
import { getAllProducts } from '@/backend/db';

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json({
      status: 'healthy',
      service: 'FreshSip Juice Bar Platform',
      version: '1.0.0',
      database: 'connected',
      catalogSize: products.length,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Database connection error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
