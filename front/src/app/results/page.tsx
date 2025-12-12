import { getPublicStats } from '@/lib/public-stats';
import Link from 'next/link';
import { ArrowLeft, BarChart3, Map, Users, Award, Globe } from 'lucide-react';
import { ClientResultsCharts } from '@/components/ClientResultsCharts';

export const dynamic = 'force-dynamic';

export default async function ResultsPage() {
    const stats = await getPublicStats();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
            {/* Navbar */}
            <header className="fixed top-0 w-full z-40 bg-slate-900/95 backdrop-blur-md border-b border-white/10 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group text-slate-300 hover:text-emerald-400 transition-colors">
                        <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-emerald-500/20 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-sm">Volver al Inicio</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                            <BarChart3 className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-white">Resultados Públicos</span>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                        <Globe className="w-3 h-3" /> Datos en Tiempo Real
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 tracking-tight">
                        Transparencia <br className="md:hidden" /> <span className="text-emerald-600">Territorial</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                        Monitoreo continuo del desempeño municipal y avance hacia los ODS.
                    </p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    <StatCard
                        icon={<Users className="w-6 h-6" />}
                        label="Usuarios Registrados"
                        value={stats.totalUsers}
                        color="blue"
                        delay={0}
                    />
                    <StatCard
                        icon={<Map className="w-6 h-6" />}
                        label="Municipios Activos"
                        value={stats.totalMunicipalities}
                        color="purple"
                        delay={100}
                    />
                    <StatCard
                        icon={<Award className="w-6 h-6" />}
                        label="Evaluaciones Completas"
                        value={stats.completedEvaluations}
                        color="emerald"
                        delay={200}
                    />
                    <StatCard
                        icon={<BarChart3 className="w-6 h-6" />}
                        label="Promedio Global (IPS)"
                        value={`${stats.averageScore.toFixed(1)}%`}
                        color="orange"
                        delay={300}
                    />
                </div>

                {/* Charts Section */}
                <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Map className="w-5 h-5 text-indigo-500" />
                            Municipios con Mayor Participación
                        </h3>
                        <div className="h-[300px] w-full">
                            <ClientResultsCharts data={stats.municipalityCounts} type="bar" />
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-center">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Award className="w-5 h-5 text-emerald-500" />
                            Estado del Desempeño
                        </h3>
                        <div className="h-[300px] w-full">
                            {/* Passing aggregated score for gauge/pie visualization */}
                            <ClientResultsCharts data={[{ name: 'Promedio', value: stats.averageScore }, { name: 'Restante', value: 100 - stats.averageScore }]} type="pie" />
                        </div>
                        <p className="text-center text-gray-500 mt-4 text-sm">
                            El Índice de Planeación Sustentable (IPS) promedio actual es del <strong>{stats.averageScore.toFixed(1)}%</strong>.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ icon, label, value, color, delay }: any) {
    const colors: any = {
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        orange: 'bg-orange-50 text-orange-600',
    };

    return (
        <div
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300 animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={`p-4 rounded-xl ${colors[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                <p className="text-sm font-medium text-gray-500">{label}</p>
            </div>
        </div>
    );
}
