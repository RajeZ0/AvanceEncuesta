import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { password, name, email, phone, state, municipality } = body;

        console.log('Registro intento:', { name, email, municipality, state });

        if (!password || !name || !email) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
        }

        if (!municipality) {
            return NextResponse.json({ error: 'Selecciona tu municipio' }, { status: 400 });
        }

        // Validar longitud mínima de contraseña
        if (password.length < 6) {
            return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
        }

        // Generar nombre de usuario desde el correo
        const username = email.split('@')[0];

        // Verificar si el usuario ya existe
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

        // Hashear la contraseña de forma segura
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generar token de sesión para auto-login
        const sessionToken = crypto.randomBytes(32).toString('hex');

        // Crear usuario con contraseña hasheada
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                name,
                email,
                phone: phone || null,
                state: state || 'Estado de México',
                municipality,
                role: 'USER',
                sessionToken
            }
        });

        console.log('Usuario creado exitosamente:', user.id);

        // Auto-login después del registro
        const cookieStore = await cookies();
        cookieStore.set('userId', user.id, { httpOnly: true, path: '/' });
        cookieStore.set('userRole', user.role, { httpOnly: true, path: '/' });
        cookieStore.set('sessionToken', sessionToken, { httpOnly: true, path: '/' });

        return NextResponse.json({
            success: true,
            user: { id: user.id, username: user.username, role: user.role }
        });
    } catch (error: any) {
        console.error('Error en registro:', error);
        console.error('Error detalles:', error.message);
        console.error('Error code:', error.code);
        return NextResponse.json({
            error: 'Error al registrar usuario',
            details: error.message
        }, { status: 500 });
    }
}
