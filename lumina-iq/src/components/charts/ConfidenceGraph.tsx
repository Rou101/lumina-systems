"use client";

import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_PREDICTIONS = [
    { event: 'Evt 1', actual: 4000, predicted: 4200, lower: 3800, upper: 4600 },
    { event: 'Evt 2', actual: 3000, predicted: 2900, lower: 2500, upper: 3300 },
    { event: 'Evt 3', actual: 5500, predicted: 5000, lower: 4500, upper: 5500 },
    { event: 'Evt 4', actual: 4800, predicted: 4900, lower: 4400, upper: 5400 },
    { event: 'Evt 5', actual: null, predicted: 6000, lower: 5200, upper: 6800 }, // Future
];

export function ConfidenceGraph() {
    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={MOCK_PREDICTIONS}>
                    <defs>
                        <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis
                        dataKey="event"
                        stroke="#71717a"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#71717a"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }}
                    />

                    {/* Confidence Interval (Area) */}
                    <Area
                        type="monotone"
                        dataKey="upper"
                        stroke="none"
                        fill="url(#colorConfidence)"
                    />
                    <Area
                        type="monotone"
                        dataKey="lower"
                        stroke="none"
                        fill="#09090b" // Masking the bottom to create a band? No, Area is usually stacked or fills to 0.
                    // Better approach for band: Use Area with [lower, upper] if recharts supports it, 
                    // OR simulate band by stacking.
                    // Simplified approach for "Crystal Ball": Just show the upper area as "Potential Upside" 
                    // and maybe another for downside.
                    // Actually, for a proper band in Recharts, we can use <Area dataKey="range" /> where data is [min, max], 
                    // but Recharts expects numeric value for axis.
                    // Let's stick to a simple visual: "Predicted" is a line, "Confidence" is a shaded region around it.
                    // We can hack it by drawing the Upper area opaque-translucent, and Lower area opaque-black to mask it?
                    // Yes, filling 'lower' with background color to mask 'upper' area is a common trick.
                    />
                    <Area
                        type="monotone"
                        dataKey="lower"
                        stroke="none"
                        fill="#09090b"
                        fillOpacity={1}
                    />

                    {/* Lines */}
                    <Line type="monotone" dataKey="predicted" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: '#f59e0b' }} name="AI Prediction" />
                    <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981' }} name="Actual Sales" />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
