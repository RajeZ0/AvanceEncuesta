import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { sectionId, answers } = body;

        const user = await validateSession();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized or session expired' }, { status: 401 });
        }
        const userId = user.id;


        let submission = await prisma.submission.findFirst({
            where: { userId, status: 'IN_PROGRESS' },
        });

        if (!submission) {
            submission = await prisma.submission.create({
                data: {
                    userId,
                    status: 'IN_PROGRESS',
                },
            });
        }

        const answerPromises = Object.entries(answers).map(async ([questionId, value]) => {
            let score = 0;
            const question = await prisma.question.findUnique({ where: { id: questionId } });

            if (question) {
                if (question.type === 'SCALE') {
                    score = (Number(value) / 5) * question.weight;
                } else if (question.type === 'BOOLEAN') {
                    score = value === 'true' ? question.weight : 0;
                }
            }

            await prisma.answer.deleteMany({
                where: {
                    submissionId: submission.id,
                    questionId: questionId,
                }
            });

            return prisma.answer.create({
                data: {
                    submissionId: submission.id,
                    questionId,
                    value: String(value),
                    score,
                },
            });
        });

        await Promise.all(answerPromises);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error saving answers' }, { status: 500 });
    }
}
