'use client';
import { motion } from 'framer-motion';

export default function Hardware() {
    return (
        <section id="hardware" className="py-24 bg-zinc-900 border-t border-zinc-800">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                <div className="w-full md:w-1/2">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="rounded-xl overflow-hidden bg-black aspect-video border border-zinc-700 flex items-center justify-center relative group"
                    >
                        {/* Visual placeholder for hardware */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <p className="text-zinc-600 font-mono">[HARDWARE_VISUAL]</p>
                    </motion.div>
                </div>

                <div className="w-full md:w-1/2">
                    <motion.h2
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black mb-6"
                    >
                        Hardware <span className="text-purple-500">Agnostic</span>.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 mb-6"
                    >
                        Run Lumina on any standard POS terminal, tablet, or smartphone. No proprietary black boxes.
                    </motion.p>
                    <ul className="space-y-4 text-gray-300">
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full" /> Works on iPad & Android Tablets
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full" /> Compatible with Sunmi & Elo
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full" /> Instant printer pairing
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    );
}
