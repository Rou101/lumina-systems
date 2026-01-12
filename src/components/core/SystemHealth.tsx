import React, { useState } from 'react';
import { Activity, Zap, ShieldAlert, Play, AlertTriangle } from 'lucide-react';
import { simulationService, Intensity } from '../../services/simulationService';

export function SystemHealth() {
    const [intensity, setIntensity] = useState<Intensity>('normal');

    const handleSimChange = (newIntensity: Intensity) => {
        setIntensity(newIntensity);
        simulationService.setIntensity(newIntensity);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-black/80 border border-emerald-900/50 p-4 rounded-lg flex items-center justify-between">
                    <div>
                        <div className="text-zinc-500 text-xs tracking-widest font-mono mb-1">GLOBAL REVENUE (TAX)</div>
                        <div className="text-3xl font-mono text-emerald-500 font-bold">$482,920.<span className="text-lg opacity-50">00</span></div>
                    </div>
                    <Activity className="text-emerald-900 w-8 h-8" />
                </div>

                <div className="bg-black/80 border border-emerald-900/50 p-4 rounded-lg flex items-center justify-between">
                    <div>
                        <div className="text-zinc-500 text-xs tracking-widest font-mono mb-1">ACTIVE CIRCUITS</div>
                        <div className="text-xl font-mono text-white font-bold flex gap-4">
                            <span className="text-emerald-500">PAYMENTS: OK</span>
                        </div>
                    </div>
                    <Zap className="text-emerald-900 w-8 h-8" />
                </div>

                <div className="bg-black/80 border border-emerald-900/50 p-4 rounded-lg flex items-center justify-between">
                    <div>
                        <div className="text-zinc-500 text-xs tracking-widest font-mono mb-1">SECURITY THREATS</div>
                        <div className="text-xl font-mono text-white font-bold">
                            <span className="text-emerald-500">LEVEL 0 (SAFE)</span>
                        </div>
                    </div>
                    <ShieldAlert className="text-emerald-900 w-8 h-8" />
                </div>

                {/* CHAOS ENGINE CONTROLS */}
                <div className="bg-zinc-900 border border-zinc-700 p-2 rounded-lg flex flex-col justify-center gap-2">
                    <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold text-center">Chaos Engine</div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => handleSimChange('idle')}
                            className={`flex-1 py-1 text-[10px] uppercase font-bold rounded ${intensity === 'idle' ? 'bg-zinc-600 text-white' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'}`}
                        >
                            Pause
                        </button>
                        <button
                            onClick={() => handleSimChange('normal')}
                            className={`flex-1 py-1 text-[10px] uppercase font-bold rounded ${intensity === 'normal' ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'}`}
                        >
                            Normal
                        </button>
                        <button
                            onClick={() => handleSimChange('high')}
                            className={`flex-1 py-1 text-[10px] uppercase font-bold rounded ${intensity === 'high' ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'}`}
                        >
                            High
                        </button>
                        <button
                            onClick={() => handleSimChange('chaos')}
                            className={`flex-1 py-1 text-[10px] uppercase font-bold rounded ${intensity === 'chaos' ? 'bg-red-600 text-white animate-pulse' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'}`}
                        >
                            CHAOS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
