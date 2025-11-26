'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { LogOut, FileText, CheckCircle2, Clock, TrendingUp, Users } from 'lucide-react';
import { ThemeControls } from '@/components/ThemeControls';
import Link from 'next/link';
import { FinalizeButton } from './FinalizeButton';

interface Section {
    id: string;
    title: string;
    description: string;
    weight: number;
    order: number;
    _count: {
        questions: number;
    };
}

interface User {
    id: string;
    username: string;
    role: string;
}

interface DashboardClientProps {
    sections: Section[];
    user: any;
}

export function DashboardClient({ sections, user }: DashboardClientProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50'}`}>
            <header className={`backdrop-blur-md shadow-sm border-b sticky top-0 z-50 transition-colors ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200/50'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Sistema de Evaluación Municipal</h1>
                            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Panel de Control</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block">
                                <p className={`text-xs uppercase tracking-wide ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Municipio</p>
                                <p className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{user?.username}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <ThemeControls />
                                {user?.role === 'ADMIN' && (
                                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg transition-all hover:scale-105 active:scale-95 shadow-sm">
                                        <Users className="w-4 h-4" />
                                        <span className="hidden sm:inline">Panel Admin</span>
                                    </Link>
                                )}
                                <form action="/api/logout" method="POST">
                                    <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg transition-all hover:scale-105 active:scale-95 shadow-sm">
                                        <LogOut className="w-4 h-4" />
                                        <span className="hidden sm:inline">Cerrar Sesión</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-12">
                    <div className={`relative overflow-hidden rounded-3xl p-8 shadow-2xl ${isDark ? 'bg-gradient-to-r from-slate-800 to-slate-700' : 'bg-gradient-to-r from-slate-900 to-blue-900'}`}>
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')] bg-cover bg-center opacity-10" />
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold text-white mb-2">¡Bienvenido!</h2>
                            <p className="text-blue-100 max-w-2xl">Complete cada sección de evaluación para generar su indicador municipal. El sistema guardará su progreso automáticamente.</p>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className={`stats-card backdrop-blur-sm rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all hover:scale-105 ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white/60 border-slate-200/50'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{sections.length}</p>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Secciones Totales</p>
                            </div>
                        </div>
                    </div>
                    <div className={`stats-card backdrop-blur-sm rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all hover:scale-105 ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white/60 border-slate-200/50'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${isDark ? 'bg-amber-900/50' : 'bg-amber-100'}`}>
                                <Clock className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>-</p>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>En Progreso</p>
                            </div>
                        </div>
                    </div>
                    <div className={`stats-card backdrop-blur-sm rounded-2xl p-6 border shadow-sm hover:shadow-md transition-all hover:scale-105 ${isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white/60 border-slate-200/50'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${isDark ? 'bg-green-900/50' : 'bg-green-100'}`}>
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>-</p>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Puntaje Esperado</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-12">
                    <h3 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                        <CheckCircle2 className="w-7 h-7 text-blue-600" />
                        Secciones de Evaluación
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sections.map((section, index) => (
                            <Link
                                key={section.id}
                                href={`/dashboard/section/${section.id}`}
                                className="group block"
                            >
                                <div className={`relative rounded-2xl shadow-sm border-2 p-6 hover:shadow-xl transition-all duration-300 h-full hover:scale-105 ${isDark ? 'bg-slate-800 border-slate-700 hover:border-blue-500' : 'bg-white border-slate-100 hover:border-blue-300'}`}>
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-xl group-hover:from-blue-100 group-hover:to-blue-200 transition-colors ${isDark ? 'bg-gradient-to-br from-blue-900/50 to-blue-800/50' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
                                            <FileText className="w-7 h-7 text-blue-600" />
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${isDark ? 'text-slate-500 bg-slate-700' : 'text-slate-400 bg-slate-100'}`}>#{index + 1}</span>
                                    </div>
                                    <h4 className={`text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                                        {section.title}
                                    </h4>
                                    <p className={`text-sm line-clamp-2 mb-4 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {section.description}
                                    </p>
                                    <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                                        <div className={`flex items-center text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                            <span className="font-medium">{section._count.questions} preguntas</span>
                                        </div>
                                        <div className="flex items-center text-xs font-bold text-blue-600">
                                            <span>Peso {section.weight}%</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className={`rounded-3xl shadow-sm border-2 p-8 ${isDark ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-slate-700' : 'bg-gradient-to-br from-white to-blue-50 border-blue-100'}`}>
                    <div className="max-w-2xl mx-auto text-center">
                        <div className={`inline-block p-4 rounded-full mb-4 ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                            <CheckCircle2 className="w-12 h-12 text-blue-600" />
                        </div>
                        <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>¿Completaste todas las secciones?</h3>
                        <p className={`mb-6 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            Una vez que finalices la evaluación, se calculará automáticamente tu calificación final.
                            <strong className={isDark ? 'text-slate-100' : 'text-slate-900'}> No podrás hacer cambios después de finalizar.</strong>
                        </p>
                        <FinalizeButton />
                    </div>
                </div>
            </main>
        </div>
    );
}
