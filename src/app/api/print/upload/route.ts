import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds maximum limit of 25MB' },
        { status: 400 }
      );
    }

    const mime = file.type.toLowerCase();
    const extension = path.extname(file.name).toLowerCase();
    const validExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];

    if (!ALLOWED_MIME_TYPES.includes(mime) && !validExtensions.includes(extension)) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file type. Only PDF, JPG, and PNG are supported.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'print-docs');
    await mkdir(uploadsDir, { recursive: true });

    const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = path.join(uploadsDir, safeName);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/print-docs/${safeName}`;

    // Approximate page count calculation for initial feedback
    let detectedPages = 1;
    if (extension === '.pdf' || mime === 'application/pdf') {
      // Basic PDF page count heuristic by scanning /Type /Page
      const content = buffer.toString('binary');
      const matches = content.match(/\/Type\s*\/Page\b/g);
      if (matches && matches.length > 0) {
        // Exclude /Pages (plural parent tree nodes)
        const pagesMatches = content.match(/\/Type\s*\/Pages\b/g) || [];
        detectedPages = Math.max(1, matches.length - pagesMatches.length);
      }
    }

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: file.name,
      fileSize: file.size,
      fileType: extension.replace('.', ''),
      detectedPages,
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

