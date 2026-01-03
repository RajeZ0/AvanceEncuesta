import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

export async function GET() {
    try {
        // Validar sesión del usuario
        const user = await validateSession();

        if (!user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }

        // Obtener la última evaluación del usuario
        const submission = await prisma.submission.findFirst({
            where: { userId: user.id },
            orderBy: { updatedAt: 'desc' },
            include: {
                answers: {
                    include: {
                        question: {
                            include: {
                                section: true
                            }
                        }
                    }
                }
            }
        });

        if (!submission) {
            return NextResponse.json({
                hasResults: false,
                message: 'Aún no has completado ninguna evaluación'
            });
        }

        // Obtener todas las secciones
        const allSections = await prisma.section.findMany({
            include: {
                questions: true
            },
            orderBy: { order: 'asc' }
        });

        // Calcular desglose por módulo con mensajes de retroalimentación
        const moduleBreakdown = allSections.map(section => {
            const sectionAnswers = submission.answers.filter(
                answer => answer.question.sectionId === section.id
            );

            const totalQuestions = section.questions.length;
            const answeredQuestions = sectionAnswers.length;

            // Calcular puntaje del módulo (promedio convertido a escala 0-100)
            let moduleScore: number | null = null;
            if (answeredQuestions > 0) {
                const avgScore = sectionAnswers.reduce((sum, ans) => sum + (ans.score || 0), 0) / answeredQuestions;
                moduleScore = (avgScore / 5) * 100;
            }

            // Determinar estado del semáforo y mensaje de retroalimentación
            let trafficLight: 'EXCELENTE' | 'INTERMEDIO' | 'BAJO' | 'PENDIENTE' = 'PENDIENTE';
            let feedbackMessage = '';
            let feedbackIcon = '';
            let recommendations: string[] = [];

            if (moduleScore !== null) {
                if (moduleScore >= 80) {
                    trafficLight = 'EXCELENTE';
                    feedbackMessage = '¡Excelente desempeño! Mantén este nivel de gestión.';
                    feedbackIcon = '🟢';
                    recommendations = [
                        'Continúa con las buenas prácticas actuales',
                        'Comparte tu experiencia con otros municipios',
                        'Documenta los procesos exitosos para replicarlos'
                    ];
                } else if (moduleScore >= 50) {
                    trafficLight = 'INTERMEDIO';
                    feedbackMessage = 'Área de oportunidad. Hay aspectos que pueden mejorarse.';
                    feedbackIcon = '🟡';
                    recommendations = [
                        'Revisa las políticas y procedimientos actuales',
                        'Identifica los puntos débiles específicos',
                        'Capacita al personal en las áreas deficientes',
                        'Establece metas de mejora a corto plazo'
                    ];
                } else {
                    trafficLight = 'BAJO';
                    feedbackMessage = 'Área crítica que requiere atención prioritaria.';
                    feedbackIcon = '🔴';
                    recommendations = [
                        'Prioriza este módulo en tu plan de trabajo',
                        'Busca asesoría especializada',
                        'Revisa la normatividad aplicable',
                        'Implementa acciones correctivas inmediatas',
                        'Considera solicitar apoyo de otras instancias'
                    ];
                }
            } else {
                feedbackMessage = 'Módulo sin respuestas aún.';
                feedbackIcon = '⚪';
                recommendations = [
                    'Completa las preguntas de este módulo para obtener retroalimentación'
                ];
            }

            const isCompleted = submission.completedSectionIds
                ? JSON.parse(submission.completedSectionIds).includes(section.id)
                : false;

            return {
                id: section.id,
                nombre: section.title,
                descripcion: section.description,
                totalPreguntas: totalQuestions,
                preguntasRespondidas: answeredQuestions,
                puntaje: moduleScore ? Math.round(moduleScore * 10) / 10 : null,
                semaforo: trafficLight,
                iconoSemaforo: feedbackIcon,
                mensajeRetroalimentacion: feedbackMessage,
                recomendaciones: recommendations,
                completado: isCompleted
            };
        });

        // Calcular estadísticas generales
        const modulosCompletados = moduleBreakdown.filter(m => m.completado).length;
        const totalModulos = allSections.length;

        // Generar mensaje general basado en el puntaje global
        let mensajeGeneral = '';
        let nivelGeneral = '';
        const puntajeGlobal = submission.score ? Math.round(submission.score * 10) / 10 : null;

        if (puntajeGlobal !== null) {
            if (puntajeGlobal >= 80) {
                nivelGeneral = 'Alto';
                mensajeGeneral = '¡Felicidades! Tu municipio muestra un excelente nivel de planeación sustentable. Sigue trabajando para mantener y mejorar estos resultados.';
            } else if (puntajeGlobal >= 50) {
                nivelGeneral = 'Medio';
                mensajeGeneral = 'Tu municipio tiene un nivel intermedio de planeación sustentable. Hay oportunidades importantes de mejora en algunos módulos.';
            } else {
                nivelGeneral = 'Bajo';
                mensajeGeneral = 'Tu municipio requiere atención prioritaria en varios aspectos de planeación sustentable. Te recomendamos revisar los módulos con semáforo rojo.';
            }
        }

        return NextResponse.json({
            hasResults: true,
            usuario: {
                nombre: user.name || user.username,
                municipio: user.municipality,
                estado: user.state
            },
            puntajeGlobal,
            nivelGeneral,
            mensajeGeneral,
            estado: submission.status,
            modulos: moduleBreakdown,
            estadisticas: {
                totalModulos,
                modulosCompletados,
                fechaInicio: submission.createdAt,
                ultimaActualizacion: submission.updatedAt
            }
        });
    } catch (error) {
        console.error('Error obteniendo resultados:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
