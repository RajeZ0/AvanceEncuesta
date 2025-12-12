import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. Gobernanza y Liderazgo (20%)
    const section1 = await prisma.section.create({
        data: {
            title: 'Gobernanza y Liderazgo',
            description: 'Evalúa la estructura administrativa, el liderazgo y la planificación estratégica del ayuntamiento.',
            weight: 20,
            order: 1,
            questions: {
                create: [
                    {
                        text: '¿El ayuntamiento cuenta con un Plan Municipal de Desarrollo actualizado y alineado a los ODS?',
                        type: 'BOOLEAN',
                        weight: 2,
                        order: 1,
                    },
                    {
                        text: '¿Se realizan reuniones de cabildo con la periodicidad establecida por la ley?',
                        type: 'SCALE',
                        weight: 1,
                        order: 2,
                    },
                    {
                        text: 'Describa brevemente los mecanismos de participación ciudadana implementados.',
                        type: 'TEXT',
                        weight: 0,
                        order: 3,
                    },
                ],
            },
        },
    });

    // 2. Hacienda Pública y Gestión Financiera (20%)
    const section2 = await prisma.section.create({
        data: {
            title: 'Hacienda Pública y Gestión Financiera',
            description: 'Medición de la salud financiera, transparencia en el gasto y cumplimiento normativo.',
            weight: 20,
            order: 2,
            questions: {
                create: [
                    {
                        text: '¿El presupuesto de egresos se ejerce conforme al calendario aprobado?',
                        type: 'SCALE',
                        weight: 2,
                        order: 1,
                    },
                    {
                        text: '¿Se publican los estados financieros trimestrales en el portal de transparencia?',
                        type: 'BOOLEAN',
                        weight: 2,
                        order: 2,
                    },
                    {
                        text: '¿El municipio cumple con los límites de endeudamiento de la Ley de Disciplina Financiera?',
                        type: 'SCALE',
                        weight: 2,
                        order: 3,
                    },
                ],
            },
        },
    });

    // 3. Servicios Públicos (20%)
    const section3 = await prisma.section.create({
        data: {
            title: 'Servicios Públicos',
            description: 'Calidad, cobertura y eficiencia de los servicios públicos municipales básicos.',
            weight: 20,
            order: 3,
            questions: {
                create: [
                    {
                        text: '¿Cuál es el porcentaje de cobertura de alumbrado público en el municipio?',
                        type: 'SCALE',
                        weight: 2,
                        order: 1,
                    },
                    {
                        text: '¿El servicio de recolección de basura cuenta con rutas y horarios establecidos y cumplidos?',
                        type: 'SCALE',
                        weight: 2,
                        order: 2,
                    },
                    {
                        text: '¿Se cuenta con un programa de mantenimiento preventivo para vialidades (bacheo)?',
                        type: 'BOOLEAN',
                        weight: 1,
                        order: 3,
                    },
                ],
            },
        },
    });

    // 4. Desarrollo Urbano y Medio Ambiente (20%)
    const section4 = await prisma.section.create({
        data: {
            title: 'Desarrollo Urbano y Medio Ambiente',
            description: 'Planeación del crecimiento urbano y acciones para la preservación del medio ambiente.',
            weight: 20,
            order: 4,
            questions: {
                create: [
                    {
                        text: '¿Existe un Plan de Desarrollo Urbano municipal vigente?',
                        type: 'BOOLEAN',
                        weight: 2,
                        order: 1,
                    },
                    {
                        text: '¿Se realizan acciones formales de reforestación y cuidado de áreas verdes?',
                        type: 'SCALE',
                        weight: 1,
                        order: 2,
                    },
                    {
                        text: '¿El municipio opera un relleno sanitario que cumple con la norma NOM-083?',
                        type: 'BOOLEAN',
                        weight: 2,
                        order: 3,
                    },
                ],
            },
        },
    });

    // 5. Seguridad Pública y Tránsito (20%)
    const section5 = await prisma.section.create({
        data: {
            title: 'Seguridad Pública y Tránsito',
            description: 'Estrategias y resultados en materia de seguridad ciudadana y orden vial.',
            weight: 20,
            order: 5,
            questions: {
                create: [
                    {
                        text: '¿La fuerza policial cuenta con el Certificado Único Policial (CUP) vigente?',
                        type: 'SCALE',
                        weight: 2,
                        order: 1,
                    },
                    {
                        text: '¿Existen comités de vigilancia vecinal activos y vinculados a la policía?',
                        type: 'BOOLEAN',
                        weight: 1,
                        order: 2,
                    },
                    {
                        text: '¿Cuál es la percepción ciudadana sobre la seguridad en el último trimestre?',
                        type: 'SCALE',
                        weight: 2,
                        order: 3,
                    },
                ],
            },
        },
    });

    // Crear usuario admin de prueba
    await prisma.user.upsert({
        where: { email: 'admin@meplansus.com' },
        update: {},
        create: {
            username: 'admin',
            email: 'admin@meplansus.com',
            password: 'admin123', // En producción esto debe ser hasheado
            role: 'ADMIN',
        },
    });

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
