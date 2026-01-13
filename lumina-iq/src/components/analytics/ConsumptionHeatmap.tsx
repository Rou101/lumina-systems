"use client";

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TimeBucket } from '@/lib/analyticsEngine';

interface ConsumptionHeatmapProps {
    data: TimeBucket[];
}

export function ConsumptionHeatmap({ data }: ConsumptionHeatmapProps) {
    // Identify the highest value to highlight it
    const peakValue = useMemo(() => {
        return Math.max(...data.map(d => d.alcoholUnits));
    }, [data]);

    return (
        <div className="w-full h-[300px] bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    🔥 Consumption Peak
                </h3>
                <span className="text-xs text-zinc-500 uppercase tracking-wider">Live Alcohol Units</span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis
                        dataKey="time"
                        stroke="#525252"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        hide={true}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Bar dataKey="alcoholUnits" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.alcoholUnits === peakValue ? '#ef4444' : '#3f3f46'}
                                className="transition-all duration-300 hover:opacity-80"
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
