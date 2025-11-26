'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { ThemeControls } from '@/components/ThemeControls';
import { useTheme } from '@/contexts/ThemeContext';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { theme } = useTheme();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                router.push('/dashboard');
            } else {
                const data = await res.json();
                setError(data.error || 'Error al iniciar sesión');
                setLoading(false);
            }
        } catch (err) {
            setError('Ocurrió un error inesperado');
            setLoading(false);
        }
    };

    const isDark = theme === 'dark';

    return (
        <div className={`min-h-screen flex transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="fixed top-4 right-4 z-50">
                <ThemeControls />
            </div>

            <div className={`hidden lg:flex lg:w-1/2 relative overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-900'}`}>
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-slate-700 via-slate-800 to-black' : 'bg-gradient-to-br from-slate-800 via-slate-900 to-black'} opacity-90`} />

                <div className="relative z-10 flex flex-col justify-between p-16 text-white h-full">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold tracking-wider text-slate-200">MUNI-EVAL</span>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
                            Evaluación de <br />
                            <span className="text-blue-400">Gestión Municipal</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-md leading-relaxed">
                            Plataforma institucional para el seguimiento y mejora continua de la administración pública local.
                        </p>
                    </div>

                    <div className="flex gap-4 text-sm text-slate-500 font-medium">
                        <span>© 2024 Sistema de Evaluación</span>
                    </div>
                </div>
            </div>

            <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative transition-colors ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
                <div className="w-full max-w-md space-y-10 relative z-10">
                    <div className="text-center lg:text-left">
                        <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Bienvenido</h2>
                        <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Acceda al panel de control institucional.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className={`text-sm font-semibold ml-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                Usuario / Municipio
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`block w-full px-4 py-3.5 border-2 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 ${isDark
                                        ? 'bg-slate-800 border-slate-700 text-slate-200 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-600'
                                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300'
                                    }`}
                                placeholder="Ej. Municipio de Santiago"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className={`text-sm font-semibold ml-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`block w-full px-4 py-3.5 border-2 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 ${isDark
                                        ? 'bg-slate-800 border-slate-700 text-slate-200 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-600'
                                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300'
                                    }`}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 border-2 border-red-100 text-red-600 text-sm font-medium flex items-center">
                                <span className="mr-2 text-lg">⚠️</span> {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`group w-full relative flex items-center justify-center py-3.5 px-4 border-2 border-transparent rounded-xl text-sm font-bold text-white focus:outline-none focus:ring-4 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] ${isDark
                                    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/20'
                                    : 'bg-slate-900 hover:bg-slate-800 focus:ring-slate-900/20'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verificando...
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    Iniciar Sesión
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className={`pt-6 text-center border-t ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                        <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            Sistema de uso exclusivo para personal autorizado.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
