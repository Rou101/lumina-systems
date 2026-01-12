import React, { useMemo } from 'react';
import { GlassCard } from '../../components/GlassUI';
import { WallStreetChart } from './WallStreetChart';
import { useTranslation } from 'react-i18next';
import { Order, Product, PickupZone } from '../../types';

interface LiveOpsProps {
    orders: Order[];
    products: Product[];
    pickupZones: PickupZone[];
    now: number; // Passed down to force refresh
}

export const LiveOps: React.FC<LiveOpsProps> = ({ orders, products, pickupZones, now }) => {
    const { t } = useTranslation();

    const metrics = useMemo(() => {
        const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
        const totalRevenue = paidOrders.reduce((acc, o) => acc + o.total, 0);

        // 1. MARGIN CALCULATION
        let totalCost = 0;
        paidOrders.forEach(o => {
            o.items.forEach(i => {
                const original = products.find(p => p.id === i.id);
                if (original) totalCost += (original.cost * i.quantity);
            });
        });
        const margin = totalRevenue - totalCost;
        const marginPercent = totalRevenue > 0 ? (margin / totalRevenue) * 100 : 0;

        // 2. VELOCITY (Orders per Minute - Last 30 mins)
        const thirtyMinsAgo = now - (30 * 60 * 1000); // Use prop 'now'
        const recentOrders = paidOrders.filter(o => o.timestamp > thirtyMinsAgo);
        const velocity = recentOrders.length > 0 ? (recentOrders.length / 30).toFixed(1) : '0.0';

        // 3. SALES TREND (Aggregate by 5 minute buckets for last hour)
        const trendBuckets = new Array(12).fill(0);
        const oneHourAgo = now - (60 * 60 * 1000); // Use prop 'now'
        paidOrders.filter(o => o.timestamp > oneHourAgo).forEach(o => {
            const bucketIndex = Math.floor((o.timestamp - oneHourAgo) / (5 * 60 * 1000));
            if (bucketIndex >= 0 && bucketIndex < 12) trendBuckets[bucketIndex] += o.total;
        });
        // If no data, show flatline or tiny noise to look alive
        const salesTrend = trendBuckets.some(v => v > 0) ? trendBuckets : [100, 100, 100, 100, 100, 100, 100, 100, 100, 100];

        // 4. ZONE HEATMAP (Active Orders Density)
        const zoneCounts: Record<string, number> = {};
        orders.forEach(o => {
            if (o.status !== 'completed' && o.status !== 'cancelled') {
                zoneCounts[o.zoneId] = (zoneCounts[o.zoneId] || 0) + 1;
            }
        });

        // 5. TOP MOVERS (Qty Sold)
        const productSales: Record<string, number> = {};
        paidOrders.forEach(o => {
            o.items.forEach(i => {
                productSales[i.id] = (productSales[i.id] || 0) + i.quantity;
            });
        });
        const topMovers = Object.entries(productSales)
            .map(([id, qty]) => ({ id, qty, name: products.find(p => p.id === id)?.name || t('admin_live_unknown') }))
            .sort((a, b) => b.qty - a.qty)
            .slice(0, 3);

        return {
            totalRevenue,
            totalCost,
            margin,
            marginPercent,
            totalOrders: orders.length,
            salesTrend,
            velocity,
            zoneCounts,
            topMovers
        };
    }, [orders, products, pickupZones, now]);

    return (
        <div className="space-y-6">
            {/* KEY METRICS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <GlassCard className="p-0 overflow-hidden relative">
                    <div className="p-4 relative z-10">
                        <p className="text-lumina-text-secondary text-[10px] font-mono uppercase tracking-widest mb-2">{t('stats_revenue')}</p>
                        <h3 className="text-3xl font-black text-lumina-text-primary tracking-tighter">${metrics.totalRevenue.toLocaleString()}</h3>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-16 opacity-50">
                        <WallStreetChart data={metrics.salesTrend} color="#00F0FF" />
                    </div>
                </GlassCard>

                <GlassCard className="p-0">
                    <div className="p-4">
                        <p className="text-lumina-text-secondary text-[10px] font-mono uppercase tracking-widest mb-2">{t('stats_margin')}</p>
                        <h3 className={`text-3xl font-black tracking-tighter ${metrics.marginPercent > 30 ? 'text-emerald-500' : 'text-yellow-500'}`}>
                            {metrics.marginPercent.toFixed(1)}%
                        </h3>
                        <p className="text-[10px] text-white/50 font-mono mt-1">{t('stats_profit')} ${metrics.margin.toLocaleString()}</p>
                    </div>
                </GlassCard>

                <GlassCard className="p-4 border-l-4 border-lumina-violet">
                    <p className="text-lumina-text-secondary text-[10px] font-mono uppercase tracking-widest mb-2">{t('stats_velocity')}</p>
                    <h3 className="text-3xl font-black text-lumina-text-primary tracking-tighter">{metrics.velocity}</h3>
                    <p className="text-[10px] text-lumina-text-secondary font-mono mt-1">{t('stats_velocity_sub')}</p>
                </GlassCard>

                <GlassCard className="p-4 border-l-4 border-fuchsia-500">
                    <p className="text-lumina-text-secondary text-[10px] font-mono uppercase tracking-widest mb-2">{t('stats_active_orders')}</p>
                    <h3 className="text-3xl font-black text-white tracking-tighter">{metrics.totalOrders}</h3>
                    <span className="text-[10px] text-emerald-500 font-mono mt-1 block">{t('stats_system_optimal')}</span>
                </GlassCard>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* TOP MOVERS */}
                <GlassCard className="p-6 md:col-span-1">
                    <h3 className="text-sm font-bold uppercase text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        {t('admin_live_top_movers')}
                    </h3>
                    <div className="space-y-4">
                        {metrics.topMovers.map((item, i) => (
                            <div key={item.id} className="flex items-center gap-4">
                                <div className="w-8 h-8 flex items-center justify-center font-black text-gray-500 bg-white/5 rounded-sm">
                                    #{i + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-bold text-sm text-white">{item.name}</span>
                                        <span className="font-mono text-lumina-cyan font-bold">{item.qty}</span>
                                    </div>
                                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-lumina-cyan rounded-full"
                                            style={{ width: `${(item.qty / (metrics.topMovers[0]?.qty || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {metrics.topMovers.length === 0 && (
                            <p className="text-white/30 text-xs italic text-center py-4">{t('admin_live_waiting')}</p>
                        )}
                    </div>
                </GlassCard>

                {/* ZONE HEATMAP */}
                <GlassCard className="p-6 md:col-span-2">
                    <h3 className="text-sm font-bold uppercase text-white mb-6">{t('admin_live_heatmap')}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {pickupZones.map(zone => {
                            const count = metrics.zoneCounts[zone.id] || 0;
                            // Heatmap intensity logic
                            let intensityColor = 'bg-white/5 border-white/10';
                            let textColor = 'text-white/50';
                            if (count > 0) { intensityColor = 'bg-blue-500/20 border-blue-500/50'; textColor = 'text-blue-400'; }
                            if (count > 5) { intensityColor = 'bg-yellow-500/20 border-yellow-500/50'; textColor = 'text-yellow-400'; }
                            if (count > 10) { intensityColor = 'bg-red-500/20 border-red-500/50'; textColor = 'text-red-400 animate-pulse'; }

                            return (
                                <div key={zone.id} className={`p-4 rounded-sm border ${intensityColor} transition-all duration-500`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-black uppercase text-white">{zone.code}</span>
                                        <span className={`text-xs font-mono font-bold ${textColor}`}>{count}</span>
                                    </div>
                                    <div className="text-[10px] text-white/40 uppercase tracking-wider truncate">{zone.name}</div>
                                    {/* Mini Bar */}
                                    <div className="mt-3 h-1 bg-black/20 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${count > 10 ? 'bg-red-500' : 'bg-blue-500'}`}
                                            style={{ width: `${Math.min(count * 5, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
