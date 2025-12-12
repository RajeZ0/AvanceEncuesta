import { NextResponse } from 'next/server';
import { getDbPath } from '@/lib/dbPath';

export async function GET() {
    try {
        const Database = require('better-sqlite3');
        const db = new Database(getDbPath());

        // Get table schema
        const schema = db.prepare("PRAGMA table_info(User)").all();

        // Get all users
        const users = db.prepare('SELECT * FROM User').all();

        // Try to find admin
        const adminByEmail = db.prepare('SELECT * FROM User WHERE email LIKE ?').get('%admin%');
        const adminByUsername = db.prepare('SELECT * FROM User WHERE username = ?').get('admin');

        db.close();

        return NextResponse.json({
            success: true,
            tableSchema: schema,
            totalUsers: users.length,
            users: users.map((u: any) => ({
                id: u.id,
                username: u.username,
                email: u.email,
                role: u.role,
                password: u.password // showing for debug only
            })),
            adminByEmail,
            adminByUsername
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
