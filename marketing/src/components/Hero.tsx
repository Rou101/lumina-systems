'use client';
import { motion } from 'framer-motion';
import { GlassButton } from './GlassUI';
import { ChevronRight, Play } from 'lucide-react';
import Link from 'next/link';

export default function Hero({ dict }: { dict: any }) {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-lumina-violet/20 rounded-full blur-[128px] animate-pulse-fast" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-lumina-cyan/20 rounded-full blur-[128px] animate-pulse-fast" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#050505] to-[#050505]" />
            </div>

            <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-7xl md:text-9xl font-black tracking-tighter mb-6 uppercase leading-tight"
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-lumina-cyan via-blue-500 to-lumina-violet">
                        {dict.hero.title}
                    </span>
                    <br />
                    <span className="text-white">{dict.hero.title_suffix}</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-xl md:text-2xl text-gray-400 font-light tracking-wide mb-12 max-w-3xl mx-auto leading-relaxed"
                >
                    {dict.hero.subtitle_prefix}
                    <span className="text-lumina-cyan font-semibold block md:inline md:ml-1">{dict.hero.subtitle_highlight1}</span>
                    <span className="text-lumina-violet font-semibold block md:inline md:ml-1">{dict.hero.subtitle_highlight2}</span>
                    <span className="block md:inline md:ml-1">{dict.hero.subtitle_suffix}</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col md:flex-row gap-6 justify-center items-center"
                >
                    <Link href="/staff" className="group">
                        <GlassButton variant="primary" className="group text-lg px-8 py-4 flex items-center gap-2">
                            {dict.hero.cta_staff} <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </GlassButton>
                    </Link>
                    <Link href="/client" className="group">
                        <GlassButton variant="secondary" className="group text-lg px-8 py-4 flex items-center gap-2">
                            {dict.hero.cta_client} <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </GlassButton>
                    </Link>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 cursor-pointer z-30"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                onClick={() => {
                    window.scrollTo({
                        top: window.innerHeight,
                        behavior: 'smooth'
                    });
                }}
            >
                <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2 hover:border-lumina-cyan transition-colors">
                    <div className="w-1 h-3 bg-white/50 rounded-full" />
                </div>
            </motion.div>
        </section>
    );
}
