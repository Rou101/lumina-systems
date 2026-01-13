"use client";

import { PremiumGate } from "@/components/ui/PremiumGate";
import { ConfidenceGraph } from "@/components/charts/ConfidenceGraph";
import { Sparkles } from "lucide-react";

export default function PredictionPage() {
    return (
        <div className="space-y-8">
            <header className="border-b border-zinc-800 pb-6">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <h1 className="text-3xl font-bold text-white tracking-tight">CRYSTAL BALL</h1>
                </div>
                <p className="text-zinc-500 mt-1">Artificial Intelligence Stock Prediction Engine.</p>
            </header>

            <PremiumGate fallbackMessage="Unlock Future Demand Predictions">
                <div className="space-y-6">
                    <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/30">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-white">Projected Demand Curve</h3>
                            <select className="bg-zinc-800 border-zinc-700 text-zinc-300 text-sm rounded px-3 py-1">
                                <option>Next Event: Electronic Fest</option>
                                <option>Next Event: Wedding</option>
                            </select>
                        </div>
                        <ConfidenceGraph />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                            <p className="text-amber-500 text-sm font-bold uppercase tracking-wider mb-2">Recommended Stock</p>
                            <p className="text-3xl font-bold text-white">450 <span className="text-base font-normal text-zinc-400">Units</span></p>
                            <p className="text-sm text-zinc-500 mt-1">Premium Vodka • +12% vs Last Event</p>
                        </div>
                        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                            <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider mb-2">Weather Impact</p>
                            <p className="text-3xl font-bold text-white">High</p>
                            <p className="text-sm text-zinc-500 mt-1">Hot night expected (+22°C)</p>
                        </div>
                        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                            <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider mb-2">Data Confidence</p>
                            <p className="text-3xl font-bold text-white">94%</p>
                            <p className="text-sm text-zinc-500 mt-1">Based on 500+ data points</p>
                        </div>
                    </div>
                </div>
            </PremiumGate>
        </div>
    );
}
