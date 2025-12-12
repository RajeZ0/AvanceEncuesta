
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { password, name, email, phone, state, municipality } = body;

        if (!password || !name || !email) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
        }

        // Auto-generate username from email
        const username = email.split('@')[0];

        // Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'El usuario o correo ya existe' }, { status: 400 });
        }

        // Create user
        const user = await prisma.user.create({
            data: {
                username,
                password, // In a real app, hash this!
                name,
                email,
                phone,
                state,
                municipality,
                role: 'USER'
            }
        });

        // Auto-login
        const cookieStore = await cookies();
        cookieStore.set('userId', user.id, { httpOnly: true, path: '/' });
        cookieStore.set('userRole', user.role, { httpOnly: true, path: '/' });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Error al registrar usuario' }, { status: 500 });
    }
}
