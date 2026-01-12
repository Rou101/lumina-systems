import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2 } from 'lucide-react';

export interface TicketItem {
    id: string;
    qty: number;
    name: string;
}

export interface Ticket {
    id: string; // "88"
    customerName: string; // "Pedro"
    items: TicketItem[];
    status: 'prep' | 'ready' | 'delivered';
    timestamp: number;
}

interface TicketCardProps {
    ticket: Ticket;
    onStatusChange: (id: string, newStatus: Ticket['status']) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onStatusChange }) => {
    const isReady = ticket.status === 'ready';
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - ticket.timestamp) / 1000 / 60)); // Minutes
        }, 1000);
        return () => clearInterval(interval);
    }, [ticket.timestamp]);

    // Critical State: > 10 mins in prep
    const isCritical = !isReady && elapsed > 10;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`
                relative overflow-hidden flex flex-col h-full border-4
                ${isReady
                    ? 'bg-emerald-600 border-emerald-500' // READY: Green Solid
                    : isCritical
                        ? 'bg-black border-red-500 animate-pulse' // CRITICAL: Red Blink
                        : 'bg-black border-yellow-400' // PENDING: Yellow Outline
                }
            `}
        >
            {/* Header */}
            <div className={`p-4 flex justify-between items-start ${isReady ? 'bg-emerald-700' : 'bg-zinc-900'} border-b-2 border-white/10`}>
                <div>
                    <h1 className={`text-6xl font-black tracking-tighter ${isReady ? 'text-white' : 'text-yellow-400'}`}>
                        #{ticket.id}
                    </h1>
                    <p className={`font-bold uppercase text-lg ${isReady ? 'text-emerald-100' : 'text-zinc-300'}`}>{ticket.customerName}</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`text-2xl font-mono font-bold ${isCritical ? 'text-red-500' : 'text-white'}`}>
                        {elapsed}m
                    </span>
                </div>
            </div>

            {/* Items */}
            <div className={`p-4 flex-1 space-y-3 ${isReady ? 'bg-emerald-600' : 'bg-black'}`}>
                {ticket.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                        <span className={`
                            text-3xl font-black w-12 h-12 flex items-center justify-center rounded
                            ${isReady ? 'bg-emerald-800 text-white' : 'bg-zinc-800 text-cyan-400'}
                        `}>
                            {item.qty}
                        </span>
                        <span className={`text-2xl font-bold leading-tight ${isReady ? 'text-white' : 'text-zinc-200'}`}>
                            {item.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <button
                onClick={() => onStatusChange(ticket.id, isReady ? 'delivered' : 'ready')}
                className={`
                    w-full py-8 text-3xl font-black uppercase tracking-widest transition-all
                    ${isReady
                        ? 'bg-white text-emerald-800 hover:bg-emerald-100'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                    }
                `}
            >
                {isReady ? "COMPLETED" : "READY"}
            </button>
        </motion.div>
    );
};
