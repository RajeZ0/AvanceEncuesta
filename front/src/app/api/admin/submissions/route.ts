import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET() {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('userRole')?.value;

    if (userRole !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        // Obtener todos los usuarios y sus submissions
        // Nota: Prisma relation query
        const submissions = await prisma.submission.findMany({
            include: {
                user: {
                    select: { username: true },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        // También podríamos querer listar usuarios que NO tienen submission aún
        // Pero por ahora mostramos solo los que tienen actividad o submissions creadas

        return NextResponse.json(submissions);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
    }
}
