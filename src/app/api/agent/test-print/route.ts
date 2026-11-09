import { NextRequest, NextResponse } from 'next/server';
import { agentStore } from '@/lib/agentStore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const orderNumber = await agentStore.createTestPrintJob();
    return NextResponse.json({
      success: true,
      message: 'Test print job queued successfully for local print agent',
      orderNumber,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

