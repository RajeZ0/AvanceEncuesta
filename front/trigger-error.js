const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // 1. Get Admin User
        const user = await prisma.user.findUnique({
            where: { username: 'admin' },
        });
        if (!user) {
            console.error('❌ Admin user not found');
            return;
        }
        console.log('✅ User:', user.id);

        // 2. Get a Section
        const section = await prisma.section.findFirst();
        if (!section) {
            console.error('❌ No section found');
            return;
        }
        console.log('✅ Section:', section.id);

        // 3. Make Request
        const url = `http://localhost:3000/api/section/${section.id}/finalize`;
        console.log('🚀 Sending POST to:', url);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Cookie': `userId=${user.id}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('STATUS:', response.status);
        const text = await response.text();
        console.log('BODY:', text);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
