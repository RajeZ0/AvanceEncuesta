import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { DashboardClient } from './DashboardClient';
import { requireAuth } from '@/lib/auth';


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
    cookieStore.delete('sessionToken');
    redirect('/login');
}

export default async function Dashboard() {
    // Validate session strictly
    const user = await requireAuth();
    const sections = await getSections();

    if (!user) {
        redirect('/api/auth/clear-session');
    }

    const submission = await prisma.submission.findFirst({
        where: { userId: user.id },
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
