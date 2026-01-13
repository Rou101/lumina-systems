'use client';
import { motion } from 'framer-motion';
import { QrCode, RefreshCw, CreditCard, ShieldCheck } from 'lucide-react';
import { GlassCard, GlassSection, SectionHeader } from './GlassUI';

export default function Mechanics({ dict }: { dict: any }) {
    const steps = [
        { icon: QrCode, ...dict.mechanics.steps[0] },
        { icon: RefreshCw, ...dict.mechanics.steps[1] },
        { icon: CreditCard, ...dict.mechanics.steps[2] }
    ];

    return (
        <GlassSection id="mechanics">
            <SectionHeader
                title={dict.mechanics.title}
                subtitle={dict.mechanics.subtitle}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lumina-border to-transparent z-0" />

                {steps.map((step: any, idx: number) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.2 }}
                        className="relative z-10"
                    >
                        <GlassCard className="h-full p-8 group hover:bg-white/5 transition-all border-lumina-border/50">
                            {/* Step Number */}
                            <div className="absolute top-4 right-4 text-[10px] font-mono text-lumina-text-muted opacity-50">
                                0{idx + 1} // {step.status}
                            </div>

                            {/* Icon */}
                            <div className="mb-8 relative">
                                <div className="w-16 h-16 bg-lumina-panel border border-lumina-border rounded-sm flex items-center justify-center group-hover:border-lumina-cyan transition-colors">
                                    <step.icon className="w-8 h-8 text-lumina-cyan" strokeWidth={1.5} />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-lumina-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tight">
                                {step.title}
                            </h3>
                            <p className="text-sm text-lumina-text-muted leading-relaxed font-mono">
                                {step.desc}
                            </p>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            {/* Security Badge */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="mt-24 flex justify-center"
            >
                <div className="inline-flex items-center gap-4 px-6 py-3 bg-lumina-panel/50 border border-lumina-border/50 rounded-sm">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                        <span className="text-xs font-bold text-lumina-text-primary tracking-wider uppercase">
                            {dict.mechanics.security.label}
                        </span>
                        <div className="hidden md:block w-px h-4 bg-lumina-border" />
                        <span className="text-[10px] font-mono text-lumina-text-muted">
                            {dict.mechanics.security.compliance}
                        </span>
                    </div>
                </div>
            </motion.div>
        </GlassSection>
    );
}
