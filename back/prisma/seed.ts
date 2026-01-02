import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to create options JSON
const opts = (o1: string, o2: string, o3: string, o4: string, o5: string) =>
    JSON.stringify([o1, o2, o3, o4, o5]);

async function main() {
    console.log('🌱 Iniciando seed de MEPLANSUS con preguntas actualizadas...\n');

    // Limpiar base de datos
    console.log('🗑️  Limpiando base de datos...');
    await prisma.metadatosEvaluacion.deleteMany();
    await prisma.answer.deleteMany();
    await prisma.submission.deleteMany();
    await prisma.question.deleteMany();
    await prisma.section.deleteMany();
    console.log('✅ Base de datos limpiada\n');

    // MÓDULO 0: Identificación y Contexto
    console.log('📝 Creando Módulo 0: Identificación y Contexto...');
    await prisma.section.create({
        data: {
            title: 'Identificación y Contexto',
            description: 'Información general del ayuntamiento y responsable de la evaluación.',
            weight: 0,
            order: 0,
            questions: {
                create: [
                    { text: 'Módulo de identificación (formulario especial)', type: 'TEXT', order: 1, weight: 0 },
                ],
            },
        },
    });

    // MÓDULO 1: Contexto Institucional (20%) - 15 preguntas
    console.log('📝 Creando Módulo 1: Contexto Institucional (15 preguntas)...');
    await prisma.section.create({
        data: {
            title: 'Contexto Institucional',
            description: 'Evaluación de la capacidad institucional, marco legal y procedimientos.',
            weight: 20,
            order: 1,
            questions: {
                create: [
                    {
                        text: '¿Las leyes, reglamentos y programas relacionados con la planificación territorial están actualizados y se siguen usando actualmente?',
                        type: 'SCALE', order: 1, weight: 1,
                        options: opts(
                            'La mayoría están desactualizados/no se usan',
                            'Algunas normas están actualizadas',
                            'Hay mezcla equilibrada de normas actuales y desactualizadas',
                            'La mayoría están actualizadas y vigentes',
                            'Casi todas están actualizadas y se usan seguido'
                        )
                    },
                    {
                        text: '¿Las reglas y normas locales no se contradicen entre sí y están alineadas con los objetivos de desarrollo sustentable del municipio?',
                        type: 'SCALE', order: 2, weight: 1,
                        options: opts(
                            'Frecuentemente se contradicen o no están alineadas',
                            'Existen varias contradicciones importantes',
                            'Algunas normas coinciden y otras no',
                            'En general son coherentes, con pocas inconsistencias',
                            'Son claramente coherentes y compatibles entre sí'
                        )
                    },
                    {
                        text: '¿Existen mecanismos claros para vigilar el cumplimiento de las normas y aplicar sanciones cuando no se respetan estas regulaciones?',
                        type: 'SCALE', order: 3, weight: 1,
                        options: opts(
                            'No existen mecanismos ni se aplican sanciones',
                            'Existen mecanismos, pero rara vez se aplican',
                            'Se aplican solo en algunos casos',
                            'Se aplican en la mayoría de los casos necesarios',
                            'Se aplican de forma sistemática y consistente'
                        )
                    },
                    {
                        text: '¿Qué porcentaje de los planes y acciones que se realizan cumplen con la legislación territorial vigente?',
                        type: 'SCALE', order: 4, weight: 1,
                        options: opts(
                            'Menor al 20% cumplen',
                            'Entre 21% y 40% cumplen',
                            'Entre 41% y 60% cumplen',
                            'Entre 61% y 80% cumplen',
                            'Más del 80% cumplen'
                        )
                    },
                    {
                        text: '¿Existen documentos formales (como organigramas o manuales) que explican claramente qué funciones y responsabilidades tiene cada área dentro en la planificación?',
                        type: 'SCALE', order: 5, weight: 1,
                        options: opts(
                            'No existen documentos formales',
                            'Existen documentos, pero son incompletos o poco claros',
                            'Los documentos existen y cubren solo algunas áreas',
                            'Los documentos son claros para la mayoría de las áreas',
                            'Las funciones están claramente definidas para todas las áreas'
                        )
                    },
                    {
                        text: '¿Es clara la responsabilidad que se le asigna a cada institución y cómo se comparten al participar varias áreas?',
                        type: 'SCALE', order: 6, weight: 1,
                        options: opts(
                            'No está claro y suele generar conflictos',
                            'Está definido de forma muy general',
                            'Está claro solo en algunos casos',
                            'Generalmente está claro, con pocas dudas',
                            'Está claramente definido y bien comprendido'
                        )
                    },
                    {
                        text: '¿La Institución cuenta con el personal capacitado y herramientas técnicas suficientes para realizar la planificación?',
                        type: 'SCALE', order: 7, weight: 1,
                        options: opts(
                            'No se cuenta con el personal ni las herramientas necesarias',
                            'Se cuenta con recursos muy limitados',
                            'Los recursos son suficientes solo para algunas tareas',
                            'Los recursos cubren la mayoría de las necesidades',
                            'Se cuenta con recursos completos y de alta calidad'
                        )
                    },
                    {
                        text: '¿Existe un presupuesto específico y suficiente para gestionar y dar seguimiento a los planes?',
                        type: 'SCALE', order: 8, weight: 1,
                        options: opts(
                            'No existe un presupuesto asignado',
                            'El presupuesto existe, pero es insuficiente',
                            'El presupuesto cubre solo lo básico',
                            'El presupuesto es suficiente para la mayoría de las actividades',
                            'El presupuesto es suficiente y estable'
                        )
                    },
                    {
                        text: '¿Las reuniones y espacios de coordinación entre instituciones son adecuadas y productivas?',
                        type: 'SCALE', order: 9, weight: 1,
                        options: opts(
                            'No existen espacios de coordinación',
                            'Existen, pero rara vez son útiles',
                            'A veces ayudan y a veces no',
                            'Generalmente son útiles y productivos',
                            'Son constantes y generan acuerdos claros'
                        )
                    },
                    {
                        text: '¿Existen acuerdos o protocolos formales que facilitan la colaboración entre instituciones?',
                        type: 'SCALE', order: 10, weight: 1,
                        options: opts(
                            'No existen acuerdos formales',
                            'Existen, pero casi no se utilizan',
                            'Se utilizan solo en algunos casos',
                            'Se utilizan de forma regular',
                            'Son claros, funcionales y ampliamente utilizados'
                        )
                    },
                    {
                        text: '¿Las personas y organizaciones clave (internos y externos) consideran que el sistema de planificación funciona adecuadamente?',
                        type: 'SCALE', order: 11, weight: 1,
                        options: opts(
                            'Predomina una percepción negativa',
                            'La mayoría tiene una percepción poco favorable',
                            'Las opiniones están divididas',
                            'Predomina una percepción favorable',
                            'Existe una percepción ampliamente favorable'
                        )
                    },
                    {
                        text: '¿Los procesos de planificación están documentados mediante manuales, guías y protocolos para formalizar y estandarizar los procedimientos?',
                        type: 'SCALE', order: 12, weight: 1,
                        options: opts(
                            'No existe documentación',
                            'Existen documentos muy generales',
                            'Existen documentos, pero no se usan siempre',
                            'Los documentos se usan en la mayoría de los casos',
                            'Los procesos están completamente documentados y estandarizados'
                        )
                    },
                    {
                        text: '¿La calidad y cantidad de información disponible al público sobre los procesos de planificación es alta y fácilmente accesible?',
                        type: 'SCALE', order: 13, weight: 1,
                        options: opts(
                            'No está disponible al público',
                            'Está disponible, pero es difícil de encontrar o entender',
                            'Está disponible, pero con información limitada',
                            'Es accesible y relativamente clara',
                            'Es fácil de encontrar, clara y completa'
                        )
                    },
                    {
                        text: '¿El tiempo promedio para elaborar y aprobar los planes es razonable y eficiente?',
                        type: 'SCALE', order: 14, weight: 1,
                        options: opts(
                            'Normalmente hay retrasos muy largos',
                            'Hay retrasos frecuentes',
                            'A veces se cumplen los tiempos y a veces no',
                            'La mayoría de los tiempos son razonables',
                            'Los tiempos se cumplen de forma constante'
                        )
                    },
                    {
                        text: '¿El sistema es capaz de ajustarse a cambios o nuevas necesidades en cualquier momento necesario?',
                        type: 'SCALE', order: 15, weight: 1,
                        options: opts(
                            'No logra adaptarse',
                            'Se adapta con mucha dificultad',
                            'Se adapta solo en algunos casos',
                            'Se adapta en la mayoría de las situaciones',
                            'Se adapta de forma ágil y oportuna'
                        )
                    },
                ],
            },
        },
    });

    // MÓDULO 2: Evaluación Estratégica (25%) - 25 preguntas
    console.log('📝 Creando Módulo 2: Evaluación Estratégica (25 preguntas)...');
    await prisma.section.create({
        data: {
            title: 'Evaluación Estratégica',
            description: 'Evaluación de la estrategia de planificación y su alineación con objetivos de sustentabilidad.',
            weight: 25,
            order: 2,
            questions: {
                create: [
                    {
                        text: '¿El diagnóstico identificó claramente los principales problemas de sustentabilidad del territorio y sus causas?',
                        type: 'SCALE', order: 1, weight: 1,
                        options: opts(
                            'Solo se identificaron problemas generales',
                            'Se identificaron algunos problemas importantes',
                            'Se identificaron los problemas principales, pero no todos',
                            'Se identificaron la mayoría de los problemas relevantes',
                            'Se identificaron de forma clara y completa los problemas y sus causas'
                        )
                    },
                    {
                        text: '¿La información del diagnóstico fue revisada y comentada con actores clave (áreas técnicas, especialistas, comunidad) para comprender bien el problema?',
                        type: 'SCALE', order: 2, weight: 1,
                        options: opts(
                            'No se validó con actores clave',
                            'Se validó de forma muy baja',
                            'Se validó con algunos actores',
                            'Se validó con la mayoría de los actores relevantes',
                            'Se validó ampliamente junto con observaciones'
                        )
                    },
                    {
                        text: '¿Durante el diagnóstico se tomaron en cuenta diferentes perspectivas sociales, económicas y vecinales para identificar problemas críticos?',
                        type: 'SCALE', order: 3, weight: 1,
                        options: opts(
                            'No se consideraron diferentes perspectivas',
                            'Se consideraron muy pocas perspectivas',
                            'Se consideraron algunas perspectivas',
                            'Se consideraron diversas perspectivas',
                            'Se incluyeron activamente perspectivas variadas y representativas'
                        )
                    },
                    {
                        text: '¿La visión del plan es clara, concreta y sirve como guía práctica para la sustentabilidad territorial?',
                        type: 'SCALE', order: 4, weight: 1,
                        options: opts(
                            'La visión es muy general y poco útil',
                            'La visión es clara, pero difícil de aplicar',
                            'La visión orienta solo algunos aspectos',
                            'La visión es clara y aplicable en la mayoría de los casos',
                            'La visión es clara, concreta y guía efectivamente las acciones'
                        )
                    },
                    {
                        text: '¿La visión y sus objetivos están reflejados en los documentos oficiales de planificación?',
                        type: 'SCALE', order: 5, weight: 1,
                        options: opts(
                            'No están integrados en los documentos',
                            'Están mencionados de forma superficial',
                            'Están integrados solo en algunos documentos',
                            'Están integrados en la mayoría de los documentos',
                            'Están claramente integrados en todos los documentos clave'
                        )
                    },
                    {
                        text: '¿El plan incluye lineamientos claros para enfrentar el cambio climático y reducir riesgos futuros?',
                        type: 'SCALE', order: 6, weight: 1,
                        options: opts(
                            'No se aborda el tema',
                            'Se menciona de forma muy general',
                            'Se incluyen algunas acciones aisladas',
                            'Se incluyen lineamientos claros',
                            'Se incluyen estrategias claras y bien definidas'
                        )
                    },
                    {
                        text: '¿El plan promueve un desarrollo urbano que reduce el consumo de energía y las emisiones de carbono?',
                        type: 'SCALE', order: 7, weight: 1,
                        options: opts(
                            'No se promueve este tipo de desarrollo',
                            'Se menciona de forma general',
                            'Se promueve en algunos casos',
                            'Se promueve de forma consistente',
                            'Es un eje central del plan'
                        )
                    },
                    {
                        text: '¿El plan considera la equidad social y prioriza los servicios en zonas con mayores necesidades?',
                        type: 'SCALE', order: 8, weight: 1,
                        options: opts(
                            'No se considera este aspecto',
                            'Se considera de forma muy general',
                            'Se considera solo en algunos casos',
                            'Se considera de forma clara',
                            'Es un componente prioritario del plan'
                        )
                    },
                    {
                        text: '¿La planificación urbana busca mejorar el acceso al agua, saneamiento y la calidad del aire?',
                        type: 'SCALE', order: 9, weight: 1,
                        options: opts(
                            'No aborda estos temas',
                            'Los aborda de forma muy limitada',
                            'Los aborda parcialmente',
                            'Los aborda de manera clara',
                            'Los aborda de forma integral'
                        )
                    },
                    {
                        text: '¿La planificación protege y fomenta espacios públicos y áreas verdes con valor ambiental?',
                        type: 'SCALE', order: 10, weight: 1,
                        options: opts(
                            'No se consideran',
                            'Se consideran de forma muy limitada',
                            'Se consideran solo en algunos casos',
                            'Se consideran de forma clara',
                            'Son elemento clave del plan'
                        )
                    },
                    {
                        text: '¿La planificación espacial integra acciones para el manejo adecuado de residuos sólidos y líquidos, incluida su ubicación?',
                        type: 'SCALE', order: 11, weight: 1,
                        options: opts(
                            'No se incluyen acciones',
                            'Se incluyen de forma general',
                            'Se incluyen algunas acciones',
                            'Se incluyen acciones claras',
                            'Se incluyen acciones integrales y bien definidas'
                        )
                    },
                    {
                        text: '¿El plan diseña calles y espacios que fomentan la caminata, el transporte no motorizado y el transporte público?',
                        type: 'SCALE', order: 12, weight: 1,
                        options: opts(
                            'No se fomenta',
                            'Se menciona de forma general',
                            'Se fomenta solo en algunas zonas',
                            'Se fomenta en la mayoría de los casos',
                            'Es una prioridad del diseño urbano'
                        )
                    },
                    {
                        text: '¿El plan define etapas claras para avanzar gradualmente hacia un desarrollo más sustentable?',
                        type: 'SCALE', order: 13, weight: 1,
                        options: opts(
                            'No define etapas',
                            'Define etapas muy generales',
                            'Define algunas etapas',
                            'Define etapas claras',
                            'Define una ruta clara y progresiva'
                        )
                    },
                    {
                        text: '¿Las estrategias propuestas están alineadas con la visión de futuro del territorio?',
                        type: 'SCALE', order: 14, weight: 1,
                        options: opts(
                            'No están alineadas',
                            'Están parcialmente alineadas',
                            'Tienen una alineación moderada',
                            'Están bien alineadas',
                            'Están totalmente alineadas'
                        )
                    },
                    {
                        text: '¿Las acciones propuestas son claras y permiten ajustarse a cambios futuros?',
                        type: 'SCALE', order: 15, weight: 1,
                        options: opts(
                            'Las acciones son poco claras',
                            'Son claras, pero rígidas',
                            'Son claras en algunos casos',
                            'Son claras y relativamente flexibles',
                            'Son claras y diseñadas para adaptarse'
                        )
                    },
                    {
                        text: '¿El plan considera de manera clara los recursos financieros, sociales y políticos necesarios para su implementación?',
                        type: 'SCALE', order: 16, weight: 1,
                        options: opts(
                            'No considera recursos',
                            'Los menciona de forma general',
                            'Considera algunos recursos',
                            'Considera gran parte de los recursos',
                            'Considera todos los recursos'
                        )
                    },
                    {
                        text: '¿El plan define quién es responsable de cada acción y en qué plazos debe realizarse?',
                        type: 'SCALE', order: 17, weight: 1,
                        options: opts(
                            'No define responsables ni tiempos',
                            'Los define de forma muy general',
                            'Los define solo para algunas acciones',
                            'Los define para la mayoría de las acciones',
                            'Los define claramente para todas las acciones'
                        )
                    },
                    {
                        text: '¿Las herramientas de evaluación permiten medir el bienestar y la sostenibilidad del territorio?',
                        type: 'SCALE', order: 18, weight: 1,
                        options: opts(
                            'No existen herramientas de medición',
                            'Existen, pero no miden estos aspectos',
                            'Miden algunos aspectos',
                            'Miden la mayoría de los aspectos relevantes',
                            'Miden claramente bienestar y sostenibilidad'
                        )
                    },
                    {
                        text: '¿Las herramientas consideran el tiempo a corto como a largo plazo y el territorio adecuado para captar los efectos de las decisiones?',
                        type: 'SCALE', order: 19, weight: 1,
                        options: opts(
                            'No considera el tiempo ni el territorio adecuados',
                            'Considera solo uno de los dos',
                            'Considera ambos de forma limitada',
                            'Considera ambos de forma adecuada',
                            'Considera plenamente tiempo y territorio'
                        )
                    },
                    {
                        text: '¿La evaluación utiliza indicadores claros y métodos estandarizados para medir los resultados?',
                        type: 'SCALE', order: 20, weight: 1,
                        options: opts(
                            'No existen indicadores claros',
                            'Existen, pero no son consistentes',
                            'Existen indicadores para algunos temas',
                            'Existen indicadores claros para la mayoría de los temas',
                            'Existe un sistema de indicadores bien estructurado'
                        )
                    },
                    {
                        text: '¿Los resultados se comparan con las metas y objetivos establecidos para medir avances?',
                        type: 'SCALE', order: 21, weight: 1,
                        options: opts(
                            'No se realiza esta comparación',
                            'Se realiza de forma ocasional',
                            'Se realiza solo en algunos casos',
                            'Se realiza de forma regular',
                            'Se realiza de forma sistemática'
                        )
                    },
                    {
                        text: '¿Los resultados de la evaluación e indicadores están disponibles para el público y se divulgan fuentes y métodos de datos?',
                        type: 'SCALE', order: 22, weight: 1,
                        options: opts(
                            'No están disponibles',
                            'Están disponibles, pero son difíciles de entender',
                            'Están disponibles de forma limitada',
                            'Son accesibles y relativamente claros',
                            'Son accesibles, claros y completos'
                        )
                    },
                    {
                        text: '¿La evaluación explica claramente cómo se obtuvieron los resultados (financiación y conflictos de interés) y sus posibles limitaciones o problemas?',
                        type: 'SCALE', order: 23, weight: 1,
                        options: opts(
                            'No es transparente',
                            'Es poco clara',
                            'Es parcialmente clara',
                            'Es mayormente clara',
                            'Es completamente transparente'
                        )
                    },
                    {
                        text: '¿La ciudadanía participa en el proceso de evaluación del avance del plan para fortalecer su legitimidad y relevancia?',
                        type: 'SCALE', order: 24, weight: 1,
                        options: opts(
                            'No participa',
                            'Participa de forma muy limitada',
                            'Participa en algunos momentos',
                            'Participa de forma regular',
                            'Participa activamente y de manera continua'
                        )
                    },
                    {
                        text: '¿Desde el inicio, la evaluación se diseñó pensando en los usuarios que usarán sus resultados?',
                        type: 'SCALE', order: 25, weight: 1,
                        options: opts(
                            'No se consideró a los usuarios',
                            'Se consideraron de forma mínima',
                            'Se consideraron algunos usuarios',
                            'Se consideraron la mayoría de los usuarios',
                            'La evaluación se adaptó claramente a las necesidades de los usuarios'
                        )
                    },
                ],
            },
        },
    });

    // MÓDULO 3: Efectividad de la Planificación (30%) - 20 preguntas
    console.log('📝 Creando Módulo 3: Efectividad de la Planificación (20 preguntas)...');
    await prisma.section.create({
        data: {
            title: 'Efectividad de la Planificación',
            description: 'Evaluación del impacto real de las estrategias implementadas.',
            weight: 30,
            order: 3,
            questions: {
                create: [
                    {
                        text: '¿Las estrategias implementadas dieron lugar a cambios de reformas en el marco institucional y regulatorio?',
                        type: 'SCALE', order: 1, weight: 1,
                        options: opts(
                            'No hubo cambios',
                            'Se hicieron ajustes menores',
                            'Se lograron algunos cambios relevantes',
                            'Se lograron varios cambios importantes',
                            'Se lograron cambios significativos y de fondo'
                        )
                    },
                    {
                        text: '¿Las acciones realizadas han influido en cómo la ciudadanía piensa y actúa respecto a la sustentabilidad?',
                        type: 'SCALE', order: 2, weight: 1,
                        options: opts(
                            'No se observa ningún cambio',
                            'Se observan cambios muy aislados',
                            'Se observan algunos cambios',
                            'Se observan cambios claros en muchos casos',
                            'Se observan cambios amplios y sostenidos'
                        )
                    },
                    {
                        text: '¿El programa se enfocó en proyectos que atacan problemas estructurales y crean condiciones para mejoras a largo plazo?',
                        type: 'SCALE', order: 3, weight: 1,
                        options: opts(
                            'Se enfocó en acciones superficiales',
                            'Abordó pocos problemas de fondo',
                            'Combinó acciones inmediatas y estructurales',
                            'Abordó principalmente problemas estructurales',
                            'Se enfocó claramente en cambios de fondo y duraderos'
                        )
                    },
                    {
                        text: '¿Existe un análisis que distingue entre actividades administrativas y cambios que realmente transformaron la situación?',
                        type: 'SCALE', order: 4, weight: 1,
                        options: opts(
                            'No existe este análisis',
                            'Existe de forma muy básica',
                            'Existe para algunos temas',
                            'Existe para la mayoría de los temas',
                            'Existe de forma clara y sistemática'
                        )
                    },
                    {
                        text: '¿Las acciones han mostrado resultados claros para reducir riesgos y aumentar la resiliencia ante el cambio climático?',
                        type: 'SCALE', order: 5, weight: 1,
                        options: opts(
                            'No se observan resultados',
                            'Se observan resultados muy limitados',
                            'Se observan algunos resultados',
                            'Se observan resultados claros',
                            'Se observan resultados sólidos y comprobables'
                        )
                    },
                    {
                        text: '¿Las acciones han contribuido a un desarrollo de patrones urbanos más eficientes y con menores emisiones de carbono para la eficiencia energética?',
                        type: 'SCALE', order: 6, weight: 1,
                        options: opts(
                            'No se observan cambios',
                            'Se observan cambios muy específicos',
                            'Se observan algunos cambios',
                            'Se observan cambios en la mayoría de los casos',
                            'Se observan cambios claros y consistentes'
                        )
                    },
                    {
                        text: '¿Las acciones priorizaron servicios y desarrollos residenciales en zonas de bajo riesgo, mejorando la equidad territorial?',
                        type: 'SCALE', order: 7, weight: 1,
                        options: opts(
                            'No se priorizó este aspecto',
                            'Se priorizó de forma muy limitada',
                            'Se priorizó solo en algunos proyectos',
                            'Se priorizó en la mayoría de los casos',
                            'Fue un criterio central en las decisiones'
                        )
                    },
                    {
                        text: 'Durante situaciones difíciles (inundaciones, fallas de servicios, emergencias), ¿la ciudad logró seguir funcionando gracias a las acciones implementadas?',
                        type: 'SCALE', order: 8, weight: 1,
                        options: opts(
                            'Las funciones urbanas se interrumpieron gravemente',
                            'Hubo interrupciones frecuentes',
                            'Se mantuvieron solo funciones básicas',
                            'La mayoría de las funciones se mantuvo',
                            'La ciudad respondió de manera sólida y organizada'
                        )
                    },
                    {
                        text: '¿Las acciones mejoraron el acceso al agua, el saneamiento y redujeron la contaminación (aire y agua)?',
                        type: 'SCALE', order: 9, weight: 1,
                        options: opts(
                            'No se observaron mejoras',
                            'Se observaron mejoras muy limitadas',
                            'Se observaron algunas mejoras',
                            'Se observaron mejoras claras',
                            'Se observaron mejoras significativas e integrales'
                        )
                    },
                    {
                        text: '¿Las acciones mejoraron, protegieron y produjeron espacios públicos y áreas verdes?',
                        type: 'SCALE', order: 10, weight: 1,
                        options: opts(
                            'No se realizaron acciones',
                            'Se realizaron acciones aisladas',
                            'Se realizaron mejoras en algunos espacios',
                            'Se realizaron mejoras en la mayoría de los espacios',
                            'Se logró una mejora integral y visible'
                        )
                    },
                    {
                        text: '¿Las acciones ayudaron a recuperar zonas urbanas deterioradas aprovechando activos y fortaleciendo la identidad social?',
                        type: 'SCALE', order: 11, weight: 1,
                        options: opts(
                            'No hubo mejoras',
                            'Hubo mejoras muy limitadas',
                            'Hubo mejoras en algunos casos',
                            'Hubo mejoras claras',
                            'Hubo una revitalización integral'
                        )
                    },
                    {
                        text: '¿Las acciones fortalecieron el reciclaje y la gestión de residuos sólidos/líquidos en el territorio?',
                        type: 'SCALE', order: 12, weight: 1,
                        options: opts(
                            'No se observaron avances',
                            'Se observaron avances mínimos',
                            'Se observaron algunos avances',
                            'Se observaron avances claros',
                            'Se observó una integración efectiva del sistema'
                        )
                    },
                    {
                        text: '¿Las acciones lograron una mejor colaboración entre proveedores, urbanizadores y propietarios para la planificación sectorial?',
                        type: 'SCALE', order: 13, weight: 1,
                        options: opts(
                            'No hubo colaboración',
                            'La colaboración fue muy limitada',
                            'Hubo colaboración en algunos casos',
                            'Hubo colaboración regular',
                            'Hubo colaboración sólida y continua'
                        )
                    },
                    {
                        text: '¿Las acciones mejoraron las normas, incentivos y prácticas para la construcción de "edificios ecológicos"?',
                        type: 'SCALE', order: 14, weight: 1,
                        options: opts(
                            'No hubo cambios',
                            'Hubo cambios muy limitados',
                            'Hubo algunos cambios',
                            'Hubo mejoras en la mayoría',
                            'Hubo mejoras en su totalidad'
                        )
                    },
                    {
                        text: '¿Las acciones mejoraron las condiciones de calles para fomentar la caminata y el uso de bicicleta y transporte público?',
                        type: 'SCALE', order: 15, weight: 1,
                        options: opts(
                            'No hubo mejoras',
                            'Hubo mejoras muy limitadas',
                            'Hubo algunas mejoras',
                            'Hubo mejoras claras',
                            'Hubo mejoras amplias y sostenidas'
                        )
                    },
                    {
                        text: '¿La mayoría de las metas planteadas se han cumplido y se revisan las diferencias entre lo planeado y lo logrado?',
                        type: 'SCALE', order: 16, weight: 1,
                        options: opts(
                            'Se cumplieron pocas metas y no se analizan brechas',
                            'Se cumplieron pocas metas, pero se analizan brechas',
                            'Se cumplieron algunas metas',
                            'Se cumplió la mayoría de las metas',
                            'Se cumplieron casi todas y se analizan regularmente'
                        )
                    },
                    {
                        text: '¿Se han realizado análisis para comprobar que los resultados se deben a las acciones implementadas?',
                        type: 'SCALE', order: 17, weight: 1,
                        options: opts(
                            'No se han realizado análisis',
                            'Se han realizado de forma muy básica',
                            'Se han realizado en algunos casos',
                            'Se han realizado análisis claros',
                            'Se han realizado análisis sólidos y documentados'
                        )
                    },
                    {
                        text: '¿Se utilizan indicadores que combinan aspectos sociales, ambientales y económicos para medir el desempeño general?',
                        type: 'SCALE', order: 18, weight: 1,
                        options: opts(
                            'No se utilizan indicadores integrales',
                            'Se utilizan indicadores muy básicos',
                            'Se utilizan algunos indicadores integrales',
                            'Se utilizan indicadores integrales de forma regular',
                            'Se cuenta con un sistema integral consolidado'
                        )
                    },
                    {
                        text: '¿El monitoreo y las revisiones se realizan con la frecuencia necesaria para hacer ajustes continuos del proceso?',
                        type: 'SCALE', order: 19, weight: 1,
                        options: opts(
                            'No se realiza seguimiento',
                            'Se realiza de forma esporádica',
                            'Se realiza de forma irregular',
                            'Se realiza de forma regular',
                            'Se realiza de forma oportuna y continua'
                        )
                    },
                    {
                        text: '¿Existe evidencia de que los ajustes al programa y mejoras se basan en el análisis de los resultados obtenidos?',
                        type: 'SCALE', order: 20, weight: 1,
                        options: opts(
                            'No se usan los resultados',
                            'Existe poca evidencia del uso de los resultados',
                            'Se usan los resultados y se evidencia parcialmente',
                            'Se usan de forma regular los resultados y se evidencian',
                            'Se usan constantemente los resultados y se evidencian'
                        )
                    },
                ],
            },
        },
    });

    // MÓDULO 4: Participación e Inclusión (15%) - 12 preguntas
    console.log('📝 Creando Módulo 4: Participación e Inclusión (12 preguntas)...');
    await prisma.section.create({
        data: {
            title: 'Participación e Inclusión',
            description: 'Evaluación del nivel de participación ciudadana y co-creación en el proceso de planificación.',
            weight: 15,
            order: 4,
            questions: {
                create: [
                    {
                        text: '¿La mayoría de los actores sociales claves invitados participaron activamente en los talleres de mapeo legal e institucional?',
                        type: 'SCALE', order: 1, weight: 1,
                        options: opts(
                            'Participó menos del 10%',
                            'Participó menos de 50%',
                            'Participó alrededor del 50%',
                            'Participó entre el 50% y 90%',
                            'Participó el 100%'
                        )
                    },
                    {
                        text: '¿Las reglas y prácticas formales e informales de planificación se documentaron y validaron con la participación de la comunidad?',
                        type: 'SCALE', order: 2, weight: 1,
                        options: opts(
                            'No se documentaron ni validaron',
                            'Se documentaron de forma muy limitada',
                            'Se documentaron parcialmente',
                            'Se documentaron y validaron en la mayoría de los casos',
                            'Se documentaron y validaron ampliamente con la comunidad'
                        )
                    },
                    {
                        text: '¿Durante los talleres se identificaron y discutieron claramente funciones traslapadas entre dependencias?',
                        type: 'SCALE', order: 3, weight: 1,
                        options: opts(
                            'No se identificaron',
                            'Se identificaron muy pocos casos',
                            'Se identificaron algunos casos',
                            'Se identificaron la mayoría de los casos',
                            'Se identificaron y abordaron claramente los traslapes'
                        )
                    },
                    {
                        text: '¿Comunidad y especialistas identificaron de manera conjunta una variedad amplia de problemas importantes del territorio?',
                        type: 'SCALE', order: 4, weight: 1,
                        options: opts(
                            'Se identificaron muy pocos problemas',
                            'Se identificaron problemas similares o repetidos',
                            'Se identificaron varios problemas distintos',
                            'Se identificaron muchos problemas relevantes',
                            'Se identificaron problemas diversos y bien fundamentados'
                        )
                    },
                    {
                        text: '¿Qué porcentaje de los elementos de la visión construida con la comunidad se incorporaron en los documentos oficiales del plan?',
                        type: 'SCALE', order: 5, weight: 1,
                        options: opts(
                            'Se incorporó el 0%',
                            'Se incorporaron menos del 20%',
                            'Se incorporó entre el 50% y 73%',
                            'Se incorporaron entre el 74% y 90%',
                            'Se incorporó el 100%'
                        )
                    },
                    {
                        text: '¿Qué porcentaje de las estrategias del plan reflejan claramente la visión de futuro construida con la comunidad?',
                        type: 'SCALE', order: 6, weight: 1,
                        options: opts(
                            'Reflejan el 0%',
                            'Reflejan menos del 20%',
                            'Reflejan entre el 50% y 73%',
                            'Reflejan entre el 74% y 90%',
                            'Reflejan el 100%'
                        )
                    },
                    {
                        text: '¿Qué porcentaje de las acciones del plan tienen responsables, recursos y tiempos definidos junto con los actores sociales?',
                        type: 'SCALE', order: 7, weight: 1,
                        options: opts(
                            'Se definió el 0%',
                            'Se definió menos del 20%',
                            'Se definió entre el 50% y 73%',
                            'Se definió entre el 74% y 90%',
                            'Se definió el 100%'
                        )
                    },
                    {
                        text: '¿Existe una red activa de personas de la comunidad que participan en el seguimiento del plan?',
                        type: 'SCALE', order: 8, weight: 1,
                        options: opts(
                            'No existe una red comunitaria',
                            'Existe, pero con muy poca participación',
                            'Existe con participación limitada',
                            'Existe y es representativa en varias zonas',
                            'Existe una red activa y bien organizada'
                        )
                    },
                    {
                        text: '¿Los diferentes actores coinciden en cómo se evalúan los impactos de las acciones realizadas?',
                        type: 'SCALE', order: 9, weight: 1,
                        options: opts(
                            'Hay mucha diferencia de opiniones',
                            'Coinciden en pocos casos',
                            'Coinciden en algunos casos',
                            'Coinciden en la mayoría de los casos',
                            'Existe un alto nivel de acuerdo'
                        )
                    },
                    {
                        text: '¿El proceso de participación influyó realmente en las decisiones y repartición de responsabilidades?',
                        type: 'SCALE', order: 10, weight: 2,
                        options: opts(
                            'La participación fue solo informativa',
                            'La participación fue consultiva',
                            'La participación influyó en algunas decisiones',
                            'La participación fue colaborativa',
                            'La comunidad tuvo un papel activo y corresponsable'
                        )
                    },
                    {
                        text: '¿En qué porcentaje los datos recopilados por la comunidad y los datos oficiales muestran resultados similares?',
                        type: 'SCALE', order: 11, weight: 1,
                        options: opts(
                            'Coinciden en menos del 20% de los indicadores',
                            'Coinciden aproximadamente entre 20% y 40%',
                            'Coinciden alrededor del 50%',
                            'Coinciden entre 60% y 80%',
                            'Coinciden en más del 80% de los indicadores'
                        )
                    },
                    {
                        text: '¿Qué porcentaje de las recomendaciones hechas por los actores sociales se tomaron en cuenta para ajustar el plan?',
                        type: 'SCALE', order: 12, weight: 1,
                        options: opts(
                            'Se adoptaron menos del 20% de las recomendaciones',
                            'Se adoptaron aproximadamente entre 20% y 40%',
                            'Se adoptaron alrededor del 50%',
                            'Se adoptaron entre 60% y 80%',
                            'Se adoptaron más del 80% de las recomendaciones'
                        )
                    },
                ],
            },
        },
    });

    console.log('\n✅ Seed completado exitosamente!');
    console.log('📊 Total de preguntas SCALE: 15 + 25 + 20 + 12 = 72 preguntas');
    console.log('📝 5 Módulos creados (0-4)');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
