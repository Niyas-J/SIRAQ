import { NextRequest, NextResponse } from 'next/server';
import { agentStore } from '@/lib/agentStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await agentStore.getStatus();
    return NextResponse.json({ success: true, data: status });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await agentStore.recordHeartbeat(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

