import { NextRequest, NextResponse } from 'next/server';
import { productsStore } from '@/lib/productsStore';
import { isRequestAdminAuthorized } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeUnavailable = searchParams.get('all') === 'true';
    const products = await productsStore.getAllProducts(includeUnavailable);
    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const host = req.headers.get('host') || '';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

    if (!isLocal && !isRequestAdminAuthorized(authHeader)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.name || !body.category || body.price === undefined) {
      return NextResponse.json({ success: false, error: 'Missing name, category, or price' }, { status: 400 });
    }

    const productId = body.id || `prod_${Date.now()}`;
    const saved = await productsStore.saveProduct({
      ...body,
      id: productId,
      price: Number(body.price),
      discountPrice: body.discountPrice ? Number(body.discountPrice) : undefined,
      isAvailable: body.isAvailable ?? true,
      isFeatured: body.isFeatured ?? false,
      orderRank: body.orderRank || 20,
    });

    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const host = req.headers.get('host') || '';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

    if (!isLocal && !isRequestAdminAuthorized(authHeader)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Missing product id' }, { status: 400 });
    }

    const saved = await productsStore.saveProduct(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const host = req.headers.get('host') || '';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

    if (!isLocal && !isRequestAdminAuthorized(authHeader)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id parameter' }, { status: 400 });
    }

    await productsStore.deleteProduct(id);
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

