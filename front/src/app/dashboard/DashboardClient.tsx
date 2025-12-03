'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { LogOut, FileText, CheckCircle2, Clock, TrendingUp, Users, ArrowRight, LayoutDashboard, Award, BarChart3 } from 'lucide-react';
import { ThemeControls } from '@/components/ThemeControls';
import Link from 'next/link';
import { FinalizeButton } from './FinalizeButton';
import { AuthModal } from '@/components/AuthModal';
import { useState } from 'react';

interface Section {
    id: string;
    title: string;
    description: string | null;
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
    completedSectionIds: string[];
    currentScore: number;
}

export function DashboardClient({ sections, user, completedSectionIds, currentScore }: DashboardClientProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

    const openAuthModal = (mode: 'login' | 'register') => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
            {/* Navbar */}
            <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white/80 border-zinc-200'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isDark ? 'bg-zinc-800' : 'bg-zinc-900 text-white'}`}>
                                <LayoutDashboard className={`w-6 h-6 ${isDark ? 'text-zinc-200' : 'text-zinc-100'}`} />
                            </div>
                            <div>
                                <h1 className={`text-lg font-bold leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>Evaluación Municipal</h1>
                                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Sistema de Monitoreo</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {user ? (
                                <>
                                    <div className="hidden md:block text-right mr-2">
                                        <p className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Municipio</p>
                                        <p className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{user.username}</p>
                                    </div>
                                    <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block" />
                                    <ThemeControls />
                                    {user.role === 'ADMIN' && (
                                        <Link href="/admin" className="p-2 text-slate-500 hover:text-blue-600 transition-colors" title="Panel Admin">
                                            <Users className="w-5 h-5" />
                                        </Link>
                                    )}
                                    <form action="/api/logout" method="POST">
                                        <button className="p-2 text-slate-500 hover:text-red-600 transition-colors" title="Cerrar Sesión">
                                            <LogOut className="w-5 h-5" />
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <ThemeControls />
                                    <button
                                        onClick={() => openAuthModal('login')}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
                                    >
                                        Entrar
                                    </button>
                                    <button
                                        onClick={() => openAuthModal('register')}
                                        className="px-5 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
                                    >
                                        Registrarse
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Hero Section */}
                <div className="relative rounded-[2rem] overflow-hidden mb-12 group">
                    <div className={`absolute inset-0 ${isDark ? 'bg-zinc-900' : 'bg-zinc-900'}`}></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>

                    <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight tracking-tight">
                                Evaluación de Desempeño <br />
                                <span className="text-zinc-400">Municipal 2025</span>
                            </h2>
                            <p className="text-zinc-300 text-lg leading-relaxed max-w-xl">
                                Diagnóstico integral de gestión pública. Monitoreo estratégico y cumplimiento de objetivos.
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-24 h-24 bg-zinc-800/50 backdrop-blur-md rounded-2xl flex items-center justify-center border border-zinc-700 shadow-2xl">
                                <Award className="w-12 h-12 text-zinc-200" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                {user && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <StatsCard
                            icon={<LayoutDashboard className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />}
                            value={sections.length}
                            label="Módulos Totales"
                            isDark={isDark}
                            color="zinc"
                        />
                        <StatsCard
                            icon={<CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
                            value={completedSectionIds.length}
                            label="Completados"
                            isDark={isDark}
                            color="emerald"
                        />
                        <StatsCard
                            icon={<BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
                            value={`${currentScore.toFixed(1)}%`}
                            label="Índice Global"
                            isDark={isDark}
                            color="indigo"
                        />
                    </div>
                )}

                {/* Modules Grid */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Módulos de Evaluación
                        </h3>
                        <span className={`text-sm font-medium px-3 py-1 rounded-full ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                            {sections.length} Disponibles
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sections.map((section, index) => {
                            const isCompleted = completedSectionIds.includes(section.id);
                            const content = (
                                <SectionCardContent
                                    section={section}
                                    index={index}
                                    isCompleted={isCompleted}
                                    isDark={isDark}
                                />
                            );

                            return (
                                <div key={section.id} className="h-full">
                                    {user ? (
                                        <Link href={`/dashboard/section/${section.id}`} className="block h-full outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl">
                                            {content}
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => openAuthModal('register')}
                                            className="block w-full h-full text-left outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl"
                                        >
                                            {content}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Finalize Section */}
                <div className={`relative overflow-hidden rounded-3xl p-10 text-center border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}`}>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${isDark ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-50 text-emerald-600'}`}>
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            Finalizar Evaluación
                        </h3>
                        <p className={`mb-8 text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Una vez completados todos los módulos, finalice el proceso para generar su reporte oficial.
                            <br />
                            <span className="text-sm opacity-75">Esta acción bloqueará las respuestas.</span>
                        </p>
                        <FinalizeButton />
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatsCard({ icon, value, label, isDark, color }: any) {
    const bgColors: any = {
        zinc: isDark ? 'bg-zinc-800' : 'bg-zinc-100',
        emerald: isDark ? 'bg-emerald-900/20' : 'bg-emerald-50',
        indigo: isDark ? 'bg-indigo-900/20' : 'bg-indigo-50',
    };

    return (
        <div className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-md ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${bgColors[color]}`}>
                    {icon}
                </div>
                <div>
                    <p className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>{value}</p>
                    <p className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{label}</p>
                </div>
            </div>
        </div>
    );
}

function SectionCardContent({ section, index, isCompleted, isDark }: { section: Section, index: number, isCompleted: boolean, isDark: boolean }) {
    return (
        <div className={`group relative h-full p-6 rounded-xl border transition-all duration-300 hover:-translate-y-1 ${isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-lg'}`}>
            {/* Progress/Status Indicator */}
            <div className="flex justify-between items-start mb-6">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${isCompleted ? 'bg-emerald-600 text-white' : (isDark ? 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700 group-hover:text-white' : 'bg-zinc-100 text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white')}`}>
                    {index + 1}
                </div>
                {isCompleted && (
                    <span className="px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-full border border-emerald-200">
                        Completado
                    </span>
                )}
            </div>

            <h4 className={`text-xl font-bold mb-3 pr-4 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {section.title}
            </h4>

            <p className={`text-sm leading-relaxed mb-6 line-clamp-3 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                {section.description}
            </p>

            <div className={`pt-4 mt-auto border-t flex items-center justify-between ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`}>
                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                    <FileText className="w-3.5 h-3.5" />
                    {section._count.questions} preguntas
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-zinc-900'} opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0`}>
                    Ver Módulo <ArrowRight className="w-3.5 h-3.5" />
                </div>
            </div>
        </div>
    );
}
