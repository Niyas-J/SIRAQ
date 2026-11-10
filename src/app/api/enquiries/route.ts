import { NextRequest, NextResponse } from 'next/server';
import { enquiryStore } from '@/lib/enquiryStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const enquiries = await enquiryStore.getAllEnquiries();
    return NextResponse.json({ success: true, data: enquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const studentName = (body.studentName || body.name || '').trim();
    const phone = (body.phone || '').trim();

    if (!studentName || !phone) {
      return NextResponse.json(
        { success: false, error: 'Student name and phone number are required.' },
        { status: 400 }
      );
    }

    const newEnquiry = await enquiryStore.createEnquiry({
      name: studentName,
      studentName: studentName,
      phone: phone,
      email: body.email || '',
      scholarshipName: body.scholarshipName || 'Other Scholarship Assistance',
      scholarshipWebsite: body.scholarshipWebsite || '',
      additionalInfo: body.additionalInfo || body.message || '',
      message: body.message || body.additionalInfo || 'Scholarship assistance request',
      serviceOrProduct: body.serviceOrProduct || 'Scholarship Assistance',
      type: body.type || 'SCHOLARSHIP',
    });

    return NextResponse.json({ success: true, data: newEnquiry }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ success: false, error: 'Missing id or status' }, { status: 400 });
    }
    const updated = await enquiryStore.updateStatus(body.id, body.status);
    return NextResponse.json({ success: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
    }
    const deleted = await enquiryStore.deleteEnquiry(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

