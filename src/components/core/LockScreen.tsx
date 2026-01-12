import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, AlertOctagon, ScanLine } from 'lucide-react';

interface LockScreenProps {
    onUnlock: () => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
    const [code, setCode] = useState('');
    const [error, setError] = useState(false);

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        if (code === 'PROTOCOL-0') {
            onUnlock();
        } else {
            setError(true);
            setCode('');
            setTimeout(() => setError(false), 500);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0%,transparent_70%)] pointer-events-none"></div>

            {/* Scan Line Effect */}
            <motion.div
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-red-500/20 blur-sm pointer-events-none"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md"
            >
                <div className="border border-red-900/50 bg-zinc-900/50 backdrop-blur-xl p-8 rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.2)] relative overflow-hidden">

                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-600"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-red-600"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-red-600"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-red-600"></div>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/20 border border-red-500/30 mb-4 animate-pulse">
                            <Lock className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-[0.2em] uppercase mb-2">Restricted Area</h1>
                        <p className="text-red-400 font-mono text-xs uppercase tracking-widest">Level 5 Clearance Required</p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-6">
                        <div className="relative">
                            <input
                                type="password"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className={`w-full bg-black/50 border ${error ? 'border-red-500' : 'border-red-900/50'} rounded px-4 py-3 text-white text-center font-mono tracking-[0.5em] focus:outline-none focus:border-red-500 transition-colors uppercase placeholder:tracking-normal placeholder:text-zinc-700`}
                                placeholder="ENTER MASTER KEY"
                                autoFocus
                            />
                            {error && (
                                <motion.div
                                    initial={{ x: -10 }}
                                    animate={{ x: [0, -10, 10, -10, 0] }}
                                    className="absolute -bottom-6 left-0 right-0 text-center text-red-500 text-xs font-mono font-bold"
                                >
                                    ACCESS DENIED
                                </motion.div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-red-900/40 hover:bg-red-900/60 border border-red-600 text-red-100 font-bold py-3 rounded uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 group"
                        >
                            <ScanLine className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                            Authenticate
                        </button>
                    </form>

                    <div className="mt-8 pt-4 border-t border-red-900/20 flex items-center justify-center gap-2 text-[10px] text-zinc-600 font-mono uppercase">
                        <AlertOctagon className="w-3 h-3 text-red-900" />
                        Lumina Security Protocol v3.0
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
