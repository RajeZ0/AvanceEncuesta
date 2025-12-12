'use client';

import { useEffect, useState } from 'react';
import { X, TrendingUp, CheckCircle2, AlertCircle, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

interface ModuleData {
    id: string;
    name: string;
    description: string | null;
    totalQuestions: number;
    answeredQuestions: number;
    moduleScore: number | null;
    trafficLight: 'EXCELLENT' | 'INTERMEDIATE' | 'BAD' | 'PENDING';
    isCompleted: boolean;
    answers: Array<{
        questionId: string;
        questionText: string;
        answer: string;
        score: number | null;
    }>;
}

interface SubmissionDetailData {
    user: {
        id: string;
        name: string;
        username: string;
        email: string;
        phone: string | null;
        municipality: string | null;
        state: string | null;
    };
    globalScore: number | null;
    status: string;
    moduleBreakdown: ModuleData[];
    statistics: {
        totalModules: number;
        completedModules: number;
        startDate: string;
        lastUpdate: string;
    };
}

interface SubmissionDetailModalProps {
    submissionId: string;
    isOpen: boolean;
    onClose: () => void;
}

export function SubmissionDetailModal({ submissionId, isOpen, onClose }: SubmissionDetailModalProps) {
    const [data, setData] = useState<SubmissionDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        if (isOpen && submissionId) {
            fetchDetails();
        }
    }, [isOpen, submissionId]);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/submissions/${submissionId}/details`);
            if (res.ok) {
                const details = await res.json();
                setData(details);
            }
        } catch (error) {
            console.error('Error fetching submission details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const getTrafficLightColor = (status: string) => {
        switch (status) {
            case 'EXCELLENT': return 'bg-green-500';
            case 'INTERMEDIATE': return 'bg-yellow-400';
            case 'BAD': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    const getTrafficLightGlow = (status: string) => {
        switch (status) {
            case 'EXCELLENT': return 'shadow-[0_0_20px_rgba(34,197,94,0.6)]';
            case 'INTERMEDIATE': return 'shadow-[0_0_20px_rgba(250,204,21,0.6)]';
            case 'BAD': return 'shadow-[0_0_20px_rgba(239,68,68,0.6)]';
            default: return '';
        }
    };

    // Prepare chart data
    const barChartData = data?.moduleBreakdown.map(module => ({
        name: module.name.length > 20 ? module.name.substring(0, 20) + '...' : module.name,
        score: module.moduleScore || 0,
        fill: module.trafficLight === 'EXCELLENT' ? '#22c55e' :
            module.trafficLight === 'INTERMEDIATE' ? '#facc15' :
                module.trafficLight === 'BAD' ? '#ef4444' : '#94a3b8'
    })) || [];

    const radarChartData = data?.moduleBreakdown.map(module => ({
        module: module.name.length > 15 ? module.name.substring(0, 12) + '...' : module.name,
        score: module.moduleScore || 0
    })) || [];

    const pieChartData = [
        { name: 'Excelente', value: data?.moduleBreakdown.filter(m => m.trafficLight === 'EXCELLENT').length || 0, color: '#22c55e' },
        { name: 'Intermedio', value: data?.moduleBreakdown.filter(m => m.trafficLight === 'INTERMEDIATE').length || 0, color: '#facc15' },
        { name: 'Bajo', value: data?.moduleBreakdown.filter(m => m.trafficLight === 'BAD').length || 0, color: '#ef4444' },
        { name: 'Pendiente', value: data?.moduleBreakdown.filter(m => m.trafficLight === 'PENDING').length || 0, color: '#94a3b8' }
    ].filter(item => item.value > 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}>
            <div className={`w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200 ${isDark ? 'bg-slate-900' : 'bg-white'}`}
                onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className={`sticky top-0 z-10 px-8 py-6 border-b ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-slate-200'}`}>
                    <button
                        onClick={onClose}
                        className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-white/80 text-slate-600 hover:text-slate-900'}`}
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {loading ? (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Cargando detalles...</span>
                        </div>
                    ) : data ? (
                        <div>
                            <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {data.user.name || data.user.username}
                            </h2>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <span className={`px-3 py-1 rounded-full font-medium ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-white text-slate-700'}`}>
                                    📍 {data.user.municipality || 'Sin municipio'}
                                </span>
                                <span className={`px-4 py-1 rounded-full font-bold text-white ${data.globalScore && data.globalScore >= 80 ? 'bg-green-600' : data.globalScore && data.globalScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                                    Calificación Global: {data.globalScore?.toFixed(1) || '--'}
                                </span>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-8">
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Cargando información detallada...</p>
                            </div>
                        </div>
                    ) : data ? (
                        <div className="space-y-8">
                            {/* Traffic Lights Grid */}
                            <section>
                                <h3 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                                    Semáforos por Módulo
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {data.moduleBreakdown.map((module, index) => (
                                        <div
                                            key={module.id}
                                            className={`relative p-5 rounded-xl border-2 transition-all hover:scale-105 ${isDark ? 'bg-slate-800 border-slate-700 hover:border-blue-500' : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-lg'}`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <span className={`text-xs font-bold px-2 py-1 rounded ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                                                    Módulo {index + 1}
                                                </span>
                                                {module.isCompleted && (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                )}
                                            </div>

                                            <h4 className={`text-sm font-bold mb-4 line-clamp-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                {module.name}
                                            </h4>

                                            {/* Traffic Light */}
                                            <div className="flex justify-center mb-4">
                                                <div className={`w-12 h-12 rounded-full border-4 border-black ${getTrafficLightColor(module.trafficLight)} ${getTrafficLightGlow(module.trafficLight)} ${module.trafficLight !== 'PENDING' ? 'animate-pulse' : 'opacity-40'}`} />
                                            </div>

                                            <div className="text-center">
                                                <p className={`text-2xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                    {module.moduleScore?.toFixed(1) || '--'}
                                                </p>
                                                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    {module.answeredQuestions}/{module.totalQuestions} preguntas
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Charts Section */}
                            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Bar Chart */}
                                <div className={`p-6 rounded-xl border-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                    <h4 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        Calificación por Módulo
                                    </h4>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={barChartData}>
                                            <XAxis dataKey="name" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                                            <YAxis tick={{ fill: isDark ? '#94a3b8' : '#64748b' }} domain={[0, 100]} />
                                            <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
                                            <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                                                {barChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Pie Chart */}
                                <div className={`p-6 rounded-xl border-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                    <h4 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        Distribución de Desempeño
                                    </h4>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={pieChartData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {pieChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Radar Chart */}
                                <div className={`p-6 rounded-xl border-2 lg:col-span-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                                    <h4 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        Vista General - Todos los Módulos
                                    </h4>
                                    <ResponsiveContainer width="100%" height={400}>
                                        <RadarChart data={radarChartData}>
                                            <PolarGrid stroke={isDark ? '#475569' : '#cbd5e1'} />
                                            <PolarAngleAxis dataKey="module" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} />
                                            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: isDark ? '#94a3b8' : '#64748b' }} />
                                            <Radar name="Calificación" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                            <Tooltip contentStyle={{ backgroundColor: isDark ? '#1e293b' : '#fff', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </section>

                            {/* Statistics */}
                            <section className={`p-6 rounded-xl border-2 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                <h4 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    Estadísticas Generales
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className={`text-xs font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Módulos</p>
                                        <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{data.statistics.totalModules}</p>
                                    </div>
                                    <div>
                                        <p className={`text-xs font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Completados</p>
                                        <p className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{data.statistics.completedModules}</p>
                                    </div>
                                    <div>
                                        <p className={`text-xs font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Inicio</p>
                                        <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {new Date(data.statistics.startDate).toLocaleDateString('es-ES')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className={`text-xs font-semibold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Última Actualización</p>
                                        <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                            {new Date(data.statistics.lastUpdate).toLocaleDateString('es-ES')}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Export Buttons */}
                            <section className="flex flex-wrap gap-4 justify-center pt-4">
                                <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg hover:scale-105">
                                    <FileSpreadsheet className="w-5 h-5" />
                                    Exportar a Excel
                                </button>
                                <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg hover:scale-105">
                                    <FileText className="w-5 h-5" />
                                    Exportar a PDF
                                </button>
                            </section>
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <AlertCircle className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                            <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>No se pudieron cargar los detalles</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
