import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const section = await prisma.section.findUnique({
        where: { id: resolvedParams.id },
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
        where: {
            userId,
            status: 'IN_PROGRESS'
        },
        include: {
            answers: {
                where: {
                    questionId: {
                        in: section.questions.map(q => q.id)
                    }
                }
            }
        }
    });

    // Transform answers into a map for easier frontend consumption
    const answersMap: Record<string, string> = {};
    if (submission) {
        submission.answers.forEach(ans => {
            answersMap[ans.questionId] = ans.value;
        });
    }

    return NextResponse.json({
        ...section,
        savedAnswers: answersMap
    });
}
