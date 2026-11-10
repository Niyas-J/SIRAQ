import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
import { printStore } from '@/lib/printStore';

export const dynamic = 'force-dynamic';

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      jobId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (!jobId) {
      return NextResponse.json({ success: false, error: 'Job ID is required' }, { status: 400 });
    }

    const job = await printStore.getJobById(jobId);
    if (!job) {
      return NextResponse.json({ success: false, error: 'Print order not found' }, { status: 404 });
    }

    // Cryptographic signature verification
    if (RAZORPAY_KEY_SECRET) {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json(
          { success: false, error: 'Missing Razorpay verification tokens' },
          { status: 400 }
        );
      }

      const generatedSignature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      const isSignatureValid = crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(razorpay_signature)
      );

      if (!isSignatureValid) {
        return NextResponse.json(
          { success: false, error: 'Invalid payment signature. Payment verification failed.' },
          { status: 400 }
        );
      }
    } else {
      // In local development or test mode without secret key, ensure payment ID is provided
      if (!razorpay_payment_id) {
        return NextResponse.json(
          { success: false, error: 'Payment reference missing' },
          { status: 400 }
        );
      }
    }

    // Update job to PAID and QUEUED
    const updatedJob = await printStore.markPaymentPaid(jobId, {
      gateway: 'razorpay',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      signature: razorpay_signature,
    });

    // Auto-spool directly to Canon G3010 if running on the shop Windows machine
    if (process.platform === 'win32' && updatedJob) {
      try {
        const scriptPath = path.join(process.cwd(), 'print-agent', 'print_single_job.py');
        let localFilePath = '';
        if (updatedJob.documentUrl.startsWith('/uploads/')) {
          localFilePath = path.join(process.cwd(), 'public', updatedJob.documentUrl);
        } else if (fs.existsSync(updatedJob.documentUrl)) {
          localFilePath = updatedJob.documentUrl;
        }

        if (localFilePath && fs.existsSync(localFilePath) && fs.existsSync(scriptPath)) {
          execFile(
            'python',
            [
              scriptPath,
              localFilePath,
              'Canon G3010 series',
              (updatedJob.copies || 1).toString(),
              updatedJob.pageRange || 'All',
              `SIRAQ_${updatedJob.orderNumber}`,
            ],
            (err) => {
              if (!err) {
                printStore.updatePrintStatus(jobId, 'COMPLETED', {
                  printerAssigned: 'Canon G3010 series',
                });
              } else {
                console.warn('Auto print dispatch background error:', err);
              }
            }
          );
        }
      } catch (dispErr) {
        console.warn('Auto print dispatch error:', dispErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully. Job entered print queue and spooled to printer.',
      job: updatedJob,
    });
  } catch (error: any) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
