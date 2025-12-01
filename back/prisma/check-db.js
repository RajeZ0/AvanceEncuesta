const db = require('better-sqlite3')('../back/dev.db', { readonly: true });

try {
    // Get all tables
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
    console.log('📊 Tables in database:');
    tables.forEach(t => console.log(`  - ${t.name}`));

    // Get User table structure
    console.log('\n👤 User table structure:');
    const userInfo = db.prepare("PRAGMA table_info(User)").all();
    userInfo.forEach(col => console.log(`  - ${col.name}: ${col.type}`));

    // Count users
    const userCount = db.prepare("SELECT COUNT(*) as count FROM User").get();
    console.log(`\n✅ Total users: ${userCount.count}`);

    // Show users
    const users = db.prepare("SELECT id, username, role FROM User").all();
    console.log('\n📋 Users:');
    users.forEach(u => console.log(`  - ${u.username} (${u.role})`));

} catch (error) {
    console.error('❌ Error:', error.message);
} finally {
    db.close();
}
