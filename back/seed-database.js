const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedDatabase() {
    try {
        console.log('🌱 Poblando base de datos...\n');

        // Limpiar datos existentes (excepto usuarios)
        await prisma.answer.deleteMany({});
        await prisma.question.deleteMany({});
        await prisma.section.deleteMany({});

        console.log('✅ Datos anteriores limpiados\n');

        // Crear módulos
        const modulos = [
            {
                order: 0,
                title: 'Identificación y Contexto',
                description: 'Datos generales del municipio'
            },
            {
                order: 1,
                title: 'Contexto Institucional',
                description: 'Marco institucional y capacidad organizacional'
            },
            {
                order: 2,
                title: 'Evaluación Estratégica',
                description: 'Planificación estratégica y alineación de objetivos'
            },
            {
                order: 3,
                title: 'Efectividad de la Planificación',
                description: 'Implementación y seguimiento'
            },
            {
                order: 4,
                title: 'Participación e Inclusión',
                description: 'Involucramiento ciudadano y stakeholders'
            },
            {
                order: 5,
                title: 'Análisis de Resultados e Impacto ODS',
                description: 'Medición de resultados y alineación con ODS'
            }
        ];

        console.log('📊 Creando módulos...');
        for (const modulo of modulos) {
            await prisma.section.create({
                data: modulo
            });
            console.log(`   ✅ Módulo ${modulo.order}: ${modulo.title}`);
        }

        console.log('\n✅ Base de datos poblada exitosamente!\n');
        console.log('📝 Resumen:');
        console.log(`   - ${modulos.length} módulos creados`);
        console.log('\n🚀 Ahora ejecuta: node update-questions-final.js');

    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedDatabase();
