import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { printStore } from '@/lib/printStore';

const execFileAsync = promisify(execFile);
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json({ success: false, error: 'Job ID is required' }, { status: 400 });
    }

    const job = await printStore.getJobById(jobId);
    if (!job) {
      return NextResponse.json({ success: false, error: 'Job not found' }, { status: 404 });
    }

    // Resolve local file path
    let localFilePath = '';
    if (job.documentUrl.startsWith('/uploads/')) {
      localFilePath = path.join(process.cwd(), 'public', job.documentUrl);
    } else if (fs.existsSync(job.documentUrl)) {
      localFilePath = job.documentUrl;
    } else {
      // Test page fallback
      const sampleFallback = path.join(process.cwd(), 'test_print_page.pdf');
      if (fs.existsSync(sampleFallback)) {
        localFilePath = sampleFallback;
      }
    }

    if (!localFilePath || !fs.existsSync(localFilePath)) {
      return NextResponse.json(
        { success: false, error: `Document file not found at ${job.documentUrl}` },
        { status: 400 }
      );
    }

    // Mark status PRINTING
    await printStore.updatePrintStatus(jobId, 'PRINTING', { printerAssigned: 'Canon G3010 series' });

    // Execute Python direct printer script
    const scriptPath = path.join(process.cwd(), 'print-agent', 'print_single_job.py');
    const copies = (job.copies || 1).toString();
    const pageRange = job.pageRange || 'All';
    const title = `SIRAQ_${job.orderNumber}`;

    const { stdout, stderr } = await execFileAsync('python', [
      scriptPath,
      localFilePath,
      'Canon G3010 series',
      copies,
      pageRange,
      title,
    ]);

    // Mark status COMPLETED
    await printStore.updatePrintStatus(jobId, 'COMPLETED', {
      printerAssigned: 'Canon G3010 series',
    });

    return NextResponse.json({
      success: true,
      message: `Job #${job.orderNumber} successfully spooled to Canon PIXMA G3010!`,
      output: stdout,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

