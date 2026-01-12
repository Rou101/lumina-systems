
import React, { useState, useEffect } from 'react';
import { useRealTimeData, markOrderReady, completePickupOrder } from '../services/dataService';
import { OrderStatus } from '../types';
import { GlassCard, GlassButton } from '../components/GlassUI';

import { useTranslation } from 'react-i18next';

const StaffDashboard: React.FC = () => {
    const { t } = useTranslation();
    const { orders, config } = useRealTimeData();
    const [filterZone, setFilterZone] = useState<string>('all');

    // Filter Active Orders (Confirmed = To Prep, Ready = Waiting Pickup)
    const activeOrders = orders.filter(o =>
        (o.status === OrderStatus.CONFIRMED || o.status === OrderStatus.READY_FOR_PICKUP) &&
        (filterZone === 'all' || o.zoneId === filterZone)
    ).sort((a, b) => a.timestamp - b.timestamp);

    const zones = config.pickupZones;

    return (
        <div className="min-h-screen bg-black p-4">
            <header className="mb-6 flex justify-between items-center bg-zinc-900 p-4 border-b-4 border-zinc-700">
                <div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Crew Monitor</h1>
                    <p className="text-zinc-400 font-mono text-lg">{t('crew_monitor_subtitle')}</p>
                </div>
                <div className="flex gap-4">
                    <select
                        value={filterZone}
                        onChange={e => setFilterZone(e.target.value)}
                        className="bg-black text-white p-4 text-xl rounded border-2 border-zinc-600 font-bold uppercase"
                    >
                        <option value="all">ALL ZONES</option>
                        {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                    </select>
                </div>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {activeOrders.length === 0 && (
                    <div className="col-span-full py-20 text-center text-zinc-600 text-4xl font-black uppercase">
                        NO ACTIVE ORDERS
                    </div>
                )}

                {activeOrders.map(order => {
                    const isReady = order.status === OrderStatus.READY_FOR_PICKUP;
                    const elapsed = Math.floor((Date.now() - order.timestamp) / 60000);
                    const isCritical = elapsed > 10;

                    return (
                        <div key={order.id} className={`flex flex-col border-4 ${isReady ? 'border-emerald-500 bg-emerald-900' : isCritical ? 'border-red-600 bg-black animate-pulse' : 'border-blue-500 bg-black'}`}>
                            <div className="p-4 border-b-2 border-white/20 flex justify-between items-start">
                                <div>
                                    <span className="bg-white text-black text-lg px-2 py-1 font-black uppercase">{order.zoneId}</span>
                                    <h2 className="text-6xl font-black text-white mt-2">{order.pickupCode}</h2>
                                </div>
                                <div className="text-right">
                                    <span className={`text-4xl font-mono font-bold ${isCritical && !isReady ? 'text-red-500' : 'text-white'}`}>{elapsed}m</span>
                                </div>
                            </div>

                            <div className="p-4 flex-1 space-y-4">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex gap-4 text-2xl font-bold items-center">
                                        <span className="bg-zinc-800 text-white w-10 h-10 flex items-center justify-center rounded">{item.quantity}</span>
                                        <span className="text-white">{item.name}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="p-2">
                                {isReady ? (
                                    <button
                                        onClick={() => completePickupOrder(order.id)}
                                        className="w-full py-6 text-3xl font-black uppercase bg-emerald-500 text-black hover:bg-emerald-400"
                                    >
                                        DELIVERED
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => markOrderReady(order.id)}
                                        className="w-full py-6 text-3xl font-black uppercase bg-blue-600 text-white hover:bg-blue-500"
                                    >
                                        READY
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StaffDashboard;
