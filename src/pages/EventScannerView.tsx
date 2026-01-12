import React, { useState, useEffect, useRef } from 'react';
import { useRealTimeData, validatePickupCode, completePickupOrder } from '../services/dataService';
import { Order } from '../types';
import { GlassCard, GlassButton } from '../components/GlassUI';

// Declaration for experimental BarcodeDetector API
declare global {
    interface Window {
        BarcodeDetector: any;
    }
}

const EventScannerView: React.FC = () => {
    const { config } = useRealTimeData();

    // State
    const [isScanning, setIsScanning] = useState(true); // Default to camera open
    const [inputCode, setInputCode] = useState('');
    const [scannedOrder, setScannedOrder] = useState<Order | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);

    // Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const intervalRef = useRef<any>(null);

    // --- CAMERA LOGIC ---
    useEffect(() => {
        let stream: MediaStream | null = null;

        const startCamera = async () => {
            // If we are scanning, have no active order, no success state, and permission hasn't been explicitly denied yet
            if (isScanning && !scannedOrder && !success && cameraPermission !== false) {
                try {
                    // Try to get back camera first (environment)
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: { ideal: "environment" } },
                        audio: false
                    });

                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        // Required for some mobile browsers to play inline
                        videoRef.current.setAttribute('playsinline', 'true');
                        await videoRef.current.play();
                    }
                    setCameraPermission(true);
                    startScanningLogic();
                } catch (err) {
                    console.error("Camera Error:", err);
                    setCameraPermission(false);
                    // Do not auto-switch to manual. Let the UI inform the user.
                }
            }
        };

        startCamera();

        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isScanning, scannedOrder, success, cameraPermission]);

    const startScanningLogic = () => {
        // 1. Try Native Barcode Detector (Chrome/Android)
        if ('BarcodeDetector' in window) {
            const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
            intervalRef.current = setInterval(async () => {
                if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                    try {
                        const barcodes = await barcodeDetector.detect(videoRef.current);
                        if (barcodes.length > 0) {
                            const code = barcodes[0].rawValue;
                            handleFoundCode(code);
                        }
                    } catch (e) { /* Ignore detection errors */ }
                }
            }, 500);
        } else {
            // 2. Simulation Mode (For Demo purpose on non-supported browsers)
            // In a real app, we would include a polyfill like 'jsQR' library here.
            console.log("Native BarcodeDetector not supported. Using demo simulation.");
        }
    };

    const handleFoundCode = (code: string) => {
        if (navigator.vibrate) navigator.vibrate(200);
        processCode(code);
    };

    const processCode = async (code: string) => {
        // Pause Scanning
        if (intervalRef.current) clearInterval(intervalRef.current);

        try {
            const order = await validatePickupCode(code);
            setScannedOrder(order);
            setError('');
            setIsScanning(false); // Stop camera to save battery/show result
        } catch (err: any) {
            setError(err.message || "Código inválido");
            // Resume scanning after error delay
            setTimeout(() => setError(''), 2000);
            if ('BarcodeDetector' in window) startScanningLogic();
        }
    };

    // --- MANUAL HANDLERS ---
    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        processCode(inputCode);
    };

    // STEP 2: COMPLETE ORDER (BARTENDER CONFIRMS)
    const handleComplete = async () => {
        if (!scannedOrder) return;
        try {
            await completePickupOrder(scannedOrder.id);
            setSuccess(true);
            setScannedOrder(null);
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

            // Reset Success State after delay and restart camera
            setTimeout(() => {
                setSuccess(false);
                setIsScanning(true);
            }, 2000);
        } catch (err) {
            setError("Error al completar orden.");
        }
    };

    const handleCancel = () => {
        setScannedOrder(null);
        setInputCode('');
        setIsScanning(true);
    };

    // Demo helper to simulate scan
    const demoSimulateScan = () => {
        // This would need a valid ID, but for demo UI purposes:
        //  handleFoundCode("demo-id"); 
        alert("Para probar: usa el ingreso manual con un código de orden generado en la app cliente.");
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">

            {/* --- CAMERA LAYER --- */}
            {isScanning && !scannedOrder && !success && (
                <div className="absolute inset-0 z-0 bg-black">
                    {cameraPermission === false ? (
                        <div className="h-full flex flex-col items-center justify-center text-white p-8 text-center bg-gray-900">
                            <div className="w-16 h-16 mb-4 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Acceso a cámara denegado</h3>
                            <p className="text-white/50 mb-6 text-sm">Por favor habilita la cámara o usa el ingreso manual.</p>
                            <div className="flex gap-4">
                                <button onClick={() => window.location.reload()} className="px-4 py-2 border border-white/20 rounded-lg text-sm font-bold hover:bg-white/10">Reintentar</button>
                                <button onClick={() => setIsScanning(false)} className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200">Usar Manual</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <video
                                ref={videoRef}
                                className="w-full h-full object-cover opacity-60"
                                playsInline
                                muted
                            />

                            {/* Scanner overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                                <div className="w-64 h-64 border-2 border-lumina-accent/50 rounded-3xl relative animate-pulse-fast">
                                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-lumina-accent rounded-tl-xl"></div>
                                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-lumina-accent rounded-tr-xl"></div>
                                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-lumina-accent rounded-bl-xl"></div>
                                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-lumina-accent rounded-br-xl"></div>

                                    {/* Laser Line */}
                                    <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-red-500 shadow-[0_0_10px_red] animate-pulse"></div>
                                </div>
                                <p className="mt-8 text-white font-bold bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
                                    Apunta al código QR
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* --- UI LAYER --- */}
            <div className="w-full max-w-md p-6 z-20 relative">

                {/* Header / Mode Switcher */}
                {!scannedOrder && !success && (
                    <div className="flex justify-center mb-6">
                        <div className="bg-black/40 backdrop-blur-md p-1 rounded-full flex border border-white/10">
                            <button
                                onClick={() => { setIsScanning(true); setCameraPermission(null); }}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${isScanning ? 'bg-lumina-cyan text-black shadow-lg' : 'text-white/50'}`}
                            >
                                Cámara
                            </button>
                            <button
                                onClick={() => setIsScanning(false)}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${!isScanning ? 'bg-white text-black shadow-lg' : 'text-white/50'}`}
                            >
                                Manual
                            </button>
                        </div>
                    </div>
                )}

                {/* ERROR TOAST */}
                {error && (
                    <div className="absolute top-10 left-6 right-6 bg-red-500/90 text-white p-4 rounded-xl text-center font-bold shadow-2xl animate-bounce z-50">
                        {error}
                    </div>
                )}

                {/* MANUAL INPUT CARD */}
                {(!isScanning && !scannedOrder && !success) && (
                    <GlassCard className="p-8 animate-fade-in-up">
                        <form onSubmit={handleManualSubmit} className="flex flex-col gap-4">
                            <label className="text-white/50 text-sm font-bold uppercase text-center">Ingreso Manual</label>
                            <input
                                type="text"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value)}
                                placeholder="A-001"
                                autoFocus
                                className="w-full bg-black/40 border border-white/20 rounded-xl p-6 text-center text-4xl font-mono font-bold text-white focus:border-lumina-cyan outline-none uppercase"
                            />
                            <GlassButton variant="primary" className="w-full py-4 text-lg">
                                BUSCAR ORDEN
                            </GlassButton>
                        </form>
                    </GlassCard>
                )}

                {/* SUCCESS STATE (Completed) */}
                {success && (
                    <div className="animate-fade-in-up text-center py-10 bg-black/80 backdrop-blur-xl rounded-3xl border border-emerald-500/30">
                        <div className="mx-auto w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center text-white text-6xl mb-6 shadow-[0_0_50px_rgba(16,185,129,0.5)] animate-pulse">
                            ✓
                        </div>
                        <h2 className="text-4xl font-black text-white uppercase">¡Entregado!</h2>
                        <p className="text-white/50 mt-2">Volviendo al escáner...</p>
                    </div>
                )}

                {/* REVIEW ORDER STATE (Bartender View) */}
                {scannedOrder && (
                    <div className="animate-fade-in-up">
                        <GlassCard className="p-0 border-lumina-cyan overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.4)]">
                            {/* Header */}
                            <div className="bg-lumina-cyan p-6 text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                <h2 className="text-6xl font-black text-black font-mono relative z-10">{scannedOrder.pickupCode}</h2>
                                <p className="text-black/80 font-bold mt-2 relative z-10">{scannedOrder.customerName}</p>
                            </div>

                            {/* Items - HUGE TEXT */}
                            <div className="p-6 space-y-4 bg-[#1a1f2e]">
                                {scannedOrder.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0">
                                        <div className="bg-white text-black font-black text-3xl w-14 h-14 flex items-center justify-center rounded-lg shadow-lg">
                                            {item.quantity}
                                        </div>
                                        <span className="text-white text-2xl font-bold leading-tight">{item.name}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="p-4 bg-black/40 grid grid-cols-2 gap-4 backdrop-blur-sm">
                                <button
                                    onClick={handleCancel}
                                    className="bg-red-500/20 text-red-400 font-bold py-4 rounded-xl border border-red-500/30 hover:bg-red-500/30"
                                >
                                    CANCELAR
                                </button>
                                <button
                                    onClick={handleComplete}
                                    className="bg-emerald-500 text-white font-black text-xl py-4 rounded-xl shadow-lg hover:bg-emerald-400 active:scale-95 transition-transform flex items-center justify-center gap-2"
                                >
                                    <span>ENTREGAR</span>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </button>
                            </div>
                        </GlassCard>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventScannerView;
