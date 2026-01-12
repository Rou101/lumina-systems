import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Zap, Shield, Globe, Play, ChevronRight,
    WifiOff, Activity, Utensils
} from 'lucide-react';

// --- COMPONENTS ---

const AuroraBackground = () => (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
        <div className="absolute inset-0 opacity-30">
            <motion.div
                animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%]"
                style={{
                    background: 'conic-gradient(from 0deg at 50% 50%, #000000 0deg, #0891b2 60deg, #7c3aed 120deg, #000000 180deg, #0891b2 240deg, #7c3aed 300deg, #000000 360deg)',
                    filter: 'blur(80px)',
                }}
            />
        </div>
        <div className="absolute inset-0 bg-black/80" /> {/* Dimmer */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
    </div>
);

const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center backdrop-blur-sm">
        <div className="text-xl font-bold tracking-tighter text-white">
            LUMINA<span className="text-cyan-400">.OS</span>
        </div>
        <div className="flex gap-6 text-sm font-medium text-zinc-400">
            <Link to="/staff" className="hover:text-white transition-colors">Staff</Link>
            <Link to="/client" className="hover:text-white transition-colors">Client</Link>
            <Link to="/admin" className="hover:text-white transition-colors">Admin</Link>
        </div>
    </nav>
);

const Hero = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <section className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
            <motion.div
                style={{ y: y1 }}
                className="relative z-10 max-w-5xl mx-auto"
            >
                <div className="mb-4 flex justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-900/10 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-6"
                    >
                        System Version 4.0
                    </motion.div>
                </div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-6xl md:text-9xl font-black tracking-tighter text-white leading-[0.9] mb-8"
                >
                    THE OPERATING SYSTEM <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
                        FOR NIGHTLIFE.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed mb-12"
                >
                    Orchestrate <span className="text-white font-medium">50k+ people</span>.
                    Zero Latency. 100% Uptime.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col md:flex-row gap-4 justify-center"
                >
                    <button className="group relative px-8 py-4 bg-white text-black font-bold text-lg rounded-lg overflow-hidden">
                        <div className="absolute inset-0 bg-cyan-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative group-hover:text-black transition-colors flex items-center gap-2">
                            Request Access <ChevronRight className="w-4 h-4" />
                        </span>
                    </button>
                    <button className="px-8 py-4 text-white font-bold text-lg rounded-lg border border-white/20 hover:bg-white/10 transition-colors">
                        Documentation
                    </button>
                </motion.div>
            </motion.div>

            {/* Floating UI Elements Parallax */}
            <motion.div style={{ y: y2 }} className="absolute bottom-20 right-[10%] z-0 hidden md:block">
                <div className="w-64 p-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-mono text-zinc-400">LIVE TRAFFIC</span>
                    </div>
                    <div className="text-4xl font-mono font-bold text-white">42,891</div>
                    <div className="h-1 bg-white/10 mt-2 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "80%" }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className="h-full bg-green-500"
                        />
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

const BentoGrid = () => {
    return (
        <section className="py-32 relative z-10 bg-black">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

                    {/* CARD 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="col-span-1 md:col-span-2 p-8 rounded-3xl bg-neutral-900/50 border border-white/10 hover:border-cyan-500/30 transition-colors group relative overflow-hidden"
                    >
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] group-hover:bg-cyan-500/30 transition-colors" />

                        <div className="relative z-10">
                            <div className="mb-6 w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                                <Activity className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-2">Instant Revenue</h3>
                            <p className="text-zinc-400 text-lg">Real-time financial tracking with millisecond precision. Watch your event's pulse.</p>

                            <div className="mt-8 flex items-baseline gap-2">
                                <span className="text-5xl font-mono font-black text-white">$124,592</span>
                                <span className="text-green-500 font-mono text-sm">+12% vs last hr</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* CARD 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="col-span-1 p-8 rounded-3xl bg-neutral-900/50 border border-white/10 hover:border-purple-500/30 transition-colors group relative overflow-hidden"
                    >
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/20 rounded-full blur-[60px] group-hover:bg-purple-500/30 transition-colors" />
                        <div className="relative z-10">
                            <div className="mb-6 w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                <WifiOff className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Offline Shield</h3>
                            <p className="text-zinc-400">Internet down? No problem. Local-first architecture syncs when you reconnect.</p>
                        </div>
                    </motion.div>

                    {/* CARD 3 - KDS */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="col-span-1 md:col-span-3 p-8 rounded-3xl bg-neutral-900/50 border border-white/10 hover:border-cyan-500/30 transition-colors group relative overflow-hidden min-h-[300px]"
                    >
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1 relative z-10">
                                <div className="mb-6 w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                                    <Utensils className="w-6 h-6" />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">Real-Time KDS</h3>
                                <p className="text-zinc-400 text-lg">Kitchen Display Systems that actually work. Route generic orders to specific stations instantly.</p>
                            </div>

                            {/* MOCK UI */}
                            <div className="flex-1 w-full relative">
                                <div className="bg-black border-4 border-yellow-500 rounded-lg p-4 font-mono transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                    <div className="flex justify-between border-b border-white/20 pb-2 mb-2">
                                        <span className="text-yellow-500 font-bold">#492 (PENDING)</span>
                                        <span className="text-white">10m ago</span>
                                    </div>
                                    <div className="space-y-2 text-xl font-bold">
                                        <div className="flex gap-4"><span className="bg-zinc-800 text-cyan-400 px-2">2x</span> <span className="text-white">Heineken</span></div>
                                        <div className="flex gap-4"><span className="bg-zinc-800 text-cyan-400 px-2">1x</span> <span className="text-white">Classic Burger</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

const SocialProof = () => (
    <section className="py-24 bg-black border-t border-white/5 relative z-10">
        <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-mono text-zinc-500 tracking-widest uppercase mb-12">
                Trusted by the Underground
            </p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                {['LOLLAPALOOZA', 'CREAMFIELDS', 'TOMORROWLAND', 'RESISTANCE'].map((brand, i) => (
                    <span key={i} className="text-2xl md:text-3xl font-black text-white tracking-tighter">
                        {brand}
                    </span>
                ))}
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="py-12 bg-black border-t border-white/5 relative z-10">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4">
            <div className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                LUMINA
            </div>
            <p className="text-zinc-600 font-mono text-sm">
                Made for <span className="text-white">Sergio Noriega</span>. Engineered in Chile.
            </p>
        </div>
    </footer>
);

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-cyan-500/30">
            <AuroraBackground />
            <Navbar />
            <Hero />
            <BentoGrid />
            <SocialProof />
            <Footer />
        </div>
    );
}
