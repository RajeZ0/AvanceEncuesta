import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const sectionId = resolvedParams.id;
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const section = await prisma.section.findUnique({
        where: { id: sectionId },
        include: {
            questions: {
                orderBy: { order: 'asc' },
            },
        },
    });

    if (!section) {
        return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    // Fetch user's active submission and answers for this section
    const submission = await prisma.submission.findFirst({
        where: { userId },
        include: { answers: true },
    });

    // Transform answers into a map for easier frontend consumption
    const savedAnswers: Record<string, string> = {};
    let isCompleted = false;

    if (submission) {
        // Filter answers to only include those relevant to the current section's questions
        const sectionQuestionIds = section.questions.map(q => q.id);
        submission.answers.forEach(ans => {
            if (sectionQuestionIds.includes(ans.questionId)) {
                savedAnswers[ans.questionId] = ans.value;
            }
        });

        const completedIds = submission.completedSectionIds ? JSON.parse(submission.completedSectionIds) : [];
        isCompleted = completedIds.includes(sectionId);
    }

    return NextResponse.json({
        ...section,
        savedAnswers,
        isCompleted
    });
}
