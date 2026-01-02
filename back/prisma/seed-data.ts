import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createSampleData() {
    console.log('🎨 Creating sample submission data...');

    // Get all sections and questions
    const sections = await prisma.section.findMany({
        include: { questions: true }
    });

    if (sections.length === 0) {
        console.log('❌ No sections found. Run the main seed first.');
        return;
    }

    // Create 3 sample users/municipalities
    const municipalities = [
        { name: 'Toluca', state: 'Estado de México', email: 'toluca@meplansus.com' },
        { name: 'Metepec', state: 'Estado de México', email: 'metepec@meplansus.com' },
        { name: 'Lerma', state: 'Estado de México', email: 'lerma@meplansus.com' }
    ];

    for (const mun of municipalities) {
        console.log(`Creating user for ${mun.name}...`);

        const user = await prisma.user.upsert({
            where: { email: mun.email },
            update: {},
            create: {
                username: mun.name.toLowerCase(),
                email: mun.email,
                password: 'demo123',
                role: 'USER',
                name: `Municipio de ${mun.name}`,
                municipality: mun.name,
                state: mun.state
            }
        });

        // Create a submission for this user
        const submission = await prisma.submission.create({
            data: {
                userId: user.id,
                isFinalized: true,
                finalizedAt: new Date()
            }
        });

        console.log(`Creating answers for ${mun.name}...`);

        // Answer all questions with random realistic values
        for (const section of sections) {
            for (const question of section.questions) {
                let value: string;

                if (question.type === 'SCALE') {
                    // Random score between 3-5 (out of 5)
                    const score = Math.floor(Math.random() * 3) + 3;
                    value = score.toString();
                } else if (question.type === 'BOOLEAN') {
                    value = Math.random() > 0.3 ? 'true' : 'false';
                } else if (question.type === 'TEXT') {
                    value = `Respuesta de ejemplo para ${mun.name}`;
                } else {
                    value = '4'; // Default
                }

                await prisma.answer.create({
                    data: {
                        submissionId: submission.id,
                        questionId: question.id,
                        value: value
                    }
                });
            }
        }

        console.log(`✅ ${mun.name} completed`);
    }

    console.log('🎉 Sample data created successfully!');
    console.log('📊 You can now view charts at /results');
}

createSampleData()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
