import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin route from public exposure on Vercel
  if (pathname.startsWith('/admin')) {
    const host = request.headers.get('host') || '';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
    const disablePublicAdmin = process.env.DISABLE_PUBLIC_ADMIN === 'true' || process.env.VERCEL === '1';

    // If on public Vercel deployment and not local:
    if (disablePublicAdmin && !isLocal) {
      // Check if authorized session cookie exists
      const session = request.cookies.get('siraq_admin_session')?.value;
      const secretKey = request.headers.get('x-siraq-admin-bypass');

      if (!session && secretKey !== process.env.ADMIN_ACCESS_KEY) {
        // Return 404 rewrite so admin does not exist on public deployment
        return new NextResponse(null, { status: 404, statusText: 'Not Found' });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

