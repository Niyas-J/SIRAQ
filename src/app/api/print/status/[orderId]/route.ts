import { NextRequest, NextResponse } from 'next/server';
import { printStore } from '@/lib/printStore';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;
    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    const job = await printStore.getJobById(orderId);
    if (!job) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      job: {
        id: job.id,
        orderNumber: job.orderNumber,
        documentName: job.documentName,
        pageCount: job.pageCount,
        copies: job.copies,
        colorMode: job.colorMode,
        paperSize: job.paperSize,
        sides: job.sides,
        totalAmount: job.totalAmount,
        paymentStatus: job.paymentStatus,
        printStatus: job.printStatus,
        printerAssigned: job.printerAssigned,
        createdAt: job.createdAt,
        paidAt: job.paidAt,
        printedAt: job.printedAt,
        errorMessage: job.errorMessage,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

