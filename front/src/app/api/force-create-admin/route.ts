import { NextResponse } from 'next/server';
import { getDbPath } from '@/lib/dbPath';

export async function GET() {
    try {
        const Database = require('better-sqlite3');
        const db = new Database(getDbPath());

        // First, let's see what users exist
        const existingUsers = db.prepare('SELECT id, username, email, role FROM User LIMIT 10').all();

        // Delete any existing admin users (by email AND username)
        db.prepare("DELETE FROM User WHERE email LIKE '%admin%' OR username = 'admin'").run();

        // Create a fresh admin user with the EXACT structure
        const adminId = 'ADMIN-ID-123';
        const now = new Date().toISOString();
        db.prepare(`
            INSERT INTO User (id, username, email, password, role, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
            adminId,
            'admin',
            'admin@admin.com',
            'admin',
            'ADMIN',
            now,
            now
        );

        // Verify creation
        const newAdmin = db.prepare('SELECT * FROM User WHERE email = ?').get('admin@admin.com');

        db.close();

        return NextResponse.json({
            success: true,
            message: '✅ Admin creado exitosamente',
            existingUsers,
            newAdmin: {
                id: newAdmin.id,
                username: newAdmin.username,
                email: newAdmin.email,
                role: newAdmin.role
            },
            credentials: {
                email: 'admin@admin.com',
                password: 'admin'
            },
            instructions: 'Usa estas credenciales EXACTAS para iniciar sesión'
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
