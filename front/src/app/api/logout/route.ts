import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;

        // Clear session token from database
        if (userId) {
            await prisma.user.update({
                where: { id: userId },
                data: { sessionToken: null },
            });
        }

        // Clear cookies
        cookieStore.delete('userId');
        cookieStore.delete('userRole');
        cookieStore.delete('sessionToken');

        return NextResponse.redirect(new URL('/login', request.url));
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'Error al cerrar sesión' }, { status: 500 });
    }
}
