import { NextResponse } from 'next/server';
import { getDbPath } from '@/lib/dbPath';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { action } = body;

        const Database = require('better-sqlite3');
        const db = new Database(getDbPath());

        if (action === 'create') {
            // Delete existing admin if any
            db.prepare('DELETE FROM User WHERE email = ?').run('admin@admin.com');

            // Create admin
            db.prepare(`
                INSERT INTO User (id, username, email, password, name, municipality, state, role)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
                'admin-user-id',
                'admin',
                'admin@admin.com',
                'admin',
                'Administrador',
                'Toluca',
                'Estado de México',
                'ADMIN'
            );

            const admin = db.prepare('SELECT id, username, email, role FROM User WHERE email = ?').get('admin@admin.com');
            db.close();

            return NextResponse.json({
                success: true,
                message: 'Admin creado',
                admin,
                credentials: { email: 'admin@admin.com', password: 'admin' }
            });
        }

        if (action === 'list') {
            const users = db.prepare('SELECT id, username, email, role FROM User').all();
            db.close();
            return NextResponse.json({ success: true, users });
        }

        db.close();
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
