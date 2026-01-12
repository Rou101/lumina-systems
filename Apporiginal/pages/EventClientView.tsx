
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Product, CartItem, Order, OrderStatus, Customer, Promotion } from '../types';
import { getProducts, sendOrder, useRealTimeData, registerCustomer } from '../services/dataService';
import { GlassButton } from '../components/GlassUI';
import { useSensory } from '../hooks/useSensory';

// --- ICONS & ASSETS ---
const IconLock = () => <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const IconApplePay = () => <svg className="h-6 w-auto" viewBox="0 0 38 16" fill="currentColor"><path d="M5.36 1.05c-1.3 0-2.4.9-2.4 2.5 0 2.2 2 3 4.2 1.4.3-.2.6-.5.7-.7-.2 1.9-1.3 2.8-2.6 2.8-1 0-1.7-.5-1.7-1.3h-1.8c0 1.7 1.6 2.8 3.5 2.8 2.2 0 4.3-1.6 4.3-4.4 0-1.8-1.5-3.1-4.2-3.1zM5.2 4c-.8 0-1.3-.5-1.3-1.3 0-.8.6-1.3 1.3-1.3.8 0 1.4.5 1.4 1.3 0 .8-.5 1.3-1.4 1.3zM10.85 8.45h1.7V3.9c0-1.1.7-1.4 1.3-1.4.2 0 .5 0 .6.1V.9c-.2 0-.5-.1-.7-.1-.8 0-1.4.4-1.6 1V1.05h-1.6v7.4h.3zM15.45 8.45h1.7V3.9c0-1.1.7-1.4 1.3-1.4.2 0 .5 0 .6.1V.9c-.2 0-.5-.1-.7-.1-.8 0-1.4.4-1.6 1V1.05h-1.6v7.4h.3zM20.25 1.05h-1.7v7.4h1.7V1.05zM22.55 1.05h-1.7v7.4h1.7V1.05zM25.75 5.55c.1 1.1 1 1.6 1.9 1.6.8 0 1.4-.3 1.6-.8h1.7c-.3 1.4-1.8 2.2-3.3 2.2-2.1 0-3.6-1.5-3.6-3.8 0-2.3 1.5-3.8 3.6-3.8 2.2 0 3.5 1.6 3.5 3.7v.9h-5.4zm3.6-1.2c0-.9-.6-1.5-1.6-1.5-.9 0-1.6.6-1.7 1.5h3.3zM19.35.45c0 .7-.5 1.3-1.3 1.3-.8 0-1.3-.6-1.3-1.3 0-.7.5-1.3 1.3-1.3.8 0 1.3.5 1.3 1.3zM35.65 3.35c0-1.6-1.2-2.3-2.6-2.3-1.5 0-2.7.9-2.7 2.4h1.7c0-.6.4-1 1-1 .5 0 .9.3.9.8 0 .4-.2.6-.8.9-1.2.5-1.8 1.1-1.8 2.1 0 1.1.9 1.8 2.1 1.8.8 0 1.4-.4 1.7-.8v.7h1.6V3.35h-1.1zm-1.6 3.6c-.5 0-.8-.3-.8-.7 0-.5.4-.8 1.2-1.1.6-.2.9-.4 1.2-.6v.6c0 .9-.7 1.8-1.6 1.8z"/></svg>;
const IconGooglePay = () => <span className="font-bold text-lg tracking-tight">G <span className="font-normal">Pay</span></span>;
const IconPlus = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const IconCheck = () => <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;

// --- MOCK PAYMENT SHEET (Native OS Simulation) ---
const PaymentSheet: React.FC<{ 
    total: number, 
    onClose: () => void, 
    onConfirm: () => void 
}> = ({ total, onClose, onConfirm }) => {
    const [processing, setProcessing] = useState(false);
    const { vibrate } = useSensory();

    const handlePay = () => {
        vibrate('heavy');
        setProcessing(true);
        // Simulate Network Latency & Biometric Auth
        setTimeout(() => {
            onConfirm();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-[#1C1C1E] w-full max-w-md rounded-t-[20px] p-6 relative z-10 animate-fade-in-up pb-safe-bottom">
                
                {/* Handle Bar */}
                <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6"></div>

                {/* Card Info */}
                <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-6">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-8 bg-gradient-to-tr from-gray-700 to-gray-600 rounded border border-white/10 flex items-end justify-end p-1">
                            <div className="w-2 h-2 rounded-full bg-white/50"></div>
                            <div className="w-2 h-2 rounded-full bg-white/30 -ml-1"></div>
                        </div>
                        <div>
                            <p className="text-white text-sm font-medium">MasterCard •••• 8842</p>
                            <p className="text-gray-400 text-xs">Lumina Payments Encrypted</p>
                        </div>
                    </div>
                    <IconLock />
                </div>

                {/* Total */}
                <div className="flex justify-between items-end mb-8">
                    <span className="text-gray-400 text-sm font-medium">TOTAL A PAGAR</span>
                    <span className="text-white text-3xl font-bold tracking-tight">${total.toLocaleString()}</span>
                </div>

                {/* Action Button */}
                <button 
                    onClick={handlePay}
                    disabled={processing}
                    className={`
                        w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all
                        ${processing ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200 active:scale-95'}
                    `}
                >
                    {processing ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <span>Procesando...</span>
                        </>
                    ) : (
                        <>
                            <IconApplePay /> 
                            <span>Pagar</span>
                        </>
                    )}
                </button>
                
                <div className="mt-4 text-center">
                    <p className="text-[#34C759] text-[10px] flex items-center justify-center gap-1 font-medium">
                        <IconLock /> Face ID Verified
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- HYPE OVERLAY COMPONENT ---
const HypeOverlay: React.FC<{ trigger: Promotion }> = ({ trigger }) => {
    const [timeLeft, setTimeLeft] = useState(trigger.durationMinutes ? trigger.durationMinutes * 60 : 0);
    const [minimized, setMinimized] = useState(false);

    useEffect(() => {
        // Auto minimize after 5 seconds to let user buy
        const t = setTimeout(() => setMinimized(true), 4000);
        return () => clearTimeout(t);
    }, []);

    if (minimized) {
        return (
             <div className="fixed top-20 right-4 z-40 animate-fade-in-up">
                 <div className="bg-red-600 text-white p-2 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)] flex items-center gap-2 pr-4 border-2 border-white animate-pulse">
                     <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-600 font-black text-xs">
                         %
                     </div>
                     <div>
                         <p className="text-[10px] font-black uppercase leading-none">{trigger.triggerLabel}</p>
                         <p className="text-[9px] font-mono leading-none">ACTIVO</p>
                     </div>
                 </div>
             </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 bg-red-600 flex flex-col items-center justify-center p-6 text-center animate-fade-in-up">
            {/* Background Image Effect */}
            {trigger.imageUrl && (
                <div className="absolute inset-0 z-0">
                    <img src={trigger.imageUrl} className="w-full h-full object-cover opacity-30 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-b from-red-600/50 via-transparent to-red-900/80"></div>
                </div>
            )}
            
            <div className="relative z-10">
                <div className="inline-block px-4 py-1 bg-black text-white font-mono text-xs uppercase tracking-widest mb-6 border border-white/30 rounded-full animate-bounce">
                    Live Event Triggered
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter leading-none mb-4 drop-shadow-xl">
                    {trigger.triggerLabel}
                </h1>
                
                <p className="text-white text-xl md:text-2xl font-bold uppercase tracking-wide mb-8 max-w-md mx-auto">
                    {trigger.description}
                </p>

                <div className="w-32 h-1 bg-white/30 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-white w-full animate-[width_3s_ease-in-out_infinite]"></div>
                </div>
            </div>
        </div>
    );
};

// --- DIGITAL TICKET VIEW ---
const DigitalTicket: React.FC<{ order: Order, onNewOrder: () => void }> = ({ order, onNewOrder }) => {
    return (
        <div className="fixed inset-0 bg-[#050505] z-40 flex flex-col items-center justify-center p-6 animate-fade-in-up">
            {/* Success Animation */}
            <div className="mb-8 relative">
                <div className="absolute inset-0 bg-lumina-cyan/20 blur-xl rounded-full animate-pulse"></div>
                <div className="w-20 h-20 bg-lumina-cyan rounded-full flex items-center justify-center text-black relative z-10 shadow-[0_0_30px_rgba(0,240,255,0.4)]">
                    <IconCheck />
                </div>
            </div>

            <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Orden Confirmada</h1>
            <p className="text-lumina-text-secondary text-sm font-mono mb-10">TU PEDIDO ESTÁ EN MARCHA</p>

            {/* THE TICKET */}
            <div className="w-full max-w-sm bg-white text-black rounded-sm overflow-hidden relative shadow-2xl">
                {/* Perforation */}
                <div className="absolute top-0 left-0 w-full h-2 bg-[radial-gradient(circle,transparent_4px,#fff_5px)] bg-[size:16px_16px] -mt-1"></div>
                
                <div className="p-8 text-center border-b border-dashed border-gray-300">
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">CÓDIGO DE RETIRO</p>
                    <h2 className="text-6xl font-black tracking-tighter mb-4">{order.pickupCode}</h2>
                    <div className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase rounded-sm">
                        Zona: {order.zoneId}
                    </div>
                </div>
                
                <div className="p-8 bg-gray-50 flex flex-col items-center">
                    {/* Simulated QR */}
                    <div className="w-48 h-48 bg-white p-2 mb-4 shadow-sm border border-gray-200">
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${order.id}`} 
                            alt="QR" 
                            className="w-full h-full object-contain mix-blend-multiply"
                        />
                    </div>
                    <p className="text-[10px] text-gray-500 uppercase font-mono">Muestra este QR al Runner</p>
                </div>
            </div>

            <button 
                onClick={onNewOrder}
                className="mt-12 text-lumina-text-secondary hover:text-white uppercase font-bold text-xs tracking-widest border-b border-transparent hover:border-white transition-all"
            >
                [ Hacer otro pedido ]
            </button>
        </div>
    );
};

// --- MAIN COMPONENT ---
const EventClientView: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const { config, orders } = useRealTimeData();
  const { vibrate } = useSensory();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // View States
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  
  const [currentUser, setCurrentUser] = useState<Customer | null>(null);

  // Load Initial Data
  useEffect(() => {
      getProducts().then(data => {
          setProducts(data);
          if (data.length > 0) setActiveCategory(data[0].category);
      });
      // Auto-login as Guest for MVP
      const guest = registerCustomer("Guest User", "guest@lumina.os");
      setCurrentUser(guest);
  }, []);

  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))), [products]);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Check for Active Hype Trigger
  const activeTrigger = config.activePromotions.find(p => p.triggerLabel && p.active);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    vibrate('light');
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1, appliedPrice: product.price }];
    });
  };

  const removeFromCart = (productId: string) => {
    vibrate('light');
    setCart(prev => prev.reduce((acc, item) => {
        if (item.id === productId) {
            if (item.quantity > 1) acc.push({ ...item, quantity: item.quantity - 1 });
        } else {
            acc.push(item);
        }
        return acc;
    }, [] as CartItem[]));
  };

  const initiateCheckout = () => {
      if (cart.length === 0) return;
      vibrate('medium');
      setShowPaymentSheet(true);
  };

  const confirmPayment = async () => {
      const order: Order = {
          id: Math.random().toString(36).substr(2, 9).toUpperCase(),
          zoneId: tableId || 'GEN',
          items: cart,
          total: cartTotal,
          tipAmount: 0,
          status: OrderStatus.CONFIRMED,
          paymentMode: 'individual',
          paymentStatus: 'paid',
          timestamp: Date.now(),
          customerName: currentUser?.name || 'Guest',
          customerEmail: currentUser?.email
      };
      
      await sendOrder(order);
      vibrate('success');
      setShowPaymentSheet(false);
      setCompletedOrder(order);
      setCart([]);
  };

  const displayedProducts = products.filter(p => p.category === activeCategory);

  // If order completed, show ticket
  if (completedOrder) {
      return <DigitalTicket order={completedOrder} onNewOrder={() => setCompletedOrder(null)} />;
  }

  return (
    <div className="min-h-[100dvh] bg-lumina-base text-lumina-text-primary overflow-hidden relative flex flex-col font-sans selection:bg-lumina-cyan selection:text-black">
        
        {/* HYPE OVERLAY */}
        {activeTrigger && <HypeOverlay trigger={activeTrigger} />}

        {/* --- PAYMENT SHEET --- */}
        {showPaymentSheet && (
            <PaymentSheet 
                total={cartTotal} 
                onClose={() => setShowPaymentSheet(false)} 
                onConfirm={confirmPayment} 
            />
        )}

        {/* --- HEADER (SECURE) --- */}
        <header className="sticky top-0 z-30 pt-safe-top bg-lumina-base/95 backdrop-blur-md border-b border-lumina-border">
            <div className="px-4 py-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-lumina-cyan text-black font-black flex items-center justify-center rounded-sm text-lg">L</div>
                    <div>
                        <h1 className="text-sm font-bold uppercase tracking-tight text-lumina-text-primary leading-none">{config.name}</h1>
                        <div className="flex items-center gap-1 mt-0.5">
                            <IconLock />
                            <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest">Secure Tunnel</span>
                        </div>
                    </div>
                </div>
                <div className="bg-lumina-panel border border-lumina-border px-3 py-1 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-lumina-text-secondary uppercase">Live</span>
                </div>
            </div>

            {/* CATEGORY TABS */}
            <div className="flex gap-4 px-4 pb-0 overflow-x-auto no-scrollbar scroll-smooth">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => {
                            setActiveCategory(cat);
                            vibrate('light');
                        }}
                        className={`
                            whitespace-nowrap pb-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all
                            ${activeCategory === cat ? 'border-lumina-cyan text-lumina-cyan' : 'border-transparent text-lumina-text-muted hover:text-lumina-text-primary'}
                        `}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </header>

        {/* --- MENU GRID --- */}
        <div className="flex-1 overflow-y-auto p-4 pb-32 animate-fade-in-up">
            <div className="grid gap-4">
                {displayedProducts.map(product => {
                    const isOutOfStock = product.stock <= 0;
                    const inCart = cart.find(i => i.id === product.id);

                    return (
                        <div key={product.id} className={`bg-lumina-panel border border-lumina-border rounded-sm overflow-hidden flex relative ${isOutOfStock ? 'opacity-50' : ''}`}>
                             {/* Sold Out Overlay */}
                            {isOutOfStock && (
                                <div className="absolute inset-0 z-20 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                                    <span className="text-white font-mono font-bold border border-white/50 px-3 py-1 text-xs uppercase tracking-widest">Sold Out</span>
                                </div>
                            )}

                            {/* Image */}
                            <div className="w-24 bg-lumina-border relative">
                                {product.imageUrl && <img src={product.imageUrl} className="w-full h-full object-cover" />}
                                {inCart && (
                                    <div className="absolute top-1 left-1 bg-lumina-cyan text-black font-bold w-6 h-6 flex items-center justify-center rounded-full text-xs shadow-lg">
                                        {inCart.quantity}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-3 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-sm uppercase text-lumina-text-primary leading-tight mb-1">{product.name}</h3>
                                    <p className="text-[10px] text-lumina-text-secondary line-clamp-2">{product.description}</p>
                                </div>
                                <div className="flex justify-between items-end mt-2">
                                    <span className="text-lumina-cyan font-mono font-bold text-sm">${product.price.toLocaleString()}</span>
                                    
                                    <div className="flex items-center gap-3">
                                        {inCart && (
                                            <button 
                                                onClick={() => removeFromCart(product.id)}
                                                className="w-8 h-8 flex items-center justify-center border border-lumina-border text-white hover:bg-white/10 rounded-sm"
                                            >
                                                -
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => addToCart(product)}
                                            disabled={isOutOfStock}
                                            className="w-8 h-8 flex items-center justify-center bg-white text-black hover:bg-lumina-cyan transition-colors rounded-sm"
                                        >
                                            <IconPlus />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* --- FLOATING CART --- */}
        {cart.length > 0 && (
            <div className="fixed bottom-6 left-4 right-4 z-40 animate-fade-in-up">
                <GlassButton 
                    onClick={initiateCheckout}
                    className="w-full py-4 shadow-[0_0_40px_rgba(0,0,0,0.8)] border-lumina-cyan/50 bg-black/90 backdrop-blur-xl flex justify-between items-center px-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-lumina-cyan text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                            {cart.reduce((a, b) => a + b.quantity, 0)}
                        </div>
                        <span className="text-white text-xs font-bold uppercase tracking-widest">Ver Bolsa</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-lumina-cyan font-mono text-lg font-bold">${cartTotal.toLocaleString()}</span>
                        <svg className="w-5 h-5 text-lumina-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </div>
                </GlassButton>
            </div>
        )}
    </div>
  );
};

export default EventClientView;
