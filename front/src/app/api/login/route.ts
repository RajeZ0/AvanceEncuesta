import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
        return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user || user.password !== password) {
        return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set('userId', user.id, { httpOnly: true, path: '/' });
    cookieStore.set('userRole', user.role, { httpOnly: true, path: '/' });

    return NextResponse.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
}
