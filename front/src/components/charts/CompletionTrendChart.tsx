import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CompletionTrendChartProps {
    data: Array<{ module: string; completion: number }>;
}

export function CompletionTrendChart({ data }: CompletionTrendChartProps) {
    return (
        <div className="bg-white rounded-2xl p-6 border-2 border-slate-100 shadow-lg">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Tasa de Completación por Módulo</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                        dataKey="module"
                        tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <YAxis
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        domain={[0, 100]}
                        label={{ value: '%', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                        formatter={(value: number | undefined) => value ? `${value.toFixed(1)}%` : '0%'}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="completion"
                        name="Completación"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 6 }}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
