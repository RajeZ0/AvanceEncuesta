const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const migrationSQL = fs.readFileSync(
  path.join(__dirname, 'migrations', '20251119193715_init', 'migration.sql'),
  'utf8'
);

const db = new Database(path.join(__dirname, '..', 'dev.db'));

try {

  console.log('🗑️  Clearing existing data...');
  db.exec(`
    DELETE FROM Answer;
    DELETE FROM Submission;
    DELETE FROM Question;
    DELETE FROM Section;
    DELETE FROM User;
  `);

  // Create admin user
  const adminId = 'admin-' + Date.now();
  db.prepare(`
    INSERT INTO User (id, username, password, role, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
  `).run(adminId, 'admin', 'adminpassword', 'ADMIN');
  console.log('✅ Admin user created');

  // =================================================================
  // MÓDULO 1: Contexto Institucional (15 preguntas)
  // =================================================================
  const mod1Id = 'section-mod1-' + Date.now();
  db.prepare(`
    INSERT INTO Section (id, title, description, weight, "order")
    VALUES (?, ?, ?, ?, ?)
  `).run(mod1Id, 'Módulo 1: Contexto Institucional', 'Evaluación de la capacidad institucional, marco legal y procedimientos', 20, 1);

  const mod1Questions = [
    '¿Las leyes, regulaciones y programas de planificación territorial están actualizados y vigentes?',
    '¿Existe coherencia y compatibilidad entre las regulaciones locales y los objetivos de sustentabilidad?',
    '¿Existen mecanismos operativos de control y capacidad de aplicar sanciones?',
    '¿Qué porcentaje de planes ha logrado alto cumplimiento de la legislación territorial?',
    '¿Existen documentos formales que definan con precisión las funciones de cada cuerpo de planificación?',
    '¿Existe alta precisión en la definición de responsabilidades compartidas entre instituciones?',
    '¿La entidad cuenta con recursos humanos especializados y técnicos necesarios?',
    '¿Existe un presupuesto específico y suficiente para la gestión y monitoreo del plan?',
    '¿La frecuencia y calidad de las reuniones de coordinación interinstitucional es adecuada?',
    '¿Existen protocolos formales y funcionales de colaboración entre entidades?',
    '¿Cuál es el nivel de satisfacción de actores clave respecto al sistema de planificación?',
    '¿El proceso utiliza manuales, guías y protocolos documentados que estandarizan procedimientos?',
    '¿La información sobre procesos de planificación es accesible al público?',
    '¿El tiempo para formulación, aprobación y entrada en vigor de planes es eficiente?',
    '¿El sistema ha demostrado capacidad de adaptación a cambios no previstos?'
  ];

  mod1Questions.forEach((q, i) => {
    const qId = `q-mod1-${i}-` + Date.now();
    db.prepare(`
      INSERT INTO Question (id, text, type, weight, "order", sectionId)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(qId, q, 'SCALE', 1, i + 1, mod1Id);
  });
  console.log('✅ Módulo 1: 15 preguntas creadas');

  // =================================================================
  // MÓDULO 2: Evaluación Estratégica (23 preguntas)
  // =================================================================
  const mod2Id = 'section-mod2-' + Date.now();
  db.prepare(`
    INSERT INTO Section (id, title, description, weight, "order")
    VALUES (?, ?, ?, ?, ?)
  `).run(mod2Id, 'Módulo 2: Evaluación Estratégica', 'Evaluación del diseño estratégico y planificación', 25, 2);

  const mod2Questions = [
    '¿El diagnóstico identificó y cubrió adecuadamente los problemas críticos de sustentabilidad?',
    '¿Se validó la línea base con actores clave para asegurar comprensión profunda?',
    '¿Se incluyeron perspectivas diversas (socioeconómicas/vecinales) para mapear problemas?',
    '¿La visión es específica y aborda operativamente lo necesario para la sustentabilidad?',
    '¿Los elementos de la visión han sido integrados en documentos de planificación formal?',
    '¿El plan establece pautas claras para mitigación, adaptación y resiliencia al cambio climático?',
    '¿Se promueven patrones de desarrollo urbanos eficientes con bajas emisiones de carbono?',
    '¿Las pautas abordan equidad y justicia social, priorizando servicios en áreas de bajo riesgo?',
    '¿El plan mejora el acceso a agua y saneamiento, y reduce la contaminación del aire?',
    '¿Se protegen y producen espacios públicos y verdes de alta calidad con valor ecológico?',
    '¿La planificación espacial integra el reciclaje y gestión de residuos sólidos/líquidos?',
    '¿El plan diseña calles que fomentan caminata, transporte no motorizado y público?',
    '¿El programa establece un proceso escalonado hacia trayectorias de desarrollo sustentable?',
    '¿Las pautas estratégicas están alineadas con la visión de futuro establecida?',
    '¿Las acciones son específicas y flexibles para cumplir principios de sustentabilidad?',
    '¿El instrumento considera asignación clara de recursos financieros, sociales y políticos?',
    '¿El programa define claramente actores responsables y cronograma creíble?',
    '¿Las herramientas miden bienestar y sostenibilidad dentro de la capacidad de la biosfera?',
    '¿Las herramientas adoptan horizonte temporal y ámbito geográfico adecuados?',
    '¿Las herramientas incluyen marco conceptual y métodos de medición estandarizados?',
    '¿Se comparan valores de indicadores con objetivos y metas para medir avance?',
    '¿Los datos e indicadores son accesibles al público con fuentes y métodos divulgados?',
    '¿La evaluación es transparente, explicando supuestos e incertidumbres?'
  ];

  mod2Questions.forEach((q, i) => {
    const qId = `q-mod2-${i}-` + Date.now();
    db.prepare(`
      INSERT INTO Question (id, text, type, weight, "order", sectionId)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(qId, q, 'SCALE', 1, i + 1, mod2Id);
  });
  console.log('✅ Módulo 2: 23 preguntas creadas');

  // =================================================================
  // MÓDULO 3: Efectividad de la Planificación (17 preguntas)
  // =================================================================
  const mod3Id = 'section-mod3-' + Date.now();
  db.prepare(`
    INSERT INTO Section (id, title, description, weight, "order")
    VALUES (?, ?, ?, ?, ?)
  `).run(mod3Id, 'Módulo 3: Efectividad de la Planificación', 'Evaluación de resultados y cumplimiento de directrices ONU-Hábitat', 30, 3);

  const mod3Questions = [
    '¿Las estrategias han generado reformas significativas en el marco institucional y regulatorio?',
    '¿Las acciones han generado cambio observable en actitudes ciudadanas hacia sustentabilidad?',
    '¿El programa se enfocó en proyectos que abordan problemas fundamentales?',
    '¿Existe análisis que distinga entre logros administrativos y cambios estructurales?',
    '¿Las acciones han demostrado resultados en mitigación del cambio climático y resiliencia urbana?',
    '¿Las acciones han resultado en patrones urbanos eficientes con bajas emisiones de carbono?',
    '¿Las acciones han logrado priorizar servicios en áreas de bajo riesgo mejorando equidad?',
    '¿Las acciones han logrado mantener continuidad de funciones urbanas durante crisis?',
    '¿Las acciones han mejorado acceso a agua y saneamiento, y reducido contaminación?',
    '¿Las acciones han resultado en revitalización y protección de espacios públicos y verdes?',
    '¿Las acciones han sido efectivas en revitalizar entornos construidos en decadencia?',
    '¿Las acciones han logrado integración efectiva de reciclaje y gestión de desechos?',
    '¿Las acciones han fomentado colaboración intersectorial para planificación?',
    '¿Las acciones han generado mejora en gestión y regulación de edificios ecológicos?',
    '¿Las acciones han resultado en diseño de calles que fomentan movilidad sostenible?',
    '¿El porcentaje de metas logradas es alto y se realizan análisis de brechas?',
    '¿Se llevan a cabo estudios que demuestren relación causal entre estrategias y cambios?'
  ];

  mod3Questions.forEach((q, i) => {
    const qId = `q-mod3-${i}-` + Date.now();
    db.prepare(`
      INSERT INTO Question (id, text, type, weight, "order", sectionId)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(qId, q, 'SCALE', 1, i + 1, mod3Id);
  });
  console.log('✅ Módulo 3: 17 preguntas creadas');

  // =================================================================
  // MÓDULO 4: Participación e Inclusión (12 preguntas)
  // =================================================================
  const mod4Id = 'section-mod4-' + Date.now();
  db.prepare(`
    INSERT INTO Section (id, title, description, weight, "order")
    VALUES (?, ?, ?, ?, ?)
  `).run(mod4Id, 'Módulo 4: Participación e Inclusión', 'Evaluación del nivel de participación ciudadana y madurez IAP2', 15, 4);

  const mod4Questions = [
    '¿Se logró alta participación (>75%) de actores sociales clave en talleres de mapeo?',
    '¿Se documentaron y validaron reglas y normas informales con participación comunitaria?',
    '¿Se identificó y abordó alto porcentaje de traslape de funciones entre agencias?',
    '¿El número de problemas críticos identificados conjuntamente fue alto y diverso?',
    '¿Qué porcentaje de elementos de la visión co-creados fueron integrados formalmente?',
    '¿Qué porcentaje de directrices estratégicas tienen alto grado de alineación con la visión?',
    '¿Qué porcentaje de acciones cuenta con actores, recursos y plazos co-definidos?',
    '¿El número de monitores comunitarios activos es alto y representativo?',
    '¿Se logró alto porcentaje de acuerdo en clasificación del tipo de impacto de acciones?',
    '¿El proceso alcanzó nivel de Colaboración o Empoderamiento (IAP2)?',
    '¿En qué porcentaje de indicadores los datos comunitarios divergen de informes oficiales?',
    '¿Qué porcentaje de correcciones recomendadas por actores fue adoptado en 6 meses?'
  ];

  mod4Questions.forEach((q, i) => {
    const qId = `q-mod4-${i}-` + Date.now();
    db.prepare(`
      INSERT INTO Question (id, text, type, weight, "order", sectionId)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(qId, q, 'SCALE', 1, i + 1, mod4Id);
  });
  console.log('✅ Módulo 4: 12 preguntas creadas');

  // =================================================================
  // MÓDULO 5: Resultados e Impacto ODS (Información)
  // =================================================================
  const mod5Id = 'section-mod5-' + Date.now();
  db.prepare(`
    INSERT INTO Section (id, title, description, weight, "order")
    VALUES (?, ?, ?, ?, ?)
  `).run(mod5Id, 'Módulo 5: Resultados e Impacto ODS', 'Análisis cuantitativo de prioridades y contribución a los ODS', 10, 5);

  const mod5Questions = [
    'Indique el número total de líneas de acción del plan',
    'Indique el número de acciones implementadas reportadas',
    'Indique el % de avance en objetivos relacionados con ODS 1 (Fin de la Pobreza)',
    'Indique el % de avance en objetivos relacionados con ODS 11 (Ciudades Sostenibles)',
    'Indique el % de avance en objetivos relacionados con ODS 13 (Acción por el Clima)'
  ];

  mod5Questions.forEach((q, i) => {
    const qId = `q-mod5-${i}-` + Date.now();
    db.prepare(`
      INSERT INTO Question (id, text, type, weight, "order", sectionId)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(qId, q, 'TEXT', 1, i + 1, mod5Id);
  });
  console.log('✅ Módulo 5: 5 preguntas informativas creadas');

  console.log('\n🎉 Base de datos PLANSUSTAIN inicializada!');
  console.log('\n📊 Resumen:');
  console.log('  - Módulo 1: 15 preguntas (Contexto Institucional)');
  console.log('  - Módulo 2: 23 preguntas (Evaluación Estratégica)');
  console.log('  - Módulo 3: 17 preguntas (Efectividad)');
  console.log('  - Módulo 4: 12 preguntas (Participación)');
  console.log('  - Módulo 5: 5 preguntas (Impacto ODS)');
  console.log('  - TOTAL: 72 preguntas');
  console.log('\n👤 Credenciales:');
  console.log('  Username: admin');
  console.log('  Password: adminpassword');

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
} finally {
  db.close();
}
