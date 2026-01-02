import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface StatusPieChartProps {
    data: Array<{ name: string; value: number }>;
}

export function StatusPieChart({ data }: StatusPieChartProps) {
    const COLORS = {
        'Completado': '#10b981',
        'En Progreso': '#f59e0b',
        'Pendiente': '#64748b'
    };

    return (
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-100 shadow-lg">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Distribución por Estado</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#64748b'} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
