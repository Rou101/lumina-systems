
import React, { useState, useEffect } from 'react';
import { useRealTimeData, markOrderReady } from '../services/dataService';
import { OrderStatus } from '../types';
import { GlassCard, GlassButton } from '../components/GlassUI';

interface Props {
  area: 'kitchen' | 'bar';
}

const KitchenDisplay: React.FC<Props> = ({ area }) => {
  const { orders } = useRealTimeData();
  const [now, setNow] = useState(Date.now());

  // Update timer every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  const stationFilter = area;

  // 1. Get Confirmed Orders
  // 2. Filter orders that actually have items of this station
  const activeTickets = orders
    .filter(o => o.status === OrderStatus.CONFIRMED)
    .filter(o => o.items.some(item => item.station === stationFilter))
    .sort((a, b) => a.timestamp - b.timestamp); // FIFO (First In, First Out)

  const handleCompleteTicket = async (orderId: string) => {
    // Moves order status to READY_FOR_PICKUP
    await markOrderReady(orderId);
  };

  const getElapsedTime = (timestamp: number) => {
    const diffMins = Math.floor((now - timestamp) / 60000);
    return diffMins;
  };

  const getTimerColor = (mins: number) => {
    if (mins < 10) return 'text-emerald-400';
    if (mins < 20) return 'text-yellow-400';
    return 'text-red-500 animate-pulse';
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 overflow-hidden flex flex-col">
      {/* Header Bar */}
      <header className="flex justify-between items-center mb-6 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-white tracking-tight uppercase">
            {area === 'kitchen' ? '🏭 KDS - Centro de Producción' : '🍸 Expendio / Barra'}
          </h1>
          <span className="bg-white/10 px-3 py-1 rounded-full text-white/60 text-sm font-mono">
            {activeTickets.length} Pendientes
          </span>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-xs uppercase tracking-widest">Tiempo Promedio</p>
          <p className="text-xl font-mono text-lumina-accent">12 min</p>
        </div>
      </header>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-start overflow-y-auto pb-10 flex-1">
        {activeTickets.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center h-96 opacity-30">
            <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <p className="text-2xl font-light">Línea de producción libre</p>
          </div>
        ) : (
          activeTickets.map(order => {
            const mins = getElapsedTime(order.timestamp);
            const filteredItems = order.items.filter(i => i.station === stationFilter);

            return (
              <GlassCard key={order.id} className="flex flex-col border-t-4 border-t-lumina-accent bg-[#1a1f2e]">
                {/* Ticket Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-start bg-white/5">
                  <div>
                    <h2 className="text-2xl font-black text-white">Zona {order.zoneId}</h2>
                    <p className="text-xs text-white/50">#{order.pickupCode || order.id.slice(-4)}</p>
                    {order.customerName && <p className="text-xs text-white/50 truncate max-w-[120px]">{order.customerName}</p>}
                  </div>
                  <div className="text-right">
                     <span className={`text-3xl font-mono font-bold ${getTimerColor(mins)}`}>
                       {mins}'
                     </span>
                     <p className="text-[10px] uppercase text-white/40">Tiempo</p>
                  </div>
                </div>

                {/* Ticket Body (Items) */}
                <div className="p-4 space-y-3 flex-1">
                  {filteredItems.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-start group">
                      <div className="bg-white/10 w-8 h-8 flex items-center justify-center rounded font-bold text-lg text-white group-hover:bg-lumina-accent transition-colors">
                        {item.quantity}
                      </div>
                      <div className="flex-1">
                        <p className="text-lg leading-tight font-medium text-white/90">{item.name}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ticket Footer */}
                <div className="p-4 pt-2">
                   <GlassButton 
                    onClick={() => handleCompleteTicket(order.id)}
                    className="w-full bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/50"
                   >
                     LISTO
                   </GlassButton>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </div>
  );
};

export default KitchenDisplay;
