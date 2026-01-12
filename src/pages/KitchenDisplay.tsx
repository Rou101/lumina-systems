import React, { useState, useEffect } from 'react';
import { Ticket, TicketCard } from '../components/staff/TicketCard';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChefHat } from 'lucide-react';

const MOCK_TICKETS: Ticket[] = [
    { id: '40', customerName: 'Alice', items: [{ id: '1', qty: 2, name: 'Heineken' }], status: 'prep', timestamp: Date.now() },
    { id: '41', customerName: 'Bob', items: [{ id: '2', qty: 1, name: 'Vodka Redbull' }], status: 'prep', timestamp: Date.now() - 30000 },
    { id: '42', customerName: 'Pedro', items: [{ id: '1', qty: 2, name: 'Heineken' }, { id: '3', qty: 1, name: 'Water' }], status: 'ready', timestamp: Date.now() - 60000 },
];

interface KitchenDisplayProps {
    area?: 'kitchen' | 'bar';
}

export default function KitchenDisplay({ area = 'bar' }: KitchenDisplayProps) {
    const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);

    const filteredTickets = tickets.filter(t => {
        // If ticket has "station" field, use it. For now, we mock based on items or just show all if no filtering logic exists in mock.
        // Let's assume MOCK data needs to be updated or we filter by item name for the demo.
        if (area === 'kitchen') return t.items.some(i => i.name.includes('Burger') || i.name.includes('Fries'));
        if (area === 'bar') return t.items.some(i => i.name.includes('Heineken') || i.name.includes('Vodka') || i.name.includes('Water'));
        return true;
    });

    // ... (rest of logic)

    return (
        <div className="min-h-screen bg-black p-4 md:p-6 pb-32">
            <header className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-700">
                        <ChefHat className="text-zinc-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Kitchen Display</h1>
                        <p className="text-zinc-500 font-mono text-xs">LUMINA KDS v1.0 • STATION: {area?.toUpperCase()}_MAIN</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <div className="text-4xl font-mono text-cyan-500 font-bold">{filteredTickets.filter(t => t.status === 'prep').length}</div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Pending</div>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-mono text-emerald-500 font-bold">{filteredTickets.filter(t => t.status === 'ready').length}</div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-widest">Ready</div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence>
                    {filteredTickets.map(ticket => (
                        <TicketCard key={ticket.id} ticket={ticket} onStatusChange={handleStatusChange} />
                    ))}
                </AnimatePresence>
            </div>

            {tickets.length === 0 && (
                <div className="text-center py-20 opacity-30">
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-zinc-500" />
                    <h2 className="text-2xl font-bold text-white uppercase">No Active Orders</h2>
                    <p className="font-mono text-zinc-500">Stand by for incoming traffic...</p>
                </div>
            )}
        </div>
    );
}
