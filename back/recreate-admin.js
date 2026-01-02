const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🔑 Verificando usuario admin...');

    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
        where: { email: 'admin@meplansus.com' }
    });

    if (existingAdmin) {
        console.log('   ⚠️  Admin ya existe, eliminando...');
        await prisma.user.delete({
            where: { email: 'admin@meplansus.com' }
        });
    }

    // Create admin user
    console.log('   👤 Creando nuevo usuario admin...');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.create({
        data: {
            username: 'Admin MEPLANSUS',
            email: 'admin@meplansus.com',
            password: hashedPassword,
            role: 'ADMIN'
        }
    });

    console.log('');
    console.log('✅ Usuario admin creado exitosamente!');
    console.log('');
    console.log('🔑 Credenciales:');
    console.log('   Email: admin@meplansus.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('💡 Ahora intenta hacer login en http://localhost:3000');
    console.log('');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
