const Database = require('better-sqlite3');
const path = require('path');

// Try to locate the database. It might be in front/dev.db or back/dev.db or back/prisma/dev.db
// Based on previous steps, we copied it to front/dev.db, but let's check where the app is looking.
// The .env says file:./dev.db in front/.env.

const pathsToCheck = [
    path.join(__dirname, 'dev.db'),
    path.join(__dirname, '../back/dev.db'),
    path.join(__dirname, '../back/prisma/dev.db')
];

pathsToCheck.forEach(dbPath => {
    console.log(`\n🔍 Inspecting database at: ${dbPath}`);
    if (!require('fs').existsSync(dbPath)) {
        console.log('❌ File not found');
        return;
    }

    const db = new Database(dbPath, { verbose: null }); // Turn off verbose for cleaner output
    try {
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        console.log(`Tables found: ${tables.map(t => t.name).join(', ')}`);

        if (tables.some(t => t.name === 'Submission')) {
            const columns = db.prepare("PRAGMA table_info(Submission)").all();
            const hasColumn = columns.some(c => c.name === 'completedSectionIds');
            console.log(`Column "completedSectionIds": ${hasColumn ? '✅ EXISTS' : '❌ MISSING'}`);

            if (hasColumn) {
                const rows = db.prepare("SELECT id, completedSectionIds FROM Submission").all();
                console.log('Row values:', rows);
            }
        }
    } catch (e) {
        console.log('Error reading DB:', e.message);
    } finally {
        db.close();
    }
});
process.exit(0);


const db = new Database(dbPath, { verbose: console.log });

try {
    console.log('\n📊 Checking Submission table schema...');
    const columns = db.prepare("PRAGMA table_info(Submission)").all();
    console.log('Columns:', columns.map(c => c.name).join(', '));

    const hasColumn = columns.some(c => c.name === 'completedSectionIds');
    if (hasColumn) {
        console.log('✅ Column "completedSectionIds" EXISTS.');
    } else {
        console.error('❌ Column "completedSectionIds" is MISSING!');
    }

    console.log('\n📊 Checking recent submissions...');
    const submissions = db.prepare("SELECT * FROM Submission ORDER BY updatedAt DESC LIMIT 5").all();
    console.log(submissions);

    console.log('\n📊 Checking Answer table...');
    const answerCount = db.prepare("SELECT COUNT(*) as count FROM Answer").get();
    console.log(`Total answers: ${answerCount.count}`);

} catch (err) {
    console.error('❌ Error inspecting database:', err);
} finally {
    db.close();
}
