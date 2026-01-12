import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { simulationService } from '../../services/simulationService';

interface Transaction {
    id: string;
    source: string;
    amount: number; // The fee amount
    timestamp: number;
}

export function ProfitStream() {
    const [gmv, setGmv] = useState(1250430);
    const [netRevenue, setNetRevenue] = useState(62521.50);
    const [stream, setStream] = useState<Transaction[]>([]);

    // Subscribe to Simulation Service
    useEffect(() => {
        // Initial data
        setStream([
            { id: 'tx-init-1', source: 'System Ready', amount: 0.00, timestamp: Date.now() }
        ]);

        const unsubscribe = simulationService.onTransaction((newTx) => {
            setStream(prev => [newTx, ...prev].slice(0, 8)); // Keep last 8
            setGmv(prev => prev + (newTx.amount * 20));
            setNetRevenue(prev => prev + newTx.amount);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="bg-black/50 border border-emerald-900/30 rounded-xl overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-emerald-900/30 bg-emerald-900/10 flex justify-between items-center">
                <h3 className="text-emerald-500 font-mono text-xs tracking-widest uppercase flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    Profit Stream
                </h3>
                <span className="text-[10px] text-emerald-700 font-mono">LIVE FEED</span>
            </div>

            <div className="grid grid-cols-2 gap-px bg-emerald-900/30">
                <div className="bg-black/80 p-4">
                    <div className="text-zinc-500 text-[10px] tracking-widest uppercase mb-1">GMV Velocity</div>
                    <div className="text-white font-mono text-xl font-bold">${gmv.toLocaleString()}</div>
                </div>
                <div className="bg-black/80 p-4">
                    <div className="text-zinc-500 text-[10px] tracking-widest uppercase mb-1">Net Revenue</div>
                    <div className="text-emerald-400 font-mono text-xl font-bold flex items-center gap-2">
                        ${netRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <ArrowUpRight size={14} className="opacity-50" />
                    </div>
                </div>
            </div>

            <div className="flex-1 p-4 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>

                <div className="space-y-2">
                    <AnimatePresence initial={false}>
                        {stream.map((tx) => (
                            <motion.div
                                key={tx.id}
                                initial={{ opacity: 0, y: -20, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                className="flex justify-between items-center border-b border-zinc-900/50 pb-2 last:border-0"
                            >
                                <div className="flex flex-col">
                                    <span className="text-emerald-500 font-mono text-xs font-bold">+${tx.amount.toFixed(2)}</span>
                                    <span className="text-zinc-600 text-[10px] font-mono">{tx.source}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-zinc-700 text-[10px] font-mono">{new Date(tx.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                                    <div className="text-zinc-800 text-[9px] font-mono tracking-tighter uppercase">{tx.id.slice(-6)}</div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>
            </div>
        </div>
    );
}
