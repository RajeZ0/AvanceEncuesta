import { getPublicStats } from '@/lib/public-stats';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Users, Award, TrendingUp } from 'lucide-react';
import { ClientResultsCharts } from '@/components/ClientResultsCharts';

export const dynamic = 'force-dynamic';

export default async function ResultsPage() {
    const stats = await getPublicStats();

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar - Matching Landing Style */}
            <header className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group text-slate-700 hover:text-[#c89f5d] transition-colors">
                        <div className="p-2 rounded-full bg-slate-100 border border-slate-200 group-hover:bg-[#c89f5d]/10 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-sm">Volver al Inicio</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#c89f5d] flex items-center justify-center text-white shadow-lg shadow-[#c89f5d]/20">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-[#1a2332]">Resultados Públicos</span>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-[#c89f5d]/10 text-[#c89f5d] font-bold text-xs uppercase tracking-wider border border-[#c89f5d]/20">
                        <TrendingUp className="w-3 h-3" /> Datos en Tiempo Real
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-6 text-[#1a2332] tracking-tight">
                        Transparencia <span className="text-[#c89f5d]">Territorial</span>
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
                        Monitoreo continuo del desempeño municipal y avance hacia los ODS.
                    </p>
                </div>

                {/* KPI Cards - Institutional Colors */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    <StatCard
                        icon={<Users className="w-6 h-6" />}
                        label="Usuarios Registrados"
                        value={stats.totalUsers}
                        color="blue"
                    />
                    <StatCard
                        icon={<BarChart3 className="w-6 h-6" />}
                        label="Municipios Activos"
                        value={stats.totalMunicipalities}
                        color="gold"
                    />
                    <StatCard
                        icon={<Award className="w-6 h-6" />}
                        label="Evaluaciones Completas"
                        value={stats.completedEvaluations}
                        color="navy"
                    />
                    <StatCard
                        icon={<TrendingUp className="w-6 h-6" />}
                        label="Promedio Global (IPS)"
                        value={`${stats.averageScore.toFixed(1)}%`}
                        color="accent"
                    />
                </div>

                {/* Charts Section - Institutional Style */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-slate-200 hover:shadow-xl transition-shadow">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#1a2332]">
                            <BarChart3 className="w-5 h-5 text-[#c89f5d]" />
                            Municipios con Mayor Participación
                        </h3>
                        <div className="h-[300px] w-full">
                            <ClientResultsCharts data={stats.municipalityCounts} type="bar" />
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-slate-200 hover:shadow-xl transition-shadow flex flex-col justify-center">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#1a2332]">
                            <Award className="w-5 h-5 text-[#c89f5d]" />
                            Estado del Desempeño
                        </h3>
                        <div className="h-[300px] w-full">
                            <ClientResultsCharts
                                data={[
                                    { name: 'Promedio', value: stats.averageScore },
                                    { name: 'Restante', value: 100 - stats.averageScore }
                                ]}
                                type="pie"
                            />
                        </div>
                        <p className="text-center text-slate-600 mt-4 text-sm">
                            El Índice de Planeación Sustentable (IPS) promedio actual es del <strong className="text-[#c89f5d]">{stats.averageScore.toFixed(1)}%</strong>.
                        </p>
                    </div>
                </div>

                {/* Additional Info Section */}
                <div className="mt-12 bg-gradient-to-br from-[#1a2332] to-[#2c4875] p-8 rounded-2xl text-white">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold mb-3">Monitoreo Transparente</h3>
                        <p className="text-slate-300 max-w-2xl mx-auto">
                            Todos los datos son actualizados en tiempo real y reflejan evaluaciones completadas por los municipios participantes.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ icon, label, value, color }: any) {
    const colors: any = {
        blue: {
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            border: 'border-blue-200'
        },
        gold: {
            bg: 'bg-[#c89f5d]/10',
            text: 'text-[#c89f5d]',
            border: 'border-[#c89f5d]/20'
        },
        navy: {
            bg: 'bg-[#1a2332]/10',
            text: 'text-[#1a2332]',
            border: 'border-[#1a2332]/20'
        },
        accent: {
            bg: 'bg-teal-50',
            text: 'text-teal-600',
            border: 'border-teal-200'
        }
    };

    return (
        <div className={`bg-white p-6 rounded-2xl shadow-md border-2 ${colors[color].border} flex items-center gap-4 hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}>
            <div className={`p-4 rounded-xl ${colors[color].bg} ${colors[color].text}`}>
                {icon}
            </div>
            <div>
                <p className="text-3xl font-bold text-slate-900">{value}</p>
                <p className="text-sm font-medium text-slate-600">{label}</p>
            </div>
        </div>
    );
}
