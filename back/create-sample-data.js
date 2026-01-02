const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🎨 Creating sample data...');

    // Get sections and questions
    const sections = await prisma.section.findMany({
        include: { questions: true }
    });

    if (sections.length === 0) {
        console.log('❌ No sections found. Run seed first.');
        process.exit(1);
    }

    console.log(`Found ${sections.length} sections`);

    // Create 3 municipalities
    const municipalities = [
        { name: 'Toluca', state: 'Estado de México' },
        { name: 'Metepec', state: 'Estado de México' },
        { name: 'Lerma', state: 'Estado de México' }
    ];

    for (const mun of municipalities) {
        const email = `${mun.name.toLowerCase()}@demo.com`;

        // Create or get user
        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                username: mun.name.toLowerCase(),
                email,
                password: 'demo123',
                role: 'USER',
                name: `Municipio de ${mun.name}`,
                municipality: mun.name,
                state: mun.state
            }
        });

        console.log(`Creating submission for ${mun.name}...`);

        // Create submission
        const submission = await prisma.submission.create({
            data: {
                userId: user.id,
                userId: user.id,
                status: 'COMPLETED'
            }
        });

        // Create answers for all questions
        let answerCount = 0;
        for (const section of sections) {
            for (const question of section.questions) {
                // Random score between 3-5
                const score = 3 + Math.floor(Math.random() * 3);

                await prisma.answer.create({
                    data: {
                        submissionId: submission.id,
                        questionId: question.id,
                        value: score.toString()
                    }
                });
                answerCount++;
            }
        }

        console.log(`✅ ${mun.name}: ${answerCount} answers created`);
    }

    console.log('🎉 Sample data created successfully!');
    console.log('📊 Visit http://localhost:3000/results to see charts');
}

main()
    .catch(e => {
        console.error('Error:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
