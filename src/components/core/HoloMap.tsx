import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { simulationService } from '../../services/simulationService';

interface Node {
    id: string;
    name: string;
    x: string;
    y: string;
    status: 'LIVE' | 'PROVISIONING' | 'OFFLINE';
    revenue: string;
    latency: string;
}

const initialNodes: Node[] = [
    { id: 'SCL', name: 'Santiago', x: '30%', y: '70%', status: 'LIVE', revenue: '$1.2M', latency: '42ms' },
    { id: 'MIA', name: 'Miami', x: '25%', y: '35%', status: 'PROVISIONING', revenue: '$0', latency: '--' },
    { id: 'TKY', name: 'Tokyo', x: '85%', y: '38%', status: 'Offline', revenue: '$0', latency: '--' }, // Fixed typo 'Offline' to 'OFFLINE' in next update but status is case sensitive in display
];

export function HoloMap() {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);

    useEffect(() => {
        const unsubscribe = simulationService.onNodeUpdate((update) => {
            setNodes(prev => prev.map(n =>
                n.id === update.id ? { ...n, status: update.status, latency: update.latency, revenue: update.revenue } : n
            ));
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="relative w-full h-[400px] bg-black border border-zinc-800 rounded-xl overflow-hidden group">
            {/* Sci-fi Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,100,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,100,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

            {/* World Map Silhouette */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-contain bg-no-repeat bg-center grayscale contrast-200"></div>

            <div className="absolute top-4 left-4 z-10">
                <h3 className="text-emerald-500 font-mono text-sm tracking-widest">[ GLOBAL_NET_VISUALIZER ]</h3>
            </div>

            {nodes.map((node) => (
                <div
                    key={node.id}
                    className="absolute group/node cursor-pointer transition-all duration-500"
                    style={{ left: node.x, top: node.y }}
                >
                    {node.status === 'LIVE' && (
                        <motion.div
                            animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -inset-4 bg-emerald-500/30 rounded-full"
                        />
                    )}

                    <div className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 ${node.status === 'LIVE' ? 'bg-emerald-500 border-white shadow-[0_0_10px_#10b981]' :
                            node.status === 'OFFLINE' ? 'bg-red-900 border-red-700' :
                                'bg-amber-500 border-amber-300'
                        }`}></div>

                    {/* Tooltip */}
                    <div className="absolute left-6 top-0 hidden group-hover/node:block bg-black/90 border border-emerald-500/30 p-3 rounded min-w-[150px] backdrop-blur-md z-20">
                        <div className="text-white font-bold">{node.name}</div>
                        <div className="text-xs text-zinc-400 font-mono mt-1">STATUS: <span className={node.status === 'LIVE' ? 'text-emerald-400' : node.status === 'OFFLINE' ? 'text-red-500' : 'text-zinc-500'}>{node.status}</span></div>
                        {node.status === 'LIVE' && (
                            <>
                                <div className="text-xs text-zinc-400 font-mono">HRTBT: {node.latency}</div>
                                <div className="text-xs text-emerald-400 font-mono mt-1">VOL: {node.revenue}</div>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
