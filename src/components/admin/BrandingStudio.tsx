import React, { useRef } from 'react';
import { GlassCard, GlassInput } from '../../components/GlassUI';
import { EventConfig } from '../../types';
import { generatePalettesFromLogo } from '../../services/themeService';
import { updateEventConfig } from '../../services/dataService';
import { useTranslation } from 'react-i18next';

interface BrandingStudioProps {
    config: EventConfig;
    formData: EventConfig;
    setFormData: (data: EventConfig) => void;
}

export const BrandingStudio: React.FC<BrandingStudioProps> = ({ config, formData, setFormData }) => {
    const { t } = useTranslation();
    const logoInputRef = useRef<HTMLInputElement>(null);

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = async (event) => {
                const result = event.target?.result as string;
                // Ideally generate palettes with ThemeService here
                const palettes = await generatePalettesFromLogo(result);
                updateEventConfig({
                    ...config,
                    logoUrl: result,
                    generatedPalettes: palettes,
                    activePalette: palettes[0]
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
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
                            <span className="text-xs font-bold uppercase text-lumina-text-secondary">{t('admin_branding_upload')}</span>
                        </>
                    )}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase text-sm text-white">{t('admin_branding_change')}</div>
                </div>
                <input ref={logoInputRef} type="file" className="hidden" onChange={handleLogoUpload} />

                <div className="mt-6 text-left">
                    <GlassInput
                        label={t('admin_branding_event_name')}
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
            </GlassCard>

            <div className="md:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-lumina-text-primary uppercase">{t('admin_branding_palettes')}</h3>
                    <span className="text-xs font-mono text-lumina-text-secondary">{t('admin_branding_select_mode')}</span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {(formData.generatedPalettes || []).map(palette => (
                        <div
                            key={palette.id}
                            onClick={() => updateEventConfig({ ...config, activePalette: palette })}
                            className={`
                                     cursor-pointer p-4 rounded-sm border-2 transition-all relative overflow-hidden group
                                     ${config?.activePalette?.id === palette.id ? 'border-lumina-cyan ring-2 ring-lumina-cyan/20' : 'border-lumina-border opacity-70 hover:opacity-100'}
                                 `}
                            style={{ backgroundColor: palette.background }}
                        >
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 style={{ color: palette.text }} className="font-bold uppercase tracking-tight">{palette.name}</h4>
                                    {config?.activePalette?.id === palette.id && <span className="bg-lumina-cyan text-black text-[10px] font-bold px-2 py-0.5 rounded-sm">{t('admin_branding_active')}</span>}
                                </div>

                                <div className="flex gap-2 h-12 mb-2">
                                    <div className="flex-1 rounded-sm" style={{ backgroundColor: palette.primary }}></div>
                                    <div className="flex-1 rounded-sm" style={{ backgroundColor: palette.secondary }}></div>
                                    <div className="flex-1 rounded-sm border border-black/10" style={{ backgroundColor: palette.cardBg }}></div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-mono uppercase font-bold" style={{ color: palette.text, opacity: 0.6 }}>
                                        {palette.mode === 'light' ? `☀ ${t('admin_branding_day')}` : `☾ ${t('admin_branding_night')}`}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
