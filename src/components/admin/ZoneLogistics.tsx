import React, { useState } from 'react';
import { GlassCard, GlassButton } from '../../components/GlassUI';
import { PickupZone, EventConfig } from '../../types';
import { updateEventConfig } from '../../services/dataService';
import { useTranslation } from 'react-i18next';

interface ZoneLogisticsProps {
    zones: PickupZone[];
    config: EventConfig;
}

export const ZoneLogistics: React.FC<ZoneLogisticsProps> = ({ zones, config }) => {
    const { t } = useTranslation();
    const [newZone, setNewZone] = useState<Partial<PickupZone>>({ name: '', code: '' });

    const handleAddZone = () => {
        if (!newZone.name || !newZone.code) return;
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
        if (confirm(t('zone_confirm_delete'))) {
            updateEventConfig({ ...config, pickupZones: config.pickupZones.filter(z => z.id !== id) });
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-end border-b border-lumina-border pb-4">
                <div>
                    <h2 className="text-xl font-bold uppercase text-lumina-text-primary">{t('zone_title')}</h2>
                    <p className="text-xs text-lumina-text-secondary font-mono">{t('zone_subtitle')}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    {zones.map(zone => (
                        <GlassCard key={zone.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-lumina-cyan/10 border border-lumina-cyan/30 flex items-center justify-center font-black text-lumina-cyan text-xl rounded-sm">
                                    {zone.code}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg uppercase text-white">{zone.name}</h3>
                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 border border-emerald-500/30 rounded-sm uppercase font-bold">{t('zone_active_node')}</span>
                                </div>
                            </div>
                            <button onClick={() => removeZone(zone.id)} className="text-lumina-text-muted hover:text-red-500 text-xl font-bold px-4">×</button>
                        </GlassCard>
                    ))}
                </div>

                <GlassCard className="p-8 h-fit">
                    <h3 className="text-lg font-bold uppercase mb-6 text-lumina-text-primary">{t('zone_deploy_new')}</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] uppercase font-bold text-lumina-text-secondary mb-1 block">{t('zone_label_name')}</label>
                            <input
                                placeholder={t('zone_ph_name')}
                                value={newZone.name}
                                onChange={e => setNewZone({ ...newZone, name: e.target.value })}
                                className="w-full bg-lumina-base border border-lumina-border p-3 text-sm text-white uppercase outline-none focus:border-lumina-cyan"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase font-bold text-lumina-text-secondary mb-1 block">{t('zone_label_code')}</label>
                            <input
                                placeholder={t('zone_ph_code')}
                                maxLength={3}
                                value={newZone.code}
                                onChange={e => setNewZone({ ...newZone, code: e.target.value })}
                                className="w-full bg-lumina-base border border-lumina-border p-3 text-sm text-white uppercase outline-none focus:border-lumina-cyan font-mono tracking-widest"
                            />
                        </div>
                        <GlassButton onClick={handleAddZone} className="w-full py-4 mt-4">{t('zone_btn_activate')}</GlassButton>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
