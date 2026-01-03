'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { LogOut, FileText, CheckCircle2, Clock, TrendingUp, Users, ArrowRight, LayoutDashboard, Award, BarChart3, Home } from 'lucide-react';
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
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

    const openAuthModal = (mode: 'login' | 'register') => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
    };

    const handleSectionClick = (sectionId: string) => {
        if (user) {
            window.location.href = `/dashboard/section/${sectionId}`;
        } else {
            setSelectedSectionId(sectionId);
            setAuthMode('login');
            setIsAuthModalOpen(true);
        }
    };

    const handleAuthSuccess = () => {
        if (selectedSectionId) {
            window.location.href = `/dashboard/section/${selectedSectionId}`;
        } else {
            window.location.reload();
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok || response.redirected) {
                // Redirect to landing page
                window.location.href = '/';
            } else {
                console.error('Logout failed');
                // Even if it fails, redirect to landing page as fallback
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Redirect to landing page even on error
            window.location.href = '/';
        }
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
                                    <Link href="/" className="p-2 text-slate-500 hover:text-emerald-600 transition-colors" title="Ir a Inicio">
                                        <Home className="w-5 h-5" />
                                    </Link>
                                    <ThemeControls />
                                    {user.role !== 'ADMIN' && (
                                        <Link href="/dashboard/my-results" className="p-2 text-slate-500 hover:text-emerald-600 transition-colors" title="Ver Mis Resultados">
                                            <BarChart3 className="w-5 h-5" />
                                        </Link>
                                    )}
                                    {user.role === 'ADMIN' && (
                                        <Link href="/admin" className="p-2 text-slate-500 hover:text-blue-600 transition-colors" title="Panel Admin">
                                            <Users className="w-5 h-5" />
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                                        title="Cerrar Sesión"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
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
                onClose={() => {
                    setIsAuthModalOpen(false);
                    setSelectedSectionId(null);
                }}
                onSuccess={handleAuthSuccess}
                initialMode={authMode}
            />

            <main className="max-w-7xl mx-auto px-6 py-8">

                {/* Stats Grid - High Contrast */}
                {user && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <StatsCard
                            icon={<LayoutDashboard className="w-6 h-6 text-slate-700" />}
                            value={sections.length}
                            label="Módulos Totales"
                            color="slate"
                        />
                        <StatsCard
                            icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
                            value={completedSectionIds.length}
                            label="Completados"
                            color="emerald"
                        />
                        <StatsCard
                            icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
                            value={`${currentScore.toFixed(1)}%`}
                            label="Índice Global"
                            color="blue"
                        />
                    </div>
                )}

                {/* Modules Grid */}
                <div className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                    <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                            Módulos de Evaluación
                        </h3>
                        <span className="text-sm font-bold px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            {sections.length} Disponibles
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sections.map((section, index) => {
                            const isCompleted = completedSectionIds.includes(section.id);
                            const content = (
                                <SectionCardContent
                                    section={section}
                                    index={index}
                                    isCompleted={isCompleted}
                                />
                            );

                            return (
                                <div key={section.id} className="h-full">
                                    {user ? (
                                        <Link href={`/dashboard/section/${section.id}`} className="block h-full outline-none focus:ring-4 focus:ring-emerald-500/20 rounded-[2rem]">
                                            {content}
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => handleSectionClick(section.id)}
                                            className="block w-full h-full text-left outline-none focus:ring-4 focus:ring-emerald-500/20 rounded-[2rem]"
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
                <div className="mt-16 text-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <div className="max-w-xl mx-auto">
                        <FinalizeButton disabled={completedSectionIds.length !== sections.length} />
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatsCard({ icon, value, label, color }: any) {
    const bgColors: any = {
        slate: 'bg-slate-100 group-hover:bg-slate-200',
        emerald: 'bg-emerald-50 group-hover:bg-emerald-100',
        blue: 'bg-blue-50 group-hover:bg-blue-100',
    };

    return (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default">
            <div className="flex items-center gap-5">
                <div className={`p-4 rounded-xl transition-colors ${bgColors[color]}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-4xl font-black text-slate-900 tracking-tight">{value}</p>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mt-1">{label}</p>
                </div>
            </div>
        </div>
    );
}

function SectionCardContent({ section, index, isCompleted }: { section: Section, index: number, isCompleted: boolean }) {
    return (
        <div className="group relative h-full p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-emerald-500/30 hover:-translate-y-2">

            {/* Hover Gradient Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

            {/* Progress/Status Indicator */}
            <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black transition-all duration-300 ${isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white'}`}>
                    {index + 1}
                </div>
                {isCompleted ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completado
                    </span>
                ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-500 bg-slate-100 rounded-full border border-slate-200 group-hover:bg-slate-200 transition-colors">
                        <Clock className="w-3.5 h-3.5" /> Pendiente
                    </span>
                )}
            </div>

            <h4 className="text-xl font-bold mb-4 pr-4 text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                {section.title}
            </h4>

            <p className="text-sm leading-relaxed mb-8 line-clamp-3 text-slate-500 group-hover:text-slate-600 transition-colors">
                {section.description}
            </p>

            <div className="pt-6 mt-auto border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <FileText className="w-4 h-4" />
                    {section._count.questions} preguntas
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 duration-300">
                    Comenzar <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
}
