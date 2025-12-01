const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'dev.db');
console.log(`🔍 Inspecting database at: ${dbPath}`);

if (!require('fs').existsSync(dbPath)) {
    console.error('❌ Database file not found!');
    process.exit(1);
}

const db = new Database(dbPath);

try {
    // 1. Check Schema
    console.log('\n📊 Checking Schema...');
    const columns = db.prepare("PRAGMA table_info(Submission)").all();
    const completedCol = columns.find(c => c.name === 'completedSectionIds');

    if (completedCol) {
        console.log('✅ Column "completedSectionIds" EXISTS.');
        console.log('   Type:', completedCol.type);
        console.log('   Dflt_value:', completedCol.dflt_value);
        console.log('   NotNull:', completedCol.notnull);
    } else {
        console.error('❌ Column "completedSectionIds" is MISSING!');
    }

    // 2. Check Data
    console.log('\n📊 Checking Data...');
    const user = db.prepare("SELECT * FROM User WHERE username = 'admin'").get();
    if (!user) {
        console.error('❌ Admin user NOT found!');
    } else {
        console.log('✅ Admin user found:', user.id);

        const submission = db.prepare("SELECT * FROM Submission WHERE userId = ?").get(user.id);
        if (!submission) {
            console.error('❌ No submission found for admin user!');
        } else {
            console.log('✅ Submission found:', submission.id);
            console.log('   completedSectionIds value:', submission.completedSectionIds);
            console.log('   Type of value:', typeof submission.completedSectionIds);

            // 3. Simulate Finalize Logic
            console.log('\n🧪 Simulating Finalize Logic...');
            try {
                let completedIds = [];
                if (submission.completedSectionIds) {
                    completedIds = JSON.parse(submission.completedSectionIds);
                }
                console.log('   Parsed completedIds:', completedIds);

                const sectionId = 'test-section-id';
                if (!completedIds.includes(sectionId)) {
                    completedIds.push(sectionId);
                }
                const newJson = JSON.stringify(completedIds);
                console.log('   New JSON to save:', newJson);
                console.log('✅ Logic simulation SUCCESS');
            } catch (err) {
                console.error('❌ Logic simulation FAILED:', err.message);
            }
        }
    }

} catch (err) {
    console.error('❌ Error:', err);
} finally {
    db.close();
}
