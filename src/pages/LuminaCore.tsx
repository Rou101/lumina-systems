import React from 'react';
import { HoloMap } from '../components/core/HoloMap';
import { SystemHealth } from '../components/core/SystemHealth';
import { TenantGrid } from '../components/core/TenantGrid';
import { ProfitStream } from '../components/core/ProfitStream';
import { ShieldCheck } from 'lucide-react';

export default function LuminaCore() {
    return (
        <div className="min-h-screen bg-black text-white p-8 font-sans selection:bg-red-900 selection:text-white">
            <header className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-6">
                <div className="flex items-center gap-4">
                    <div className="bg-red-900/20 p-2 rounded border border-red-900/50">
                        <ShieldCheck className="text-red-500 w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-[0.2em] font-mono text-white">LUMINA <span className="text-red-600">CORE</span></h1>
                        <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest">Restricted Access // Level 5 Clearance</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-zinc-600 text-xs font-mono">SESSION ID</div>
                    <div className="text-emerald-500 font-mono">0x9F2...A1B</div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto space-y-8">
                <section>
                    <SystemHealth />
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <section className="lg:col-span-5 space-y-4">
                        <h2 className="text-zinc-500 text-xs font-mono uppercase tracking-widest border-l-2 border-red-600 pl-3">Global node Visualizer</h2>
                        <HoloMap />
                    </section>

                    <section className="lg:col-span-4 space-y-4">
                        <h2 className="text-zinc-500 text-xs font-mono uppercase tracking-widest border-l-2 border-red-600 pl-3">Tenant Control Grid</h2>
                        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 h-[400px] overflow-y-auto">
                            <TenantGrid />
                        </div>
                    </section>

                    <section className="lg:col-span-3 space-y-4 h-[400px]">
                        <h2 className="text-zinc-500 text-xs font-mono uppercase tracking-widest border-l-2 border-red-600 pl-3">Profit Velocity</h2>
                        <ProfitStream />
                    </section>
                </div>
            </main>
        </div>
    );
}
