import { NextResponse } from 'next/server';
import { getDbPath } from '@/lib/dbPath';

export async function GET() {
    try {
        const Database = require('better-sqlite3');
        const db = new Database(getDbPath());

        // Check if column exists first
        const tableInfo = db.prepare("PRAGMA table_info(User)").all();
        const hasSessionToken = tableInfo.some((col: any) => col.name === 'sessionToken');

        if (!hasSessionToken) {
            db.exec('ALTER TABLE User ADD COLUMN sessionToken TEXT;');
            db.close();
            return NextResponse.json({
                success: true,
                message: 'Session token column added successfully',
                action: 'added'
            });
        } else {
            db.close();
            return NextResponse.json({
                success: true,
                message: 'Session token column already exists',
                action: 'none'
            });
        }
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
