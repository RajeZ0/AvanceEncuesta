'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Users, FileCheck, AlertCircle, TrendingUp, Search, Filter, FileSpreadsheet, FileText } from 'lucide-react';
import { ThemeControls } from '@/components/ThemeControls';
import { useTheme } from '@/contexts/ThemeContext';
import { SubmissionDetailModal } from '@/components/SubmissionDetailModal';
import { ESTADO_MEXICO_MUNICIPALITIES } from '@/lib/municipalities';
import { ExcelExporter } from '@/lib/exporters/ExcelExporter';
import { PDFExporter } from '@/lib/exporters/PDFExporter';
import { MunicipalityByStateChart } from '@/components/charts/MunicipalityByStateChart';
import { StatusPieChart } from '@/components/charts/StatusPieChart';
import { CompletionTrendChart } from '@/components/charts/CompletionTrendChart';

interface SubmissionData {
    id: string;
    user: { username: string };
    status: string;
    score: number | null;
    updatedAt: string;
}

export default function AdminDashboard() {
    const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [exportingExcel, setExportingExcel] = useState(false);
    const [exportingPDF, setExportingPDF] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [municipalityFilter, setMunicipalityFilter] = useState('');
    const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const res = await fetch('/api/admin/submissions');
                if (res.ok) {
                    const data = await res.json();
                    setSubmissions(data);
                }
            } catch (error) {
                console.error('Error fetching submissions', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePosition({
                    x: (e.clientX - rect.left) / rect.width,
                    y: (e.clientY - rect.top) / rect.height,
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const getScoreStatus = (score: number | null) => {
        if (score === null) return 'PENDING';
        if (score >= 80) return 'EXCELLENT';
        if (score >= 50) return 'INTERMEDIATE';
        return 'BAD';
    };

    const getScoreLabel = (score: number | null) => {
        if (score === null) return 'Pendiente';
        if (score >= 80) return 'Excelente';
        if (score >= 50) return 'Intermedio';
        return 'Malo';
    };

    //Export handlers
    const handleExportExcel = async () => {
        setExportingExcel(true);
        try {
            const exporter = new ExcelExporter();
            const filename = `Reporte_MEPLANSUS_${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}.xlsx`;
            await exporter.downloadReport(submissions, filename);
        } catch (error) {
            console.error('Error exportando Excel:', error);
            alert('Hubo un error al generar el reporte Excel');
        } finally {
            setExportingExcel(false);
        }
    };

    const handleExportPDF = async () => {
        setExportingPDF(true);
        try {
            const exporter = new PDFExporter();
            const filename = `Reporte_MEPLANSUS_${new Date().toLocaleDateString('es-ES').replace(/\//g, '-')}.pdf`;
            await exporter.downloadReport(submissions, filename);
        } catch (error) {
            console.error('Error exportando PDF:', error);
            alert('Hubo un error al generar el reporte PDF');
        } finally {
            setExportingPDF(false);
        }
    };

    const filteredSubmissions = submissions.filter(sub => {
        const matchesSearch = sub.user.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesMunicipality = !municipalityFilter || sub.user.username.toLowerCase().includes(municipalityFilter.toLowerCase());
        return matchesSearch && matchesMunicipality;
    });

    const avgScore = submissions.filter(s => s.score !== null).reduce((acc, s) => acc + (s.score || 0), 0) / submissions.filter(s => s.score !== null).length || 0;

    if (loading) return (
        <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className={`font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Cargando datos del sistema...</p>
            </div>
        </div>
    );

    const isDark = theme === 'dark';

    return (
        <div ref={containerRef} className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50'}`}>
            {/* Animated Background Elements */}
            <div
                className={`fixed w-96 h-96 rounded-full blur-3xl transition-all duration-1000 pointer-events-none ${isDark ? 'bg-blue-600/10' : 'bg-blue-400/10'}`}
                style={{
                    top: `${mousePosition.y * 60}%`,
                    left: `${mousePosition.x * 60}%`,
                }}
            />
            <div
                className={`fixed w-96 h-96 rounded-full blur-3xl transition-all duration-1000 pointer-events-none ${isDark ? 'bg-purple-600/10' : 'bg-purple-400/10'}`}
                style={{
                    bottom: `${(1 - mousePosition.y) * 60}%`,
                    right: `${(1 - mousePosition.x) * 60}%`,
                }}
            />

            <div className="relative z-10 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/dashboard"
                                    className={`p-2 border-2 rounded-xl transition-all hover:shadow-md flex items-center gap-2 ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </Link>
                                <div>
                                    <h1 className={`text-4xl font-extrabold mb-2 tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Panel de Administración</h1>
                                    <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Monitoreo y análisis de evaluaciones municipales</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <ThemeControls />
                                <select
                                    value={municipalityFilter}
                                    onChange={(e) => setMunicipalityFilter(e.target.value)}
                                    className={`px-4 py-2 border-2 rounded-xl transition-all hover:shadow-md appearance-none cursor-pointer ${isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500' : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300'}`}
                                >
                                    <option value="">🏛️ Todos los municipios</option>
                                    {ESTADO_MEXICO_MUNICIPALITIES.map(mun => (
                                        <option key={mun.id} value={mun.name}>{mun.name}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleExportExcel}
                                    disabled={exportingExcel}
                                    className={`px-4 py-2 border-2 rounded-xl transition-all hover:shadow-md flex items-center gap-2 ${exportingExcel ? 'opacity-60 cursor-not-allowed' : ''} ${isDark ? 'bg-green-600 border-green-700 text-white hover:bg-green-700' : 'bg-green-600 text-white hover:bg-green-700 border-green-700'}`}
                                >
                                    {exportingExcel ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Exportando...
                                        </>
                                    ) : (
                                        <>
                                            <FileSpreadsheet className="w-4 h-4" />
                                            Excel
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleExportPDF}
                                    disabled={exportingPDF}
                                    className={`px-4 py-2 border-2 rounded-xl transition-all hover:shadow-md flex items-center gap-2 ${exportingPDF ? 'opacity-60 cursor-not-allowed' : ''} ${isDark ? 'bg-red-600 border-red-700 text-white hover:bg-red-700' : 'bg-red-600 text-white hover:bg-red-700 border-red-700'}`}
                                >
                                    {exportingPDF ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Exportando...
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="w-4 h-4" />
                                            PDF
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="relative max-w-md">
                            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                            <input
                                type="text"
                                placeholder="Buscar municipio..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200 placeholder-slate-500 focus:ring-blue-500/20 focus:border-blue-500' : 'bg-white border-slate-200 focus:ring-blue-500/10 focus:border-blue-500'}`}
                            />
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <div className={`stats-card group rounded-2xl p-6 border-2 shadow-sm hover:shadow-xl transition-all hover:scale-105 ${isDark ? 'bg-slate-800 border-slate-700 hover:border-blue-500' : 'bg-white border-slate-100 hover:border-blue-300'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                                    <Users className="w-7 h-7 text-blue-600" />
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Total</span>
                            </div>
                            <p className={`text-3xl font-black mb-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{submissions.length}</p>
                            <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Municipios</p>
                        </div>

                        <div className={`stats-card group rounded-2xl p-6 border-2 shadow-sm hover:shadow-xl transition-all hover:scale-105 ${isDark ? 'bg-slate-800 border-slate-700 hover:border-green-500' : 'bg-white border-slate-100 hover:border-green-300'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform ${isDark ? 'bg-green-900/50' : 'bg-green-100'}`}>
                                    <FileCheck className="w-7 h-7 text-green-600" />
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Estado</span>
                            </div>
                            <p className={`text-3xl font-black mb-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                                {submissions.filter(s => s.status === 'SUBMITTED' || s.status === 'COMPLETED').length}
                            </p>
                            <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Completados</p>
                        </div>

                        <div className={`stats-card group rounded-2xl p-6 border-2 shadow-sm hover:shadow-xl transition-all hover:scale-105 ${isDark ? 'bg-slate-800 border-slate-700 hover:border-amber-500' : 'bg-white border-slate-100 hover:border-amber-300'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform ${isDark ? 'bg-amber-900/50' : 'bg-amber-100'}`}>
                                    <AlertCircle className="w-7 h-7 text-amber-600" />
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Estado</span>
                            </div>
                            <p className={`text-3xl font-black mb-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                                {submissions.filter(s => s.status === 'IN_PROGRESS').length}
                            </p>
                            <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>En Progreso</p>
                        </div>

                        <div className={`stats-card group rounded-2xl p-6 border-2 shadow-sm hover:shadow-xl transition-all hover:scale-105 ${isDark ? 'bg-slate-800 border-slate-700 hover:border-purple-500' : 'bg-white border-slate-100 hover:border-purple-300'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                                    <TrendingUp className="w-7 h-7 text-purple-600" />
                                </div>
                                <span className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Promedio</span>
                            </div>
                            <p className={`text-3xl font-black mb-1 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{avgScore.toFixed(1)}</p>
                            <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Puntuación</p>
                        </div>
                    </div>

                    {/* Analytics Charts */}
                    <div className="mb-12">
                        <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                            Análisis y Estadísticas
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                            <MunicipalityByStateChart
                                data={submissions
                                    .filter(s => s.score !== null)
                                    .sort((a, b) => (b.score || 0) - (a.score || 0))
                                    .slice(0, 10)
                                    .map(sub => {
                                        // Remove "Municipio de " prefix for cleaner labels
                                        let name = sub.user.username.replace(/^Municipio de /i, '');
                                        if (name.length > 12) name = name.substring(0, 10) + '...';
                                        return {
                                            state: name,
                                            count: Math.round(sub.score || 0)
                                        };
                                    })
                                }
                            />
                            <StatusPieChart
                                data={[
                                    { name: 'Completado', value: submissions.filter(s => s.status === 'SUBMITTED' || s.status === 'COMPLETED').length },
                                    { name: 'En Progreso', value: submissions.filter(s => s.status === 'IN_PROGRESS' || s.status === 'DRAFT').length },
                                    { name: 'Pendiente', value: submissions.filter(s => s.status === 'PENDING').length }
                                ]}
                            />
                        </div>
                        <div className="mb-12">
                            <CompletionTrendChart
                                data={[
                                    { module: 'M0', completion: 100 },
                                    { module: 'M1', completion: 85 },
                                    { module: 'M2', completion: 70 },
                                    { module: 'M3', completion: 60 },
                                    { module: 'M4', completion: 45 },
                                    { module: 'M5', completion: 0 }
                                ]}
                            />
                        </div>
                    </div>

                    {/* Traffic Lights Grid */}
                    <div className="mb-12">
                        <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
                            Estado de Evaluaciones (Semáforo)
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredSubmissions.map((submission) => {
                                const status = getScoreStatus(submission.score);
                                return (
                                    <div
                                        key={submission.id}
                                        className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl border-2 border-slate-700 hover:border-blue-500 flex flex-col items-center overflow-hidden transition-all hover:scale-105 hover:shadow-2xl"
                                    >
                                        {/* Metallic texture effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                                        {/* Glow effect on hover */}
                                        <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-all duration-500 pointer-events-none" />

                                        <h3 className="text-white font-bold text-lg mb-6 text-center z-10 group-hover:scale-105 transition-transform">{submission.user.username}</h3>

                                        <div className="bg-black/50 p-4 rounded-2xl border-2 border-slate-600 shadow-inner flex flex-col gap-3 mb-6 z-10 group-hover:border-blue-500/50 transition-all">
                                            {/* Green Light (Top) */}
                                            <div className={`w-14 h-14 rounded-full border-4 border-black shadow-lg transition-all duration-500 ${status === 'EXCELLENT'
                                                ? 'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.8)] scale-110 animate-pulse'
                                                : 'bg-green-900/30 opacity-40'
                                                }`} />

                                            {/* Yellow Light (Middle) */}
                                            <div className={`w-14 h-14 rounded-full border-4 border-black shadow-lg transition-all duration-500 ${status === 'INTERMEDIATE'
                                                ? 'bg-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.8)] scale-110 animate-pulse'
                                                : 'bg-yellow-900/30 opacity-40'
                                                }`} />

                                            {/* Red Light (Bottom) */}
                                            <div className={`w-14 h-14 rounded-full border-4 border-black shadow-lg transition-all duration-500 ${status === 'BAD'
                                                ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.8)] scale-110 animate-pulse'
                                                : 'bg-red-900/30 opacity-40'
                                                }`} />
                                        </div>

                                        <div className="text-center z-10">
                                            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1 font-semibold">Puntaje</p>
                                            <p className="text-4xl font-black text-white mb-2">
                                                {submission.score ? submission.score.toFixed(1) : '--'}
                                            </p>
                                            <p className={`text-sm font-bold px-3 py-1 rounded-full ${status === 'EXCELLENT' ? 'bg-green-500/20 text-green-300' :
                                                status === 'INTERMEDIATE' ? 'bg-yellow-500/20 text-yellow-300' :
                                                    status === 'BAD' ? 'bg-red-500/20 text-red-300' : 'bg-slate-500/20 text-slate-400'
                                                }`}>
                                                {getScoreLabel(submission.score)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredSubmissions.length === 0 && (
                                <div className="col-span-full text-center py-16">
                                    <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>No se encontraron resultados para "{searchTerm}"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Table */}
                    <div className={`rounded-2xl shadow-sm border-2 overflow-hidden ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                        <div className={`px-8 py-6 border-b-2 ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50'}`}>
                            <h2 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Detalle Completo</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className={`font-bold uppercase tracking-wider text-xs border-b-2 ${isDark ? 'bg-slate-800/50 text-slate-400 border-slate-700' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                                    <tr>
                                        <th className="px-8 py-4">Municipio</th>
                                        <th className="px-8 py-4">Estado</th>
                                        <th className="px-8 py-4">Puntaje</th>
                                        <th className="px-8 py-4">Evaluación</th>
                                        <th className="px-8 py-4">Última Actualización</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-100'}`}>
                                    {filteredSubmissions.map((submission) => (
                                        <tr key={submission.id} className={`transition-colors ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-blue-50/50'}`}>
                                            <td
                                                className={`px-8 py-4 font-bold cursor-pointer hover:text-blue-600 hover:underline transition-colors ${isDark ? 'text-slate-200 hover:text-blue-400' : 'text-slate-900'}`}
                                                onClick={() => setSelectedSubmissionId(submission.id)}
                                            >
                                                {submission.user.username}
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${submission.status === 'SUBMITTED'
                                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                                    }`}>
                                                    {submission.status === 'SUBMITTED' ? 'Completado' : 'En Progreso'}
                                                </span>
                                            </td>
                                            <td className={`px-8 py-4 font-black text-lg ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                                                {submission.score ? submission.score.toFixed(1) : '-'}
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getScoreStatus(submission.score) === 'EXCELLENT' ? 'bg-green-100 text-green-700' :
                                                    getScoreStatus(submission.score) === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-700' :
                                                        getScoreStatus(submission.score) === 'BAD' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {getScoreLabel(submission.score)}
                                                </span>
                                            </td>
                                            <td className={isDark ? 'px-8 py-4 text-slate-400' : 'px-8 py-4 text-slate-600'}>{new Date(submission.updatedAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Submission Detail Modal */}
            {
                selectedSubmissionId && (
                    <SubmissionDetailModal
                        submissionId={selectedSubmissionId}
                        isOpen={true}
                        onClose={() => setSelectedSubmissionId(null)}
                    />
                )
            }
        </div >
    );
}
