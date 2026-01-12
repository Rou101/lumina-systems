
import React from 'react';

interface Props {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    id?: string;
}

// LVOS CARD: Dynamic Panel, Sharp, Subtle Border
export const GlassCard: React.FC<Props> = ({ children, className = '', onClick, id }) => (
    <div
        id={id}
        onClick={onClick}
        className={`
      bg-lumina-panel border border-lumina-border text-lumina-text-primary
      rounded-sm relative overflow-hidden transition-all duration-300
      ${onClick ? 'cursor-pointer hover:border-lumina-cyan hover:shadow-glow-cyan/20 group' : ''}
      ${className}
    `}
    >
        {/* Optional: Cyber corner accent */}
        {onClick && <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-lumina-cyan opacity-0 group-hover:opacity-100 transition-opacity" />}
        {children}
    </div>
);

// SECTION CONTAINER: Standardizes max-width and padding for Web/Landing
export const GlassSection: React.FC<Props> = ({ children, className = '', id }) => (
    <section id={id} className={`relative px-6 py-20 md:py-32 w-full max-w-7xl mx-auto ${className}`}>
        {children}
    </section>
);

// TYPOGRAPHY: Section Headers
export const SectionHeader: React.FC<{ title: string; subtitle: string; align?: 'left' | 'center' }> = ({ title, subtitle, align = 'center' }) => (
    <div className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}>
        <div className={`inline-flex items-center gap-2 mb-4 ${align === 'center' ? 'justify-center' : 'justify-start'}`}>
            <span className="w-2 h-2 bg-lumina-cyan rounded-full animate-pulse"></span>
            <span className="text-lumina-cyan font-mono text-xs tracking-widest uppercase">{subtitle}</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-lumina-text-primary uppercase tracking-tighter leading-[0.9]">
            {title}
        </h2>
    </div>
);

// LVOS BUTTON
export const GlassButton: React.FC<Props & { variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline', disabled?: boolean }> = ({
    children,
    className = '',
    onClick,
    variant = 'primary',
    disabled = false
}) => {
    const variants = {
        primary: 'bg-lumina-cyan text-black hover:bg-white hover:shadow-glow-cyan border-transparent',
        secondary: 'bg-transparent text-lumina-cyan border-lumina-cyan/30 hover:border-lumina-cyan hover:bg-lumina-cyan/10',
        outline: 'bg-transparent text-lumina-text-primary border-lumina-border hover:border-lumina-text-primary',
        danger: 'bg-transparent text-lumina-fuchsia border-lumina-fuchsia/50 hover:bg-lumina-fuchsia hover:text-black hover:shadow-glow-fuchsia',
        success: 'bg-emerald-500 text-black hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] border-transparent',
    };

    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`
        px-8 py-4 font-bold uppercase tracking-widest text-xs border
        transition-all duration-200 flex items-center justify-center rounded-sm
        ${variants[variant]}
        ${disabled ? 'opacity-30 cursor-not-allowed grayscale' : 'active:scale-95'}
        ${className}
      `}
        >
            {children}
        </button>
    );
};

export const Badge: React.FC<{ status: string }> = ({ status }) => {
    const styles: Record<string, string> = {
        pending_confirmation: 'text-yellow-600 border-yellow-600/30 bg-yellow-400/10',
        confirmed: 'text-lumina-cyan border-lumina-cyan/30 bg-lumina-cyan/10',
        ready_for_pickup: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
        completed: 'text-emerald-600 border-emerald-600/30 bg-emerald-400/10',
        cancelled: 'text-lumina-fuchsia border-lumina-fuchsia/30 bg-lumina-fuchsia/10',
        held: 'text-lumina-text-primary border-lumina-text-muted bg-lumina-panel'
    };

    // Safe fallback
    const safeStatus = status?.toLowerCase() || 'pending';
    const activeStyle = styles[safeStatus] || styles['held'];

    return (
        <span className={`px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border rounded-sm ${activeStyle}`}>
            {status ? status.replace(/_/g, ' ') : 'UNKNOWN'}
        </span>
    );
};

export const GlassInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => (
    <div className="w-full">
        {label && <label className="text-xs font-bold text-lumina-text-secondary uppercase block mb-2">{label}</label>}
        <input
            className={`
            w-full bg-transparent border-b border-lumina-border py-2 text-lg font-bold 
            focus:border-lumina-text-primary outline-none text-lumina-text-primary
            placeholder:text-lumina-text-muted/30 transition-all
            ${className}
        `}
            {...props}
        />
    </div>
);
