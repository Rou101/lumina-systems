'use client';
import { motion } from 'framer-motion';

export default function Contact({ dict }: { dict: any }) {
    return (
        <section id="contact" className="py-32 bg-black relative">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-7xl font-black mb-8 tracking-tighter"
                >
                    Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Upgrade?</span>
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <button className="bg-white text-black font-bold py-5 px-12 rounded-full text-xl hover:bg-gray-200 transition-colors">
                        {dict.cta.book}
                    </button>
                </motion.div>

                <p className="mt-12 text-zinc-600">
                    Lumina Systems © 2026. All rights reserved.
                </p>
            </div>
        </section>
    );
}
