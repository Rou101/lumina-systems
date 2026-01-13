'use client';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar({ lang }: { lang: string }) {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/5"
        >
            <div className="text-xl font-bold tracking-tighter text-white">
                LUMINA<span className="text-cyan-500">.OS</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
                <a href="#hardware" className="text-sm text-gray-400 hover:text-white transition-colors">Hardware</a>
                <LanguageSwitcher />
                <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium transition-all">
                    Login
                </button>
            </div>

            <div className="md:hidden text-white">
                <Menu />
            </div>
        </motion.nav>
    );
}
