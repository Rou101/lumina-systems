import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BentoGrid, BentoItem } from './ui/BentoGrid';
import { GlassButton } from './GlassUI';
import { Zap, Globe, Shield, Activity, DollarSign, Smartphone } from 'lucide-react';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [revenue, setRevenue] = useState(1420500);

    // Simulate Live Revenue Ticker
    useEffect(() => {
        const interval = setInterval(() => {
            setRevenue(prev => prev + Math.floor(Math.random() * 5000));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black overflow-x-hidden font-sans">

            {/* --- BACKGROUND --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-grid-pattern opacity-20 mask-image-gradient"></div>
                <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full animate-float"></div>
                <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* --- NAV --- */}
            <nav className="relative z-50 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto border-b border-white/5 bg-black/50 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-cyan-500 rounded flex items-center justify-center font-black text-black">L</div>
                    <span className="font-bold tracking-tighter text-lg">LUMINA<span className="text-cyan-500">.SYSTEMS</span></span>
                </div>
                <div className="hidden md:flex gap-8 text-sm font-medium text-white/60">
                    <a href="#" className="hover:text-white transition-colors">Platform</a>
                    <a href="#" className="hover:text-white transition-colors">Hardware</a>
                    <a href="#" className="hover:text-white transition-colors">Case Studies</a>
                </div>
                <GlassButton onClick={() => navigate('/staff/login')} variant="outline" className="text-xs px-4 py-2 border-white/20">
                    SYSTEM LOGIN
                </GlassButton>
            </nav>

            {/* --- HERO --- */}
            <section className="relative z-10 pt-32 pb-40 px-6 text-center max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-900/10 text-cyan-400 text-[10px] font-mono tracking-widest mb-8 uppercase">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        System Online v2.4
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
                        The Operating System <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 text-glow">
                            For Massive Scale.
                        </span>
                    </h1>

                    <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                        Orchestrate festivals, stadiums, and mega-clubs from a single reactive terminal.
                        Zero latency. 100% Uptime.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={() => navigate('/event/GEN')}
                            className="bg-white text-black px-8 py-4 rounded font-bold text-sm tracking-widest uppercase hover:bg-cyan-400 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                            Deploy Environment
                        </button>
                        <button
                            className="text-white/60 hover:text-white px-8 py-4 font-mono text-xs uppercase tracking-widest border-b border-transparent hover:border-white transition-colors"
                        >
                            View Documentation
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* --- BENTO GRID FEATURE SHOWCASE --- */}
            <section className="relative z-10 px-6 pb-32">
                <div className="max-w-7xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold uppercase tracking-tighter mb-2">Core Capabilities</h2>
                    <div className="h-1 w-20 bg-cyan-500"></div>
                </div>

                <BentoGrid>
                    {/* Item 1: Revenue (Double Width) */}
                    <BentoItem
                        className="md:col-span-2 bg-gradient-to-br from-black to-gray-900 border-white/10"
                        title={<span className="text-4xl text-emerald-400 font-mono">${revenue.toLocaleString()}</span>}
                        description="Real-time transaction processing across all nodes. 0.05ms latency."
                        header={<div className="flex items-center gap-2 text-emerald-500 mb-2"><Activity size={16} /> LIVE REVENUE STREAM</div>}
                        icon={<DollarSign className="h-8 w-8 text-white/20 absolute right-4 top-4" />}
                    />

                    {/* Item 2: Offline Mode */}
                    <BentoItem
                        className="md:col-span-1"
                        title="Edge Resilience"
                        description="Network failure? No problem. Local nodes continue processing and sync automatically."
                        header={<div className="w-full h-32 bg-grid-pattern opacity-50 rounded bg-cyan-900/10 mb-4 border border-cyan-500/20 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-cyan-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        </div>}
                        icon={<Shield className="h-6 w-6 text-cyan-500" />}
                    />

                    {/* Item 3: Global Reach */}
                    <BentoItem
                        className="md:col-span-1"
                        title="Global Compliance"
                        description="Fiscal integration ready for Chile (SII), Mexico (SAT), and Brazil."
                        icon={<Globe className="h-6 w-6 text-purple-500" />}
                    />

                    {/* Item 4: Mobile First */}
                    <BentoItem
                        className="md:col-span-2"
                        title="The 'Glass' Architecture"
                        description="A frictionless progressive web app (PWA) that feels native. No app store downloads required."
                        header={<div className="flex gap-4 mb-4">
                            <div className="w-12 h-12 rounded bg-white/10 flex items-center justify-center font-bold">iOS</div>
                            <div className="w-12 h-12 rounded bg-white/10 flex items-center justify-center font-bold">AND</div>
                        </div>}
                        icon={<Smartphone className="h-6 w-6 text-white/50" />}
                    />
                </BentoGrid>
            </section>

            {/* --- TRUST FOOTER --- */}
            <footer className="border-t border-white/10 py-12 bg-black">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
                    <p className="font-mono text-[10px] uppercase tracking-widest">
                        Trusted by industry sleepers
                    </p>
                    <div className="flex gap-8 mt-4 md:mt-0 grayscale">
                        <span className="font-black text-xl">TICKETMASTER</span>
                        <span className="font-black text-xl">LIVE NATION</span>
                        <span className="font-black text-xl">DG MEDIOS</span>
                    </div>
                </div>

                <div className="mt-20 text-center">
                    <p className="text-white/20 text-[10px] font-mono">
                        ENGINEERED BY ANTIGRAVITY // COPYRIGHT 2026 LUMINA SYSTEMS INC.
                    </p>
                </div>
            </footer>

        </div>
    );
};
export default LandingPage;
