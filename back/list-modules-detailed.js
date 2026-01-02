const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listModulesDetailed() {
    try {
        const sections = await prisma.section.findMany({
            include: {
                questions: true
            },
            orderBy: {
                order: 'asc'
            }
        });

        console.log('\n=== MÓDULOS CON DETALLE ===\n');

        for (const section of sections) {
            console.log(`📋 Módulo ${section.order}: ${section.title}`);
            console.log(`   ID: ${section.id}`);
            console.log(`   Preguntas: ${section.questions.length}`);
            if (section.questions.length > 0) {
                console.log(`   Primera pregunta: ${section.questions[0].text.substring(0, 50)}...`);
            }
            console.log('---\n');
        }

        const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);
        console.log(`\n✅ Total: ${sections.length} módulos, ${totalQuestions} preguntas\n`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

listModulesDetailed();
