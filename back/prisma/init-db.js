const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Initializing PLANSUSTAIN database...');

    try {
        // Create Module 1
        const module1 = await prisma.module.create({
            data: {
                number: 1,
                name: 'Contexto Institucional',
                description: 'Evaluación de la capacidad institucional, marco legal y procedimientos',
                evaluationType: 'PDC',
                outputKey: 'IPS',
                order: 1,
            },
        });

        console.log('✅ Created Module 1');

        // Create Component: Marco Legal
        const marcoLegal = await prisma.component.create({
            data: {
                moduleId: module1.id,
                name: 'Marco Legal',
                description: 'Evaluación del marco legal y normativo',
                order: 1,
            },
        });

        // Create Question 1.1
        const q1 = await prisma.question.create({
            data: {
                componentId: marcoLegal.id,
                text: '¿Las leyes, regulaciones y programas de planificación territorial están actualizados y vigentes (No obsoletos)?',
                type: 'SCALE',
                weight: 1,
                order: 1,
            },
        });

        // Create scale options for Q1
        await prisma.scaleOption.createMany({
            data: [
                { questionId: q1.id, value: 1, label: 'Muy Deficiente', description: 'Más del 75% de las regulaciones están obsoletas (>10 años sin actualización)' },
                { questionId: q1.id, value: 2, label: 'Deficiente', description: '50-75% de las regulaciones están desactualizadas o no reflejan necesidades actuales' },
                { questionId: q1.id, value: 3, label: 'Aceptable', description: '25-50% de las regulaciones están actualizadas; existen algunas inconsistencias' },
                { questionId: q1.id, value: 4, label: 'Bueno', description: '75-90% de las regulaciones están vigentes y actualizadas en los últimos 5 años' },
                { questionId: q1.id, value: 5, label: 'Excelente', description: '>90% de las regulaciones están completamente actualizadas y alineadas con estándares actuales' },
            ],
        });

        console.log('✅ Created Question 1.1 with scale options');

        // Create admin user
        await prisma.user.upsert({
            where: { username: 'admin' },
            update: {},
            create: {
                username: 'admin',
                password: 'adminpassword',
                role: 'ADMIN',
            },
        });

        console.log('✅ Created admin user');
        console.log('🎉 Database initialized successfully!');
        console.log('\nYou can now login with:');
        console.log('  Username: admin');
        console.log('  Password: adminpassword');

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
