'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseAutoSaveOptions {
    datos: any;
    guardar: (datos: any) => Promise<void>;
    retrasoMs?: number;
}

/**
 * Hook personalizado para guardado automático con debounce
 * @param datos - Datos a guardar
 * @param guardar - Función async para guardar los datos
 * @param retrasoMs - Tiempo de espera después del último cambio (default: 2000ms)
 */
export function useAutoSave({ datos, guardar, retrasoMs = 2000 }: UseAutoSaveOptions) {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const datosAnterioresRef = useRef(datos);

    const guardarConDebounce = useCallback(() => {
        // Limpiar timer anterior
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // Crear nuevo timer
        timerRef.current = setTimeout(async () => {
            try {
                await guardar(datos);
            } catch (error) {
                console.error('Error en auto-guardado:', error);
            }
        }, retrasoMs);
    }, [datos, guardar, retrasoMs]);

    useEffect(() => {
        // Solo guardar si los datos cambiaron
        const datosStrActual = JSON.stringify(datos);
        const datosStrAnterior = JSON.stringify(datosAnterioresRef.current);

        if (datosStrActual !== datosStrAnterior) {
            datosAnterioresRef.current = datos;
            guardarConDebounce();
        }

        // Cleanup
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [datos, guardarConDebounce]);
}
