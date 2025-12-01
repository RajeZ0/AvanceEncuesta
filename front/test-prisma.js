const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

async function main() {
    console.log('Testing Prisma connection...');
    try {
        const users = await prisma.user.findMany();
        console.log('✅ Connection successful!');
        console.log('Users found:', users);
    } catch (error) {
        console.error('❌ Connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
