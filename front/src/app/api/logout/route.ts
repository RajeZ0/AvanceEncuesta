import { NextResponse } from 'next/server';
import { getDbPath } from '@/lib/dbPath';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('userId')?.value;

        // Clear session token from database
        if (userId) {
            const Database = require('better-sqlite3');
            const db = new Database(getDbPath());
            db.prepare('UPDATE User SET sessionToken = NULL WHERE id = ?').run(userId);
            db.close();
        }

        // Clear cookies
        cookieStore.delete('userId');
        cookieStore.delete('userRole');
        cookieStore.delete('sessionToken');

        return NextResponse.redirect(new URL('/login', request.url));
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'Error al cerrar sesión' }, { status: 500 });
    }
}
