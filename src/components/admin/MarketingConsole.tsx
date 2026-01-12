import React, { useState } from 'react';
import { GlassCard, GlassButton } from '../../components/GlassUI';
import { useTranslation } from 'react-i18next';
import { Promotion, Product } from '../../types';
import { addPromotion, activateTrigger } from '../../services/dataService'; // Direct data service usage for actions

interface MarketingConsoleProps {
    promotions: Promotion[];
    products: Product[];
    now: number;
}

export const MarketingConsole: React.FC<MarketingConsoleProps> = ({ promotions, products, now }) => {
    const { t } = useTranslation();
    const hypeTriggers = promotions.filter(p => !!p.triggerLabel);

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
        if (!newTrigger.triggerLabel || !newTrigger.title) return;
        const trigger: Promotion = {
            id: `trigger_${Date.now()}`,
            title: newTrigger.title!,
            description: `Evento: ${newTrigger.triggerLabel}`,
            discountPercent: newTrigger.discountPercent || 20,
            triggerLabel: newTrigger.triggerLabel!,
            durationMinutes: newTrigger.durationMinutes || 5,
            active: false,
            startsAt: 0,
            type: 'flash',
            imageUrl: newTrigger.imageUrl || undefined,
            applicableProductIds: products.length > 0 ? [products[0].id] : [] // Auto-apply to first product for MVP
        };
        addPromotion(trigger); // Calling the service directly as per original code logic
        setNewTrigger({ title: '', triggerLabel: '', discountPercent: 50, durationMinutes: 5, imageUrl: '' });
    };

    const handleActivateTrigger = (promo: Promotion) => {
        if (confirm(t('marketing_confirm_msg', { label: promo.triggerLabel }))) {
            activateTrigger(promo.id);
        }
    };

    const getTimeString = (promo: Promotion) => {
        if (promo.type === 'flash' && promo.endsAt) {
            const diff = Math.max(0, promo.endsAt - now);
            if (diff === 0) return t('marketing_expired');
            return `${Math.floor(diff / 60000)}:${Math.floor((diff % 60000) / 1000).toString().padStart(2, '0')}`;
        }
        return '∞';
    };

    return (
        <div className="space-y-12">
            {/* 1. HYPE TRIGGERS LIST (BIG BUTTONS) */}
            <section>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <h2 className="text-xl font-black uppercase text-lumina-text-primary tracking-tight">{t('marketing_title')}</h2>
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
                                        {isLive ? t('marketing_in_progress') : t('marketing_ready')}
                                    </div>
                                    <h3 className={`text-2xl font-black uppercase leading-none ${isLive ? 'text-black' : 'text-white'}`}>
                                        {trigger.triggerLabel}
                                    </h3>
                                </div>

                                <div className={`relative z-20 font-mono text-xs font-bold uppercase flex justify-between ${isLive ? 'text-black/70' : 'text-red-500'}`}>
                                    <span>{isLive ? t('marketing_time_left') : t('marketing_duration')}</span>
                                    <span>{isLive ? getTimeString(trigger) : `${trigger.durationMinutes} MIN`}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* 2. TRIGGER CREATOR */}
                <GlassCard className="p-6 border-t-2 border-lumina-cyan">
                    <h3 className="text-sm font-bold uppercase mb-4 text-lumina-cyan">{t('marketing_create_title')}</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="md:col-span-2 grid grid-cols-2 gap-2">
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-lumina-text-secondary uppercase mb-1 block">{t('marketing_label')}</label>
                                <input
                                    className="w-full bg-lumina-base border border-lumina-border p-3 text-lumina-text-primary font-black uppercase text-lg outline-none focus:border-lumina-cyan"
                                    placeholder={t('marketing_placeholder_label')}
                                    value={newTrigger.triggerLabel}
                                    onChange={e => setNewTrigger({ ...newTrigger, triggerLabel: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-lumina-text-secondary uppercase mb-1 block">{t('marketing_manual_off')}</label>
                                <input
                                    type="number"
                                    className="w-full bg-lumina-base border border-emerald-900 border-2 p-3 text-emerald-400 font-mono font-bold text-lg outline-none focus:border-emerald-500"
                                    placeholder="50"
                                    value={newTrigger.discountPercent}
                                    onChange={e => setNewTrigger({ ...newTrigger, discountPercent: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-lumina-text-secondary uppercase mb-1 block">{t('marketing_desc')}</label>
                            <input
                                className="w-full bg-lumina-base border border-lumina-border p-3 text-lumina-text-primary font-mono text-sm outline-none"
                                placeholder={t('marketing_placeholder_desc')}
                                value={newTrigger.title}
                                onChange={e => setNewTrigger({ ...newTrigger, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-lumina-text-secondary uppercase mb-1 block">{t('marketing_image')}</label>
                            <input
                                className="w-full bg-lumina-base border border-lumina-border p-3 text-lumina-text-primary font-mono text-sm outline-none"
                                placeholder="https://..."
                                value={newTrigger.imageUrl}
                                onChange={e => setNewTrigger({ ...newTrigger, imageUrl: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4 mt-4">
                        <div>
                            <label className="text-[10px] font-bold text-lumina-text-secondary uppercase mb-1 block">{t('marketing_duration_min')}</label>
                            <input
                                type="number"
                                className="w-full bg-lumina-base border border-lumina-border p-3 text-lumina-text-primary font-mono text-sm outline-none"
                                value={newTrigger.durationMinutes}
                                onChange={e => setNewTrigger({ ...newTrigger, durationMinutes: parseInt(e.target.value) })}
                            />
                        </div>
                        {/* REMOVED DUPLICATE DISCOUNT INPUT */}
                        <div className="md:col-span-2 flex items-end">
                            <GlassButton onClick={handleCreateTrigger} className="w-full">
                                {t('marketing_btn_add')}
                            </GlassButton>
                        </div>
                    </div>
                </GlassCard>
            </section>
        </div>
    );
};
