import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEventContext } from '../context/EventContext';
import { Siren } from 'lucide-react';

export const HypeOverlay = () => {
    const { hype } = useEventContext();

    return (
        <AnimatePresence>
            {hype.isActive && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black"
                >
                    {/* Flashing Background */}
                    <motion.div
                        animate={{
                            backgroundColor: ["#ef4444", "#000000", "#ef4444"],
                        }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="absolute inset-0 opacity-50"
                    />

                    {/* Content */}
                    <div className="relative z-10 text-center">
                        <motion.div
                            animate={{ rotate: [-10, 10, -10], scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.2, repeat: Infinity }}
                            className="flex justify-center mb-8 text-white"
                        >
                            <Siren size={120} />
                        </motion.div>

                        <motion.h1
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-9xl font-black text-white uppercase tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,1)]"
                        >
                            {hype.message}
                        </motion.h1>

                        <motion.div
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.1, repeat: Infinity }}
                            className="mt-8 text-4xl font-mono text-yellow-400 font-bold"
                        >
                            !!! PROMOCIÓN ACTIVA !!!
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
