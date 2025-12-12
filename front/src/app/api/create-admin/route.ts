import { NextResponse } from 'next/server';
import { getDbPath } from '@/lib/dbPath';

export async function GET() {
    try {
        const Database = require('better-sqlite3');
        const db = new Database(getDbPath());

        // First, check if admin exists
        try {
            const existingAdmin = db.prepare('SELECT id, username, email, role FROM User WHERE email = ?').get('admin@meplansus.com');

            if (existingAdmin) {
                db.close();
                return NextResponse.json({
                    success: true,
                    alreadyExists: true,
                    message: 'Usuario admin ya existe',
                    adminInfo: existingAdmin,
                    credentials: {
                        email: 'admin@meplansus.com',
                        password: 'admin123'
                    }
                });
            }
        } catch (selectError) {
            // User doesn't exist, continue to create
        }

        // Delete any existing admin user first (in case of corrupted data)
        try {
            db.prepare('DELETE FROM User WHERE email = ?').run('admin@meplansus.com');
        } catch (e) {
            // Ignore if doesn't exist
        }

        // Create new admin user
        const adminId = 'admin-' + Date.now();

        db.prepare(`
            INSERT INTO User (id, username, email, password, name, municipality, state, role)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            adminId,
            'admin',
            'admin@meplansus.com',
            'admin123',
            'Administrador MEPLANSUS',
            'Toluca',
            'Estado de México',
            'ADMIN'
        );

        // Verify it was created
        const createdAdmin = db.prepare('SELECT id, username, email, role FROM User WHERE email = ?').get('admin@meplansus.com');

        db.close();

        return NextResponse.json({
            success: true,
            created: true,
            message: '✅ Usuario admin creado exitosamente',
            adminInfo: createdAdmin,
            credentials: {
                email: 'admin@meplansus.com',
                password: 'admin123',
                note: 'Usa estos datos para iniciar sesión'
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
