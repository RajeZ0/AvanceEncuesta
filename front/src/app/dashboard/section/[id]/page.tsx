'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';

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
    const router = useRouter();

    useEffect(() => {
        const fetchSection = async () => {
            try {
                const res = await fetch(`/api/section/${resolvedParams.id}`);
                if (!res.ok) throw new Error('Error loading section');
                const data = await res.json();
                setSection(data);

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

    const handleAnswerChange = (questionId: string, value: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sectionId: resolvedParams.id,
                    answers,
                }),
            });

            if (res.ok) {
                router.push('/dashboard');
            } else {
                alert('Error al guardar las respuestas');
            }
        } catch (err) {
            console.error(err);
            alert('Error de conexión');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Cargando preguntas...</div>;
    if (!section) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">Sección no encontrada</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors font-medium">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Volver
                    </Link>
                    <h1 className="text-lg font-bold text-gray-800 truncate ml-4">{section.title}</h1>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center bg-slate-800 hover:bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-sm transition-all disabled:opacity-50"
                    >
                        {saving ? 'Guardando...' : 'Guardar Progreso'}
                        <Save className="w-4 h-4 ml-2" />
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{section.title}</h2>
                    <p className="text-gray-600 text-lg leading-relaxed">{section.description}</p>
                </div>

                {section.questions.map((q, index) => (
                    <div key={q.id} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start gap-4 mb-6">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold border border-slate-200">
                                {index + 1}
                            </span>
                            <h3 className="text-gray-900 font-medium text-lg leading-tight">{q.text}</h3>
                        </div>

                        <div className="ml-12">
                            {q.type === 'BOOLEAN' && (
                                <div className="flex gap-4">
                                    <label className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg border cursor-pointer transition-all duration-200 ${answers[q.id] === 'true'
                                        ? 'bg-slate-100 border-slate-400 text-slate-900 font-semibold shadow-sm'
                                        : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-600'}`}>
                                        <input
                                            type="radio"
                                            name={q.id}
                                            value="true"
                                            checked={answers[q.id] === 'true'}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            className="hidden"
                                        />
                                        <span className="text-base">Sí</span>
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg border cursor-pointer transition-all duration-200 ${answers[q.id] === 'false'
                                        ? 'bg-slate-100 border-slate-400 text-slate-900 font-semibold shadow-sm'
                                        : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-600'}`}>
                                        <input
                                            type="radio"
                                            name={q.id}
                                            value="false"
                                            checked={answers[q.id] === 'false'}
                                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                            className="hidden"
                                        />
                                        <span className="text-base">No</span>
                                    </label>
                                </div>
                            )}

                            {q.type === 'SCALE' && (
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm font-medium text-gray-500 px-2">
                                        <span>Deficiente</span>
                                        <span>Excelente</span>
                                    </div>
                                    <div className="flex justify-between gap-2 sm:gap-4">
                                        {[1, 2, 3, 4, 5].map((val) => (
                                            <label key={val} className={`flex-1 flex flex-col items-center justify-center py-3 rounded-lg border cursor-pointer transition-all duration-200 ${answers[q.id] === String(val)
                                                ? 'bg-slate-100 border-slate-400 text-slate-900 font-bold shadow-sm'
                                                : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-600'}`}>
                                                <input
                                                    type="radio"
                                                    name={q.id}
                                                    value={val}
                                                    checked={answers[q.id] === String(val)}
                                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                    className="hidden"
                                                />
                                                <span className="text-lg">{val}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {q.type === 'TEXT' && (
                                <textarea
                                    value={answers[q.id] || ''}
                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-200 focus:border-slate-400 outline-none min-h-[120px] text-gray-700 text-base transition-all bg-gray-50 focus:bg-white"
                                    placeholder="Escriba su respuesta detallada aquí..."
                                />
                            )}
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
}
