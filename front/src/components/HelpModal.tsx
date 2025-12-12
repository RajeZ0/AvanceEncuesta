'use client';

import { useState } from 'react';
import { HelpCircle, X, ExternalLink } from 'lucide-react';

export function HelpModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-110 z-50 flex items-center justify-center"
                title="Ayuda / Manual de Usuario"
            >
                <HelpCircle className="w-6 h-6" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <HelpCircle className="w-5 h-5 text-blue-600" />
                                Manual de Usuario
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </header>

                        <div className="p-6 overflow-y-auto space-y-6 text-gray-600">
                            <section>
                                <h3 className="font-bold text-gray-900 mb-2">1. Inicio de Sesión</h3>
                                <p>Ingrese con sus credenciales asignadas. Recuerde que el sistema permite <b>una única sesión activa</b> por cuenta. Si inicia sesión en otro dispositivo, la sesión anterior se cerrará automáticamente.</p>
                            </section>

                            <section>
                                <h3 className="font-bold text-gray-900 mb-2">2. Responder Encuesta</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Las respuestas se <b>guardan automáticamente</b> cada vez que usted selecciona una opción o deja de escribir.</li>
                                    <li>Navegue entre módulos desde el Dashboard principal.</li>
                                    <li>Utilice la barra de navegación lateral para ir rápidamente a una pregunta.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="font-bold text-gray-900 mb-2">3. Finalizar Módulo</h3>
                                <p>Solo podrá finalizar un módulo cuando haya respondido el <b>100% de las preguntas</b>. Una vez finalizado, no podrá realizar modificaciones. Asegúrese de revisar sus respuestas.</p>
                            </section>

                            <section>
                                <h3 className="font-bold text-gray-900 mb-2">4. Conflictos y Advertencias</h3>
                                <p>Si ve una advertencia roja indicando que "el módulo está abierto en otra pestaña", cierre las pestañas duplicadas inmediatamente para evitar errores al guardar su información.</p>
                            </section>

                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <ExternalLink className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-blue-900 text-sm">¿Necesita más ayuda?</h4>
                                    <p className="text-sm text-blue-700 mt-1">Contacte al administrador del sistema o envíe un correo a soporte@municipio.gob.mx</p>
                                </div>
                            </div>
                        </div>

                        <footer className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
                            >
                                Entendido
                            </button>
                        </footer>
                    </div>
                </div>
            )}
        </>
    );
}
