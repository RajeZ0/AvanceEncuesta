import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        console.log(`Login attempt for ${username}`);

        if (!username || !password) {
            return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
        }

        // Using better-sqlite3 directly instead of Prisma
        const Database = require('better-sqlite3');
        const db = new Database('C:/Users/poopj/Documents/municipal-eval-system/back/dev.db', { readonly: true });

        const user = db.prepare('SELECT * FROM User WHERE username = ?').get(username);
        db.close();

        if (!user || user.password !== password) {
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        const cookieStore = await cookies();
        cookieStore.set('userId', user.id, { httpOnly: true, path: '/' });
        cookieStore.set('userRole', user.role, { httpOnly: true, path: '/' });

        return NextResponse.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({
            error: 'Error interno del servidor',
            details: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
