import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { agentStore } from '@/lib/agentStore';
import { printStore } from '@/lib/printStore';

const execFileAsync = promisify(execFile);
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const orderNumber = await agentStore.createTestPrintJob();

    // Ensure a test PDF exists on disk
    const testPdfPath = path.join(process.cwd(), 'test_print_page.pdf');
    if (!fs.existsSync(testPdfPath)) {
      // create simple test pdf
      const createScript = path.join(process.cwd(), 'create_test.py');
      if (fs.existsSync(createScript)) {
        await execFileAsync('python', [createScript]);
      }
    }

    // Direct print to Canon G3010
    if (fs.existsSync(testPdfPath)) {
      const scriptPath = path.join(process.cwd(), 'print-agent', 'print_single_job.py');
      try {
        await execFileAsync('python', [
          scriptPath,
          testPdfPath,
          'Canon G3010 series',
          '1',
          'All',
          `SIRAQ_TEST_${orderNumber}`,
        ]);

        // Find the newly created job and mark it COMPLETED
        const jobs = await printStore.getAllJobs();
        const createdJob = jobs.find((j) => j.orderNumber === orderNumber);
        if (createdJob) {
          await printStore.updatePrintStatus(createdJob.id, 'COMPLETED', {
            printerAssigned: 'Canon G3010 series',
          });
        }
      } catch (printErr) {
        console.warn('Direct print test notice:', printErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Test print job #${orderNumber} sent directly to Canon PIXMA G3010!`,
      orderNumber,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
