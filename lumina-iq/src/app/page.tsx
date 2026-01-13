"use client";

import { useEffect, useMemo } from "react";
import { useStore } from "@/store/useStore";
import { ArrowUpRight, DollarSign, ShoppingBag, Users } from "lucide-react";
import { processTimeBuckets, generatePredictions } from "@/lib/analyticsEngine";
import { CrystalBall } from "@/components/analytics/CrystalBall";
import { ConsumptionHeatmap } from "@/components/analytics/ConsumptionHeatmap";

export default function Dashboard() {
  const { orders, loadData, isLoading } = useStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Transform data for charts
  const timeData = useMemo(() => processTimeBuckets(orders), [orders]);
  // Generate predictive data based on the processed time buckets
  const predictions = useMemo(() => generatePredictions(timeData), [timeData]);

  const totalSales = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const avgTicket = totalOrders > 0 ? totalSales / totalOrders : 0;

  if (isLoading) {
    return <div className="text-white">Loading market data...</div>;
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">MARKET OVERVIEW</h1>
          <p className="text-zinc-500 mt-1">Real-time financial performance.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-zinc-500">EVENT STATUS</p>
          <p className="text-emerald-500 font-bold tracking-wider flex items-center justify-end gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            LIVE TRADING
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          label="TOTAL REVENUE"
          value={`$${totalSales.toLocaleString()}`}
          icon={DollarSign}
          trend="+12.5%"
        />
        <KpiCard
          label="VOLUME"
          value={totalOrders.toString()}
          icon={ShoppingBag}
          trend="+5.2%"
        />
        <KpiCard
          label="AVG TICKET"
          value={`$${Math.floor(avgTicket)}`}
          icon={Users}
          trend="-1.2%"
          trendDown
        />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CrystalBall historicalData={timeData} predictedData={predictions} />
        </div>
        <div className="lg:col-span-1">
          <ConsumptionHeatmap data={timeData} />
        </div>
      </div>

      <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/30">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Order Feed</h3>
        <div className="space-y-4">
          {orders.slice(-5).reverse().map(order => (
            <div key={order.id} className="flex justify-between items-center py-3 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 px-2 rounded transition-colors">
              <div className="flex flex-col">
                <span className="text-zinc-300 font-medium">{order.items.map(i => i.name).join(", ")}</span>
                <span className="text-xs text-zinc-500">{order.id} • {new Date(order.timestamp).toLocaleTimeString()}</span>
              </div>
              <span className="text-emerald-400 font-mono font-medium">+${order.total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, trend, trendDown = false }: any) {
  return (
    <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/50 hover:border-zinc-700 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
          <Icon className="w-5 h-5" />
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded ${trendDown ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'} flex items-center gap-1`}>
          {trend} <ArrowUpRight className={`w-3 h-3 ${trendDown ? 'rotate-90' : ''}`} />
        </span>
      </div>
      <p className="text-zinc-500 text-sm font-semibold tracking-wider">{label}</p>
      <p className="text-3xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}
