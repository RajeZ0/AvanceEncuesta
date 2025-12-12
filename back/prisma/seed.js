const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    // Crear secciones
    const section1 = await prisma.section.create({
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

    const section2 = await prisma.section.create({
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

    // Crear usuario admin de prueba
    try {
        await prisma.user.upsert({
            where: { username: 'admin' },
            update: {},
            create: {
                username: 'admin',
                password: 'adminpassword',
                role: 'ADMIN',
            },
        });
        console.log('Admin user created');
    } catch (e) {
        console.log('User might already exist');
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
