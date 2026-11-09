import { NextRequest, NextResponse } from 'next/server';
import { servicesStore } from '@/lib/servicesStore';
import { isRequestAdminAuthorized } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get('all') === 'true';
    const services = await servicesStore.getAllServices(includeInactive);
    return NextResponse.json({ success: true, data: services });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    // Also allow local requests
    const host = req.headers.get('host') || '';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

    if (!isLocal && !isRequestAdminAuthorized(authHeader)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title || !body.category) {
      return NextResponse.json({ success: false, error: 'Missing title or category' }, { status: 400 });
    }

    const serviceId = body.id || `srv_${Date.now()}`;
    const saved = await servicesStore.saveService({
      ...body,
      id: serviceId,
      isActive: body.isActive ?? true,
      orderRank: body.orderRank || 10,
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
      return NextResponse.json({ success: false, error: 'Missing service id' }, { status: 400 });
    }

    const saved = await servicesStore.saveService(body);
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

    await servicesStore.deleteService(id);
    return NextResponse.json({ success: true, message: 'Service deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

