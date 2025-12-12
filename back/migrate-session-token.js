const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'dev.db');
const db = new Database(dbPath);

try {
    // Add sessionToken column to User table
    db.exec('ALTER TABLE User ADD COLUMN sessionToken TEXT;');
    console.log('✅ Successfully added sessionToken column to User table');
} catch (error) {
    if (error.message.includes('duplicate column name')) {
        console.log('ℹ️  sessionToken column already exists');
    } else {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
} finally {
    db.close();
}
