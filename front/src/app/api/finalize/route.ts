import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';


export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const submission = await prisma.submission.findFirst({
            where: {
                userId,
                status: { not: 'SUBMITTED' }
            },
            include: { answers: true },
            orderBy: { createdAt: 'desc' }
        });

        if (!submission) {
            // Try to find any submission for this user
            const anySubmission = await prisma.submission.findFirst({
                where: { userId },
                orderBy: { createdAt: 'desc' }
            });

            if (anySubmission?.status === 'SUBMITTED') {
                return NextResponse.json({ error: 'Esta evaluación ya fue enviada anteriormente', alreadySubmitted: true }, { status: 400 });
            }
            return NextResponse.json({ error: 'No active submission found' }, { status: 404 });
        }

        const sections = await prisma.section.findMany({
            include: { questions: true },
        });

        let totalScore = 0;
        let totalWeight = 0;

        for (const section of sections) {
            let sectionScore = 0;
            let maxSectionScore = 0;

            for (const question of section.questions) {
                const answer = submission.answers.find(a => a.questionId === question.id);

                maxSectionScore += question.weight;

                if (answer && answer.score !== null) {
                    sectionScore += answer.score;
                }
            }

            if (maxSectionScore > 0) {
                const sectionPercentage = (sectionScore / maxSectionScore) * 100;
                totalScore += (sectionPercentage * section.weight) / 100;
                totalWeight += section.weight;
            }
        }

        const finalScore = totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;

        await prisma.submission.update({
            where: { id: submission.id },
            data: {
                status: 'SUBMITTED',
                score: finalScore,
            },
        });

        return NextResponse.json({ success: true, score: finalScore });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error finalizing submission' }, { status: 500 });
    }
}
