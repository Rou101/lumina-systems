
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, GlassButton, GlassSection, SectionHeader } from '../components/GlassUI';

const IconServer = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 01-2 2v4a2 2 0 012 2h14a2 2 0 012-2v-4a2 2 0 01-2-2m-2-4h.01M17 16h.01" /></svg>;
const IconBrain = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const IconChart = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;

const CorporateWeb: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-lumina-base text-lumina-text-primary font-sans relative">
        
        {/* BACKGROUND MATRIX */}
        <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>

        {/* --- NAVBAR --- */}
        <nav className="relative z-20 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto border-b border-lumina-border/50 bg-lumina-base/80 backdrop-blur-md sticky top-0">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-8 h-8 bg-white flex items-center justify-center text-black font-black text-xl rounded-sm">L</div>
                <span className="font-bold text-xl tracking-tighter uppercase text-white">Lumina<span className="text-lumina-text-secondary">.CORP</span></span>
            </div>
            <div className="flex items-center gap-6">
                <a href="#ecosystem" className="hidden md:block text-xs font-bold text-lumina-text-secondary hover:text-white uppercase tracking-widest">Ecosistema</a>
                <a href="#intelligence" className="hidden md:block text-xs font-bold text-lumina-text-secondary hover:text-white uppercase tracking-widest">Data</a>
                <GlassButton variant="outline" className="px-6 py-2 text-[10px]" onClick={() => navigate('/')}>Launch Demo</GlassButton>
            </div>
        </nav>

        {/* --- HEADER --- */}
        <header className="relative py-32 px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6">
                Infraestructura para <br/>
                <span className="text-lumina-text-secondary">Eventos Masivos.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lumina-text-muted text-lg font-light leading-relaxed">
                Lumina no es solo una app. Es un sistema operativo logístico que sincroniza 
                ventas, inventario y staff en tiempo real.
            </p>
        </header>

        {/* --- SECTION 1: THE ECOSYSTEM --- */}
        <GlassSection id="ecosystem">
            <SectionHeader title="El Ecosistema" subtitle="Full Stack Logistics" />
            
            <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-lumina-cyan/10 text-lumina-cyan flex items-center justify-center rounded-sm border border-lumina-cyan/20">
                        <IconServer />
                    </div>
                    <h3 className="text-2xl font-bold uppercase">Core</h3>
                    <p className="text-lumina-text-secondary text-sm leading-relaxed">
                        La PWA del cliente. Sin descargas. Carga en 1.2 segundos. Soporta picos de 50,000 usuarios concurrentes por nodo local.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="w-12 h-12 bg-lumina-violet/10 text-lumina-violet flex items-center justify-center rounded-sm border border-lumina-violet/20">
                        <IconBrain />
                    </div>
                    <h3 className="text-2xl font-bold uppercase">Command</h3>
                    <p className="text-lumina-text-secondary text-sm leading-relaxed">
                        KDS (Kitchen Display System) para barras y cocinas. Algoritmos de enrutamiento de pedidos para balancear la carga de trabajo entre barras.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="w-12 h-12 bg-lumina-fuchsia/10 text-lumina-fuchsia flex items-center justify-center rounded-sm border border-lumina-fuchsia/20">
                        <IconChart />
                    </div>
                    <h3 className="text-2xl font-bold uppercase">Brain</h3>
                    <p className="text-lumina-text-secondary text-sm leading-relaxed">
                        Panel Administrativo. Control de stock en tiempo real, cambio de precios dinámico y gestión de permisos de staff.
                    </p>
                </div>
            </div>
        </GlassSection>

        {/* --- SECTION 2: LUMINA INTELLIGENCE (Premium) --- */}
        <section id="intelligence" className="py-32 bg-[#020202] border-y border-lumina-border relative overflow-hidden">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-lumina-cyan/5 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-block px-3 py-1 border border-lumina-cyan/30 text-lumina-cyan text-[10px] font-bold uppercase tracking-widest mb-6 bg-lumina-cyan/5">
                            Premium Service
                        </div>
                        <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-6">
                            Lumina <span className="text-lumina-cyan">Intelligence.</span>
                        </h2>
                        <p className="text-lumina-text-secondary text-lg mb-8">
                            No operes a ciegas. Toma decisiones basadas en terabytes de comportamiento real.
                            Nuestro servicio de Data Science post-evento revela lo invisible.
                        </p>
                        
                        <ul className="space-y-4 mb-10">
                            {[
                                "Mapas de calor de consumo por zona (Heatmaps)",
                                "Predicción de quiebre de stock con IA",
                                "Análisis de ticket promedio por minuto",
                                "Segmentación de usuarios VIP vs General"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-mono text-white">
                                    <span className="w-1.5 h-1.5 bg-lumina-cyan"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="p-6 border border-lumina-border bg-lumina-panel/50 rounded-sm">
                            <h4 className="text-xs font-bold uppercase text-lumina-text-muted mb-4">Client Access</h4>
                            <div className="flex gap-4">
                                <input disabled placeholder="ENTER_CLIENT_ID" className="bg-black border border-lumina-border px-4 py-2 text-xs font-mono w-full opacity-50 cursor-not-allowed" />
                                <button className="bg-lumina-text-muted text-black font-bold uppercase text-xs px-6 py-2 cursor-not-allowed">Locked</button>
                            </div>
                            <p className="text-[10px] text-lumina-text-secondary mt-2">Contact sales to unlock your Intelligence Dashboard.</p>
                        </div>
                    </div>

                    {/* Abstract Data Visualization */}
                    <div className="relative">
                        <GlassCard className="p-0 border-lumina-cyan/20 h-96 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <div className="text-center space-y-2">
                                <div className="text-6xl font-black text-lumina-cyan animate-pulse">40%</div>
                                <div className="text-xs font-mono uppercase tracking-widest text-white">Aumento en Throughput</div>
                            </div>
                            {/* Grid overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                        </GlassCard>
                    </div>
                </div>
            </div>
        </section>

        {/* --- SECTION 3: CASE STUDIES --- */}
        <GlassSection>
            <SectionHeader title="Case Studies" subtitle="Proven Results" />
            
            <div className="grid md:grid-cols-2 gap-8">
                <GlassCard className="p-8">
                    <h3 className="text-2xl font-black text-white uppercase mb-2">Neon Stadium</h3>
                    <p className="text-lumina-text-secondary text-xs font-mono mb-6">SANTIAGO, CHILE • 15.000 ATTENDEES</p>
                    <div className="flex justify-between items-end border-t border-lumina-border pt-6">
                        <div>
                            <div className="text-4xl font-bold text-white">12s</div>
                            <div className="text-[10px] uppercase text-lumina-text-muted">Tiempo Promedio Entrega</div>
                        </div>
                        <div className="text-right">
                             <div className="text-4xl font-bold text-emerald-500">+25%</div>
                            <div className="text-[10px] uppercase text-lumina-text-muted">Revenue vs Efectivo</div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-8">
                    <h3 className="text-2xl font-black text-white uppercase mb-2">Summer Fest 2024</h3>
                    <p className="text-lumina-text-secondary text-xs font-mono mb-6">VIÑA DEL MAR • OUTDOOR</p>
                    <div className="flex justify-between items-end border-t border-lumina-border pt-6">
                        <div>
                            <div className="text-4xl font-bold text-white">100%</div>
                            <div className="text-[10px] uppercase text-lumina-text-muted">Uptime (Modo Offline)</div>
                        </div>
                        <div className="text-right">
                             <div className="text-4xl font-bold text-lumina-violet">35k</div>
                            <div className="text-[10px] uppercase text-lumina-text-muted">Transacciones Totales</div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </GlassSection>

        {/* --- FOOTER --- */}
        <footer className="bg-black py-12 px-6 border-t border-lumina-border">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-left">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-white flex items-center justify-center text-black font-black text-sm rounded-sm">L</div>
                        <span className="font-bold text-lg tracking-tighter uppercase text-white">Lumina<span className="text-lumina-text-secondary">.CORP</span></span>
                    </div>
                    <p className="text-lumina-text-muted text-xs max-w-xs">
                        Infraestructura crítica para la industria del entretenimiento.
                        Santiago, Chile.
                    </p>
                </div>
                
                <div className="flex gap-8 text-xs font-bold uppercase text-lumina-text-secondary">
                    <a href="#" className="hover:text-white transition-colors">Contacto</a>
                    <a href="#" className="hover:text-white transition-colors">Prensa</a>
                    <a href="#" className="hover:text-white transition-colors">Legal</a>
                    <button onClick={() => navigate('/staff/login')} className="text-lumina-cyan hover:text-white">[ Staff Access ]</button>
                </div>
            </div>
        </footer>
    </div>
  );
};

export default CorporateWeb;
