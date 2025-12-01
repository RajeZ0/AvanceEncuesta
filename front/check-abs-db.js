const Database = require('better-sqlite3');
const path = 'c:/Users/poopj/Documents/municipal-eval-system/back/dev.db';

try {
    console.log(`Checking DB at: ${path}`);
    const db = new Database(path, { readonly: true });

    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('Tables:', tables.map(t => t.name));

    const users = db.prepare("SELECT * FROM User").all();
    console.log('Users:', users);

    db.close();
} catch (error) {
    console.error('❌ Error:', error);
}
