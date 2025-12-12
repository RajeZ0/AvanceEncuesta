import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';


export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'El email es requerido' }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: { email },
        });

        if (!user) {
            // For security, we don't want to reveal if a user exists or not
            return NextResponse.json({ success: true, message: 'Si el email existe, se ha enviado un enlace de recuperación.' });
        }

        const token = uuidv4();
        // Token expires in 1 hour
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: token,
                resetTokenExpiry: expiresAt,
            },
        });

        // SIMULATION: Log the link to the console
        const resetLink = `${new URL(request.url).origin}/reset-password?token=${token}`;
        console.log('---------------------------------------------------');
        console.log('PASSWORD RESET LINK (SIMULATION):');
        console.log(resetLink);
        console.log('---------------------------------------------------');

        return NextResponse.json({ success: true, message: 'Si el email existe, se ha enviado un enlace de recuperación.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
