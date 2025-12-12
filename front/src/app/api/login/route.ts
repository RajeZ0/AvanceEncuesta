import { NextResponse } from 'next/server';
// import { getDbPath } from '@/lib/dbPath';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        console.log(`Login attempt for ${email}`);

        if (!email || !password) {
            return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
        }

        // Use Prisma instead of better-sqlite3 for Postgres compatibility

        // Check user credentials
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || user.password !== password) {
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        // Generate new session token
        const sessionToken = crypto.randomBytes(32).toString('hex');

        // Update user session
        await prisma.user.update({
            where: { id: user.id },
            data: { sessionToken },
        });

        const cookieStore = await cookies();
        cookieStore.set('userId', user.id, { httpOnly: true, path: '/' });
        cookieStore.set('userRole', user.role, { httpOnly: true, path: '/' });
        cookieStore.set('sessionToken', sessionToken, { httpOnly: true, path: '/' });

        return NextResponse.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({
            error: 'Error interno del servidor',
            details: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
