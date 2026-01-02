import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface MunicipalityByStateChartProps {
    data: Array<{ state: string; count: number }>;
}

export function MunicipalityByStateChart({ data }: MunicipalityByStateChartProps) {
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    return (
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-100 shadow-lg">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Top 10 Municipios por Puntuación</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                        dataKey="state"
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                    />
                    <Legend />
                    <Bar dataKey="count" name="Municipios" radius={[8, 8, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
