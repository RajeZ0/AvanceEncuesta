'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, BarChart3, Layers, Target, Globe, ChevronRight, Users } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

// Lazy load AuthModal - huge performance win for initial load
const AuthModal = dynamic(() => import('@/components/AuthModal').then(mod => mod.AuthModal), {
    ssr: false,
    loading: () => null
});

export function LandingPage() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen ${isDark ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'} transition-colors duration-500 font-sans selection:bg-emerald-500 selection:text-white`}>

            {/* Navbar Navigation */}
            <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-slate-900/90 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] group-hover:scale-105 transition-transform duration-300">
                            <Target className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white">MEPLANSUS</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-300">
                        <a href="#modelo" className="hover:text-emerald-400 transition-colors">El Modelo</a>
                        <a href="#fases" className="hover:text-emerald-400 transition-colors">Fases</a>
                        <Link href="/results" className="hover:text-emerald-400 transition-colors flex items-center gap-1 group">
                            Resultados
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="px-6 py-2.5 bg-emerald-500 text-white hover:bg-emerald-400 rounded-full font-bold transition-all shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 flex items-center gap-2 text-sm"
                    >
                        Ingresar
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </nav>

            {/* Hero Section - High Contrast Dark */}
            <section className="relative pt-40 pb-32 px-6 overflow-hidden bg-slate-900 text-white">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
                {/* Abstract Background Accents */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3" />

                <div className="max-w-7xl mx-auto text-center relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 font-bold text-sm tracking-wide shadow-sm">
                        <Globe className="w-4 h-4" />
                        Modelo de Evaluación para una Planeación Sustentable
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.95] tracking-tight">
                        Transforme su <br />
                        <span className="text-emerald-400">futuro territorial.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
                        Sistema integral de diagnóstico para fortalecer la gestión pública municipal mediante datos inteligentes y estrategias sostenibles.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-lg font-bold rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:-translate-y-1 transition-all duration-300 min-w-[200px]"
                        >
                            Capturar Datos
                        </button>

                        <Link href="/results">
                            <button className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 text-white text-lg font-bold rounded-full transition-all duration-300 min-w-[200px] flex items-center justify-center gap-2 group">
                                <BarChart3 className="w-5 h-5 text-emerald-400" />
                                Consultar Resultados
                            </button>
                        </Link>
                    </div>

                    {/* Stats strip */}
                    <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12">
                        <div className="text-center">
                            <div className="text-3xl font-black text-white">4</div>
                            <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mt-1">Dimensiones</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-black text-white">17</div>
                            <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mt-1">ODS Integrados</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-black text-white">100%</div>
                            <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mt-1">Digital</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-black text-white">IP</div>
                            <div className="text-xs uppercase tracking-widest text-slate-400 font-bold mt-1">Desempeño</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Visual Bento Grid Section - Light High Contrast */}
            <section id="modelo" className="py-24 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-slate-900 mb-4">Arquitectura del Modelo</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">Una estructura jerárquica diseñada para la claridad y la acción.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white rounded-[2rem] p-10 md:p-14 border border-slate-200 shadow-2xl shadow-slate-200/50 hover:border-emerald-500/50 transition-colors group">
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg mb-8 group-hover:scale-110 transition-transform duration-500">
                                <Layers className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold mb-6 text-slate-900">Enfoque Modular</h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                Desde indicadores micro hasta índices macro. MEPLANSUS permite diseccionar el desempeño territorial con precisión quirúrgica.
                            </p>
                            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-100 group-hover:shadow-2xl transition-all duration-500">
                                <Image src="/meplansus-tree.jpg" alt="Structure" width={600} height={400} className="w-full object-cover" />
                            </div>
                        </div>

                        <div className="grid grid-rows-2 gap-8">
                            <Link href="/results" className="bg-slate-900 rounded-[2rem] p-10 text-white relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-900/40 transition-all duration-500 cursor-pointer block">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
                                <div className="relative z-10 h-full flex flex-col justify-between">
                                    <div>
                                        <BarChart3 className="w-10 h-10 mb-6 text-emerald-400" />
                                        <h3 className="text-3xl font-bold mb-2">Datos Abiertos</h3>
                                        <p className="text-slate-300 max-w-sm">
                                            Transparencia total. Acceda a dashboards públicos y compare el desempeño municipal.
                                        </p>
                                    </div>
                                    <span className="flex items-center gap-2 font-bold text-emerald-400 group-hover:translate-x-2 transition-transform mt-8">
                                        Explorar Dashboard <ArrowRight className="w-5 h-5" />
                                    </span>
                                </div>
                            </Link>

                            <div className="bg-emerald-600 rounded-[2rem] p-10 text-white border border-emerald-500/50 flex flex-col justify-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
                                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 relative z-10">
                                    <Target className="w-6 h-6" />
                                    Niveles de Agregación
                                </h3>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                                        <div className="w-3 h-3 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.8)]" />
                                        <span className="font-bold">Macro (Sistema)</span>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                                        <div className="w-3 h-3 rounded-full bg-blue-300" />
                                        <span className="font-semibold text-white/90">Meso (Componente)</span>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                                        <div className="w-3 h-3 rounded-full bg-purple-300" />
                                        <span className="font-semibold text-white/90">Micro (Indicador)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ciclo Flow Section */}
            <section id="fases" className="py-24 px-6 bg-slate-900 text-white relative">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-emerald-400 font-bold tracking-widest text-sm uppercase mb-4 block">Metodología Cíclica</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-6">El Proceso MEPLANSUS</h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Evaluación continua para resultados permanentes.
                        </p>
                    </div>

                    <div className="relative rounded-3xl p-8 bg-white/5 border border-white/10 shadow-2xl">
                        <Image
                            src="/meplansus-phases.png"
                            alt="Fases MEPLANSUS"
                            width={1200}
                            height={600}
                            className="w-full h-auto rounded-xl"
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 px-6 text-center bg-white">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-5xl md:text-6xl font-black mb-8 text-slate-900 tracking-tight">
                        La sostenibilidad se mide.
                    </h2>
                    <p className="text-xl text-slate-600 mb-12 font-medium">
                        Únase a la red de municipios que basan sus decisiones en evidencia.
                    </p>
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="px-12 py-5 bg-slate-900 hover:bg-black text-white text-xl font-bold rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                        Comenzar Evaluación
                    </button>
                    <div className="mt-8 flex items-center justify-center gap-4 text-sm font-semibold text-slate-400">
                        <span className="flex items-center gap-1"><Target className="w-4 h-4" /> Sin costo inicial</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Soporte incluido</span>
                    </div>
                </div>
            </section>

            <footer className="py-12 bg-slate-50 text-center text-sm text-slate-400 border-t border-slate-200">
                <p>© 2025 MEPLANSUS. Sistema de Evaluación Municipal.</p>
            </footer>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
}
