import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const sectionId = resolvedParams.id;
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const submission = await prisma.submission.findFirst({
            where: { userId },
        });

        if (!submission) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }

        const completedIds = submission.completedSectionIds ? JSON.parse(submission.completedSectionIds) : [];

        if (!completedIds.includes(sectionId)) {
            completedIds.push(sectionId);
            console.log('Updating submission with completedIds:', completedIds);
            await prisma.submission.update({
                where: { id: submission.id },
                data: {
                    completedSectionIds: JSON.stringify(completedIds),
                },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error in finalize route:', error);
        return NextResponse.json({
            error: 'Error finalizing section',
            details: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
