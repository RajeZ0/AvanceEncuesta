import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: submissionId } = await params;

        // Fetch submission with all related data
        const submission = await prisma.submission.findUnique({
            where: { id: submissionId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        email: true,
                        phone: true,
                        municipality: true,
                        state: true
                    }
                },
                answers: {
                    include: {
                        question: {
                            include: {
                                section: true
                            }
                        }
                    }
                }
            }
        });

        if (!submission) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }

        // Get all sections
        const allSections = await prisma.section.findMany({
            include: {
                questions: true
            },
            orderBy: { order: 'asc' }
        });

        // Calculate per-module breakdown
        const moduleBreakdown = allSections.map(section => {
            const sectionAnswers = submission.answers.filter(
                answer => answer.question.sectionId === section.id
            );

            const totalQuestions = section.questions.length;
            const answeredQuestions = sectionAnswers.length;

            // Calculate module score (average of answered questions, converted to 0-100 scale)
            let moduleScore: number | null = null;
            if (answeredQuestions > 0) {
                const avgScore = sectionAnswers.reduce((sum, ans) => sum + (ans.score || 0), 0) / answeredQuestions;
                // Convert 1-5 scale to 0-100 percentage: (avg / 5) * 100
                moduleScore = (avgScore / 5) * 100;
            }

            // Determine traffic light status based on percentage
            let trafficLight: 'EXCELLENT' | 'INTERMEDIATE' | 'BAD' | 'PENDING' = 'PENDING';
            if (moduleScore !== null) {
                if (moduleScore >= 80) trafficLight = 'EXCELLENT';
                else if (moduleScore >= 50) trafficLight = 'INTERMEDIATE';
                else trafficLight = 'BAD';
            }

            const isCompleted = submission.completedSectionIds
                ? JSON.parse(submission.completedSectionIds).includes(section.id)
                : false;

            return {
                id: section.id,
                name: section.title,
                description: section.description,
                totalQuestions,
                answeredQuestions,
                moduleScore: moduleScore ? Math.round(moduleScore * 10) / 10 : null,
                trafficLight,
                isCompleted,
                answers: sectionAnswers.map(ans => ({
                    questionId: ans.question.id,
                    questionText: ans.question.text,
                    answer: ans.value,
                    score: ans.score
                }))
            };
        });

        // Calculate statistics
        const completedModules = moduleBreakdown.filter(m => m.isCompleted).length;
        const totalModules = allSections.length;

        return NextResponse.json({
            user: {
                id: submission.user.id,
                name: submission.user.name,
                username: submission.user.username,
                email: submission.user.email,
                phone: submission.user.phone,
                municipality: submission.user.municipality,
                state: submission.user.state
            },
            globalScore: submission.score ? Math.round(submission.score * 10) / 10 : null,
            status: submission.status,
            moduleBreakdown,
            statistics: {
                totalModules,
                completedModules,
                startDate: submission.createdAt,
                lastUpdate: submission.updatedAt
            }
        });
    } catch (error) {
        console.error('Error fetching submission details:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
