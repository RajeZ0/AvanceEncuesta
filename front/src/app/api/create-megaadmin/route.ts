import { NextResponse } from 'next/server';
import { getDbPath } from '@/lib/dbPath';

export async function GET() {
    try {
        const Database = require('better-sqlite3');
        const db = new Database(getDbPath());

        // Check if megaadmin exists
        const existing = db.prepare('SELECT * FROM User WHERE email = ?').get('megaadmin@system.com');

        if (existing) {
            // Already exists, just return credentials
            db.close();
            return NextResponse.json({
                success: true,
                message: '✅ Usuario MEGAADMIN ya existe y está listo',
                credentials: {
                    email: 'megaadmin@system.com',
                    password: 'mega123',
                    note: 'USA ESTAS CREDENCIALES PARA INICIAR SESIÓN'
                },
                existingUser: {
                    username: existing.username,
                    email: existing.email,
                    role: existing.role
                }
            });
        }

        // Create fresh admin with unique credentials
        const now = new Date().toISOString();
        db.prepare(`
            INSERT INTO User (id, username, email, password, role, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
            'MEGAADMIN-' + Date.now(),
            'megaadmin',
            'megaadmin@system.com',
            'mega123',
            'ADMIN',
            now,
            now
        );

        // Verify
        const created = db.prepare('SELECT * FROM User WHERE email = ?').get('megaadmin@system.com');
        const loginTest = db.prepare('SELECT * FROM User WHERE email = ? AND password = ?').get('megaadmin@system.com', 'mega123');

        db.close();

        return NextResponse.json({
            success: true,
            message: '✅ Usuario MEGAADMIN creado exitosamente!',
            loginTestPassed: !!loginTest,
            credentials: {
                email: 'megaadmin@system.com',
                password: 'mega123',
                note: 'USA ESTAS CREDENCIALES PARA INICIAR SESIÓN'
            },
            createdUser: {
                id: created.id,
                username: created.username,
                email: created.email,
                role: created.role
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
