'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, User, Mail, Building, Lock, ArrowRight } from 'lucide-react';
import { ESTADO_MEXICO_MUNICIPALITIES } from '@/lib/municipalities';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'register';
    onSuccess?: () => void;
}

export function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'register' | 'recovery'>(initialMode);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();

    // Form States
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [registerData, setRegisterData] = useState({
        name: '', email: '', phone: '', state: 'Estado de México', municipality: '', password: '', confirmPassword: ''
    });
    const [recoveryEmail, setRecoveryEmail] = useState('');

    if (!isOpen) return null;

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        let endpoint = '';
        let body = {};

        if (mode === 'login') {
            endpoint = '/api/login';
            body = loginData;
        } else if (mode === 'register') {
            endpoint = '/api/register';
            body = registerData;
        } else if (mode === 'recovery') {
            endpoint = '/api/auth/forgot-password';
            body = { email: recoveryEmail };
        }

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (res.ok) {
                if (mode === 'login' || mode === 'register') {
                    if (onSuccess) {
                        onSuccess();
                    } else {
                        router.push('/dashboard');
                    }
                } else if (mode === 'recovery') {
                    setSuccessMessage(data.message || 'Se ha enviado un enlace de recuperación');
                }
            } else {
                setError(data.error || 'Error en la autenticación');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); }}
                        className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === 'login' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Iniciar Sesión
                    </button>
                    <button
                        onClick={() => { setMode('register'); setError(''); setSuccessMessage(''); }}
                        className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === 'register' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Registrarse
                    </button>
                    <button
                        onClick={() => { setMode('recovery'); setError(''); setSuccessMessage(''); }}
                        className={`flex-1 py-4 text-sm font-bold transition-colors ${mode === 'recovery' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Recuperar
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {successMessage && (
                        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                            ✓ {successMessage}
                        </div>
                    )}

                    {error && (
                        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                            ⚠ {error}
                        </div>
                    )}

                    {mode === 'login' && (
                        <>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700 uppercase">Correo Electrónico</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={loginData.email}
                                    onChange={handleLoginChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    placeholder="correo@ejemplo.com"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700 uppercase">Contraseña</label>
                                <input
                                    name="password"
                                    type="password"
                                    value={loginData.password}
                                    onChange={handleLoginChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </>
                    )}

                    {mode === 'register' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700 uppercase">Nombre</label>
                                    <input
                                        name="name"
                                        value={registerData.name}
                                        onChange={handleRegisterChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Juan Pérez"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700 uppercase">Teléfono</label>
                                    <input
                                        name="phone"
                                        value={registerData.phone}
                                        onChange={handleRegisterChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="55 1234 5678"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700 uppercase">Correo Electrónico</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={registerData.email}
                                    onChange={handleRegisterChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="correo@ejemplo.com"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700 uppercase">Municipio</label>
                                <select
                                    name="municipality"
                                    value={registerData.municipality}
                                    onChange={handleRegisterChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    required
                                >
                                    <option value="">Selecciona tu municipio</option>
                                    {ESTADO_MEXICO_MUNICIPALITIES.map(mun => (
                                        <option key={mun.id} value={mun.name}>{mun.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700 uppercase">Contraseña</label>
                                <input
                                    name="password"
                                    type="password"
                                    value={registerData.password}
                                    onChange={handleRegisterChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-700 uppercase">Confirmar Contraseña</label>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    value={registerData.confirmPassword}
                                    onChange={handleRegisterChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </>
                    )}

                    {mode === 'recovery' && (
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-700 uppercase">Correo Electrónico</label>
                            <input
                                type="email"
                                value={recoveryEmail}
                                onChange={(e) => setRecoveryEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="correo@ejemplo.com"
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            <>
                                {mode === 'login' && 'Iniciar Sesión'}
                                {mode === 'register' && 'Registrarse'}
                                {mode === 'recovery' && 'Enviar Enlace'}
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
