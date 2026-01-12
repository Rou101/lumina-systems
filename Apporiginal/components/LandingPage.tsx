
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, GlassButton, GlassSection, SectionHeader } from './GlassUI';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Quick Demo Toggle for Light/Dark Mode to show "Intelligent Adaptation"
  const toggleDemoTheme = () => {
    document.body.classList.toggle('light-mode');
  };

  return (
    <div className="min-h-screen bg-lumina-base text-lumina-text-primary font-sans relative flex flex-col selection:bg-lumina-cyan selection:text-black transition-colors duration-500">
      
      {/* Grid Background Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(100,100,100,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(100,100,100,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

      {/* Navbar Minimalista */}
      <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full border-b border-lumina-border/50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-lumina-cyan flex items-center justify-center text-black font-black text-xl rounded-sm">L</div>
          <span className="font-bold text-xl tracking-tighter uppercase text-lumina-text-primary">Lumina<span className="text-lumina-cyan">.OS</span></span>
        </div>
        <div className="hidden md:flex items-center gap-6">
           <button onClick={() => navigate('/corporate')} className="text-xs font-mono font-bold text-lumina-text-secondary hover:text-lumina-text-primary uppercase tracking-widest transition-colors">
             Corporativo
           </button>
           <button onClick={() => navigate('/staff/login')} className="text-xs font-mono font-bold text-lumina-text-secondary hover:text-lumina-cyan uppercase tracking-widest transition-colors">
             [ Staff_Login ]
           </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-6xl mx-auto py-20 md:py-32">
        <div className="mb-6 flex items-center gap-2 animate-fade-in-up">
            <span className="w-2 h-2 bg-lumina-cyan rounded-full animate-pulse"></span>
            <span className="text-lumina-cyan font-mono text-xs tracking-widest uppercase">System v1.1 Operational</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black text-lumina-text-primary mb-6 tracking-tighter uppercase leading-[0.9]">
          Logistics at the <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-lumina-cyan via-lumina-violet to-lumina-fuchsia">Speed of Sound</span>
        </h1>
        
        <p className="text-lg md:text-xl text-lumina-text-secondary mb-12 max-w-2xl font-light">
          Sistema Operativo de venta descentralizada. QR Entry. Apple Pay Integration.
          <span className="block mt-2 font-medium text-lumina-text-primary">Sin filas. Sin efectivo. Solo velocidad.</span>
        </p>

        <div className="flex flex-col md:flex-row gap-4 w-full justify-center mb-20">
            {/* MAIN CTA: GO TO THE BRAIN (ADMIN) */}
            <GlassButton onClick={() => navigate('/staff/login')} className="text-lg px-8 py-5 animate-pulse-fast shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                [ INITIALIZE_DEMO ]
            </GlassButton>
            
            {/* SECONDARY CTA: GO TO THE PRODUCT (APP) */}
            <GlassButton variant="outline" onClick={() => navigate('/event/GEN')}>
                Open Client App
            </GlassButton>
        </div>
      </main>

      {/* --- THE LUMINA TRIAD (Value Prop) --- */}
      <GlassSection className="border-t border-lumina-border/30">
        <div className="grid md:grid-cols-3 gap-6 w-full text-left">
            {/* Card 1: Speed */}
            <GlassCard className="p-8 hover:border-lumina-cyan transition-colors group">
                <h3 className="text-lumina-cyan font-mono text-xs uppercase tracking-widest mb-4">[ 01. ZERO FRICTION ]</h3>
                <h2 className="text-3xl font-black text-lumina-text-primary uppercase mb-4">Qr & Go</h2>
                <p className="text-sm text-lumina-text-secondary leading-relaxed">
                   El fan NO baja una App. Escanea -> Pide -> Paga con Apple/Google Pay. 
                   <br/>
                   <span className="text-lumina-text-primary font-bold mt-2 block">Tiempo de transacción: 15 seg.</span>
                </p>
                <div className="mt-6 w-full h-1 bg-lumina-border overflow-hidden">
                    <div className="h-full bg-lumina-cyan w-1/3 animate-glitch"></div>
                </div>
            </GlassCard>

            {/* Card 2: AI Visuals (Interactive) */}
            <GlassCard onClick={toggleDemoTheme} className="p-8 hover:border-lumina-violet transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lumina-violet font-mono text-xs uppercase tracking-widest">[ 02. ADAPTIVE UI ]</h3>
                    <span className="bg-lumina-text-primary text-lumina-base text-[10px] font-bold px-2 py-1 uppercase rounded-sm">Click to Test</span>
                </div>
                <h2 className="text-3xl font-black text-lumina-text-primary uppercase mb-4">Visual AI Engine</h2>
                <p className="text-sm text-lumina-text-secondary leading-relaxed">
                    *Adaptive Protocol.* El sistema analiza tu logo y reescribe su CSS en tiempo real. 
                    <br/>
                    <span className="text-lumina-text-primary mt-2 block">Modos "Daylight" (Clinic White) y "Night Ops" (Void Black) automáticos.</span>
                </p>
            </GlassCard>

            {/* Card 3: Resilience */}
            <GlassCard className="p-8 hover:border-lumina-fuchsia transition-colors">
                <h3 className="text-lumina-fuchsia font-mono text-xs uppercase tracking-widest mb-4">[ 03. RESILIENCE ]</h3>
                <h2 className="text-3xl font-black text-lumina-text-primary uppercase mb-4">Offline First</h2>
                <p className="text-sm text-lumina-text-secondary leading-relaxed">
                    Si se cae la red 4G del estadio, Lumina sigue operando en red local (Mesh).
                    <br/><span className="text-lumina-text-primary font-bold mt-2 block">Sincronización automática al recuperar señal.</span>
                </p>
            </GlassCard>
        </div>
      </GlassSection>

      {/* --- TECH STACK TERMINAL --- */}
      <GlassSection className="text-center">
          <SectionHeader title="System Architecture" subtitle="Under the Hood" />
          
          <div className="w-full max-w-4xl mx-auto border border-lumina-border bg-lumina-panel/80 backdrop-blur-md p-6 rounded-sm text-left font-mono text-xs md:text-sm shadow-2xl">
            <div className="flex gap-2 mb-4 border-b border-lumina-border pb-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="ml-2 text-lumina-text-muted">root@lumina-server:~</span>
            </div>
            <div className="space-y-2 text-lumina-text-secondary">
                <p>> initializing_stack...</p>
                <p>> load_module: <span className="text-lumina-cyan">Reactive_KDS (Kitchen Display System)</span> ... OK [Latency: 2ms]</p>
                <p>> load_module: <span className="text-lumina-cyan">Dynamic_Pricing_Engine (Flash Sales)</span> ... OK</p>
                <p>> load_module: <span className="text-lumina-cyan">Live_Revenue_Analytics</span> ... OK</p>
                <p>> check_connection: <span className="text-emerald-500">OFFLINE_READY</span></p>
                <p className="animate-pulse text-lumina-text-primary mt-4">> SYSTEM READY. WAITING FOR DEPLOYMENT_</p>
            </div>
        </div>
      </GlassSection>

      {/* --- FINAL CTA --- */}
      <section className="py-20 bg-lumina-cyan/5 border-t border-lumina-cyan/20 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-lumina-text-primary uppercase mb-8">
              Deja de perder dinero <br/> por filas lentas.
          </h2>
          <GlassButton onClick={() => navigate('/corporate')} className="text-lg px-12 py-6">
              HABLAR CON INGENIERÍA
          </GlassButton>
      </section>

      {/* Footer Simple */}
      <footer className="py-6 border-t border-lumina-border bg-lumina-base text-center text-[10px] font-mono text-lumina-text-muted uppercase tracking-widest">
        <p>Lumina.OS v1.1 © 2024 | All Systems Operational</p>
      </footer>
    </div>
  );
};
