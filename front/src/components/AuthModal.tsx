
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, User, Mail, Phone, MapPin, Building, Lock, ArrowRight, LogIn } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
    const [mode, setMode] = useState<'login' | 'register' | 'recovery'>(initialMode);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const router = useRouter();

    // Form States
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [registerData, setRegisterData] = useState({
        name: '', email: '', phone: '', state: '', municipality: '', username: '', password: ''
    });
    const [recoveryEmail, setRecoveryEmail] = useState('');

    if (!isOpen) return null;

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                if (mode === 'recovery') {
                    setSuccessMessage(data.message);
                } else {
                    onClose();
                    router.refresh(); // Refresh to update UI with user session
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
                </div>

                <div className="p-8 max-h-[80vh] overflow-y-auto">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {mode === 'login' ? 'Bienvenido de nuevo' : mode === 'register' ? 'Crea tu cuenta' : 'Recuperar Contraseña'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {mode === 'login' ? 'Accede a tu panel de control' : mode === 'register' ? 'Únete para evaluar tu municipio' : 'Ingresa tu correo para recibir un enlace'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'login' ? (
                            <>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700 uppercase">Usuario</label>
                                    <input
                                        name="username"
                                        value={loginData.username}
                                        onChange={handleLoginChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Tu usuario"
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
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <div className="text-right">
                                        <button
                                            type="button"
                                            onClick={() => { setMode('recovery'); setError(''); setSuccessMessage(''); }}
                                            className="text-xs text-blue-600 hover:underline"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : mode === 'register' ? (
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
                                        <label className="text-xs font-semibold text-gray-700 uppercase">Usuario</label>
                                        <input
                                            name="username"
                                            value={registerData.username}
                                            onChange={handleRegisterChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="juanperez"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-700 uppercase">Correo</label>
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-700 uppercase">Estado</label>
                                        <input
                                            name="state"
                                            value={registerData.state}
                                            onChange={handleRegisterChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Estado"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-700 uppercase">Municipio</label>
                                        <input
                                            name="municipality"
                                            value={registerData.municipality}
                                            onChange={handleRegisterChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Municipio"
                                            required
                                        />
                                    </div>
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
                            </>
                        ) : (
                            // Recovery Mode
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
                                <div className="text-right mt-2">
                                    <button
                                        type="button"
                                        onClick={() => { setMode('login'); setError(''); setSuccessMessage(''); }}
                                        className="text-xs text-gray-500 hover:text-gray-700"
                                    >
                                        Volver al inicio de sesión
                                    </button>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                                <span className="text-lg">⚠️</span> {error}
                            </div>
                        )}

                        {successMessage && (
                            <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100 flex items-center gap-2">
                                <span className="text-lg">✅</span> {successMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !!successMessage}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 mt-4"
                        >
                            {loading ? (
                                <span className="animate-pulse">Procesando...</span>
                            ) : (
                                <>
                                    {mode === 'login' ? 'Entrar' : mode === 'register' ? 'Registrarse' : 'Enviar Enlace'}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
