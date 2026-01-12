import React, { useState } from 'react';
import { GlassCard, GlassButton } from '../../components/GlassUI';
import { StaffMember, EventConfig, StaffRole } from '../../types';
import { updateEventConfig } from '../../services/dataService';
import { useTranslation } from 'react-i18next';

interface StaffRosterProps {
    staff: StaffMember[];
    config: EventConfig;
}

export const StaffRoster: React.FC<StaffRosterProps> = ({ staff, config }) => {
    const { t } = useTranslation();
    const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({ name: '', role: 'runner', pin: '' });

    const handleAddStaff = () => {
        if (!newStaff.name || !newStaff.pin) return;
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
        if (confirm(t('staff_confirm_discharge'))) {
            updateEventConfig({ ...config, staff: config.staff.filter(s => s.id !== id) });
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="flex justify-between items-end border-b border-lumina-border pb-4">
                <div>
                    <h2 className="text-xl font-bold uppercase text-lumina-text-primary">{t('staff_title')}</h2>
                    <p className="text-xs text-lumina-text-secondary font-mono">{t('staff_subtitle')}</p>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* ADD STAFF CARD */}
                <GlassCard className="p-6 border-dashed border-lumina-border bg-transparent">
                    <h3 className="text-sm font-bold uppercase mb-4 text-lumina-cyan">{t('staff_new_recruit')}</h3>
                    <div className="space-y-3">
                        <input
                            placeholder={t('staff_ph_name')}
                            value={newStaff.name}
                            onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                            className="w-full bg-lumina-base border border-lumina-border p-2 text-xs text-white uppercase outline-none focus:border-lumina-cyan"
                        />
                        <select
                            value={newStaff.role}
                            onChange={e => setNewStaff({ ...newStaff, role: e.target.value as StaffRole })}
                            className="w-full bg-lumina-base border border-lumina-border p-2 text-xs text-white uppercase outline-none focus:border-lumina-cyan"
                        >
                            <option value="runner">{t('role_runner')}</option>
                            <option value="manager">{t('role_manager')}</option>
                            <option value="scanner">{t('role_scanner')}</option>
                            <option value="kitchen">{t('role_kitchen')}</option>
                        </select>
                        <input
                            placeholder={t('staff_ph_pin')}
                            maxLength={4}
                            value={newStaff.pin}
                            onChange={e => setNewStaff({ ...newStaff, pin: e.target.value })}
                            className="w-full bg-lumina-base border border-lumina-border p-2 text-xs text-white uppercase outline-none focus:border-lumina-cyan tracking-widest"
                        />
                        <GlassButton onClick={handleAddStaff} className="w-full py-3 mt-2">{t('staff_btn_authorize')}</GlassButton>
                    </div>
                </GlassCard>

                {/* STAFF LIST */}
                {staff.map(member => (
                    <GlassCard key={member.id} className="p-6 flex flex-col justify-between group">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <div className={`
                                         w-8 h-8 flex items-center justify-center text-xs font-bold rounded-sm uppercase
                                         ${member.role === 'manager' ? 'bg-lumina-fuchsia text-black' : 'bg-lumina-border text-lumina-text-secondary'}
                                     `}>
                                    {member.role.substring(0, 2)}
                                </div>
                                <button onClick={() => removeStaff(member.id)} className="text-lumina-text-muted hover:text-red-500 text-xs uppercase opacity-0 group-hover:opacity-100 transition-opacity">{t('staff_discharge')}</button>
                            </div>
                            <h3 className="text-xl font-bold uppercase text-white">{member.name}</h3>
                            <p className="text-xs text-lumina-text-secondary font-mono">{t('staff_id_prefix')} {member.id}</p>
                        </div>
                        <div className="mt-6 border-t border-lumina-border pt-4 flex justify-between items-center">
                            <span className="text-[10px] font-mono text-lumina-text-secondary uppercase">{t('staff_pin_code')}</span>
                            <span className="text-lg font-mono font-bold text-lumina-cyan tracking-widest">••••</span>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};
