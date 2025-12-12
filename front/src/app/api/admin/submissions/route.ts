import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';


export async function GET() {
    const cookieStore = await cookies();
    const userRole = cookieStore.get('userRole')?.value;

    if (userRole !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const submissions = await prisma.submission.findMany({
            include: {
                user: {
                    select: {
                        username: true,
                        municipality: true
                    },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        return NextResponse.json(submissions);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
    }
}
