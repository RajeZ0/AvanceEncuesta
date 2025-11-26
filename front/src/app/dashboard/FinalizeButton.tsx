'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function FinalizeButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleFinalize = async () => {
        if (!confirm('¿Estás seguro de que deseas finalizar la evaluación?')) return;

        setLoading(true);
        try {
            const res = await fetch('/api/finalize', { method: 'POST' });
            if (res.ok) {
                const data = await res.json();
                alert(`Evaluación enviada correctamente. Tu calificación final es: ${data.score.toFixed(2)}`);
                router.refresh();
            } else {
                alert('Error al enviar la evaluación');
            }
        } catch (e) {
            alert('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleFinalize}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50"
        >
            {loading ? 'Enviando...' : 'Finalizar Evaluación'}
        </button>
    );
}
