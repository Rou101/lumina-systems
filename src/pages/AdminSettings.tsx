import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';
import { useRealTimeData, updateEventConfig } from '../services/dataService';
import { EventConfig, AdminTab } from '../types';
import { GlassButton } from '../components/GlassUI';
import { useTranslation } from 'react-i18next';

// Imported Components
import { LiveOps } from '../components/admin/LiveOps';
import { MarketingConsole } from '../components/admin/MarketingConsole';
import { InventoryManager } from '../components/admin/InventoryManager';
import { StaffRoster } from '../components/admin/StaffRoster';
import { ZoneLogistics } from '../components/admin/ZoneLogistics';
import { BrandingStudio } from '../components/admin/BrandingStudio';
import { CRMTable } from '../components/admin/CRMTable';

import { ChaosEngine } from '../services/chaosEngine';

const AdminSettings: React.FC = () => {
    const { t } = useTranslation();
    const { config, products, orders } = useRealTimeData();
    const { user, logout } = useAuth(); // Added useAuth hook
    const [activeTab, setActiveTab] = useState<AdminTab>('live'); // Kept original initial state
    const [formData, setFormData] = useState<EventConfig>(config);

    // Sync form data with config updates
    useEffect(() => {
        setFormData(config);
    }, [config]);

    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    // --- ACTIONS ---
    const saveConfig = () => {
        updateEventConfig(formData); // Use formData which might have pending changes from BrandingStudio
        alert(t('system_sync_complete'));
    };

    const toggleTheme = () => {
        document.body.classList.toggle('light-mode');
    };

    return (
        <div className="min-h-screen bg-lumina-base p-4 md:p-8 pb-32 font-sans text-lumina-text-primary selection:bg-lumina-cyan selection:text-black">

            {/* HEADER */}
            <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-lumina-border pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-lumina-cyan rounded-sm flex items-center justify-center font-black text-xl text-black">L</div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter uppercase text-lumina-text-primary">{t('app_name')}</h1>
                        <p className="text-lumina-text-secondary text-[10px] font-mono tracking-widest uppercase">{t('admin_terminal')}</p>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <button onClick={toggleTheme} className="text-xs font-bold uppercase border border-lumina-border px-3 py-2 rounded-sm hover:bg-lumina-panel text-lumina-text-secondary">
                        {t('admin_theme_toggle')}
                    </button>
                    {/* LINK TO CLIENT APP SIMULATOR */}
                    <GlassButton onClick={() => window.open('#/event/GEN', '_blank')} variant="secondary" className="px-4 py-3 font-bold text-xs">
                        {t('btn_launch_client')} ↗
                    </GlassButton>

                    <GlassButton onClick={saveConfig} variant="success" className="px-6 py-3 font-bold border border-emerald-500/50 hover:bg-emerald-500/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                        {t('btn_sync')}
                    </GlassButton>
                </div>
            </header>

            {/* TABS */}
            <div className="max-w-7xl mx-auto mb-8 border-b border-lumina-border">
                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group" onClick={logout}>
                        <img src={user?.avatar} alt={user?.name} className="w-8 h-8 rounded-full border border-white/10" />
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-white truncate">{user?.name}</div>
                            <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                        </div>
                        <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-400" />
                    </div>
                </div>
                <div className="flex gap-1 overflow-x-auto pb-0">
                    {([
                        { id: 'live', label: t('nav_live') },
                        { id: 'marketing', label: t('nav_marketing') },
                        { id: 'inventory', label: t('nav_inventory') },
                        { id: 'crew', label: t('nav_staff') },
                        { id: 'logistics', label: t('nav_zones') },
                        { id: 'branding', label: t('nav_branding') },
                        { id: 'crm', label: t('nav_crm') },
                    ] as { id: AdminTab, label: string }[]).map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
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
                {activeTab === 'live' && (
                    <LiveOps
                        orders={orders}
                        products={products}
                        pickupZones={config.pickupZones}
                        now={now}
                    />
                )}

                {activeTab === 'marketing' && (
                    <MarketingConsole
                        promotions={config.activePromotions}
                        products={products}
                        now={now}
                    />
                )}

                {activeTab === 'inventory' && (
                    <InventoryManager
                        products={products}
                    />
                )}

                {activeTab === 'crew' && (
                    <StaffRoster
                        staff={config.staff}
                        config={config}
                    />
                )}

                {activeTab === 'logistics' && (
                    <ZoneLogistics
                        zones={config.pickupZones}
                        config={config}
                    />
                )}

                {activeTab === 'branding' && (
                    <BrandingStudio
                        config={config}
                        formData={formData}
                        setFormData={setFormData}
                    />
                )}

                {activeTab === 'crm' && (
                    <CRMTable
                        customers={config.customers}
                    />
                )}
            </main>
        </div>
    );
};

export default AdminSettings;
