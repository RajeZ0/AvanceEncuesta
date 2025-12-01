const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    console.log('🚀 Starting reproduction script...');

    try {
        // 1. Fetch Admin User
        const user = await prisma.user.findUnique({
            where: { username: 'admin' },
        });

        if (!user) {
            console.error('❌ Admin user not found');
            return;
        }
        console.log('✅ Found user:', user.id);

        // 2. Fetch Submission
        const submission = await prisma.submission.findFirst({
            where: { userId: user.id },
        });

        if (!submission) {
            console.error('❌ No submission found');
            return;
        }
        console.log('✅ Found submission:', submission.id);
        console.log('   Keys:', Object.keys(submission));
        console.log('   completedSectionIds:', submission.completedSectionIds);

        // 3. Simulate Update
        const sectionId = 'test-section-' + Date.now();
        let completedIds = [];
        if (submission.completedSectionIds) {
            try {
                completedIds = JSON.parse(submission.completedSectionIds);
            } catch (e) {
                console.error('⚠️ Error parsing JSON:', e.message);
            }
        }

        if (!completedIds.includes(sectionId)) {
            completedIds.push(sectionId);
            console.log('   Updating with:', JSON.stringify(completedIds));

            const updated = await prisma.submission.update({
                where: { id: submission.id },
                data: {
                    completedSectionIds: JSON.stringify(completedIds),
                },
            });
            console.log('✅ Update successful!', updated.completedSectionIds);
        }

    } catch (error) {
        console.error('❌ CRITICAL ERROR:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
