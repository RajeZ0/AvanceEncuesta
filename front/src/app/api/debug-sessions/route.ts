import { NextResponse } from 'next/server';
import { getDbPath } from '@/lib/dbPath';

export async function GET() {
    try {
        const Database = require('better-sqlite3');
        const db = new Database(getDbPath(), { readonly: true });

        // Get all users with their session tokens
        const users = db.prepare('SELECT id, username, email, sessionToken FROM User').all();

        db.close();

        return NextResponse.json({
            success: true,
            users,
            count: users.length
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
