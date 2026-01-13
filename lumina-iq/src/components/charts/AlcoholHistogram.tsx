"use client";

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Order } from '@/types/lumina';

interface AlcoholHistogramProps {
    orders: Order[];
}

export function AlcoholHistogram({ orders }: AlcoholHistogramProps) {
    const data = useMemo(() => {
        if (!orders.length) return [];

        // Initialize 24h buckets
        const buckets = Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            label: `${i}:00`,
            sales: 0,
            count: 0
        }));

        orders.forEach(order => {
            const date = new Date(order.timestamp);
            const hour = date.getHours();
            buckets[hour].sales += order.total;
            buckets[hour].count += 1;
        });

        // Filter to show only relevant timeframe (e.g. 5 PM to 5 AM) for Nightlife context
        // But for simplicity, we mock a "Night" view by rotating or just showing all non-zero
        return buckets.filter(b => b.sales > 0);
    }, [orders]);

    if (!orders.length) return <div className="text-zinc-500 text-sm">No data available</div>;

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis
                        dataKey="label"
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
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        cursor={{ fill: '#27272a', opacity: 0.4 }}
                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }}
                        formatter={(value: any) => [`$${value.toLocaleString()}`, 'Sales']}
                    />
                    <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.hour >= 23 || entry.hour <= 2 ? '#10b981' : '#f59e0b'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
