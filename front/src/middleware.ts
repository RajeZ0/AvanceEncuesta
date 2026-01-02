import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const userId = request.cookies.get('userId')?.value;
    const sessionToken = request.cookies.get('sessionToken')?.value;
    const { pathname } = request.nextUrl;

    // Only protect /dashboard/section/* routes (actual module pages)
    if (pathname.startsWith('/dashboard/section/')) {
        if (!userId || !sessionToken) {
            // Clear invalid cookies and redirect to dashboard
            const response = NextResponse.redirect(new URL('/dashboard', request.url));
            response.cookies.delete('userId');
            response.cookies.delete('userRole');
            response.cookies.delete('sessionToken');
            return response;
        }

        // Validate session cookie existence (Detailed validation happens in API/Page)
        // Note: Database access (better-sqlite3) is not supported in Next.js Middleware (Edge Runtime)
        // so we deferred full session validation to the server-side components.
    }

    // Admin-only routes
    if (pathname.startsWith('/admin')) {
        if (!userId || !sessionToken) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        const userRole = request.cookies.get('userRole')?.value;
        if (userRole !== 'ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // Redirect authenticated users away from /login to dashboard
    if (pathname === '/login' && userId && sessionToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/section/:path*', '/admin/:path*', '/login'],
};
