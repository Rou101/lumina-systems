"use client";

import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TimeBucket } from '@/lib/analyticsEngine';

interface CrystalBallProps {
    historicalData: TimeBucket[];
    predictedData: TimeBucket[];
}

export function CrystalBall({ historicalData, predictedData }: CrystalBallProps) {
    // Combine data for the chart, but keep them distinct for styling
    const chartData = useMemo(() => {
        // For the chart to flow smoothly, we need the last historical point to connect to the first prediction
        const connectionPoint = historicalData[historicalData.length - 1];

        // Format historical
        const history = historicalData.map(d => ({
            ...d,
            actualRevenue: d.revenue,
            predictedRevenue: null // Don't show prediction line here
        }));

        // Format prediction
        const prediction = predictedData.map(d => ({
            ...d,
            actualRevenue: null, // Don't show actual line here
            predictedRevenue: d.revenue
        }));

        // Add connection point to prediction start so lines touch
        if (connectionPoint) {
            prediction.unshift({
                ...connectionPoint,
                actualRevenue: connectionPoint.revenue, // Anchor point
                predictedRevenue: connectionPoint.revenue
            });
        }

        return [...history, ...prediction.slice(1)]; // Return combined excluding duplicate timestamp
    }, [historicalData, predictedData]);

    return (
        <div className="w-full h-[400px] bg-black/40 backdrop-blur-md rounded-xl border border-cyan-500/30 p-6 relative overflow-hidden group">
            {/* Sci-fi Overlay Effect */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>

            <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
                    🔮 The Crystal Ball
                    <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30">AI PREDICTIVE</span>
                </h3>
                <div className="flex gap-4 text-xs font-mono">
                    <span className="flex items-center gap-2 text-zinc-400">
                        <div className="w-2 h-2 rounded-full bg-cyan-500"></div> Actual
                    </span>
                    <span className="flex items-center gap-2 text-zinc-400">
                        <div className="w-2 h-2 rounded-full border border-dashed border-cyan-500"></div> AI Projection
                    </span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPredict" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis
                        dataKey="time"
                        stroke="#525252"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#525252"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #3f3f46' }}
                        itemStyle={{ color: '#fff' }}
                    />

                    {/* Actual Revenue Line */}
                    <Area
                        type="monotone"
                        dataKey="actualRevenue"
                        stroke="#06b6d4"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                    />

                    {/* Predicted Revenue Line (Dashed) */}
                    <Area
                        type="monotone"
                        dataKey="predictedRevenue"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fillOpacity={1}
                        fill="url(#colorPredict)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
