"use client";

import { useStore } from "@/store/useStore";
import { PremiumGate } from "@/components/ui/PremiumGate";
import { AlcoholHistogram } from "@/components/charts/AlcoholHistogram";

export default function AnalyticsPage() {
    const { orders } = useStore();

    return (
        <div className="space-y-8">
            <header className="border-b border-zinc-800 pb-6">
                <h1 className="text-3xl font-bold text-white tracking-tight">DEEP ANALYTICS</h1>
                <p className="text-zinc-500 mt-1">Consumer behavior and time-series analysis.</p>
            </header>

            <PremiumGate fallbackMessage="Unlock Consumption Patterns">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/30">
                        <h3 className="text-lg font-semibold text-white mb-6">Peak Alcohol Consumption Window</h3>
                        <AlcoholHistogram orders={orders} />
                    </div>

                    <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/30">
                        <h3 className="text-lg font-semibold text-white mb-6">Staff Efficiency Ranking</h3>
                        <div className="flex flex-col gap-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-500">#{i}</div>
                                    <div className="flex-1">
                                        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${100 - i * 15}%` }}></div>
                                        </div>
                                    </div>
                                    <span className="font-mono text-zinc-400">{100 - i * 5} Orders</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-zinc-600 mt-6 text-center italic">Calculated based on order fulfillment delta.</p>
                    </div>
                </div>
            </PremiumGate>
        </div>
    );
}
