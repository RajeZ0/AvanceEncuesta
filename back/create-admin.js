const Database = require('better-sqlite3');
const path = require('path');
const { randomUUID } = require('crypto');

const dbPath = path.join(__dirname, 'dev.db');
const db = new Database(dbPath);

try {
    // Check if admin already exists
    const existingAdmin = db.prepare('SELECT * FROM User WHERE email = ?').get('admin@meplansus.com');

    if (existingAdmin) {
        console.log('ℹ️  Usuario admin ya existe');
        console.log('📧 Email: admin@meplansus.com');
        console.log('🔑 Password: admin123');
    } else {
        // Create admin user
        const adminId = randomUUID();
        db.prepare(`
            INSERT INTO User (id, username, email, password, name, municipality, role, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `).run(
            adminId,
            'admin',
            'admin@meplansus.com',
            'admin123',
            'Administrador MEPLANSUS',
            'Toluca',
            'ADMIN'
        );

        console.log('✅ Usuario admin creado exitosamente!');
        console.log('');
        console.log('📋 Credenciales de acceso:');
        console.log('📧 Email: admin@meplansus.com');
        console.log('🔑 Password: admin123');
        console.log('');
        console.log('🎯 Puedes iniciar sesión con estas credenciales para acceder al panel de administración');
    }
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
} finally {
    db.close();
}
