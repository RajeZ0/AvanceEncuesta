import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const cookieStore = await cookies();
    cookieStore.delete('userId');
    cookieStore.delete('userRole');

    const url = new URL(request.url);
    return NextResponse.redirect(new URL('/', url.origin));
}
