import { NextResponse } from 'next/server';
import { getDbPath } from '@/lib/dbPath';

export async function GET() {
    try {
        const Database = require('better-sqlite3');
        const db = new Database(getDbPath());

        const log: string[] = [];

        // Step 1: Delete ALL users with username 'admin' or email containing 'admin'
        log.push('Paso 1: Eliminando usuarios admin existentes...');
        const deleted = db.prepare("DELETE FROM User WHERE username = 'admin' OR email LIKE '%admin%'").run();
        log.push(`✓ Eliminados: ${deleted.changes} usuarios`);

        // Step 2: Create new admin
        log.push('\nPaso 2: Creando nuevo usuario admin...');
        const now = new Date().toISOString();
        db.prepare(`
            INSERT INTO User (id, username, email, password, role, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
            'ADMIN-FINAL-ID',
            'superadmin',
            'admin@admin.com',
            'admin123',
            'ADMIN',
            now,
            now
        );
        log.push('✓ Usuario admin creado');

        // Step 3: Verify it exists
        log.push('\nPaso 3: Verificando creación...');
        const admin = db.prepare('SELECT * FROM User WHERE email = ?').get('admin@admin.com');
        log.push(`✓ Usuario encontrado: ${admin.username} (${admin.email})`);

        // Step 4: Test login credentials
        log.push('\nPaso 4: Probando credenciales...');
        const testLogin = db.prepare('SELECT * FROM User WHERE email = ? AND password = ?').get('admin@admin.com', 'admin123');

        if (testLogin) {
            log.push('✅ LOGIN EXITOSO! Las credenciales funcionan correctamente.');
        } else {
            log.push('❌ Error: Las credenciales no funcionan');
        }

        db.close();

        return NextResponse.json({
            success: true,
            log,
            credentials: {
                email: 'admin@admin.com',
                password: 'admin123',
                verified: !!testLogin
            },
            adminUser: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                role: admin.role
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
