import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting PLANSUSTAIN seed...');

    // Clear existing data
    await prisma.answer.deleteMany();
    await prisma.odsImpact.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.scaleOption.deleteMany();
    await prisma.question.deleteMany();
    await prisma.component.deleteMany();
    await prisma.module.deleteMany();

    console.log('✅ Cleared existing data');

    // ============================================================================
    // MÓDULO 1: Contexto Institucional (15 indicadores)
    // ============================================================================
    const module1 = await prisma.module.create({
        data: {
            number: 1,
            name: 'Contexto Institucional',
            description: 'Evaluación de la capacidad institucional, marco legal y procedimientos',
            evaluationType: 'PDC',
            outputKey: 'IPS',
            order: 1,
            components: {
                create: [
                    {
                        name: 'Marco Legal',
                        description: 'Evaluación del marco legal y normativo',
                        order: 1,
                        questions: {
                            create: [
                                {
                                    text: '¿Las leyes, regulaciones y programas de planificación territorial están actualizados y vigentes (No obsoletos)?',
                                    type: 'SCALE',
                                    weight: 1,
                                    order: 1,
                                    scaleOptions: {
                                        create: [
                                            { value: 1, label: 'Muy Deficiente', description: 'Más del 75% de las regulaciones están obsoletas (>10 años sin actualización)' },
                                            { value: 2, label: 'Deficiente', description: '50-75% de las regulaciones están desactualizadas o no reflejan necesidades actuales' },
                                            { value: 3, label: 'Aceptable', description: '25-50% de las regulaciones están actualizadas; existen algunas inconsistencias' },
                                            { value: 4, label: 'Bueno', description: '75-90% de las regulaciones están vigentes y actualizadas en los últimos 5 años' },
                                            { value: 5, label: 'Excelente', description: '>90% de las regulaciones están completamente actualizadas y alineadas con estándares actuales' },
                                        ],
                                    },
                                },
                                {
                                    text: '¿Existe coherencia y compatibilidad entre las regulaciones locales existentes y los objetivos de sustentabilidad del sistema de planificación?',
                                    type: 'SCALE',
                                    weight: 1,
                                    order: 2,
                                    scaleOptions: {
                                        create: [
                                            { value: 1, label: 'Muy Deficiente', description: 'Contradicciones graves entre regulaciones; objetivos de sustentabilidad ausentes' },
                                            { value: 2, label: 'Deficiente', description: 'Múltiples inconsistencias; sustentabilidad mencionada pero no integrada' },
                                            { value: 3, label: 'Aceptable', description: 'Coherencia parcial; algunos objetivos de sustentabilidad integrados' },
                                            { value: 4, label: 'Bueno', description: 'Alta coherencia; mayoría de regulaciones alineadas con sustentabilidad' },
                                            { value: 5, label: 'Excelente', description: 'Coherencia total; todas las regulaciones integran principios de sustentabilidad' },
                                        ],
                                    },
                                },
                                {
                                    text: '¿Existen mecanismos operativos de control y la capacidad de aplicar sanciones por incumplimiento de las regulaciones establecidas?',
                                    type: 'SCALE',
                                    weight: 1,
                                    order: 3,
                                    scaleOptions: {
                                        create: [
                                            { value: 1, label: 'Muy Deficiente', description: 'No existen mecanismos de control ni sanciones aplicables' },
                                            { value: 2, label: 'Deficiente', description: 'Mecanismos definidos pero no operativos; sanciones nunca aplicadas' },
                                            { value: 3, label: 'Aceptable', description: 'Mecanismos parcialmente operativos; sanciones aplicadas ocasionalmente' },
                                            { value: 4, label: 'Bueno', description: 'Mecanismos funcionales; sanciones aplicadas regularmente (>60% de casos)' },
                                            { value: 5, label: 'Excelente', description: 'Mecanismos altamente efectivos; sanciones aplicadas consistentemente (>90%)' },
                                        ],
                                    },
                                },
                                {
                                    text: '¿Qué porcentaje de los planes y acciones desarrollados ha logrado un alto cumplimiento de la legislación territorial vigente?',
                                    type: 'SCALE',
                                    weight: 1,
                                    order: 4,
                                    scaleOptions: {
                                        create: [
                                            { value: 1, label: 'Muy Deficiente', description: '<40% de cumplimiento legal en planes y acciones' },
                                            { value: 2, label: 'Deficiente', description: '40-55% de cumplimiento legal' },
                                            { value: 3, label: 'Aceptable', description: '55-70% de cumplimiento legal' },
                                            { value: 4, label: 'Bueno', description: '70-85% de cumplimiento legal' },
                                            { value: 5, label: 'Excelente', description: '>85% de cumplimiento legal en todos los planes y acciones' },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        name: 'Marco Institucional',
                        description: 'Evaluación de la estructura y capacidad institucional',
                        order: 2,
                        questions: {
                            create: [
                                {
                                    text: '¿Existen documentos formales (organigramas/manuales) que definan con alta precisión las funciones y atribuciones de cada cuerpo de planificación?',
                                    type: 'SCALE',
                                    weight: 1,
                                    order: 1,
                                    scaleOptions: {
                                        create: [
                                            { value: 1, label: 'Muy Deficiente', description: 'No existen documentos formales de definición de roles' },
                                            { value: 2, label: 'Deficiente', description: 'Documentos existen pero son vagos o desactualizados (>5 años)' },
                                            { value: 3, label: 'Aceptable', description: 'Documentos formales con definiciones básicas; algunas ambigüedades' },
                                            { value: 4, label: 'Bueno', description: 'Documentos detallados y actualizados; roles claramente definidos' },
                                            { value: 5, label: 'Excelente', description: 'Documentación completa, precisa y actualizada anualmente' },
                                        ],
                                    },
                                },
                                {
                                    text: '¿Existe alta precisión en la definición de las responsabilidades compartidas (límites) entre las diferentes instituciones de planificación?',
                                    type: 'SCALE',
                                    weight: 1,
                                    order: 2,
                                    scaleOptions: {
                                        create: [
                                            { value: 1, label: 'Muy Deficiente', description: 'Traslape total de funciones; conflictos constantes entre instituciones' },
                                            { value: 2, label: 'Deficiente', description: 'Responsabilidades compartidas mal definidas; conflictos frecuentes' },
                                            { value: 3, label: 'Aceptable', description: 'Definición básica de límites; algunos traslapes ocasionales' },
                                            { value: 4, label: 'Bueno', description: 'Límites claramente definidos; coordinación efectiva en >75% de casos' },
                                            { value: 5, label: 'Excelente', description: 'Precisión total; protocolos claros para todas las responsabilidades compartidas' },
                                        ],
                                    },
                                },
                                {
                                    text: '¿La entidad cuenta con la cantidad y calidad necesaria de recursos humanos especializados y técnicos (capacitación, software, especialistas)?',
                                    type: 'SCALE',
                                    weight: 1,
                                    order: 3,
                                    scaleOptions: {
                                        create: [
                                            { value: 1, label: 'Muy Deficiente', description: '<40% de los recursos técnicos necesarios disponibles' },
                                            { value: 2, label: 'Deficiente', description: '40-55% de recursos técnicos; personal sin capacitación especializada' },
                                            { value: 3, label: 'Aceptable', description: '55-70% de recursos; capacitación básica; software limitado' },
                                            { value: 4, label: 'Bueno', description: '70-85% de recursos; personal capacitado; software adecuado' },
                                            { value: 5, label: 'Excelente', description: '>85% de recursos; equipo altamente especializado; tecnología de punta' },
                                        ],
                                    },
                                },
                                {
                                    text: '¿Existe un presupuesto específico y suficiente asignado para la gestión y monitoreo del plan y sus instrumentos?',
                                    type: 'SCALE',
                                    weight: 1,
                                    order: 4,
                                    scaleOptions: {
                                        create: [
                                            { value: 1, label: 'Muy Deficiente', description: 'No existe presupuesto específico asignado' },
                                            { value: 2, label: 'Deficiente', description: 'Presupuesto insuficiente (<50% de lo necesario); ejecución limitada' },
                                            { value: 3, label: 'Aceptable', description: 'Presupuesto cubre 50-70% de necesidades; algunas limitaciones' },
                                            { value: 4, label: 'Bueno', description: 'Presupuesto adecuado (70-90% de necesidades); ejecución efectiva' },
                                            { value: 5, label: 'Excelente', description: 'Presupuesto completo y suficiente (>90%); recursos garantizados' },
                                        ],
                                    },
                                },
                                {
                                    text: '¿La frecuencia y calidad de las reuniones y mesas de coordinación interinstitucional es adecuada y productiva?',
                                    type: 'SCALE',
                                    weight: 1,
                                    order: 5,
                                    scaleOptions: {
                                        create: [
                                            { value: 1, label: 'Muy Deficiente', description: 'No existen reuniones de coordinación regulares' },
                                            { value: 2, label: 'Deficiente', description: 'Reuniones esporádicas (<4 al año); baja productividad' },
                                            { value: 3, label: 'Aceptable', description: 'Reuniones trimestrales; productividad moderada' },
                                            { value: 4, label: 'Bueno', description: 'Reuniones mensuales o bimensuales; alta productividad' },
                                            { value: 5, label: 'Excelente', description: 'Coordinación continua; reuniones altamente productivas con seguimiento' },
                                        ],
                                    },
                                },
                                {
                                    text: '¿Existen protocolos formales y funcionales de colaboración y coordinación (ej. acuerdos sectoriales) entre las entidades responsables?',
                                    type: 'SCALE',
                                    weight: 1,
                                    order: 6,
                                    scaleOptions: {
                                        create: [
                                            { value: 1, label: 'Muy Deficiente', description: 'No existen protocolos formales de colaboración' },
                                            { value: 2, label: 'Deficiente', description: 'Protocolos existen pero no se utilizan o están desactualizados' },
                                            { value: 3, label: 'Aceptable', description: 'Protocolos básicos; aplicación parcial' },
                                            { value: 4, label: 'Bueno', description: 'Protocolos completos y funcionales; aplicación regular' },
                                            { value: 5, label: 'Excelente', description: 'Protocolos integrales, actualizados y aplicados consistentemente' },
                                        ],
                                    },
                                },
                                {
                                    text: '¿Cuál es el nivel de satisfacción de los actores clave (internos y externos) respecto a la efectividad y eficiencia general del sistema de planificación?',
                                    type: 'SCALE',
                                    weight: 1,
                                    order: 7,
                                    scaleOptions: {
                                        create: [
                                            { value: 1, label: 'Muy Deficiente', description: '<40% de satisfacción; críticas generalizadas' },
                                            { value: 2, label: 'Deficiente', description: '40-55% de satisfacción; múltiples quejas' },
                                            { value: 3, label: 'Aceptable', description: '55-70% de satisfacción; opiniones mixtas' },
                                            { value: 4, label: 'Bueno', description: '70-85% de satisfacción; reconocimiento positivo' },
                                            { value: 5, label: 'Excelente', description: '>85% de satisfacción; alta confianza en el sistema' },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        name: 'Marco de Procedimientos',
                        description: 'Evaluación de procesos y procedimientos formales',
                        order: 3,
                        questions: {
                            create: [
                                {
                                    text: '¿El proceso de planificación utiliza manuales, guías y protocolos documentados que formalizan y estandarizan los procedimientos?',
                                    type: 'SCALE',
                                    weight: 1,
                                    order: 1,
                                    scaleOptions: {
                                        create: [
                                            { value: 1, label: 'Muy Deficiente', description: 'No existen manuales ni protocolos documentados' },
                                            { value: 2, label: 'Deficiente', description: 'Documentación mínima; procesos no estandarizados' },
                                            { value: 3, label: 'Aceptable', description: 'Manuales básicos; estandarización parcial' },
                                            { value: 4, label: 'Bueno', description: 'Manuales completos; procesos bien estandarizados' },
                                            { value: 5, label: 'Excelente', description: 'Documentación integral; estandarización total con mejora continua' },
                                        ],
                                    },
                                },
                                {
                                    text: '¿La calidad y cantidad de información disponible al público sobre los procesos de planificación es alta y fácilmente accesible?',
                                    type: 'SCALE',
                                    weight: 1,
                                    order: 2,
                                    scaleOptions: {
                                        create: [
                                            { value: 1, label: 'Muy Deficiente', description: 'Información no disponible o inaccesible al público' },
                                            { value: 2, label: 'Deficiente', description: 'Información limitada; difícil acceso; baja calidad' },
                                            { value: 3, label: 'Aceptable', description: 'Información básica disponible; acceso moderado' },
                                            { value: 4, label: 'Bueno', description: 'Información completa; fácil acceso; buena calidad' },
                                            { value: 5, label: 'Excelente', description: 'Transparencia total; plataformas digitales; información actualizada' },
                                        ],
                                    },
                                },
                                {
                                    text: '¿El tiempo promedio para la formulación, aprobación y entrada en vigor de planes es razonable y eficiente?',
                                    type: 'SCALE',
                                    weight: 1,
                                    order: 3,
                                    scaleOptions: {
                                        create: [
                                            { value: 1, label: 'Muy Deficiente', description: 'Procesos >24 meses; burocracia excesiva' },
                                            { value: 2, label: 'Deficiente', description: '18-24 meses; retrasos frecuentes' },
                                            { value: 3, label: 'Aceptable', description: '12-18 meses; algunos retrasos' },
                                            { value: 4, label: 'Bueno', description: '6-12 meses; proceso eficiente' },
                                            { value: 5, label: 'Excelente', description: '<6 meses; alta eficiencia y agilidad' },
                                        ],
                                    },
                                },
                                {
                                    text: '¿El sistema ha demostrado una alta capacidad de respuesta y adaptación a cambios o nuevas necesidades no previstas inicialmente?',
                                    type: 'SCALE',
                                    weight: 1,
                                    order: 4,
                                    scaleOptions: {
                                        create: [
                                            { value: 1, label: 'Muy Deficiente', description: 'Sistema rígido; incapaz de adaptarse' },
                                            { value: 2, label: 'Deficiente', description: 'Adaptación muy lenta (>12 meses); resistencia al cambio' },
                                            { value: 3, label: 'Aceptable', description: 'Adaptación moderada (6-12 meses); flexibilidad limitada' },
                                            { value: 4, label: 'Bueno', description: 'Buena capacidad de adaptación (3-6 meses); respuesta efectiva' },
                                            { value: 5, label: 'Excelente', description: 'Alta flexibilidad; adaptación rápida (<3 meses); innovación continua' },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    });

    console.log('✅ Created Module 1: Contexto Institucional (15 questions)');

    // Create admin user
    await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: 'adminpassword',
            role: 'ADMIN',
        },
    });

    console.log('✅ Created admin user');
    console.log('🎉 PLANSUSTAIN seed completed!');
    console.log('\n📊 Summary:');
    console.log('- Modules: 1 (Module 1 complete)');
    console.log('- Components: 3');
    console.log('- Questions: 15');
    console.log('- Scale Options: 75 (5 per question)');
    console.log('\nNote: This is Module 1 only. Run full seed for all 67 indicators.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
