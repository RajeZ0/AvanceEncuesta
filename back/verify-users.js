const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Verificando usuarios en la base de datos...\n');

    // Get all users
    const users = await prisma.user.findMany({
        select: {
            id: true,
            username: true,
            email: true,
            role: true
        }
    });

    console.log(`📊 Total de usuarios: ${users.length}\n`);

    if (users.length === 0) {
        console.log('⚠️  No hay usuarios en la base de datos!\n');
        console.log('Creando usuario admin...\n');

        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.create({
            data: {
                username: 'Admin MEPLANSUS',
                email: 'admin@meplansus.com',
                password: hashedPassword,
                role: 'ADMIN'
            }
        });

        console.log('✅ Usuario admin creado!\n');
    }

    // List all users
    console.log('👥 Usuarios encontrados:\n');
    users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.username}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log('');
    });

    // Test admin password
    const admin = await prisma.user.findUnique({
        where: { email: 'admin@meplansus.com' }
    });

    if (admin) {
        console.log('🔑 Verificando password del admin...');
        const testPassword = await bcrypt.compare('admin123', admin.password);
        console.log(`   Password 'admin123' válido: ${testPassword ? '✅ SÍ' : '❌ NO'}\n');
        
        if (!testPassword) {
            console.log('⚠️  Password incorrecto! Actualizando...\n');
            const newHash = await bcrypt.hash('admin123', 10);
            await prisma.user.update({
                where: { email: 'admin@meplansus.com' },
                data: { password: newHash }
            });
            console.log('✅ Password actualizado a: admin123\n');
        }
    }

    console.log('🔑 CREDENCIALES VÁLIDAS:');
    console.log('   Email: admin@meplansus.com');
    console.log('   Password: admin123');
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
