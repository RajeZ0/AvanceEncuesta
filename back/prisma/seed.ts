import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting MEPLANSUS seed...');

    // Limpiar base de datos
    await prisma.answer.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.question.deleteMany();
    await prisma.section.deleteMany();
    // No borramos usuarios para no romper sesiones activas si es posible, 
    // pero para un reset limpio a veces es mejor. 
    // En este caso, asumimos que el usuario quiere ver los cambios.

    // 1. MÓDULO 1: Contexto Institucional (20%)
    console.log('Creating Module 1...');
    await prisma.section.create({
        data: {
            title: 'Contexto Institucional',
            description: 'Evaluación de la capacidad institucional, marco legal y procedimientos.',
            weight: 20,
            order: 1,
            questions: {
                create: [
                    { text: '¿Las leyes, regulaciones y programas de planificación territorial están actualizados y vigentes?', type: 'SCALE', order: 1 },
                    { text: '¿Existe coherencia y compatibilidad entre las regulaciones locales y los objetivos de sustentabilidad?', type: 'SCALE', order: 2 },
                    { text: '¿Existen mecanismos operativos de control y capacidad de aplicar sanciones?', type: 'SCALE', order: 3 },
                    { text: '¿Qué porcentaje de planes ha logrado alto cumplimiento de la legislación territorial?', type: 'SCALE', order: 4 },
                    { text: '¿Existen documentos formales que definan con precisión las funciones de cada cuerpo de planificación?', type: 'SCALE', order: 5 },
                    { text: '¿Existe alta precisión en la definición de responsabilidades compartidas entre instituciones?', type: 'SCALE', order: 6 },
                    { text: '¿La entidad cuenta con recursos humanos especializados y técnicos necesarios?', type: 'SCALE', order: 7 },
                    { text: '¿Existe un presupuesto específico y suficiente para la gestión y monitoreo del plan?', type: 'SCALE', order: 8 },
                    { text: '¿La frecuencia y calidad de las reuniones de coordinación interinstitucional es adecuada?', type: 'SCALE', order: 9 },
                    { text: '¿Existen protocolos formales y funcionales de colaboración entre entidades?', type: 'SCALE', order: 10 },
                    { text: '¿Cuál es el nivel de satisfacción de actores clave respecto al sistema de planificación?', type: 'SCALE', order: 11 },
                    { text: '¿El proceso utiliza manuales, guías y protocolos documentados que estandarizan procedimientos?', type: 'SCALE', order: 12 },
                    { text: '¿La información sobre procesos de planificación es accesible al público?', type: 'SCALE', order: 13 },
                    { text: '¿El tiempo para formulación, aprobación y entrada en vigor de planes es eficiente?', type: 'SCALE', order: 14 },
                    { text: '¿El sistema ha demostrado capacidad de adaptación a cambios no previstos?', type: 'SCALE', order: 15 },
                ],
            },
        },
    });

    // 2. MÓDULO 2: Evaluación Estratégica (25%)
    console.log('Creating Module 2...');
    await prisma.section.create({
        data: {
            title: 'Evaluación Estratégica',
            description: 'Evaluación del diseño estratégico y planificación.',
            weight: 25,
            order: 2,
            questions: {
                create: [
                    { text: '¿El diagnóstico identificó y cubrió adecuadamente los problemas críticos de sustentabilidad?', type: 'SCALE', order: 1 },
                    { text: '¿Se validó la línea base con actores clave para asegurar comprensión profunda?', type: 'SCALE', order: 2 },
                    { text: '¿Se incluyeron perspectivas diversas (socioeconómicas/vecinales) para mapear problemas?', type: 'SCALE', order: 3 },
                    { text: '¿La visión es específica y aborda operativamente lo necesario para la sustentabilidad?', type: 'SCALE', order: 4 },
                    { text: '¿Los elementos de la visión han sido integrados en documentos de planificación formal?', type: 'SCALE', order: 5 },
                    { text: '¿El plan establece pautas claras para mitigación, adaptación y resiliencia al cambio climático?', type: 'SCALE', order: 6 },
                    { text: '¿Se promueven patrones de desarrollo urbanos eficientes con bajas emisiones de carbono?', type: 'SCALE', order: 7 },
                    { text: '¿Las pautas abordan equidad y justicia social, priorizando servicios en áreas de bajo riesgo?', type: 'SCALE', order: 8 },
                    { text: '¿El plan mejora el acceso a agua y saneamiento, y reduce la contaminación del aire?', type: 'SCALE', order: 9 },
                    { text: '¿Se protegen y producen espacios públicos y verdes de alta calidad con valor ecológico?', type: 'SCALE', order: 10 },
                    { text: '¿La planificación espacial integra el reciclaje y gestión de residuos sólidos/líquidos?', type: 'SCALE', order: 11 },
                    { text: '¿El plan diseña calles que fomentan caminata, transporte no motorizado y público?', type: 'SCALE', order: 12 },
                    { text: '¿El programa establece un proceso escalonado hacia trayectorias de desarrollo sustentable?', type: 'SCALE', order: 13 },
                    { text: '¿Las pautas estratégicas están alineadas con la visión de futuro establecida?', type: 'SCALE', order: 14 },
                    { text: '¿Las acciones son específicas y flexibles para cumplir principios de sustentabilidad?', type: 'SCALE', order: 15 },
                    { text: '¿El instrumento considera asignación clara de recursos financieros, sociales y políticos?', type: 'SCALE', order: 16 },
                    { text: '¿El programa define claramente actores responsables y cronograma creíble?', type: 'SCALE', order: 17 },
                    { text: '¿Las herramientas miden bienestar y sostenibilidad dentro de la capacidad de la biosfera?', type: 'SCALE', order: 18 },
                    { text: '¿Las herramientas adoptan horizonte temporal y ámbito geográfico adecuados?', type: 'SCALE', order: 19 },
                    { text: '¿Las herramientas incluyen marco conceptual y métodos de medición estandarizados?', type: 'SCALE', order: 20 },
                    { text: '¿Se comparan valores de indicadores con objetivos y metas para medir avance?', type: 'SCALE', order: 21 },
                    { text: '¿Los datos e indicadores son accesibles al público con fuentes y métodos divulgados?', type: 'SCALE', order: 22 },
                    { text: '¿La evaluación es transparente, explicando supuestos e incertidumbres?', type: 'SCALE', order: 23 },
                ],
            },
        },
    });

    // 3. MÓDULO 3: Efectividad de la Planificación (30%)
    console.log('Creating Module 3...');
    await prisma.section.create({
        data: {
            title: 'Efectividad de la Planificación',
            description: 'Evaluación de resultados y cumplimiento de directrices ONU-Hábitat.',
            weight: 30,
            order: 3,
            questions: {
                create: [
                    { text: '¿Las estrategias han generado reformas significativas en el marco institucional y regulatorio?', type: 'SCALE', order: 1 },
                    { text: '¿Las acciones han generado cambio observable en actitudes ciudadanas hacia sustentabilidad?', type: 'SCALE', order: 2 },
                    { text: '¿El programa se enfocó en proyectos que abordan problemas fundamentales?', type: 'SCALE', order: 3 },
                    { text: '¿Existe análisis que distinga entre logros administrativos y cambios estructurales?', type: 'SCALE', order: 4 },
                    { text: '¿Las acciones han demostrado resultados en mitigación del cambio climático y resiliencia urbana?', type: 'SCALE', order: 5 },
                    { text: '¿Las acciones han resultado en patrones urbanos eficientes con bajas emisiones de carbono?', type: 'SCALE', order: 6 },
                    { text: '¿Las acciones han logrado priorizar servicios en áreas de bajo riesgo mejorando equidad?', type: 'SCALE', order: 7 },
                    { text: '¿Las acciones han logrado mantener continuidad de funciones urbanas durante crisis?', type: 'SCALE', order: 8 },
                    { text: '¿Las acciones han mejorado acceso a agua y saneamiento, y reducido contaminación?', type: 'SCALE', order: 9 },
                    { text: '¿Las acciones han resultado en revitalización y protección de espacios públicos y verdes?', type: 'SCALE', order: 10 },
                    { text: '¿Las acciones han sido efectivas en revitalizar entornos construidos en decadencia?', type: 'SCALE', order: 11 },
                    { text: '¿Las acciones han logrado integración efectiva de reciclaje y gestión de desechos?', type: 'SCALE', order: 12 },
                    { text: '¿Las acciones han fomentado colaboración intersectorial para planificación?', type: 'SCALE', order: 13 },
                    { text: '¿Las acciones han generado mejora en gestión y regulación de edificios ecológicos?', type: 'SCALE', order: 14 },
                    { text: '¿Las acciones han resultado en diseño de calles que fomentan movilidad sostenible?', type: 'SCALE', order: 15 },
                    { text: '¿El porcentaje de metas logradas es alto y se realizan análisis de brechas?', type: 'SCALE', order: 16 },
                    { text: '¿Se llevan a cabo estudios que demuestren relación causal entre estrategias y cambios?', type: 'SCALE', order: 17 },
                ],
            },
        },
    });

    // 4. MÓDULO 4: Participación e Inclusión (15%)
    console.log('Creating Module 4...');
    await prisma.section.create({
        data: {
            title: 'Participación e Inclusión',
            description: 'Evaluación del nivel de participación ciudadana y madurez IAP2.',
            weight: 15,
            order: 4,
            questions: {
                create: [
                    { text: '¿Se logró alta participación (>75%) de actores sociales clave en talleres de mapeo?', type: 'SCALE', order: 1 },
                    { text: '¿Se documentaron y validaron reglas y normas informales con participación comunitaria?', type: 'SCALE', order: 2 },
                    { text: '¿Se identificó y abordó alto porcentaje de traslape de funciones entre agencias?', type: 'SCALE', order: 3 },
                    { text: '¿El número de problemas críticos identificados conjuntamente fue alto y diverso?', type: 'SCALE', order: 4 },
                    { text: '¿Qué porcentaje de elementos de la visión co-creados fueron integrados formalmente?', type: 'SCALE', order: 5 },
                    { text: '¿Qué porcentaje de directrices estratégicas tienen alto grado de alineación con la visión?', type: 'SCALE', order: 6 },
                    { text: '¿Qué porcentaje de acciones cuenta con actores, recursos y plazos co-definidos?', type: 'SCALE', order: 7 },
                    { text: '¿El número de monitores comunitarios activos es alto y representativo?', type: 'SCALE', order: 8 },
                    { text: '¿Se logró alto porcentaje de acuerdo en clasificación del tipo de impacto de acciones?', type: 'SCALE', order: 9 },
                    { text: '¿El proceso alcanzó nivel de Colaboración o Empoderamiento (IAP2)?', type: 'SCALE', order: 10 },
                    { text: '¿En qué porcentaje de indicadores los datos comunitarios divergen de informes oficiales?', type: 'SCALE', order: 11 },
                    { text: '¿Qué porcentaje de correcciones recomendadas por actores fue adoptado en 6 meses?', type: 'SCALE', order: 12 },
                ],
            },
        },
    });

    // 5. MÓDULO 5: Resultados e Impacto ODS (10%)
    console.log('Creating Module 5...');
    await prisma.section.create({
        data: {
            title: 'Resultados e Impacto ODS',
            description: 'Análisis cuantitativo de prioridades y contribución a los ODS.',
            weight: 10,
            order: 5,
            questions: {
                create: [
                    { text: 'Indique el número total de líneas de acción del plan', type: 'TEXT', order: 1 },
                    { text: 'Indique el número de acciones implementadas reportadas', type: 'TEXT', order: 2 },
                    { text: 'Indique el % de avance en objetivos relacionados con ODS 1 (Fin de la Pobreza)', type: 'TEXT', order: 3 },
                    { text: 'Indique el % de avance en objetivos relacionados con ODS 11 (Ciudades Sostenibles)', type: 'TEXT', order: 4 },
                    { text: 'Indique el % de avance en objetivos relacionados con ODS 13 (Acción por el Clima)', type: 'TEXT', order: 5 },
                ],
            },
        },
    });

    // Crear usuario admin de prueba
    const admin = await prisma.user.upsert({
        where: { email: 'admin@meplansus.com' },
        update: {},
        create: {
            username: 'admin',
            email: 'admin@meplansus.com',
            password: 'admin123',
            role: 'ADMIN',
            name: 'Administrador MEPLANSUS',
            municipality: 'Toluca',
            state: 'Estado de México'
        },
    });

    console.log('✅ Seeding completed.');
    console.log('👤 Admin user:', admin.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
