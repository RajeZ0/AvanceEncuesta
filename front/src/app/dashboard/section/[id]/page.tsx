'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { QuestionNavigation } from '@/components/QuestionNavigation';

interface Question {
    id: string;
    text: string;
    type: 'SCALE' | 'BOOLEAN' | 'TEXT';
    weight: number;
}

interface Section {
    id: string;
    title: string;
    description: string;
    questions: Question[];
}

export default function SectionPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [section, setSection] = useState<Section | null>(null);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchSection = async () => {
            try {
                const res = await fetch(`/api/section/${resolvedParams.id}`);
                if (!res.ok) throw new Error('Error loading section');
                const data = await res.json();
                setSection(data);
                setIsCompleted(data.isCompleted);

                // Load existing answers
                if (data.savedAnswers) {
                    setAnswers(data.savedAnswers);
                }
            } catch (err) {
                console.error(err);
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
                alert(`No puede finalizar el módulo. Ha respondido ${answeredCount} de ${section.questions.length} preguntas.`);
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
                alert('Módulo finalizado correctamente');
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
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Cargando preguntas...</div>;
    if (!section) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">Módulo no encontrado</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
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
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Content - Questions */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">{section.description}</p>
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
                                className={`bg-white p-8 rounded-xl shadow-sm border border-gray-200 transition-shadow duration-200 scroll-mt-28 ${isCompleted ? 'opacity-75 pointer-events-none' : 'hover:shadow-md'}`}
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
                                        <div className="space-y-4">
                                            <div className="flex justify-between gap-2 sm:gap-4">
                                                {[1, 2, 3, 4, 5].map((val) => {
                                                    const labels: Record<number, string> = {
                                                        1: 'Crítico/Nulo',
                                                        2: 'Bajo',
                                                        3: 'Regular',
                                                        4: 'Bueno',
                                                        5: 'Excelente'
                                                    };

                                                    return (
                                                        <label key={val} className={`flex-1 flex flex-col items-center justify-center py-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${answers[q.id] === String(val)
                                                            ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-md'
                                                            : 'border-gray-100 text-gray-500 hover:border-gray-300 hover:bg-gray-50'}`}>
                                                            <input
                                                                type="radio"
                                                                name={q.id}
                                                                value={val}
                                                                checked={answers[q.id] === String(val)}
                                                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                                className="hidden"
                                                                disabled={isCompleted}
                                                            />
                                                            <span className="text-sm uppercase tracking-wider font-semibold text-center">{labels[val]}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
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
            </main>
        </div>
    );
}
