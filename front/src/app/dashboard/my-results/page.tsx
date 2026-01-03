'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import {
    ArrowLeft,
    BarChart3,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Clock,
    TrendingUp,
    Award,
    Target,
    Lightbulb,
    Home,
    LogOut
} from 'lucide-react';
import { ThemeControls } from '@/components/ThemeControls';

interface ModuleResult {
    id: string;
    nombre: string;
    descripcion: string | null;
    totalPreguntas: number;
    preguntasRespondidas: number;
    puntaje: number | null;
    semaforo: 'EXCELENTE' | 'INTERMEDIO' | 'BAJO' | 'PENDIENTE';
    iconoSemaforo: string;
    mensajeRetroalimentacion: string;
    recomendaciones: string[];
    completado: boolean;
}

interface ResultsData {
    hasResults: boolean;
    message?: string;
    usuario?: {
        nombre: string;
        municipio: string;
        estado: string;
    };
    puntajeGlobal: number | null;
    nivelGeneral: string;
    mensajeGeneral: string;
    estado: string;
    modulos: ModuleResult[];
    estadisticas: {
        totalModulos: number;
        modulosCompletados: number;
        fechaInicio: string;
        ultimaActualizacion: string;
    };
}

export default function MyResultsPage() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ResultsData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [expandedModule, setExpandedModule] = useState<string | null>(null);

    useEffect(() => {
        async function fetchResults() {
            try {
                const res = await fetch('/api/my-results');
                if (!res.ok) {
                    if (res.status === 401) {
                        window.location.href = '/login';
                        return;
                    }
                    throw new Error('Error al cargar resultados');
                }
                const result = await res.json();
                setData(result);
            } catch (err) {
                setError('No se pudieron cargar tus resultados');
            } finally {
                setLoading(false);
            }
        }
        fetchResults();
    }, []);

    const handleLogout = async () => {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = '/';
    };

    const getSemaforoStyles = (semaforo: string) => {
        switch (semaforo) {
            case 'EXCELENTE':
                return {
                    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                    border: 'border-emerald-200 dark:border-emerald-700',
                    text: 'text-emerald-700 dark:text-emerald-400',
                    icon: <CheckCircle2 className="w-6 h-6" />,
                    badgeBg: 'bg-emerald-500',
                    progressBg: 'bg-emerald-500'
                };
            case 'INTERMEDIO':
                return {
                    bg: 'bg-amber-50 dark:bg-amber-900/20',
                    border: 'border-amber-200 dark:border-amber-700',
                    text: 'text-amber-700 dark:text-amber-400',
                    icon: <AlertTriangle className="w-6 h-6" />,
                    badgeBg: 'bg-amber-500',
                    progressBg: 'bg-amber-500'
                };
            case 'BAJO':
                return {
                    bg: 'bg-red-50 dark:bg-red-900/20',
                    border: 'border-red-200 dark:border-red-700',
                    text: 'text-red-700 dark:text-red-400',
                    icon: <XCircle className="w-6 h-6" />,
                    badgeBg: 'bg-red-500',
                    progressBg: 'bg-red-500'
                };
            default:
                return {
                    bg: 'bg-slate-50 dark:bg-slate-800',
                    border: 'border-slate-200 dark:border-slate-700',
                    text: 'text-slate-500 dark:text-slate-400',
                    icon: <Clock className="w-6 h-6" />,
                    badgeBg: 'bg-slate-400',
                    progressBg: 'bg-slate-400'
                };
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className={`text-lg font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
                        Cargando tus resultados...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
                <div className="text-center p-8 max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                        {error || 'Error al cargar'}
                    </h2>
                    <Link href="/dashboard" className="text-emerald-600 hover:underline">
                        Volver al Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    if (!data.hasResults) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-zinc-950' : 'bg-zinc-50'}`}>
                <div className="text-center p-8 max-w-md">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-amber-500" />
                    </div>
                    <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                        Sin resultados aún
                    </h2>
                    <p className={`mb-6 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        {data.message || 'Completa al menos un módulo para ver tus resultados.'}
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Ir a la Evaluación
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-zinc-950' : 'bg-gradient-to-br from-slate-50 to-zinc-100'}`}>
            {/* Header */}
            <header className={`sticky top-0 z-40 backdrop-blur-xl border-b transition-colors duration-300 ${isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white/80 border-zinc-200'}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/dashboard" className="flex items-center gap-3 group">
                            <div className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-zinc-800 group-hover:bg-zinc-700' : 'bg-zinc-100 group-hover:bg-zinc-200'}`}>
                                <ArrowLeft className={`w-5 h-5 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`} />
                            </div>
                            <span className={`font-semibold ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`}>Volver</span>
                        </Link>

                        <h1 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                            Mis Resultados
                        </h1>

                        <div className="flex items-center gap-3">
                            <Link href="/dashboard" className="p-2 text-slate-500 hover:text-emerald-600 transition-colors" title="Dashboard">
                                <Home className="w-5 h-5" />
                            </Link>
                            <ThemeControls />
                            <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-600 transition-colors" title="Cerrar Sesión">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* User Info & Global Score */}
                <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className={`p-8 rounded-3xl ${isDark ? 'bg-gradient-to-br from-zinc-900 to-zinc-800' : 'bg-gradient-to-br from-white to-slate-50'} shadow-xl border ${isDark ? 'border-zinc-700' : 'border-slate-200'}`}>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <p className={`text-sm font-medium uppercase tracking-wider mb-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                    Evaluación Municipal
                                </p>
                                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                                    {data.usuario?.nombre || 'Usuario'}
                                </h2>
                                {data.usuario?.municipio && (
                                    <p className={`mt-1 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                        📍 {data.usuario.municipio}, {data.usuario.estado}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-6">
                                {/* Global Score Circle */}
                                <div className="relative">
                                    <svg className="w-32 h-32 transform -rotate-90">
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke={isDark ? '#27272a' : '#e4e4e7'}
                                            strokeWidth="12"
                                            fill="none"
                                        />
                                        <circle
                                            cx="64"
                                            cy="64"
                                            r="56"
                                            stroke={data.puntajeGlobal !== null && data.puntajeGlobal >= 80 ? '#10b981' : data.puntajeGlobal !== null && data.puntajeGlobal >= 50 ? '#f59e0b' : '#ef4444'}
                                            strokeWidth="12"
                                            fill="none"
                                            strokeDasharray={`${((data.puntajeGlobal || 0) / 100) * 352} 352`}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <span className={`text-3xl font-black ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                                            {data.puntajeGlobal?.toFixed(1) || '--'}%
                                        </span>
                                        <span className={`text-xs font-medium ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                            IPS Global
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${data.nivelGeneral === 'Alto'
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                        : data.nivelGeneral === 'Medio'
                                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        }`}>
                                        <Award className="w-4 h-4" />
                                        Nivel {data.nivelGeneral}
                                    </div>
                                    <p className={`mt-2 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                        {data.estadisticas.modulosCompletados} de {data.estadisticas.totalModulos} módulos
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* General Feedback Message */}
                        <div className={`mt-6 p-4 rounded-xl ${isDark ? 'bg-zinc-800/50' : 'bg-slate-100'}`}>
                            <div className="flex items-start gap-3">
                                <Lightbulb className={`w-5 h-5 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
                                <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                    {data.mensajeGeneral}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Module Breakdown */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <BarChart3 className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                            Desglose por Módulo
                        </h3>
                    </div>

                    <div className="grid gap-4">
                        {data.modulos.map((modulo, index) => {
                            const styles = getSemaforoStyles(modulo.semaforo);
                            const isExpanded = expandedModule === modulo.id;

                            return (
                                <div
                                    key={modulo.id}
                                    className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${styles.bg} ${styles.border}`}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <button
                                        onClick={() => setExpandedModule(isExpanded ? null : modulo.id)}
                                        className="w-full p-6 text-left"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className={`p-3 rounded-xl ${styles.badgeBg} text-white`}>
                                                    {styles.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h4 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                                                            {modulo.nombre}
                                                        </h4>
                                                        <span className={`text-2xl`}>{modulo.iconoSemaforo}</span>
                                                    </div>
                                                    <p className={`text-sm mb-3 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                                        {modulo.descripcion}
                                                    </p>

                                                    {/* Progress Bar */}
                                                    <div className="flex items-center gap-4">
                                                        <div className={`flex-1 h-3 rounded-full overflow-hidden ${isDark ? 'bg-zinc-700' : 'bg-white/50'}`}>
                                                            <div
                                                                className={`h-full rounded-full transition-all duration-500 ${styles.progressBg}`}
                                                                style={{ width: `${modulo.puntaje || 0}%` }}
                                                            />
                                                        </div>
                                                        <span className={`text-lg font-bold min-w-[4rem] text-right ${styles.text}`}>
                                                            {modulo.puntaje !== null ? `${modulo.puntaje.toFixed(1)}%` : '--'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Feedback Message (always visible) */}
                                        <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-black/20' : 'bg-white/70'}`}>
                                            <p className={`text-sm font-medium ${styles.text}`}>
                                                💬 {modulo.mensajeRetroalimentacion}
                                            </p>
                                        </div>
                                    </button>

                                    {/* Expanded Recommendations */}
                                    {isExpanded && (
                                        <div className={`px-6 pb-6 border-t ${isDark ? 'border-zinc-700' : 'border-white/50'}`}>
                                            <div className="pt-4">
                                                <h5 className={`font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                                                    <Target className="w-4 h-4" />
                                                    Recomendaciones para mejorar:
                                                </h5>
                                                <ul className="space-y-2">
                                                    {modulo.recomendaciones.map((rec, i) => (
                                                        <li
                                                            key={i}
                                                            className={`flex items-start gap-2 text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}
                                                        >
                                                            <span className="text-emerald-500 mt-1">•</span>
                                                            {rec}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Statistics Footer */}
                <div className={`p-6 rounded-2xl ${isDark ? 'bg-zinc-900' : 'bg-white'} border ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
                    <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
                        <div className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>
                            <span className="font-medium">Última actualización:</span>{' '}
                            {new Date(data.estadisticas.ultimaActualizacion).toLocaleDateString('es-MX', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors"
                        >
                            Continuar Evaluación
                            <TrendingUp className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
