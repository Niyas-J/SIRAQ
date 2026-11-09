import { NextRequest, NextResponse } from 'next/server';
import { printStore } from '@/lib/printStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitCount = parseInt(searchParams.get('limit') || '5', 10);
    const queuedJobs = await printStore.getQueuedJobsForAgent(limitCount);
    return NextResponse.json({ success: true, count: queuedJobs.length, jobs: queuedJobs });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId, status, printerAssigned, errorMessage } = body;

    if (!jobId || !status) {
      return NextResponse.json({ success: false, error: 'Job ID and status required' }, { status: 400 });
    }

    const success = await printStore.updatePrintStatus(jobId, status, {
      printerAssigned,
      errorMessage,
    });

    return NextResponse.json({ success, message: `Status updated to ${status}` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

