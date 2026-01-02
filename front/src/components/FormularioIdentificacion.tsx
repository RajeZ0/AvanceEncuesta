'use client';

import { useState, useEffect } from 'react';
import { useAutoSave } from '@/hooks/useAutoSave';
import { Save, CheckCircle2 } from 'lucide-react';
import { ESTADO_MEXICO_MUNICIPALITIES } from '@/lib/municipalities';

interface FormularioIdentificacionProps {
    onFinalizar: () => void;
}

export function FormularioIdentificacion({ onFinalizar }: FormularioIdentificacionProps) {
    const [guardando, setGuardando] = useState(false);
    const [ultimoGuardado, setUltimoGuardado] = useState<Date | null>(null);
    const [datos, setDatos] = useState({
        nombreMunicipio: '',
        estado: '',
        anioCapturo: new Date().getFullYear().toString(),
        fechaInicioEvaluacion: new Date().toISOString().split('T')[0],
        periodoVigencia: '',
        nombreResponsable: '',
        cargoResponsable: '',
        correoInstitucional: '',
        correoPersonal: '',
        telefonoMovil: '',
        telefonoDepartamental: '',
        fechaNacimiento: '',
        departamento: '',
    });

    // Municipios del Estado de México
    const municipiosEstadoMexico = ESTADO_MEXICO_MUNICIPALITIES;

    // Estados de México
    const estadosMexico = [
        'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
        'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
        'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo',
        'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
        'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
        'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas'
    ];

    // Años disponibles
    const aniosDisponibles = [2025, 2024, 2023, 2022, 2021];

    // Periodos de vigencia comunes
    const periodosVigencia = [
        '2024-2027',
        '2025-2028',
        '2026-2029',
        '2024-2026',
        '2025-2027',
        'Otro'
    ];

    // Cargos comunes
    const cargosComunes = [
        'Presidente Municipal',
        'Director de Planeación',
        'Director de Desarrollo Urbano',
        'Director de Desarrollo Sostenible',
        'Coordinador de Sustentabilidad',
        'Secretario Técnico',
        'Otro cargo directivo'
    ];

    // Departamentos/Áreas comunes
    const departamentosComunes = [
        'Dirección de Planeación Urbana',
        'Dirección de Desarrollo Sostenible',
        'Secretaría de Desarrollo Urbano',
        'Coordinación de ODS',
        'Dirección de Obras Públicas',
        'Otra área'
    ];

    // Cargar datos existentes al montar
    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const res = await fetch('/api/metadatos');
            const data = await res.json();
            if (data.metadatos) {
                // Convertir fechas de ISO a formato input
                const metadatos = data.metadatos;
                setDatos({
                    nombreMunicipio: metadatos.nombreMunicipio || '',
                    estado: metadatos.estado || '',
                    anioCapturo: metadatos.anioCapturo?.toString() || new Date().getFullYear().toString(),
                    fechaInicioEvaluacion: metadatos.fechaInicioEvaluacion ? new Date(metadatos.fechaInicioEvaluacion).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    periodoVigencia: metadatos.periodoVigencia || '',
                    nombreResponsable: metadatos.nombreResponsable || '',
                    cargoResponsable: metadatos.cargoResponsable || '',
                    correoInstitucional: metadatos.correoInstitucional || '',
                    correoPersonal: metadatos.correoPersonal || '',
                    telefonoMovil: metadatos.telefonoMovil || '',
                    telefonoDepartamental: metadatos.telefonoDepartamental || '',
                    fechaNacimiento: metadatos.fechaNacimiento ? new Date(metadatos.fechaNacimiento).toISOString().split('T')[0] : '',
                    departamento: metadatos.departamento || '',
                });
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
        }
    };

    const guardarDatos = async (datosAGuardar: typeof datos) => {
        setGuardando(true);
        try {
            await fetch('/api/metadatos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosAGuardar),
            });
            setUltimoGuardado(new Date());
        } catch (error) {
            console.error('Error al guardar:', error);
        } finally {
            setGuardando(false);
        }
    };

    // Auto-save con debounce de 2 segundos
    useAutoSave({
        datos,
        guardar: guardarDatos,
        retrasoMs: 2000,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setDatos(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validar campos requeridos
        const requeridos = [
            'nombreMunicipio',
            'estado',
            'nombreResponsable',
            'cargoResponsable',
            'correoInstitucional',
            'telefonoMovil',
        ];

        const faltantes = requeridos.filter(campo => !datos[campo as keyof typeof datos]);

        if (faltantes.length > 0) {
            alert('Por favor complete los campos requeridos marcados con *');
            return;
        }

        // Guardar y finalizar módulo
        await guardarDatos(datos);
        onFinalizar();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Indicador de guardado */}
            <div className="flex items-center justify-end gap-2 text-sm">
                {guardando ? (
                    <div className="flex items-center gap-2 text-teal-600">
                        <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                        <span>Guardando...</span>
                    </div>
                ) : ultimoGuardado ? (
                    <div className="flex items-center gap-2 text-gray-500">
                        <CheckCircle2 className="w-4 h-4 text-teal-500" />
                        <span>Guardado automáticamente</span>
                    </div>
                ) : null}
            </div>

            {/* Información del Ayuntamiento */}
            <div className="bg-white p-8 rounded-2xl border-2 border-slate-200 shadow-sm">
                <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-gradient-to-b from-teal-500 to-cyan-600 rounded-full" />
                    Información del Ayuntamiento
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Nombre del Municipio *
                        </label>
                        <select
                            name="nombreMunicipio"
                            value={datos.nombreMunicipio}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none transition-all bg-white"
                        >
                            <option value="">Seleccione un municipio...</option>
                            {municipiosEstadoMexico.map(municipio => (
                                <option key={municipio.id} value={municipio.name}>{municipio.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Estado *
                        </label>
                        <select
                            name="estado"
                            value={datos.estado}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none transition-all bg-white"
                        >
                            <option value="">Seleccione un estado...</option>
                            {estadosMexico.map(estado => (
                                <option key={estado} value={estado}>{estado}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Año de Captura
                        </label>
                        <select
                            name="anioCapturo"
                            value={datos.anioCapturo}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none transition-all bg-white"
                        >
                            {aniosDisponibles.map(anio => (
                                <option key={anio} value={anio}>{anio}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Fecha de Inicio de Evaluación
                        </label>
                        <input
                            type="date"
                            name="fechaInicioEvaluacion"
                            value={datos.fechaInicioEvaluacion}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Periodo de Vigencia
                        </label>
                        <select
                            name="periodoVigencia"
                            value={datos.periodoVigencia}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none transition-all bg-white"
                        >
                            <option value="">Seleccione un periodo...</option>
                            {periodosVigencia.map(periodo => (
                                <option key={periodo} value={periodo}>{periodo}</option>
                            ))}
                        </select>
                    </div>


                </div>
            </div>

            {/* Información del Responsable */}
            <div className="bg-white p-8 rounded-2xl border-2 border-slate-200 shadow-sm">
                <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full" />
                    Información del Responsable
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Nombre Completo *
                        </label>
                        <input
                            type="text"
                            name="nombreResponsable"
                            value={datos.nombreResponsable}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Cargo/Puesto *
                        </label>
                        <select
                            name="cargoResponsable"
                            value={datos.cargoResponsable}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none transition-all bg-white"
                        >
                            <option value="">Seleccione un cargo...</option>
                            {cargosComunes.map(cargo => (
                                <option key={cargo} value={cargo}>{cargo}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Correo Institucional *
                        </label>
                        <input
                            type="email"
                            name="correoInstitucional"
                            value={datos.correoInstitucional}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none transition-all"
                            placeholder="correo@municipio.gob.mx"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Correo Personal
                        </label>
                        <input
                            type="email"
                            name="correoPersonal"
                            value={datos.correoPersonal}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Teléfono Móvil *
                        </label>
                        <input
                            type="tel"
                            name="telefonoMovil"
                            value={datos.telefonoMovil}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none transition-all"
                            placeholder="722 123 4567"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Teléfono Departamental
                        </label>
                        <input
                            type="tel"
                            name="telefonoDepartamental"
                            value={datos.telefonoDepartamental}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Fecha de Nacimiento
                        </label>
                        <input
                            type="date"
                            name="fechaNacimiento"
                            value={datos.fechaNacimiento}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Área/Departamento
                        </label>
                        <select
                            name="departamento"
                            value={datos.departamento}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none transition-all bg-white"
                        >
                            <option value="">Seleccione un área...</option>
                            {departamentosComunes.map(depto => (
                                <option key={depto} value={depto}>{depto}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Botón de finalizar */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                    <Save className="w-5 h-5" />
                    Finalizar Módulo 0
                </button>
            </div>
        </form>
    );
}
