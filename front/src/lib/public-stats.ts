import { prisma } from '@/lib/prisma';

export async function getPublicStats() {
    const totalUsers = await prisma.user.count({
        where: { role: 'USER' }
    });

    const activeMunicipalities = await prisma.user.groupBy({
        by: ['municipality'],
        where: { role: 'USER', municipality: { not: null } },
        _count: { municipality: true }
    });

    const submissions = await prisma.submission.findMany({
        where: { status: 'SUBMITTED' },
        select: { score: true }
    });

    // Calculate average score
    const totalScore = submissions.reduce((acc, sub) => acc + (sub.score || 0), 0);
    const averageScore = submissions.length > 0 ? totalScore / submissions.length : 0;

    // Get participation by municipality (Top 5)
    // Note: SQLite might have limitations with sophisticated groupBys in Prisma, let's do simple processing
    const municipalityCounts = activeMunicipalities
        .map(m => ({ name: m.municipality || 'Desconocido', count: m._count.municipality }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    return {
        totalUsers,
        totalMunicipalities: activeMunicipalities.length,
        averageScore,
        municipalityCounts,
        completedEvaluations: submissions.length
    };
}
