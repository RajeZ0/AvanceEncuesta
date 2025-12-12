const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// Read the migration SQL
const migrationSQL = fs.readFileSync(
  path.join(__dirname, 'migrations', '20251119193715_init', 'migration.sql'),
  'utf8'
);

const db = new Database(path.join(__dirname, 'dev.db'));

try {
  console.log('🗑️  Dropping existing tables...');
  db.exec(`
    DROP TABLE IF EXISTS Answer;
    DROP TABLE IF EXISTS Submission;
    DROP TABLE IF EXISTS Question;
    DROP TABLE IF EXISTS Section;
    DROP TABLE IF EXISTS User;
  `);
  console.log('✅ Existing tables dropped');

  console.log('📦 Creating tables...');
  db.exec(migrationSQL);
  console.log('✅ Tables created');

  // Create admin user
  const userId = 'admin-' + Date.now();
  db.prepare(`
    INSERT INTO User (id, username, password, role, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
  `).run(userId, 'admin', 'adminpassword', 'ADMIN');
  console.log('✅ Admin user created');

  // Create a sample section
  const sectionId = 'section-' + Date.now();
  db.prepare(`
    INSERT INTO Section (id, title, description, weight, "order")
    VALUES (?, ?, ?, ?, ?)
  `).run(sectionId, 'Evaluación General', 'Sección de evaluación general', 20, 1);
  console.log('✅ Sample section created');

  // Create a sample question
  const questionId = 'question-' + Date.now();
  db.prepare(`
    INSERT INTO Question (id, text, type, weight, "order", sectionId)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(questionId, '¿El municipio cuenta con un plan de desarrollo?', 'BOOLEAN', 1, 1, sectionId);
  console.log('✅ Sample question created');

  console.log('\n🎉 Database initialized successfully!');
  console.log('Username: admin');
  console.log('Password: adminpassword');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} finally {
  db.close();
}
