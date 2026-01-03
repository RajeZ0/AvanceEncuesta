'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function FinalizeButton({ disabled }: { disabled?: boolean }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleFinalize = async () => {
        if (!confirm('¿Estás seguro de que deseas finalizar la evaluación?')) return;

        setLoading(true);
        try {
            const res = await fetch('/api/finalize', { method: 'POST' });
            const data = await res.json();

            if (res.ok) {
                alert(`Evaluación enviada correctamente. Tu calificación final es: ${data.score.toFixed(2)}`);
                router.refresh();
            } else if (data.alreadySubmitted) {
                alert('Esta evaluación ya fue enviada anteriormente.');
                router.refresh();
            } else {
                alert(data.error || 'Error al enviar la evaluación');
            }
        } catch (e) {
            console.error('Finalize error:', e);
            alert('Error de conexión. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    if (disabled) {
        return (
            <div className="p-4 bg-gray-100 dark:bg-zinc-800 rounded-xl text-gray-400 dark:text-zinc-500 text-sm font-medium border border-gray-200 dark:border-zinc-700 cursor-not-allowed select-none">
                Complete todos los módulos para finalizar la evaluación
            </div>
        );
    }

    return (
        <button
            onClick={handleFinalize}
            disabled={loading}
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
            {loading ? 'Enviando...' : 'Finalizar Evaluación'}
        </button>
    );
}
