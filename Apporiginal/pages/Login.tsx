
import React, { useState } from 'react';
import { GlassCard } from '../components/GlassUI';

interface Props {
  onLogin: (role: 'staff' | 'kitchen' | 'admin') => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handlePad = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleSubmit = (overridePin?: string) => {
    const finalPin = overridePin || pin;
    switch (finalPin) {
      case '1234': // Staff General (Runner/Scanner)
        onLogin('staff');
        break;
      case '2020': // Kitchen
        onLogin('kitchen');
        break;
      case '9999': // Admin
        onLogin('admin');
        break;
      default:
        setError('Acceso denegado');
        setPin('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative bg-black">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80')] bg-cover opacity-30 blur-sm"></div>
      
      <GlassCard className="w-full max-w-sm p-8 flex flex-col items-center relative z-10 backdrop-blur-xl border-white/20">
        <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Lumina Crew</h1>
        <p className="text-white/50 mb-8 text-sm uppercase tracking-widest">Sistema de Acceso</p>

        {/* PIN Display */}
        <div className="w-full mb-8 relative">
          <div className={`
            bg-white/5 border rounded-2xl h-16 flex items-center justify-center text-4xl tracking-[0.5em] font-bold text-white transition-all duration-300
            ${error ? 'border-red-500 text-red-500 animate-shake' : 'border-white/10'}
          `}>
            {'•'.repeat(pin.length)}
          </div>
          {error && <p className="absolute -bottom-6 left-0 w-full text-center text-xs text-red-500 font-bold uppercase">{error}</p>}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-4 w-full mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '→'].map(item => (
            <button
              key={item}
              onClick={() => {
                  if (item === 'C') setPin('');
                  else if (item === '→') handleSubmit();
                  else handlePad(item.toString());
              }}
              className={`
                aspect-square rounded-2xl text-2xl font-bold transition-all active:scale-95 flex items-center justify-center
                ${item === '→' ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/20'}
                ${item === 'C' ? 'text-red-400 text-lg' : ''}
              `}
            >
              {item}
            </button>
          ))}
        </div>
        
        {/* Quick Demo Access */}
        <div className="w-full pt-6 border-t border-white/10">
            <p className="text-[10px] text-white/30 uppercase text-center mb-2 tracking-widest">Demo Quick Access</p>
            <div className="grid grid-cols-3 gap-2">
                <button onClick={() => handleSubmit('9999')} className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 text-[10px] font-bold py-2 rounded uppercase border border-purple-500/30">Manager</button>
                <button onClick={() => handleSubmit('1234')} className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-200 text-[10px] font-bold py-2 rounded uppercase border border-blue-500/30">Staff</button>
                <button onClick={() => handleSubmit('2020')} className="bg-orange-500/20 hover:bg-orange-500/40 text-orange-200 text-[10px] font-bold py-2 rounded uppercase border border-orange-500/30">Kitchen</button>
            </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default Login;
