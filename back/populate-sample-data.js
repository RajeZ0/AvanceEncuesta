const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Municipios del Estado de México
const municipios = [
    { username: 'Municipio de Toluca', municipality: 'Toluca', email: 'toluca@ejemplo.com' },
    { username: 'Municipio de Ecatepec', municipality: 'Ecatepec de Morelos', email: 'ecatepec@ejemplo.com' },
    { username: 'Municipio de Naucalpan', municipality: 'Naucalpan de Juárez', email: 'naucalpan@ejemplo.com' },
    { username: 'Municipio de Metepec', municipality: 'Metepec', email: 'metepec@ejemplo.com' },
    { username: 'Municipio de Nezahualcóyotl', municipality: 'Nezahualcóyotl', email: 'nezahualcoyotl@ejemplo.com' },
];

async function main() {
    console.log('🌱 Poblando base de datos con municipios del Estado de México...\n');

    // Obtener todas las secciones con sus preguntas
    const sections = await prisma.section.findMany({
        include: { questions: true },
        orderBy: { order: 'asc' }
    });

    console.log(`📋 Encontradas ${sections.length} secciones`);

    const hashedPassword = await bcrypt.hash('demo123', 10);

    for (const muni of municipios) {
        console.log(`\n👤 Creando: ${muni.username}`);

        // Eliminar usuario si ya existe
        const existing = await prisma.user.findUnique({ where: { email: muni.email } });
        if (existing) {
            await prisma.answer.deleteMany({ where: { submission: { userId: existing.id } } });
            await prisma.metadatosEvaluacion.deleteMany({ where: { submission: { userId: existing.id } } });
            await prisma.submission.deleteMany({ where: { userId: existing.id } });
            await prisma.user.delete({ where: { id: existing.id } });
        }

        // Crear usuario
        const user = await prisma.user.create({
            data: {
                username: muni.username,
                email: muni.email,
                password: hashedPassword,
                state: 'Estado de México',
                municipality: muni.municipality,
                role: 'USER'
            }
        });

        // Crear submission
        const completedSectionIds = sections.map(s => s.id);
        const submission = await prisma.submission.create({
            data: {
                userId: user.id,
                status: 'COMPLETED',
                completedSectionIds: JSON.stringify(completedSectionIds),
                score: Math.floor(Math.random() * 30) + 60 // Score entre 60-90
            }
        });

        // Crear metadatos
        await prisma.metadatosEvaluacion.create({
            data: {
                submissionId: submission.id,
                nombreMunicipio: muni.municipality,
                estado: 'Estado de México',
                anioCapturo: 2024,
                fechaInicioEvaluacion: new Date(),
                periodoVigencia: '2024-2027',
                poblacion: Math.floor(Math.random() * 500000) + 100000,
                presupuestoAnual: Math.floor(Math.random() * 500000000) + 100000000,
                numeroEmpleados: Math.floor(Math.random() * 5000) + 500,
                presidenteMunicipal: 'Presidente Municipal',
                nombreResponsable: 'Director de Planeación',
                cargoResponsable: 'Director',
                correoInstitucional: muni.email,
                departamento: 'Planeación y Desarrollo'
            }
        });

        // Crear respuestas para cada pregunta
        let answersCreated = 0;
        for (const section of sections) {
            for (const question of section.questions) {
                if (question.type === 'SCALE') {
                    const value = String(Math.floor(Math.random() * 4) + 2);
                    await prisma.answer.create({
                        data: {
                            submissionId: submission.id,
                            questionId: question.id,
                            value: value,
                            score: parseFloat(value)
                        }
                    });
                    answersCreated++;
                } else if (question.type === 'TEXT') {
                    await prisma.answer.create({
                        data: {
                            submissionId: submission.id,
                            questionId: question.id,
                            value: 'Información de ejemplo.',
                            score: 0
                        }
                    });
                    answersCreated++;
                }
            }
        }

        console.log(`   ✅ ${answersCreated} respuestas creadas`);
    }

    // Eliminar municipios de otros estados creados anteriormente
    const oldEmails = ['monterrey@ejemplo.com', 'guadalajara@ejemplo.com', 'merida@ejemplo.com', 'queretaro@ejemplo.com', 'puebla@ejemplo.com'];
    for (const email of oldEmails) {
        const old = await prisma.user.findUnique({ where: { email } });
        if (old) {
            console.log(`🗑️  Eliminando municipio antiguo: ${email}`);
            await prisma.answer.deleteMany({ where: { submission: { userId: old.id } } });
            await prisma.metadatosEvaluacion.deleteMany({ where: { submission: { userId: old.id } } });
            await prisma.submission.deleteMany({ where: { userId: old.id } });
            await prisma.user.delete({ where: { id: old.id } });
        }
    }

    console.log('\n✅ Datos actualizados con municipios del Estado de México!');
    console.log(`📊 ${municipios.length} municipios con evaluaciones completas`);
    console.log('\n💡 Credenciales: demo123');
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
