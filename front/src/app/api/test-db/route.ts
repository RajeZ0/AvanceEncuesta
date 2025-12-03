import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const Database = require('better-sqlite3');
        const db = new Database('C:/Users/poopj/Documents/municipal-eval-system/back/dev.db', { readonly: true });

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
