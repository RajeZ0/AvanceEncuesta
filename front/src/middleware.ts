import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const userId = request.cookies.get('userId')?.value;
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/dashboard/section')) {
        if (!userId) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    if (pathname.startsWith('/admin')) {
        const userRole = request.cookies.get('userRole')?.value;
        if (!userId || userRole !== 'ADMIN') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    if (pathname === '/login') {
        if (userId) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/login'],
};
