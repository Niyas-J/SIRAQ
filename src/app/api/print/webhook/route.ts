import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { printStore } from '@/lib/printStore';

export const dynamic = 'force-dynamic';

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (WEBHOOK_SECRET && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        return NextResponse.json({ success: false, error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;

      if (orderId) {
        const allJobs = await printStore.getAllPrintJobs();
        const matchingJob = allJobs.find((j) => j.razorpayOrderId === orderId);

        if (matchingJob && matchingJob.paymentStatus !== 'PAID') {
          await printStore.markPaymentPaid(matchingJob.id, {
            gateway: 'razorpay',
            paymentId: paymentId || `pay_wh_${Date.now()}`,
            orderId,
            signature,
          });
        }
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

