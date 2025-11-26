import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardClient } from './DashboardClient';

const prisma = new PrismaClient();

async function getSections() {
    return await prisma.section.findMany({
        orderBy: { order: 'asc' },
        include: {
            _count: {
                select: { questions: true },
            },
        },
    });
}

async function logout() {
    'use server';
    const cookieStore = await cookies();
    cookieStore.delete('userId');
    cookieStore.delete('userRole');
    redirect('/login');
}

export default async function Dashboard() {
    const sections = await getSections();
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) redirect('/login');

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) redirect('/login');

    return <DashboardClient sections={sections} user={user} />;
}
