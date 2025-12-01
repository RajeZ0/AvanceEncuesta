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

    if (!user) {
        redirect('/api/auth/clear-session');
    }

    const submission = await prisma.submission.findFirst({
        where: { userId },
        include: {
            answers: {
                include: {
                    question: true,
                },
            },
        },
    });

    const completedSectionIds = submission?.completedSectionIds ? JSON.parse(submission.completedSectionIds) : [];

    // Calculate Score
    let totalScore = 0;
    if (submission?.answers) {
        const answersBySection: Record<string, number> = {};

        // Group answer values by section
        submission.answers.forEach(ans => {
            const sectionId = ans.question.sectionId;
            if (!answersBySection[sectionId]) answersBySection[sectionId] = 0;
            // Assuming value is 1-5 for SCALE. If BOOLEAN, handle differently or assume 0/1?
            // The seed uses SCALE for almost everything.
            // For BOOLEAN, value is 'true'/'false'.
            let val = 0;
            if (ans.question.type === 'SCALE') {
                val = Number(ans.value) || 0;
            } else if (ans.question.type === 'BOOLEAN') {
                val = ans.value === 'true' ? 5 : 0; // Map boolean to 0-5 scale for simplicity? Or use weight?
                // Actually, let's stick to the simple sum for now as per seed structure (mostly SCALE).
            }
            answersBySection[sectionId] += val;
        });

        // Calculate weighted score per section
        sections.forEach(section => {
            const sectionTotal = answersBySection[section.id] || 0;
            const maxSectionScore = section._count.questions * 5; // Max possible if all are 5

            if (maxSectionScore > 0) {
                const sectionWeight = section.weight;
                const weightedSectionScore = (sectionTotal / maxSectionScore) * sectionWeight;
                totalScore += weightedSectionScore;
            }
        });
    }

    return <DashboardClient sections={sections} user={user} completedSectionIds={completedSectionIds} currentScore={totalScore} />;
}
