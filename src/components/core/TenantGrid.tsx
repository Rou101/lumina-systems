import React, { useState } from 'react';
import { AlertTriangle, Power, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tenant {
    id: string;
    name: string;
    status: 'LIVE' | 'PROVISIONING' | 'OFFLINE';
    fee: number;
}

export function TenantGrid() {
    const [tenants, setTenants] = useState<Tenant[]>([
        { id: '1', name: 'Lollapalooza CL', status: 'LIVE', fee: 5.0 },
        { id: '2', name: 'Ultra Miami', status: 'PROVISIONING', fee: 4.5 },
        { id: '3', name: 'Private Event #92', status: 'OFFLINE', fee: 8.0 },
    ]);

    const [killTarget, setKillTarget] = useState<string | null>(null);

    return (
        <div className="space-y-4">
            <div className="grid grid-header grid-cols-12 text-xs text-zinc-500 font-mono border-b border-zinc-800 pb-2 uppercase tracking-widest">
                <div className="col-span-4">Tenant Identifier</div>
                <div className="col-span-2">System Status</div>
                <div className="col-span-3">Lumina Tax (%)</div>
                <div className="col-span-3 text-right">Danger Zone</div>
            </div>

            {tenants.map((tenant) => (
                <div key={tenant.id} className="grid grid-cols-12 items-center py-4 border-b border-zinc-800 hover:bg-white/5 transition-colors px-2 -mx-2 rounded">
                    {/* Name */}
                    <div className="col-span-4 font-mono text-white flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${tenant.status === 'LIVE' ? 'bg-emerald-500 animate-pulse' : tenant.status === 'PROVISIONING' ? 'bg-amber-500' : 'bg-red-900'}`}></div>
                        {tenant.name}
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                        <span className={`text-[10px] px-2 py-1 rounded border ${tenant.status === 'LIVE' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10' : 'border-zinc-700 text-zinc-500 bg-zinc-800'}`}>
                            {tenant.status}
                        </span>
                    </div>

                    {/* Fee Slider */}
                    <div className="col-span-3 flex items-center gap-3 pr-4">
                        <input
                            type="range"
                            min="0"
                            max="20"
                            step="0.5"
                            value={tenant.fee}
                            onChange={() => { }} // Read-only for proto
                            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-ew-resize accent-emerald-500"
                        />
                        <span className="font-mono text-emerald-400 w-12 text-right">{tenant.fee}%</span>
                    </div>

                    {/* Kill Switch */}
                    <div className="col-span-3 flex justify-end">
                        <button
                            onClick={() => setKillTarget(tenant.id)}
                            className="bg-red-900/20 hover:bg-red-900/50 text-red-500 border border-red-900/50 px-3 py-1 rounded text-xs font-bold tracking-wider flex items-center gap-2 transition-all"
                        >
                            <Power size={12} /> KILL
                        </button>
                    </div>
                </div>
            ))}

            {/* Kill Confirmation Modal */}
            <AnimatePresence>
                {killTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-zinc-900 border-2 border-red-600 p-8 rounded-xl max-w-md w-full shadow-[0_0_50px_rgba(220,38,38,0.5)]"
                        >
                            <div className="flex flex-col items-center text-center">
                                <AlertTriangle className="w-16 h-16 text-red-600 mb-4 animate-bounce" />
                                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">Confirm Shutdown</h2>
                                <p className="text-zinc-400 mb-8">
                                    Are you sure you want to terminate the instance for <span className="text-red-400 font-mono font-bold">{tenants.find(t => t.id === killTarget)?.name}</span>? This action causes immediate service interruption and potential data loss.
                                </p>

                                <div className="flex gap-4 w-full">
                                    <button
                                        onClick={() => setKillTarget(null)}
                                        className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-bold uppercase tracking-wider"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => setKillTarget(null)} // Mock Action
                                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                                    >
                                        EXECUTE
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
