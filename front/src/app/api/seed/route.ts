import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET() {
    try {
        await prisma.section.create({
            data: {
                title: 'Gobernanza y Liderazgo',
                description: 'Evalúa la estructura administrativa y el liderazgo del ayuntamiento.',
                weight: 20,
                order: 1,
                questions: {
                    create: [
                        {
                            text: '¿El ayuntamiento cuenta con un Plan Municipal de Desarrollo actualizado?',
                            type: 'BOOLEAN',
                            weight: 2,
                            order: 1,
                        },
                        {
                            text: '¿Se realizan reuniones de cabildo con la periodicidad establecida por la ley?',
                            type: 'SCALE',
                            weight: 1,
                            order: 2,
                        },
                        {
                            text: 'Describa brevemente los mecanismos de participación ciudadana implementados.',
                            type: 'TEXT',
                            weight: 0,
                            order: 3,
                        },
                    ],
                },
            },
        });

        await prisma.section.create({
            data: {
                title: 'Servicios Públicos',
                description: 'Calidad y cobertura de los servicios públicos municipales.',
                weight: 30,
                order: 2,
                questions: {
                    create: [
                        {
                            text: '¿Cuál es el porcentaje de cobertura de alumbrado público?',
                            type: 'SCALE',
                            weight: 2,
                            order: 1,
                        },
                        {
                            text: '¿El servicio de recolección de basura es eficiente?',
                            type: 'SCALE',
                            weight: 2,
                            order: 2,
                        },
                    ],
                },
            },
        });

        const user = await prisma.user.upsert({
            where: { username: 'admin' },
            update: {},
            create: {
                username: 'admin',
                password: 'adminpassword',
                role: 'ADMIN',
            },
        });

        return NextResponse.json({ success: true, message: 'Seeding completed', user });
    } catch (error) {
        return NextResponse.json({ error: 'Seeding failed', details: String(error) }, { status: 500 });
    }
}
