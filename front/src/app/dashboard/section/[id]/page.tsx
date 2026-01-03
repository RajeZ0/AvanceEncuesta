'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { QuestionNavigation } from '@/components/QuestionNavigation';
import { FormularioIdentificacion } from '@/components/FormularioIdentificacion';

interface Question {
    id: string;
    text: string;
    type: 'SCALE' | 'BOOLEAN' | 'TEXT';
    weight: number;
    options?: string; // JSON array of option labels
}

interface Section {
    id: string;
    title: string;
    description: string;
    order: number;
    questions: Question[];
}

// Sistema de colores por módulo
const moduleColors: Record<number, {
    bg: string;
    border: string;
    accent: string;
    selected: string;
    hover: string;
}> = {
    0: { bg: 'bg-purple-50/30', border: 'border-purple-200', accent: 'bg-purple-500', selected: 'bg-purple-50 border-purple-500', hover: 'hover:border-purple-300 hover:bg-purple-50/50' },
    1: { bg: 'bg-blue-50/30', border: 'border-blue-200', accent: 'bg-blue-500', selected: 'bg-blue-50 border-blue-500', hover: 'hover:border-blue-300 hover:bg-blue-50/50' },
    2: { bg: 'bg-green-50/30', border: 'border-green-200', accent: 'bg-green-500', selected: 'bg-green-50 border-green-500', hover: 'hover:border-green-300 hover:bg-green-50/50' },
    3: { bg: 'bg-amber-50/30', border: 'border-amber-200', accent: 'bg-amber-500', selected: 'bg-amber-50 border-amber-500', hover: 'hover:border-amber-300 hover:bg-amber-50/50' },
    4: { bg: 'bg-pink-50/30', border: 'border-pink-200', accent: 'bg-pink-500', selected: 'bg-pink-50 border-pink-500', hover: 'hover:border-pink-300 hover:bg-pink-50/50' },
    5: { bg: 'bg-indigo-50/30', border: 'border-indigo-200', accent: 'bg-indigo-500', selected: 'bg-indigo-50 border-indigo-500', hover: 'hover:border-indigo-300 hover:bg-indigo-50/50' },
};

// Instrucciones por módulo
const moduleInstructions: Record<number, string> = {
    0: 'Complete la información de identificación y contexto del municipio. Todos los campos marcados con * son obligatorios.',
    1: 'Evalúe el marco legal y capacidad institucional de su municipio seleccionando la opción que mejor refleje la situación actual.',
    2: 'Analice la planificación estratégica y alineación con objetivos de sustentabilidad. Considere tanto la visión como las acciones concretas.',
    3: 'Califique los resultados e impactos logrados por las acciones de planificación implementadas en el territorio.',
    4: 'Evalúe el nivel de participación ciudadana y stakeholders en los procesos de planificación del municipio.',
    5: 'Ingrese datos cuantitativos sobre alineación con Objetivos de Desarrollo Sostenible.',
};

export default function SectionPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [section, setSection] = useState<Section | null>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchSection = async () => {
            try {
                const res = await fetch(`/api/section/${resolvedParams.id}`);
                if (res.status === 401) {
                    router.push('/login?session=expired');
                    return;
                }
                if (!res.ok) throw new Error('Error loading section');
                const data = await res.json();
                setSection(data);
                setIsCompleted(data.isCompleted);

                // Load existing answers
                if (data.savedAnswers) {
                    setAnswers(data.savedAnswers);
                }
            } catch (err: any) {
                console.error(err);
                // Only alert if it's not a redirect
                if (err.message) alert(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSection();
    }, [resolvedParams.id]);

    // Auto-save logic
    useEffect(() => {
        if (Object.keys(answers).length === 0 || isCompleted) return;

        const timeoutId = setTimeout(async () => {
            setSaving(true);
            try {
                await fetch('/api/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sectionId: resolvedParams.id,
                        answers,
                    }),
                });
            } catch (err) {
                console.error('Auto-save failed', err);
            } finally {
                setSaving(false);
            }
        }, 1000); // 1 second debounce

        return () => clearTimeout(timeoutId);
    }, [answers, resolvedParams.id, isCompleted]);

    const handleAnswerChange = (questionId: string, value: string) => {
        if (isCompleted) return;
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    // Concurrency Warning
    const [hasConflict, setHasConflict] = useState(false);

    useEffect(() => {
        if (!section) return;

        const channel = new BroadcastChannel(`section_${section.id}_user`);

        // Listen for other tabs
        channel.onmessage = (event) => {
            if (event.data === 'I_AM_HERE' || event.data === 'I_AM_HERE_TOO') {
                setHasConflict(true);
                // If I just arrived and someone else is here, I acknowledge them
                if (event.data === 'I_AM_HERE') {
                    channel.postMessage('I_AM_HERE_TOO');
                }
            }
        };

        // Announce my presence
        channel.postMessage('I_AM_HERE');

        return () => {
            channel.close();
        };
    }, [section]);

    const handleFinalize = async () => {
        // Enforce all questions answered
        if (section) {
            const answeredCount = section.questions.filter(q => answers[q.id]).length;
            if (answeredCount < section.questions.length) {
                setToast({ message: `No puede finalizar. Ha respondido ${answeredCount} de ${section.questions.length} preguntas.`, type: 'error' });
                setTimeout(() => setToast(null), 3000);
                return;
            }
        }

        if (!confirm('¿Está seguro de finalizar este módulo? No podrá modificar sus respuestas después.')) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/section/${resolvedParams.id}/finalize`, {
                method: 'POST',
            });

            if (res.ok) {
                setToast({ message: '✓ ¡Módulo finalizado con éxito!', type: 'success' });
                // Wait 2 seconds before redirecting so user can see the message
                setTimeout(() => {
                    router.push('/dashboard');
                }, 2000);
            } else {
                setToast({ message: 'Error al finalizar el módulo', type: 'error' });
                setTimeout(() => setToast(null), 3000);
            }
        } catch (err) {
            console.error(err);
            setToast({ message: 'Error de conexión', type: 'error' });
            setTimeout(() => setToast(null), 3000);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Cargando preguntas...</div>;
    if (!section) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">Módulo no encontrado</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-xl shadow-2xl font-semibold text-white transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${toast.type === 'success'
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600'
                        : 'bg-gradient-to-r from-red-500 to-rose-600'
                    }`}>
                    <div className="flex items-center gap-3">
                        {toast.type === 'success' ? (
                            <CheckCircle className="w-6 h-6" />
                        ) : (
                            <span className="text-xl">⚠️</span>
                        )}
                        <span className="text-lg">{toast.message}</span>
                    </div>
                </div>
            )}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Volver
                    </Link>
                    <h1 className="text-lg font-bold text-gray-800 truncate ml-4">{section.title}</h1>
                    <div className="flex items-center gap-4">
                        {saving && <span className="text-sm text-gray-500 animate-pulse">Guardando...</span>}
                        {!isCompleted && (
                            <button
                                onClick={handleFinalize}
                                disabled={saving}
                                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-sm transition-all disabled:opacity-50"
                            >
                                Finalizar Módulo
                                <CheckCircle className="w-4 h-4 ml-2" />
                            </button>
                        )}
                        {isCompleted && (
                            <span className="flex items-center text-green-600 font-bold px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Completado
                            </span>
                        )}
                    </div>
                </div>
                {hasConflict && (
                    <div className="bg-red-500 text-white text-center py-2 text-sm font-bold animate-pulse">
                        ⚠️ Advertencia: Tienes este módulo abierto en otra pestaña. Para evitar errores de guardado, cierra las otras pestañas.
                    </div>
                )}
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Módulo 0: Formulario de Identificación */}
                {section.order === 0 ? (
                    <FormularioIdentificacion
                        onFinalizar={async () => {
                            setSaving(true);
                            try {
                                const res = await fetch(`/api/section/${resolvedParams.id}/finalize`, {
                                    method: 'POST',
                                });
                                if (res.ok) {
                                    alert('Módulo 0 finalizado correctamente');
                                    router.push('/dashboard');
                                } else {
                                    alert('Error al finalizar el módulo');
                                }
                            } catch (err) {
                                console.error(err);
                                alert('Error de conexión');
                            } finally {
                                setSaving(false);
                            }
                        }}
                    />
                ) : (
                    /* Módulos 1-5: Preguntas normales */
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Main Content - Questions */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Header con color de módulo */}
                            <div className={`${moduleColors[section.order]?.bg || 'bg-gray-50'} p-8 rounded-xl shadow-lg border-2 ${moduleColors[section.order]?.border || 'border-gray-200'}`}>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h2>
                                <p className="text-gray-600 text-lg leading-relaxed mb-4">{section.description}</p>

                                {/* Banner de instrucciones */}
                                <div className="mt-4 p-4 bg-white/80 backdrop-blur-sm rounded-lg border-l-4 border-gray-400 shadow-sm">
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        <span className="font-bold text-gray-900">📋 Instrucciones:</span> {moduleInstructions[section.order] || 'Complete todas las preguntas de este módulo.'}
                                    </p>
                                </div>

                                {isCompleted && (
                                    <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200 text-sm">
                                        Este módulo ha sido finalizado y no se pueden editar las respuestas.
                                    </div>
                                )}
                            </div>

                            {section.questions.map((q, index) => (
                                <div
                                    key={q.id}
                                    id={q.id}
                                    className={`bg-white p-8 rounded-xl shadow-lg border-2 ${moduleColors[section.order]?.border || 'border-gray-200'} transition-all duration-200 scroll-mt-28 ${isCompleted ? 'opacity-75 pointer-events-none' : `hover:shadow-xl ${moduleColors[section.order]?.hover || 'hover:shadow-md'}`
                                        }`}
                                >
                                    <div className="flex items-start gap-4 mb-6">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold border border-slate-200">
                                            {index + 1}
                                        </span>
                                        <h3 className="text-gray-900 font-medium text-lg leading-tight">{q.text}</h3>
                                    </div>

                                    <div className="ml-12">
                                        {q.type === 'BOOLEAN' && (
                                            <div className="flex gap-4">
                                                <label className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg border transition-all duration-200 ${answers[q.id] === 'true'
                                                    ? 'bg-slate-100 border-slate-400 text-slate-900 font-semibold shadow-sm'
                                                    : 'border-gray-200 text-gray-600'}`}>
                                                    <input
                                                        type="radio"
                                                        name={q.id}
                                                        value="true"
                                                        checked={answers[q.id] === 'true'}
                                                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                        className="hidden"
                                                        disabled={isCompleted}
                                                    />
                                                    <span className="text-base">Sí</span>
                                                </label>
                                                <label className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg border transition-all duration-200 ${answers[q.id] === 'false'
                                                    ? 'bg-slate-100 border-slate-400 text-slate-900 font-semibold shadow-sm'
                                                    : 'border-gray-200 text-gray-600'}`}>
                                                    <input
                                                        type="radio"
                                                        name={q.id}
                                                        value="false"
                                                        checked={answers[q.id] === 'false'}
                                                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                        className="hidden"
                                                        disabled={isCompleted}
                                                    />
                                                    <span className="text-base">No</span>
                                                </label>
                                            </div>
                                        )}

                                        {q.type === 'SCALE' && (
                                            <div className="space-y-3">
                                                {(() => {
                                                    // Parse custom options or use defaults
                                                    let optionLabels: string[];
                                                    try {
                                                        optionLabels = q.options
                                                            ? JSON.parse(q.options)
                                                            : ['Crítico/Nulo', 'Bajo', 'Regular', 'Bueno', 'Excelente'];
                                                    } catch {
                                                        optionLabels = ['Crítico/Nulo', 'Bajo', 'Regular', 'Bueno', 'Excelente'];
                                                    }

                                                    const colors = moduleColors[section.order] || moduleColors[1];

                                                    return optionLabels.map((label, idx) => {
                                                        const val = idx + 1;
                                                        return (
                                                            <label
                                                                key={val}
                                                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${answers[q.id] === String(val)
                                                                    ? `${colors.selected} font-semibold shadow-md`
                                                                    : `border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm`
                                                                    }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name={q.id}
                                                                    value={val}
                                                                    checked={answers[q.id] === String(val)}
                                                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                                    className="hidden"
                                                                    disabled={isCompleted}
                                                                />
                                                                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${answers[q.id] === String(val)
                                                                    ? `${colors.accent} text-white border-transparent`
                                                                    : 'bg-gray-100 text-gray-500 border-gray-200'
                                                                    }`}>
                                                                    {val}
                                                                </span>
                                                                <span className="text-sm leading-snug">{label}</span>
                                                            </label>
                                                        );
                                                    });
                                                })()}
                                            </div>
                                        )}


                                        {q.type === 'TEXT' && (
                                            <textarea
                                                value={answers[q.id] || ''}
                                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none min-h-[120px] text-gray-700 text-base transition-all bg-gray-50 focus:bg-white disabled:bg-gray-100 disabled:text-gray-500"
                                                placeholder="Escriba su respuesta detallada aquí..."
                                                disabled={isCompleted}
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Sidebar - Navigation */}
                        <div className="lg:col-span-4">
                            <QuestionNavigation questions={section.questions} answers={answers} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
