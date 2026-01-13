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
      ${onClick ? 'cursor-pointer hover:border-lumina-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] group' : ''}
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
            <span className="w-2 h-2 bg-lumina-cyan rounded-full animate-pulse-fast"></span>
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
        primary: 'bg-lumina-cyan text-black hover:bg-white hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] border-transparent',
        secondary: 'bg-transparent text-lumina-cyan border-lumina-cyan/30 hover:border-lumina-cyan hover:bg-lumina-cyan/10',
        outline: 'bg-transparent text-lumina-text-primary border-lumina-border hover:border-lumina-text-primary',
        danger: 'bg-transparent text-lumina-fuchsia border-lumina-fuchsia/50 hover:bg-lumina-fuchsia hover:text-black hover:shadow-[0_0_20px_rgba(255,0,255,0.4)]',
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
