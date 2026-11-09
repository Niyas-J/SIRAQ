import { NextRequest, NextResponse } from 'next/server';
import { printStore } from '@/lib/printStore';

export const dynamic = 'force-dynamic';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      documentName,
      documentUrl,
      documentType,
      documentSize,
      pageCount,
      colorMode,
      paperSize,
      sides,
      copies,
      pageRange,
    } = body;

    if (!documentUrl || !customerPhone) {
      return NextResponse.json(
        { success: false, error: 'Document and phone number are required' },
        { status: 400 }
      );
    }

    // Calculate verified price on the server
    const { unitPrice, totalAmount } = await printStore.calculatePrice({
      pageCount: Number(pageCount) || 1,
      copies: Number(copies) || 1,
      colorMode: colorMode || 'bw',
      paperSize: paperSize || 'A4',
      sides: sides || 'single',
    });

    let razorpayOrderId = `order_sim_${Date.now()}`;
    let isLiveGateway = false;

    // Call real Razorpay API if credentials configured
    if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
      try {
        const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
        const res = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: totalAmount * 100, // amount in paise
            currency: 'INR',
            receipt: `rcpt_${Date.now().toString().slice(-8)}`,
            notes: {
              customerName: customerName || 'Valued Customer',
              customerPhone,
              documentName,
            },
          }),
        });

        if (res.ok) {
          const rzpOrder = await res.json();
          razorpayOrderId = rzpOrder.id;
          isLiveGateway = true;
        } else {
          console.warn('Razorpay order creation fallback:', await res.text());
        }
      } catch (err) {
        console.warn('Razorpay fetch error:', err);
      }
    }

    // Save job with PENDING payment status
    const job = await printStore.createJob({
      customerName: customerName || 'Guest User',
      customerPhone,
      documentName: documentName || 'Document.pdf',
      documentUrl,
      documentType: documentType || 'pdf',
      documentSize: documentSize || 1024,
      pageCount: Number(pageCount) || 1,
      colorMode: colorMode || 'bw',
      paperSize: paperSize || 'A4',
      sides: sides || 'single',
      copies: Number(copies) || 1,
      pageRange: pageRange || 'All',
      unitPrice,
      totalAmount,
      paymentStatus: 'PENDING',
      razorpayOrderId,
    });

    return NextResponse.json({
      success: true,
      jobId: job.id,
      orderNumber: job.orderNumber,
      amount: totalAmount,
      amountPaise: totalAmount * 100,
      currency: 'INR',
      razorpayOrderId,
      keyId: RAZORPAY_KEY_ID || 'rzp_test_siraq_shop',
      isLiveGateway,
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

