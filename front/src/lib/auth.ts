import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function validateSession() {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    const sessionToken = cookieStore.get('sessionToken')?.value;

    if (!userId || !sessionToken) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user || user.sessionToken !== sessionToken) {
        return null;
    }

    return user;
}

export async function requireAuth() {
    const user = await validateSession();
    if (!user) {
        redirect('/login?session=expired');
    }
    return user;
}
