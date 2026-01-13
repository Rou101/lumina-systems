'use client';
import { motion } from 'framer-motion';
import { Zap, Shield, Globe, Clock } from 'lucide-react';
import { GlassCard } from './GlassUI';

const icons = {
    zap: <Zap className="w-8 h-8 text-yellow-400" />,
    shield: <Shield className="w-8 h-8 text-emerald-400" />,
    globe: <Globe className="w-8 h-8 text-lumina-cyan" />,
    clock: <Clock className="w-8 h-8 text-lumina-violet" />
};

export default function Features({ dict }: { dict: any }) {
    return (
        <section className="py-24 relative z-10" id="features">
            <div className="max-w-7xl mx-auto px-4">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
                >
                    {dict.features.title}
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {dict.features.items.map((feature: any, idx: number) => {
                        const Icon = icons[feature.icon as keyof typeof icons] || icons.zap;

                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <GlassCard className="h-full hover:bg-white/10 transition-colors group p-6">
                                    <div className="mb-4 p-3 bg-white/5 rounded-lg w-fit group-hover:scale-110 transition-transform">
                                        {Icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
