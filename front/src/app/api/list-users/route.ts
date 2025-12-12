import { NextResponse } from 'next/server';
import { getDbPath } from '@/lib/dbPath';

export async function GET() {
    try {
        const Database = require('better-sqlite3');
        const db = new Database(getDbPath());

        // Get all users to debug
        const allUsers = db.prepare('SELECT id, username, email, role FROM User').all();

        db.close();

        return NextResponse.json({
            success: true,
            users: allUsers,
            count: allUsers.length
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
