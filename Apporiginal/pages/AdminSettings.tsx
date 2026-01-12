
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useRealTimeData, updateEventConfig, addPromotion, togglePromotion, activateTrigger, importProducts, updateProductStock, transferStock, toggleProductAvailability, downloadCSVTemplate, importCustomers, downloadCustomersCSVTemplate, downloadFilteredCustomersCSV } from '../services/dataService';
import { generatePalettesFromLogo } from '../services/themeService';
import { EventConfig, StaffMember, BrandPalette, Product, ProductStation, Promotion, Customer, PickupZone, StaffRole } from '../types';
import { GlassCard, GlassButton } from '../components/GlassUI';

// Cyber Chart
const WallStreetChart: React.FC<{ data: number[], color: string }> = ({ data, color }) => {
    const max = Math.max(...data, 1);
    const min = Math.min(...data);
    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((val - min) / (max - min)) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="w-full h-12 relative border-b border-lumina-border/50 bg-lumina-panel/50">
             {/* Grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_19%,rgba(100,100,100,0.05)_20%)] bg-[size:20%_100%]"></div>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                <polygon points={`0,100 ${points} 100,100`} fill={color} fillOpacity="0.1" />
            </svg>
        </div>
    );
};

const AdminSettings: React.FC = () => {
  const { config, products, orders } = useRealTimeData();
  const [activeTab, setActiveTab] = useState<'live' | 'branding' | 'inventory' | 'marketing' | 'crew' | 'logistics' | 'crm'>('live');
  const [formData, setFormData] = useState<EventConfig>(config);
  
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
      const interval = setInterval(() => setNow(Date.now()), 1000);
      return () => clearInterval(interval);
  }, []);

  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const [crmSearch, setCrmSearch] = useState('');

  // --- ACTIONS ---
  const saveConfig = () => {
    updateEventConfig(formData);
    alert("SYSTEM SYNC COMPLETE");
  };

  const toggleTheme = () => {
      document.body.classList.toggle('light-mode');
  };

  const handleStockChange = (id: string, val: string) => {
      const num = parseInt(val);
      if(!isNaN(num)) updateProductStock(id, num);
  };

  // --- STAFF LOGIC ---
  const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({ name: '', role: 'runner', pin: '' });
  const handleAddStaff = () => {
      if(!newStaff.name || !newStaff.pin) return;
      const member: StaffMember = {
          id: Math.random().toString(36).substr(2, 9),
          name: newStaff.name!,
          role: newStaff.role as StaffRole,
          pin: newStaff.pin!,
          assignedZoneIds: config.pickupZones.map(z => z.id) // Default to all zones
      };
      updateEventConfig({ ...config, staff: [...config.staff, member] });
      setNewStaff({ name: '', role: 'runner', pin: '' });
  };
  const removeStaff = (id: string) => {
      if(confirm('Confirm discharge of staff member?')) {
          updateEventConfig({ ...config, staff: config.staff.filter(s => s.id !== id) });
      }
  };

  // --- ZONES LOGIC ---
  const [newZone, setNewZone] = useState<Partial<PickupZone>>({ name: '', code: '' });
  const handleAddZone = () => {
      if(!newZone.name || !newZone.code) return;
      const zone: PickupZone = {
          id: Math.random().toString(36).substr(2, 9),
          name: newZone.name!,
          code: newZone.code!.toUpperCase(),
          isActive: true
      };
      updateEventConfig({ ...config, pickupZones: [...config.pickupZones, zone] });
      setNewZone({ name: '', code: '' });
  };
  const removeZone = (id: string) => {
      if(confirm('Delete Zone? This may affect active orders.')) {
          updateEventConfig({ ...config, pickupZones: config.pickupZones.filter(z => z.id !== id) });
      }
  };

  // --- METRICS ---
  const metrics = useMemo(() => {
      const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
      const totalRevenue = paidOrders.reduce((acc, o) => acc + o.total, 0);
      let totalCost = 0;
      paidOrders.forEach(o => {
         o.items.forEach(i => {
             const original = products.find(p => p.id === i.id);
             if(original) totalCost += (original.cost * i.quantity);
         });
      });
      const margin = totalRevenue - totalCost;
      const marginPercent = totalRevenue > 0 ? (margin / totalRevenue) * 100 : 0;
      const salesTrend = [120, 150, 180, 130, 200, 250, 300, 280, 400, 450];
      const marginTrend = [30, 32, 31, 35, 34, 38, 40, 42, 45, 44]; 

      return { totalRevenue, totalCost, margin, marginPercent, totalOrders: orders.length, salesTrend, marginTrend };
  }, [orders, products]);


  // Handlers needed for render:
  // HYPE TRIGGER CREATION STATE
  const [newTrigger, setNewTrigger] = useState<Partial<Promotion>>({ 
      title: '', 
      triggerLabel: '', 
      discountPercent: 50, 
      durationMinutes: 5, 
      imageUrl: '', 
      active: false,
      type: 'flash'
  });

  const handleCreateTrigger = () => {
      if(!newTrigger.triggerLabel || !newTrigger.title) return;
      const trigger: Promotion = {
          id: `trigger_${Date.now()}`,
          title: newTrigger.title,
          description: `Evento: ${newTrigger.triggerLabel}`,
          discountPercent: newTrigger.discountPercent || 20,
          triggerLabel: newTrigger.triggerLabel,
          durationMinutes: newTrigger.durationMinutes || 5,
          active: false,
          startsAt: 0,
          type: 'flash',
          imageUrl: newTrigger.imageUrl || undefined,
          applicableProductIds: products.length > 0 ? [products[0].id] : [] // Auto-apply to first product for MVP
      };
      addPromotion(trigger);
      setNewTrigger({ title: '', triggerLabel: '', discountPercent: 50, durationMinutes: 5, imageUrl: '' });
  };

  const filteredCustomers = config.customers.filter(c => c.name.toLowerCase().includes(crmSearch.toLowerCase())); 

  // Marketing Logic
  const hypeTriggers = config.activePromotions.filter(p => !!p.triggerLabel);
  const regularPromos = config.activePromotions.filter(p => !p.triggerLabel);

  const getTimeString = (promo: Promotion) => {
      if (promo.type === 'flash' && promo.endsAt) {
          const diff = Math.max(0, promo.endsAt - now);
          if (diff === 0) return 'EXPIRED';
          return `${Math.floor(diff / 60000)}:${Math.floor((diff % 60000) / 1000).toString().padStart(2, '0')}`;
      }
      return '∞';
  };

  const handleActivateTrigger = (promo: Promotion) => {
      if (confirm(`⚠ ACTIVAR EVENTO: ${promo.triggerLabel}?\n\nEsto enviará la promoción a todos los usuarios activos ahora mismo.`)) {
          activateTrigger(promo.id);
      }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = async (event) => {
              const result = event.target?.result as string;
              const palettes = await generatePalettesFromLogo(result);
              setFormData(prev => ({ 
                  ...prev, 
                  logoUrl: result,
                  generatedPalettes: palettes,
                  activePalette: palettes[0] 
              }));
          };
          reader.readAsDataURL(file);
      }
  };

  return (
    <div className="min-h-screen bg-lumina-base p-4 md:p-8 pb-32 font-sans text-lumina-text-primary selection:bg-lumina-cyan selection:text-black">
      
      {/* HEADER */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-lumina-border pb-6">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-lumina-cyan rounded-sm flex items-center justify-center font-black text-xl text-black">L</div>
            <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase text-lumina-text-primary">Lumina<span className="text-lumina-cyan">.OS</span></h1>
                <p className="text-lumina-text-secondary text-[10px] font-mono tracking-widest uppercase">Admin Terminal v2.3</p>
            </div>
        </div>
        <div className="flex gap-4 items-center">
             <button onClick={toggleTheme} className="text-xs font-bold uppercase border border-lumina-border px-3 py-2 rounded-sm hover:bg-lumina-panel text-lumina-text-secondary">
                 ☀/☾ Theme
             </button>
             {/* LINK TO CLIENT APP SIMULATOR */}
             <GlassButton onClick={() => window.open('#/event/GEN', '_blank')} variant="secondary" className="px-4 py-3 font-bold text-xs">
                 LAUNCH CLIENT APP ↗
             </GlassButton>

             <GlassButton onClick={saveConfig} variant="success" className="px-6 py-3 font-bold border border-emerald-500/50 hover:bg-emerald-500/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                 SYNC_SYSTEM
             </GlassButton>
        </div>
      </header>

      {/* TABS */}
      <div className="max-w-7xl mx-auto mb-8 border-b border-lumina-border">
          <div className="flex gap-1 overflow-x-auto pb-0">
            {[
                { id: 'live', label: 'Live Ops' },
                { id: 'marketing', label: 'Hype / Marketing' }, // Renamed
                { id: 'inventory', label: 'Inventory' },
                { id: 'crew', label: 'Staff' },
                { id: 'logistics', label: 'Zones' },
                { id: 'branding', label: 'Visuals' },
                { id: 'crm', label: 'CRM / Data' },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                        px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-all border-t-2
                        ${activeTab === tab.id ? 'border-lumina-cyan text-lumina-cyan bg-lumina-cyan/5' : 'border-transparent text-lumina-text-muted hover:text-lumina-text-primary'}
                    `}
                >
                    {tab.label}
                </button>
            ))}
          </div>
      </div>

      <main className="max-w-7xl mx-auto animate-fade-in-up">
        
        {/* --- LIVE OPS --- */}
        {activeTab === 'live' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <GlassCard className="p-0">
                    <div className="p-4">
                        <p className="text-lumina-text-secondary text-[10px] font-mono uppercase tracking-widest mb-2">Total Revenue</p>
                        <h3 className="text-3xl font-black text-lumina-text-primary tracking-tighter">${metrics.totalRevenue.toLocaleString()}</h3>
                    </div>
                    <WallStreetChart data={metrics.salesTrend} color="#00F0FF" />
                </GlassCard>
                
                <GlassCard className="p-0">
                    <div className="p-4">
                         <p className="text-lumina-text-secondary text-[10px] font-mono uppercase tracking-widest mb-2">Net Margin</p>
                         <h3 className="text-3xl font-black text-yellow-500 tracking-tighter">{metrics.marginPercent.toFixed(1)}%</h3>
                    </div>
                    <WallStreetChart data={metrics.marginTrend} color="#EAB308" />
                </GlassCard>

                <GlassCard className="p-4 border-l-2 border-lumina-violet">
                     <p className="text-lumina-text-secondary text-[10px] font-mono uppercase tracking-widest mb-2">Orders Processed</p>
                     <h3 className="text-3xl font-black text-lumina-text-primary tracking-tighter">{metrics.totalOrders}</h3>
                     <span className="text-[10px] text-emerald-500 font-mono mt-1 block">● SYSTEM OPTIMAL</span>
                </GlassCard>
            </div>
        )}

        {/* --- MARKETING (HYPE TRIGGERS) --- */}
        {activeTab === 'marketing' && (
            <div className="space-y-12">
                
                {/* 1. HYPE TRIGGERS LIST (BIG BUTTONS) */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <h2 className="text-xl font-black uppercase text-lumina-text-primary tracking-tight">Hype Triggers (Live Events)</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {hypeTriggers.map(trigger => {
                            const isLive = trigger.active && trigger.endsAt && trigger.endsAt > now;
                            return (
                                <button
                                    key={trigger.id}
                                    onClick={() => handleActivateTrigger(trigger)}
                                    disabled={isLive as boolean}
                                    className={`
                                        relative group overflow-hidden rounded-sm p-6 text-left border-2 transition-all h-32 flex flex-col justify-between
                                        ${isLive 
                                            ? 'bg-red-500 border-red-500 text-black cursor-not-allowed' 
                                            : 'bg-lumina-panel border-lumina-border hover:border-red-500 hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]'
                                        }
                                    `}
                                >
                                    {trigger.imageUrl && (
                                        <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity">
                                            <img src={trigger.imageUrl} className="w-full h-full object-cover grayscale" />
                                        </div>
                                    )}
                                    {/* Stripes */}
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.1)_25%,rgba(0,0,0,0.1)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.1)_75%,rgba(0,0,0,0.1)_100%)] bg-[size:10px_10px] opacity-20 pointer-events-none z-10"></div>
                                    
                                    <div className="relative z-20">
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">
                                            {isLive ? 'EVENT IN PROGRESS' : 'READY TO TRIGGER'}
                                        </div>
                                        <h3 className={`text-2xl font-black uppercase leading-none ${isLive ? 'text-black' : 'text-white'}`}>
                                            {trigger.triggerLabel}
                                        </h3>
                                    </div>

                                    <div className={`relative z-20 font-mono text-xs font-bold uppercase flex justify-between ${isLive ? 'text-black/70' : 'text-red-500'}`}>
                                        <span>{isLive ? 'TIME LEFT:' : 'DURATION:'}</span>
                                        <span>{isLive ? getTimeString(trigger) : `${trigger.durationMinutes} MIN`}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* 2. TRIGGER CREATOR */}
                    <GlassCard className="p-6 border-t-2 border-lumina-cyan">
                        <h3 className="text-sm font-bold uppercase mb-4 text-lumina-cyan">Create New Trigger</h3>
                        <div className="grid md:grid-cols-4 gap-4">
                             <div className="md:col-span-2">
                                <label className="text-[10px] font-bold text-lumina-text-secondary uppercase mb-1 block">Trigger Label (e.g. GOL)</label>
                                <input 
                                    className="w-full bg-lumina-base border border-lumina-border p-3 text-lumina-text-primary font-black uppercase text-lg outline-none focus:border-lumina-cyan" 
                                    placeholder="GOL COLO-COLO"
                                    value={newTrigger.triggerLabel} 
                                    onChange={e => setNewTrigger({...newTrigger, triggerLabel: e.target.value})}
                                />
                             </div>
                             <div>
                                <label className="text-[10px] font-bold text-lumina-text-secondary uppercase mb-1 block">Description</label>
                                <input 
                                    className="w-full bg-lumina-base border border-lumina-border p-3 text-lumina-text-primary font-mono text-sm outline-none" 
                                    placeholder="50% Off Beers"
                                    value={newTrigger.title} 
                                    onChange={e => setNewTrigger({...newTrigger, title: e.target.value})}
                                />
                             </div>
                             <div>
                                <label className="text-[10px] font-bold text-lumina-text-secondary uppercase mb-1 block">Image URL / Link</label>
                                <input 
                                    className="w-full bg-lumina-base border border-lumina-border p-3 text-lumina-text-primary font-mono text-sm outline-none" 
                                    placeholder="https://..."
                                    value={newTrigger.imageUrl} 
                                    onChange={e => setNewTrigger({...newTrigger, imageUrl: e.target.value})}
                                />
                             </div>
                        </div>
                        <div className="grid md:grid-cols-4 gap-4 mt-4">
                             <div>
                                <label className="text-[10px] font-bold text-lumina-text-secondary uppercase mb-1 block">Duration (Min)</label>
                                <input 
                                    type="number"
                                    className="w-full bg-lumina-base border border-lumina-border p-3 text-lumina-text-primary font-mono text-sm outline-none" 
                                    value={newTrigger.durationMinutes} 
                                    onChange={e => setNewTrigger({...newTrigger, durationMinutes: parseInt(e.target.value)})}
                                />
                             </div>
                             <div>
                                <label className="text-[10px] font-bold text-lumina-text-secondary uppercase mb-1 block">Discount (%)</label>
                                <input 
                                    type="number"
                                    className="w-full bg-lumina-base border border-lumina-border p-3 text-lumina-text-primary font-mono text-sm outline-none" 
                                    value={newTrigger.discountPercent} 
                                    onChange={e => setNewTrigger({...newTrigger, discountPercent: parseInt(e.target.value)})}
                                />
                             </div>
                             <div className="md:col-span-2 flex items-end">
                                 <GlassButton onClick={handleCreateTrigger} className="w-full">
                                     + ADD HYPE TRIGGER
                                 </GlassButton>
                             </div>
                        </div>
                    </GlassCard>
                </section>
            </div>
        )}

        {/* --- BRANDING (LIGHT MODE TOGGLE) --- */}
        {activeTab === 'branding' && (
            <div className="grid md:grid-cols-3 gap-8">
                <GlassCard className="p-8 md:col-span-1 text-center">
                    <div 
                        onClick={() => logoInputRef.current?.click()}
                        className="aspect-square rounded-sm bg-lumina-panel border-2 border-dashed border-lumina-border flex flex-col items-center justify-center cursor-pointer hover:border-lumina-cyan transition-all group relative overflow-hidden"
                    >
                         {formData.logoUrl ? (
                            <img src={formData.logoUrl} className="w-full h-full object-cover" />
                         ) : (
                             <>
                                <span className="text-4xl mb-2 text-lumina-text-secondary">📸</span>
                                <span className="text-xs font-bold uppercase text-lumina-text-secondary">Upload Logo</span>
                             </>
                         )}
                         <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase text-sm text-white">Change</div>
                    </div>
                    <input ref={logoInputRef} type="file" className="hidden" onChange={handleLogoUpload} />
                    
                    <div className="mt-6 text-left">
                        <label className="text-xs font-bold text-lumina-text-secondary uppercase">Event Name</label>
                        <input 
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-transparent border-b border-lumina-border py-2 text-xl font-bold focus:border-lumina-text-primary outline-none text-lumina-text-primary"
                        />
                    </div>
                </GlassCard>

                <div className="md:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-lumina-text-primary uppercase">System Palettes (AI Generated)</h3>
                        <span className="text-xs font-mono text-lumina-text-secondary">SELECT TO ACTIVATE MODE</span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        {formData.generatedPalettes.map(palette => (
                            <div 
                                key={palette.id}
                                onClick={() => setFormData({...formData, activePalette: palette})}
                                className={`
                                    cursor-pointer p-4 rounded-sm border-2 transition-all relative overflow-hidden group
                                    ${formData.activePalette.id === palette.id ? 'border-lumina-cyan ring-2 ring-lumina-cyan/20' : 'border-lumina-border opacity-70 hover:opacity-100'}
                                `}
                                style={{ backgroundColor: palette.background }}
                            >
                                <div className="relative z-10">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 style={{ color: palette.text }} className="font-bold uppercase tracking-tight">{palette.name}</h4>
                                        {formData.activePalette.id === palette.id && <span className="bg-lumina-cyan text-black text-[10px] font-bold px-2 py-0.5 rounded-sm">ACTIVE</span>}
                                    </div>
                                    
                                    <div className="flex gap-2 h-12 mb-2">
                                        <div className="flex-1 rounded-sm" style={{ backgroundColor: palette.primary }}></div>
                                        <div className="flex-1 rounded-sm" style={{ backgroundColor: palette.secondary }}></div>
                                        <div className="flex-1 rounded-sm border border-black/10" style={{ backgroundColor: palette.cardBg }}></div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                         <span className="text-[10px] font-mono uppercase font-bold" style={{ color: palette.text, opacity: 0.6 }}>
                                             {palette.mode === 'light' ? '☀ DAYLIGHT OPS' : '☾ NIGHT OPS'}
                                         </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {/* --- CRM --- */}
        {activeTab === 'crm' && (
            <div className="space-y-6">
                 <div className="flex justify-between items-end border-b border-lumina-border pb-4">
                    <div>
                        <h2 className="text-xl font-bold uppercase text-lumina-text-primary">User Database</h2>
                        <p className="text-xs text-lumina-text-secondary font-mono">SEGMENTATION & EXPORT</p>
                    </div>
                    <div className="flex gap-2">
                        <GlassButton onClick={downloadCustomersCSVTemplate} variant="secondary" className="h-8 py-0 text-[10px]">CSV Template</GlassButton>
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                    <input 
                        placeholder="SEARCH_QUERY..." 
                        value={crmSearch}
                        onChange={(e) => setCrmSearch(e.target.value)}
                        className="md:col-span-3 bg-lumina-panel border border-lumina-border p-3 text-lumina-text-primary font-mono text-sm focus:border-lumina-cyan outline-none rounded-sm uppercase"
                    />
                    <GlassButton onClick={() => {}} className="w-full">FILTER DATA</GlassButton>
                </div>

                <div className="border border-lumina-border bg-lumina-panel rounded-sm overflow-hidden">
                    <table className="w-full text-left font-mono text-xs">
                        <thead className="bg-lumina-border/30 text-lumina-text-secondary">
                            <tr>
                                <th className="p-3 uppercase tracking-wider">Name</th>
                                <th className="p-3 uppercase tracking-wider">Segment</th>
                                <th className="p-3 uppercase tracking-wider">Group ID</th>
                                <th className="p-3 uppercase tracking-wider text-right">LTV</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-lumina-border/30">
                            {filteredCustomers.map(c => (
                                <tr key={c.id} className="hover:bg-lumina-cyan/5 text-lumina-text-primary">
                                    <td className="p-3 font-bold">{c.name}</td>
                                    <td className="p-3"><span className="text-lumina-cyan bg-lumina-cyan/10 px-1 border border-lumina-cyan/20">{c.segment}</span></td>
                                    <td className="p-3 text-yellow-500">{c.externalGroupId || 'N/A'}</td>
                                    <td className="p-3 text-right">${c.totalSpent}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* --- INVENTORY MODULE --- */}
         {activeTab === 'inventory' && (
             <div className="space-y-8 animate-fade-in-up">
                 <div className="flex justify-between items-end border-b border-lumina-border pb-4">
                     <div>
                         <h2 className="text-xl font-bold uppercase text-lumina-text-primary">Stock Control</h2>
                         <p className="text-xs text-lumina-text-secondary font-mono">LIVE UPDATE PROTOCOL</p>
                     </div>
                     <div className="flex gap-2">
                         <GlassButton onClick={downloadCSVTemplate} variant="secondary" className="px-4 py-2 text-[10px]">Download Template</GlassButton>
                         <label className="bg-lumina-cyan text-black px-4 py-2 text-[10px] font-bold uppercase cursor-pointer hover:bg-white transition-colors">
                             Import CSV
                             <input type="file" className="hidden" />
                         </label>
                     </div>
                 </div>

                 <div className="bg-lumina-panel border border-lumina-border rounded-sm overflow-hidden">
                     <table className="w-full text-left border-collapse">
                         <thead className="bg-lumina-border/20 text-lumina-text-secondary text-[10px] font-mono uppercase">
                             <tr>
                                 <th className="p-3">Product</th>
                                 <th className="p-3">Category</th>
                                 <th className="p-3">Cost</th>
                                 <th className="p-3">Price</th>
                                 <th className="p-3">Live Stock</th>
                                 <th className="p-3 text-center">Status</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-lumina-border/30 text-xs">
                             {products.map(product => (
                                 <tr key={product.id} className="group hover:bg-lumina-cyan/5">
                                     <td className="p-3 font-bold text-lumina-text-primary">{product.name}</td>
                                     <td className="p-3 text-lumina-text-secondary">{product.category}</td>
                                     <td className="p-3 text-lumina-text-muted font-mono">${product.cost}</td>
                                     <td className="p-3 text-lumina-cyan font-mono font-bold">${product.price}</td>
                                     <td className="p-3">
                                         <input 
                                             type="number"
                                             defaultValue={product.stock}
                                             onBlur={(e) => handleStockChange(product.id, e.target.value)}
                                             className="bg-black/30 border border-lumina-border w-20 px-2 py-1 text-center font-bold text-white focus:border-lumina-cyan outline-none"
                                         />
                                     </td>
                                     <td className="p-3 text-center">
                                         <button 
                                             onClick={() => toggleProductAvailability(product.id)}
                                             className={`
                                                 px-3 py-1 text-[9px] uppercase font-bold border rounded-sm transition-all
                                                 ${product.isAvailable ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10' : 'border-red-500/50 text-red-500 bg-red-500/10'}
                                             `}
                                         >
                                             {product.isAvailable ? 'ACTIVE' : 'OFFLINE'}
                                         </button>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             </div>
         )}

         {/* --- CREW MODULE --- */}
         {activeTab === 'crew' && (
             <div className="space-y-8 animate-fade-in-up">
                 <div className="flex justify-between items-end border-b border-lumina-border pb-4">
                     <div>
                         <h2 className="text-xl font-bold uppercase text-lumina-text-primary">Staff Roster</h2>
                         <p className="text-xs text-lumina-text-secondary font-mono">ACCESS CONTROL & ROLES</p>
                     </div>
                 </div>

                 <div className="grid md:grid-cols-3 gap-6">
                     {/* ADD STAFF CARD */}
                     <GlassCard className="p-6 border-dashed border-lumina-border bg-transparent">
                         <h3 className="text-sm font-bold uppercase mb-4 text-lumina-cyan">New Recruit</h3>
                         <div className="space-y-3">
                             <input 
                                 placeholder="FULL NAME" 
                                 value={newStaff.name}
                                 onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                                 className="w-full bg-lumina-base border border-lumina-border p-2 text-xs text-white uppercase outline-none focus:border-lumina-cyan"
                             />
                             <select 
                                 value={newStaff.role}
                                 onChange={e => setNewStaff({...newStaff, role: e.target.value as StaffRole})}
                                 className="w-full bg-lumina-base border border-lumina-border p-2 text-xs text-white uppercase outline-none focus:border-lumina-cyan"
                             >
                                 <option value="runner">Runner</option>
                                 <option value="manager">Manager</option>
                                 <option value="scanner">Scanner</option>
                                 <option value="kitchen">Kitchen</option>
                             </select>
                             <input 
                                 placeholder="ACCESS PIN (4 Digits)" 
                                 maxLength={4}
                                 value={newStaff.pin}
                                 onChange={e => setNewStaff({...newStaff, pin: e.target.value})}
                                 className="w-full bg-lumina-base border border-lumina-border p-2 text-xs text-white uppercase outline-none focus:border-lumina-cyan tracking-widest"
                             />
                             <GlassButton onClick={handleAddStaff} className="w-full py-3 mt-2">AUTHORIZE</GlassButton>
                         </div>
                     </GlassCard>

                     {/* STAFF LIST */}
                     {config.staff.map(member => (
                         <GlassCard key={member.id} className="p-6 flex flex-col justify-between group">
                             <div>
                                 <div className="flex justify-between items-start mb-2">
                                     <div className={`
                                         w-8 h-8 flex items-center justify-center text-xs font-bold rounded-sm uppercase
                                         ${member.role === 'manager' ? 'bg-lumina-fuchsia text-black' : 'bg-lumina-border text-lumina-text-secondary'}
                                     `}>
                                         {member.role.substring(0,2)}
                                     </div>
                                     <button onClick={() => removeStaff(member.id)} className="text-lumina-text-muted hover:text-red-500 text-xs uppercase opacity-0 group-hover:opacity-100 transition-opacity">Discharge</button>
                                 </div>
                                 <h3 className="text-xl font-bold uppercase text-white">{member.name}</h3>
                                 <p className="text-xs text-lumina-text-secondary font-mono">ID: {member.id}</p>
                             </div>
                             <div className="mt-6 border-t border-lumina-border pt-4 flex justify-between items-center">
                                 <span className="text-[10px] font-mono text-lumina-text-secondary uppercase">PIN CODE</span>
                                 <span className="text-lg font-mono font-bold text-lumina-cyan tracking-widest">••••</span>
                             </div>
                         </GlassCard>
                     ))}
                 </div>
             </div>
         )}

         {/* --- LOGISTICS MODULE (ZONES) --- */}
         {activeTab === 'logistics' && (
             <div className="space-y-8 animate-fade-in-up">
                 <div className="flex justify-between items-end border-b border-lumina-border pb-4">
                     <div>
                         <h2 className="text-xl font-bold uppercase text-lumina-text-primary">Zone Logistics</h2>
                         <p className="text-xs text-lumina-text-secondary font-mono">PICKUP POINTS & ROUTING</p>
                     </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                         {config.pickupZones.map(zone => (
                             <GlassCard key={zone.id} className="p-4 flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 bg-lumina-cyan/10 border border-lumina-cyan/30 flex items-center justify-center font-black text-lumina-cyan text-xl rounded-sm">
                                         {zone.code}
                                     </div>
                                     <div>
                                         <h3 className="font-bold text-lg uppercase text-white">{zone.name}</h3>
                                         <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 border border-emerald-500/30 rounded-sm uppercase font-bold">Active Node</span>
                                     </div>
                                 </div>
                                 <button onClick={() => removeZone(zone.id)} className="text-lumina-text-muted hover:text-red-500 text-xl font-bold px-4">×</button>
                             </GlassCard>
                         ))}
                     </div>

                     <GlassCard className="p-8 h-fit">
                         <h3 className="text-lg font-bold uppercase mb-6 text-lumina-text-primary">Deploy New Zone</h3>
                         <div className="space-y-4">
                             <div>
                                 <label className="text-[10px] uppercase font-bold text-lumina-text-secondary mb-1 block">Zone Name</label>
                                 <input 
                                     placeholder="e.g. VIP NORTH LOUNGE"
                                     value={newZone.name}
                                     onChange={e => setNewZone({...newZone, name: e.target.value})}
                                     className="w-full bg-lumina-base border border-lumina-border p-3 text-sm text-white uppercase outline-none focus:border-lumina-cyan"
                                 />
                             </div>
                             <div>
                                 <label className="text-[10px] uppercase font-bold text-lumina-text-secondary mb-1 block">Short Code (3 Chars)</label>
                                 <input 
                                     placeholder="e.g. VPN"
                                     maxLength={3}
                                     value={newZone.code}
                                     onChange={e => setNewZone({...newZone, code: e.target.value})}
                                     className="w-full bg-lumina-base border border-lumina-border p-3 text-sm text-white uppercase outline-none focus:border-lumina-cyan font-mono tracking-widest"
                                 />
                             </div>
                             <GlassButton onClick={handleAddZone} className="w-full py-4 mt-4">ACTIVATE ZONE</GlassButton>
                         </div>
                     </GlassCard>
                 </div>
             </div>
         )}
      </main>
    </div>
  );
};

export default AdminSettings;
