const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const MODULO_1 = [
    'Actualización Regulatoria: ¿Las leyes, regulaciones y programas de planificación territorial están actualizados y vigentes (No obsoletos)?',
    'Coherencia Normativa: ¿Existe coherencia y compatibilidad entre las regulaciones locales existentes y los objetivos de sustentabilidad del sistema de planificación?',
    'Mecanismos de Control y Sanción: ¿Existen mecanismos operativos de control y la capacidad de aplicar sanciones por incumplimiento de las regulaciones establecidas?',
    'Grado de Cumplimiento Legal: ¿Qué porcentaje de los planes y acciones desarrollados ha logrado un alto cumplimiento de la legislación territorial vigente?',
    'Definición de Roles: ¿Existen documentos formales (organigramas/manuales) que definan con alta precisión las funciones y atribuciones de cada cuerpo de planificación?',
    'Precisión Interinstitucional: ¿Existe alta precisión en la definición de las responsabilidades compartidas (límites) entre las diferentes instituciones de planificación?',
    'Disponibilidad de Recursos Técnicos: ¿La entidad cuenta con la cantidad y calidad necesaria de recursos humanos especializados y técnicos (capacitación, software, especialistas)?',
    'Asignación Presupuestaria: ¿Existe un presupuesto específico y suficiente asignado para la gestión y monitoreo del plan y sus instrumentos?',
    'Calidad de Coordinación: ¿La frecuencia y calidad de las reuniones y mesas de coordinación interinstitucional es adecuada y productiva?',
    'Protocolos de Colaboración: ¿Existen protocolos formales y funcionales de colaboración y coordinación (ej. acuerdos sectoriales) entre las entidades responsables?',
    'Percepción de Actores Clave: ¿Cuál es el nivel de satisfacción de los actores clave (internos y externos) respecto a la efectividad y eficiencia general del sistema de planificación?',
    'Formalización del Proceso: ¿El proceso de planificación utiliza manuales, guías y protocolos documentados que formalizan y estandarizan los procedimientos?',
    'Acceso a la Información: ¿La calidad y cantidad de información disponible al público sobre los procesos de planificación es alta y fácilmente accesible?',
    'Eficiencia en Aprobación: ¿El tiempo promedio para la formulación, aprobación y entrada en vigor de planes es razonable y eficiente?',
    'Capacidad de Adaptación: ¿El sistema ha demostrado una alta capacidad de respuesta y adaptación a cambios o nuevas necesidades no previstas inicialmente?'
];

const MODULO_2 = [
    'Cobertura de Problemas Críticos (Suficiencia): ¿El diagnóstico identificó y cubrió adecuadamente los problemas críticos de sustentabilidad y sus presiones asociadas? (1=Mínima, 5=Total)',
    'Tasa de Validación de Datos (Comprensión): ¿Se realizó una validación significativa de la línea base con actores clave para asegurar una comprensión profunda de la problemática?',
    'Diversidad de Perspectivas: ¿Se incluyeron activamente perspectivas diversas (socioeconómicas/vecinales) para mapear los problemas críticos?',
    'Operatividad y Alineación de la Visión: ¿La visión es específica y concreta, y aborda operativamente lo necesario y suficiente para la sustentabilidad territorial? (1=Baja Operatividad, 5=Alta Operatividad)',
    'Tasa de Adopción de la Visión: ¿Los objetivos y elementos de la visión orientada a la sustentabilidad han sido integrados en los documentos de planificación formal?',
    'Mitigación, adaptación y aumento de la resiliencia: ¿El plan establece pautas estratégicas claras para la mitigación, adaptación y aumento de la resiliencia al cambio climático?',
    'Patrones de desarrollo urbanos eficientes: ¿Se promueven patrones de desarrollo urbanos eficientes con bajas emisiones de carbono para mejorar la eficiencia energética?',
    'Equidad y justicia social: ¿Las pautas estratégicas abordan la equidad y justicia social, priorizando servicios esenciales en áreas de bajo riesgo?',
    'Servicios ambientales: ¿El plan utiliza la planificación urbana para mejorar el acceso a agua y saneamiento, y reducir la contaminación del aire?',
    'Conservación/Espacios Verdes: ¿Se aplica la planificación para proteger y producir espacios públicos y verdes de alta calidad con valor ecológico?',
    'Gestión Integral de Residuos: ¿La planificación espacial integra el reciclaje y la gestión de residuos sólidos/líquidos (incluida la ubicación de sitios)?',
    'Movilidad sostenible: ¿El plan diseña calles y espacios que fomentan la caminata, el transporte no motorizado y el transporte público?',
    'Trayectoria de Desarrollo Sustentable: ¿El programa establece pautas que enmarcan un proceso escalonado de avance hacia nuevas trayectorias de desarrollo sustentable?',
    'Índice de Consenso Estratégico (Visión): ¿Las pautas estratégicas están altamente alineadas con la visión de futuro establecida?',
    'Especificidad y Flexibilidad de Acciones: ¿Las acciones son específicas y servirán como plataformas flexibles para cumplir con los principios de sustentabilidad?',
    'Asignación de Recursos y Capital: ¿El instrumento considera la clara asignación de recursos financieros, sociales y políticos para la implementación?',
    'Índice de Responsabilidad y Cronograma: ¿El programa define claramente los actores responsables y un cronograma de implementación creíble?',
    'Medición de Bienestar y Sostenibilidad ¿Las herramientas de evaluación están diseñadas para medir el bienestar y la sostenibilidad dentro de la capacidad de la biosfera?',
    'Horizonte Temporal y Ámbito Geográfico: ¿Las herramientas adoptan un horizonte de tiempo apropiado (corto y largo plazo) y un ámbito geográfico adecuado para captar los efectos de las decisiones?',
    'Marco Conceptual y Métodos Estandarizados:¿Las herramientas incluyen un marco conceptual (dominios de indicadores) y métodos de medición estandarizados?',
    'Comparación con Objetivos y Metas:¿Se realiza la comparación de los valores de los indicadores con los objetivos y metas del programa para medir el avance?',
    'Accesibilidad y Divulgación de Datos:¿Los datos, indicadores y resultados son accesibles al público, y se divulgan fuentes y métodos de datos?',
    'Transparencia de la Evaluación: ¿La evaluación es transparente, explicando supuestos e incertidumbres, y divulgando fuentes de financiación o posibles conflictos de interés?',
    'Participación Pública en el Progreso: ¿El proceso de evaluación del progreso incluye la participación del público para fortalecer su legitimidad y relevancia?',
    'Compromiso con Usuarios de la Evaluación: ¿Desde el inicio, se buscó el compromiso con los usuarios de la evaluación para que esta se adapte mejor a sus necesidades?'
];

const MODULO_3 = [
    'Reforma Regulatoria Lograda: ¿Las estrategias han generado un número significativo y cualitativo de reformas en el marco institucional y regulatorio?',
    'Cambio de Actitud y Comportamiento: ¿Las acciones han generado un cambio observable y medible en las actitudes y comportamientos ciudadanos hacia la sustentabilidad?',
    'Intervenciones Estructurales y Condiciones Habilitantes: ¿El programa se enfocó en proyectos que abordan problemas fundamentales y lograron un alto porcentaje de condiciones habilitantes?',
    'Evaluación de Transformación: ¿Existe un análisis que distinga claramente entre los logros administrativos básicos y aquellos que generaron cambios estructurales y sostenibles?',
    'Resultados en Mitigación y Resiliencia Urbana:¿Las acciones han demostrado resultados positivos en la mitigación del cambio climático y el aumento de la resiliencia urbana?',
    'Resultados en Patrones Urbanos de Bajas Emisiones y Eficiencia: ¿Las acciones han resultado en formas y patrones urbanos eficientes con bajas emisiones de carbono para la eficiencia energética?',
    'Resultados en Priorización de Servicios y Vivienda en Bajo Riesgo: ¿Las acciones han logrado priorizar servicios y desarrollos residenciales en áreas de bajo riesgo, mejorando la equidad?',
    'Resultados en Mantenimiento de Funciones Urbanas y Resiliencia: ¿Las acciones implementadas han logrado mantener la continuidad de las funciones urbanas y la resiliencia durante situaciones de estrés o choque?',
    'Resultados en Acceso a Agua, Saneamiento y Reducción de Contaminación: ¿Las acciones han mejorado efectivamente el acceso a agua y saneamiento, y han reducido la contaminación (aire y agua)?',
    'Resultados en Revitalización y Protección de Espacios Públicos y Verdes: ¿Las acciones han resultado en la revitalización, protección y producción de espacios públicos y verdes de alto valor ecológico?',
    'Efectividad en la Revitalización de Entornos Construidos: ¿Las acciones han sido efectivas en revitalizar entornos construidos en decadencia, aprovechando activos y fortaleciendo la identidad social?',
    'Resultados en Integración de Reciclaje y Gestión de Desechos: ¿Las acciones han logrado una integración efectiva del reciclaje y la gestión de desechos sólidos/líquidos en el territorio?',
    'Fomento de Colaboración Intersectorial para Planificación: ¿Las acciones han fomentado una colaboración exitosa entre proveedores, urbanizadores y propietarios para vincular la planificación sectorial?',
    'Mejora en la Regulación y Gestión de Edificios Ecológicos: ¿Las acciones han generado una mejora en la gestión, regulación e incentivos para la construcción de "edificios ecológicos"?',
    'Resultados en Movilidad Sostenible: ¿Las acciones han resultado en el diseño de calles que fomentan la caminata, el transporte no motorizado y el transporte público?',
    'Logro de Objetivos y Análisis de Brechas: ¿El porcentaje de metas planificadas logradas es alto, y se realizan análisis periódicos de brechas (visión vs. realidad)?',
    'Evaluación Causal y Desempeño: ¿Se llevan a cabo estudios que demuestren la relación directa y causal entre las estrategias de planificación y los cambios observados?',
    'Índices de Desempeño Integrales: ¿Se utilizan índices de desempeño compuestos que integran resultados ambientales, sociales y económicos para medir el impacto general?',
    'Efectividad del Monitoreo y Frecuencia de Revisiones: ¿Los mecanismos de monitoreo y la frecuencia de las revisiones son altamente efectivos y oportunos para facilitar el ajuste continuo del proceso?',
    'Consistencia del Aprendizaje: ¿Existe evidencia de que las mejoras y ajustes en los procesos de planificación se han basado consistentemente en el análisis de los resultados obtenidos?'
];

const MODULO_4 = [
    'Cobertura Participativa: ¿Se logró una alta participación (>75%) de los actores sociales clave invitados en los talleres de mapeo legal e institucional?',
    'Transparencia Normativa: ¿Se documentaron y validaron la mayor parte de las reglas y normas informales de planificación con la participación de la comunidad?',
    'Índice de Traslape Institucional: ¿Se identificó y abordó un alto porcentaje del traslape de funciones entre agencias durante las sesiones de co-creación?',
    'Reconocimiento del Problema (Atlas Híbrido): ¿El número de problemas críticos de sustentabilidad identificados conjuntamente (atlas híbrido comunidad-experto) fue alto y diverso?',
    'Incorporación de la Visión: ¿Qué porcentaje de los elementos de la visión co-creados con la comunidad fueron integrados formalmente en los documentos estratégicos del plan?',
    'Alineación de Consenso: ¿Qué porcentaje de las directrices estratégicas clave fueron calificadas con un alto grado de alineación (>75%) con la Visión de Futuro co-creada?',
    'Rendición de Cuentas de la Acción: ¿Qué porcentaje de las acciones planeadas cuenta con actores, recursos y plazos co-definidos con los actores sociales?',
    'Cobertura de la Red de Monitoreo: ¿El número de monitores comunitarios activos por habitante es alto y representativo de los diferentes territorios?',
    'Concordancia de Clasificación: ¿Se logró un alto porcentaje de acuerdo (>75%) en la clasificación del tipo de impacto de las acciones implementadas entre los diferentes actores sociales?',
    'Índice de Madurez de la Participación (IAP2): ¿El proceso de participación en general alcanzó consistentemente el nivel de Colaboración o Empoderamiento (máxima incidencia y corresponsabilidad)? (Peso Reforzado)',
    'Tasa de Discrepancia: ¿En qué porcentaje de indicadores clave los datos recopilados por la comunidad divergen significativamente (>10%) de los informes oficiales?',
    'Adopción Adaptativa: ¿Qué porcentaje de las correcciones o ajustes de medio término recomendados por los actores fue formalmente adoptado por la gestión en un plazo de seis meses?'
];

async function updateAllQuestions() {
    console.log('🔄 Iniciando actualización de preguntas...\n');

    try {
        const sections = await prisma.section.findMany({ orderBy: { order: 'asc' } });

        for (const section of sections) {
            if (section.order === 0) continue; // Saltar Módulo 0

            let preguntas = [];
            let moduloNum = 0;

            if (section.order === 1) { preguntas = MODULO_1; moduloNum = 1; }
            else if (section.order === 2) { preguntas = MODULO_2; moduloNum = 2; }
            else if (section.order === 3) { preguntas = MODULO_3; moduloNum = 3; }
            else if (section.order === 4) { preguntas = MODULO_4; moduloNum = 4; }

            if (preguntas.length === 0) continue;

            console.log(`📝 Módulo ${moduloNum}: ${section.title} - ${preguntas.length} preguntas`);

            // Borrar preguntas existentes
            const deleted = await prisma.question.deleteMany({ where: { sectionId: section.id } });
            console.log(`   🗑️  ${deleted.count} preguntas anteriores eliminadas`);

            // Insertar nuevas preguntas
            for (let i = 0; i < preguntas.length; i++) {
                const weight = (moduloNum === 4 && i === 9) ? 2 : 1;
                await prisma.question.create({
                    data: {
                        text: preguntas[i],
                        type: 'SCALE',
                        weight,
                        order: i + 1,
                        sectionId: section.id
                    }
                });
            }
            console.log(`   ✅ ${preguntas.length} preguntas nuevas agregadas${weight === 2 ? ' (IAP2 peso x2)' : ''}\n`);
        }

        console.log('✅ ACTUALIZACIÓN COMPLETADA');
        console.log(`📊 Total: ${MODULO_1.length} + ${MODULO_2.length} + ${MODULO_3.length} + ${MODULO_4.length} = 72 preguntas SCALE`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateAllQuestions();
