import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function POST(request: Request) {
    try {
        const { token, newPassword } = await request.json();

        if (!token || !newPassword) {
            return NextResponse.json({ error: 'Faltan datos requeridos' }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date(), // Expiry must be greater than now
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 400 });
        }

        // Update password and clear token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: newPassword, // NOTE: In a real app, hash this password!
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return NextResponse.json({ success: true, message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
