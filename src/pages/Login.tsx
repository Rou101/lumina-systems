import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Fingerprint, Loader2, Play } from 'lucide-react';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const from = location.state?.from?.pathname || "/admin";

    const handleLogin = async () => {
        setIsAuthenticating(true);
        await login();
        navigate(from, { replace: true });
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.1)]"
            >
                <div className="flex flex-col items-center mb-12">
                    <div className="w-16 h-16 bg-cyan-900/20 rounded-xl flex items-center justify-center border border-cyan-500/30 mb-6 relative overflow-hidden group">
                        <Fingerprint className="text-cyan-400 w-8 h-8 relative z-10" />
                        <div className="absolute inset-0 bg-cyan-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    </div>
                    <h1 className="text-4xl font-bold font-mono text-white tracking-[0.2em] mb-2 text-center">LUMINA</h1>
                    <p className="text-cyan-500 font-mono text-xs uppercase tracking-widest">Admin Authorization</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleLogin}
                        disabled={isAuthenticating}
                        className="w-full h-14 bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-widest rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {isAuthenticating ? (
                            <>
                                <Loader2 className="animate-spin w-5 h-5" />
                                <span>Establishing Link...</span>
                            </>
                        ) : (
                            <>
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                                <span>Sign in with Google</span>
                            </>
                        )}
                    </button>

                    <div className="text-center">
                        <span className="text-zinc-600 text-[10px] uppercase font-mono tracking-widest">Authorized Personnel Only</span>
                    </div>
                </div>
            </motion.div>

            {/* Floating particles or decorative elements could go here */}
        </div>
    );
};

export default Login;
