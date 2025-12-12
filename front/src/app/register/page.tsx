'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, User, Mail, Phone, Building, Lock } from 'lucide-react';
import Link from 'next/link';
import { ESTADO_MEXICO_MUNICIPALITIES } from '@/lib/municipalities';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        state: 'Estado de México',
        municipality: '',
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/dashboard');
            } else {
                setError(data.error || 'Error al registrarse');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
                {/* Left Side - Info */}
                <div className="bg-slate-900 text-white p-12 md:w-2/5 flex flex-col justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-4">Únete a la Evaluación Municipal</h1>
                        <p className="text-slate-400 leading-relaxed">
                            Regístrate para acceder a los módulos de evaluación y contribuir al desarrollo de tu municipio.
                        </p>
                    </div>
                    <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-3 text-slate-300">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">1</div>
                            <span>Crea tu cuenta institucional</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">2</div>
                            <span>Completa los módulos</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-300">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">3</div>
                            <span>Obtén tu diagnóstico</span>
                        </div>
                    </div>
                    <div className="mt-12 text-sm text-slate-500">
                        ¿Ya tienes cuenta? <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium">Inicia sesión</Link>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="p-12 md:w-3/5">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Registro de Usuario</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        name="name"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Juan Pérez"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Teléfono</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        name="phone"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="55 1234 5678"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="correo@ejemplo.com"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Municipio del Estado de México</label>
                                <div className="relative">
                                    <Building className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none z-10" />
                                    <select
                                        name="municipality"
                                        value={formData.municipality}
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white cursor-pointer"
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecciona tu municipio...</option>
                                        {ESTADO_MEXICO_MUNICIPALITIES.map(mun => (
                                            <option key={mun.id} value={mun.name}>{mun.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="••••••••"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="••••••••"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? 'Registrando...' : 'Crear Cuenta'}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
