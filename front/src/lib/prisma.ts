import { PrismaClient } from '@prisma/client';
import path from 'path';
import { getDbPath } from '@/lib/dbPath';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const dbUrl = `file:${getDbPath()}`;
console.log('Initializing PrismaClient with URL:', dbUrl);

let prismaInstance: PrismaClient;

try {
    prismaInstance = globalForPrisma.prisma || new PrismaClient({
        datasources: {
            db: {
                url: dbUrl,
            },
        },
    });
} catch (error: any) {
    console.error('Failed to initialize PrismaClient:', error);
    const fs = require('fs');
    fs.writeFileSync(path.join(process.cwd(), 'init-error.log'), `Error initializing Prisma: ${error.message}\n${error.stack}`);
    throw error;
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
