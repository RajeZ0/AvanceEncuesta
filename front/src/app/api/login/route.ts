import { NextResponse } from 'next/server';
import { getDbPath } from '@/lib/dbPath';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        console.log(`Login attempt for ${email}`);

        if (!email || !password) {
            return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 });
        }

        // Using better-sqlite3 directly
        const Database = require('better-sqlite3');
        const db = new Database(getDbPath());

        const user = db.prepare('SELECT * FROM User WHERE email = ?').get(email);

        if (!user || user.password !== password) {
            db.close();
            return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
        }

        // Generate new session token
        const sessionToken = crypto.randomBytes(32).toString('hex');

        // Update user with new session token (this invalidates previous sessions)
        db.prepare('UPDATE User SET sessionToken = ? WHERE id = ?').run(sessionToken, user.id);
        db.close();

        const cookieStore = await cookies();
        cookieStore.set('userId', user.id, { httpOnly: true, path: '/' });
        cookieStore.set('userRole', user.role, { httpOnly: true, path: '/' });
        cookieStore.set('sessionToken', sessionToken, { httpOnly: true, path: '/' });

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
