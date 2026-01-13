'use client';

import { GlassCard } from './GlassUI';

export default function Performance({ dict }: { dict: any }) {
    return (
        <div className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/10 to-transparent pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-16">
                <div className="flex-1">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {dict.performance.title} <br />
                        <span className="text-lumina-cyan">{dict.performance.title_highlight}</span>
                    </h2>
                    <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                        {dict.performance.desc}
                    </p>
                    <div className="flex gap-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">{dict.performance.stats.latency.value}</div>
                            <div className="text-sm text-gray-500">{dict.performance.stats.latency.label}</div>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">{dict.performance.stats.uptime.value}</div>
                            <div className="text-sm text-gray-500">{dict.performance.stats.uptime.label}</div>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white">{dict.performance.stats.scale.value}</div>
                            <div className="text-sm text-gray-500">{dict.performance.stats.scale.label}</div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 w-full relative">
                    <GlassCard className="relative z-10 !bg-neutral-900/80 aspect-video flex items-center justify-center border-lumina-cyan/30">
                        <div className="text-lumina-cyan font-mono text-lg animate-pulse">
                            &gt; {dict.performance.terminal.ready} <br />
                            &gt; {dict.performance.terminal.input}
                        </div>

                        {/* Decorative elements */}
                        <div className="hidden md:block absolute -top-4 -right-4 w-24 h-24 bg-lumina-cyan/20 rounded-full blur-xl animate-pulse-fast" />
                        <div className="hidden md:block absolute -bottom-4 -left-4 w-32 h-32 bg-lumina-violet/20 rounded-full blur-xl animate-pulse-fast" />
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
