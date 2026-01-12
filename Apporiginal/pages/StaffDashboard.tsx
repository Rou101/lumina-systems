
import React, { useState, useEffect } from 'react';
import { useRealTimeData, markOrderReady, completePickupOrder } from '../services/dataService';
import { OrderStatus } from '../types';
import { GlassCard, GlassButton } from '../components/GlassUI';

const StaffDashboard: React.FC = () => {
  const { orders, config } = useRealTimeData();
  const [filterZone, setFilterZone] = useState<string>('all');

  // Filter Active Orders (Confirmed = To Prep, Ready = Waiting Pickup)
  const activeOrders = orders.filter(o => 
      (o.status === OrderStatus.CONFIRMED || o.status === OrderStatus.READY_FOR_PICKUP) &&
      (filterZone === 'all' || o.zoneId === filterZone)
  ).sort((a, b) => a.timestamp - b.timestamp);

  const zones = config.pickupZones;

  return (
    <div className="min-h-screen bg-[#0f172a] p-6 pb-32">
        <header className="mb-8 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-black text-white uppercase">Monitor de Flujo</h1>
                <p className="text-white/50">Gestión de entregas</p>
            </div>
            <div className="flex gap-2">
                <select 
                    value={filterZone}
                    onChange={e => setFilterZone(e.target.value)}
                    className="bg-white/10 text-white p-3 rounded-xl border border-white/20 font-bold"
                >
                    <option value="all">TODAS LAS ZONAS</option>
                    {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                </select>
            </div>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOrders.length === 0 && (
                <div className="col-span-full py-20 text-center opacity-30 text-2xl font-bold">
                    Todo tranquilo por ahora...
                </div>
            )}

            {activeOrders.map(order => {
                const isReady = order.status === OrderStatus.READY_FOR_PICKUP;
                const elapsed = Math.floor((Date.now() - order.timestamp) / 60000);
                
                return (
                    <GlassCard key={order.id} className={`flex flex-col border-l-8 ${isReady ? 'border-l-emerald-500 bg-emerald-500/10' : 'border-l-blue-500'}`}>
                        <div className="p-4 border-b border-white/10 flex justify-between items-start">
                            <div>
                                <span className="bg-white/10 text-xs px-2 py-1 rounded font-bold">{order.zoneId}</span>
                                <h2 className="text-4xl font-black text-white mt-2">{order.pickupCode}</h2>
                            </div>
                            <div className="text-right">
                                <span className={`text-xl font-mono font-bold ${elapsed > 10 ? 'text-red-500 animate-pulse' : 'text-white/60'}`}>{elapsed}m</span>
                            </div>
                        </div>

                        <div className="p-4 flex-1 space-y-2">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex gap-3 text-lg">
                                    <span className="font-bold text-white w-6">{item.quantity}</span>
                                    <span className="text-white/80">{item.name}</span>
                                </div>
                            ))}
                        </div>

                        <div className="p-4">
                            {isReady ? (
                                <GlassButton 
                                    onClick={() => completePickupOrder(order.id)} 
                                    variant="success" 
                                    className="w-full py-4 text-xl font-bold"
                                >
                                    ENTREGADO ✓
                                </GlassButton>
                            ) : (
                                <GlassButton 
                                    onClick={() => markOrderReady(order.id)} 
                                    variant="primary" 
                                    className="w-full py-4 text-xl font-bold bg-blue-600 hover:bg-blue-500 border-blue-400"
                                >
                                    MARCAR LISTO 🔔
                                </GlassButton>
                            )}
                        </div>
                    </GlassCard>
                );
            })}
        </div>
    </div>
  );
};

export default StaffDashboard;
