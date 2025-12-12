import { NextResponse } from 'next/server';
import { getDbPath } from '@/lib/dbPath';

export async function GET() {
    try {
        const Database = require('better-sqlite3');
        const db = new Database(getDbPath(), { readonly: true });

        const users = db.prepare('SELECT * FROM User').all();
        db.close();

        return NextResponse.json({ success: true, users });
    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
