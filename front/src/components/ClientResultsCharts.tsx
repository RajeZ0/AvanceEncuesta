'use client';

import dynamic from 'next/dynamic';

const ResultsCharts = dynamic(() => import('./ResultsCharts').then(mod => mod.ResultsCharts), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-slate-100/50 rounded-xl animate-pulse flex flex-col items-center justify-center gap-2 p-4">
            <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-emerald-500 animate-spin" />
            <span className="text-slate-400 text-xs font-medium">Cargando datos...</span>
        </div>
    )
});

export function ClientResultsCharts(props: any) {
    return <ResultsCharts {...props} />;
}
