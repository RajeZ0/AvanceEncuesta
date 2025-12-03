
'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface Question {
    id: string;
    text: string;
    type: 'SCALE' | 'BOOLEAN' | 'TEXT';
    weight: number;
}

interface QuestionNavigationProps {
    questions: Question[];
    answers: Record<string, string>;
}

export function QuestionNavigation({ questions, answers }: QuestionNavigationProps) {
    const [activeId, setActiveId] = useState<string>('');

    const scrollToQuestion = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setActiveId(id);
        }
    };

    const answeredCount = questions.filter(q => answers[q.id]).length;
    const progress = Math.round((answeredCount / questions.length) * 100);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Navegación</h3>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>Progreso</span>
                    <span className="font-medium text-gray-900">{progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                    {answeredCount} de {questions.length} respondidas
                </p>
            </div>

            <div className="grid grid-cols-5 gap-2">
                {questions.map((q, index) => {
                    const isAnswered = !!answers[q.id];
                    return (
                        <button
                            key={q.id}
                            onClick={() => scrollToQuestion(q.id)}
                            className={`
                                relative flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold transition-all duration-200
                                ${isAnswered
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200'}
                                ${activeId === q.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                            `}
                            title={q.text}
                        >
                            {index + 1}
                            {isAnswered && (
                                <div className="absolute -top-1 -right-1">
                                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                    <span>Respondida</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded"></div>
                    <span>Pendiente</span>
                </div>
            </div>
        </div>
    );
}
