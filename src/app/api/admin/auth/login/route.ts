import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials, createAdminToken } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password are required' }, { status: 400 });
    }

    const isValid = validateAdminCredentials(username, password);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid admin credentials' }, { status: 401 });
    }

    const token = createAdminToken(username);

    const response = NextResponse.json({
      success: true,
      message: 'Authenticated successfully',
      token,
      user: {
        username,
        role: 'SUPER_ADMIN',
        roleTitle: 'SIRAQ Shop Administrator',
      },
    });

    // Set secure cookie
    response.cookies.set('siraq_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

