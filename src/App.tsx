
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom';
import StaffDashboard from './pages/StaffDashboard';
import KitchenDisplay from './pages/KitchenDisplay';
import AdminSettings from './pages/AdminSettings';
import Login from './pages/Login';
import KitchenDisplay from './pages/KitchenDisplay';
import { LandingPage } from './components/LandingPage';
import EventClientView from './pages/EventClientView';
import EventClientView from './pages/EventClientView';
import EventScannerView from './pages/EventScannerView';
import LuminaCore from './pages/LuminaCore';
import { AuthGuard } from './components/core/AuthGuard';

// Staff Navigation Bar (Floating)
const StaffNavigation = () => {
    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-black/80 backdrop-blur-xl rounded-full px-6 py-3 flex gap-6 text-xs border border-white/20 shadow-2xl items-center">
                <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">CREW</span>
                <div className="w-px h-4 bg-white/20"></div>
                <Link to="/staff/dashboard" className="text-white hover:text-cyan-400 font-bold uppercase">Monitor</Link>
                <Link to="/staff/scanner" className="text-white hover:text-cyan-400 font-bold uppercase">Scanner</Link>
                <Link to="/staff/kitchen" className="text-white hover:text-cyan-400 font-bold uppercase">Cocina</Link>
                <div className="w-px h-4 bg-white/20"></div>
                <Link to="/staff/admin" className="text-purple-400 hover:text-white font-bold uppercase">Admin</Link>
            </div>
        </nav>
    );
};

const StaffLayout = () => {
    const [role, setRole] = useState<'staff' | 'kitchen' | 'admin' | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

    // If we are not logged in and not on login page, redirect
    // For MVP/Demo ease, if we are fresh, we go to login.
    if (!role && location.pathname !== '/staff/login') {
        return <Navigate to="/staff/login" replace />;
    }

    return (
        <>
            <Routes>
                <Route path="login" element={
                    <Login onLogin={(r) => {
                        const mappedRole = (r === 'manager') ? 'admin' : (r === 'kitchen') ? 'kitchen' : 'staff';
                        setRole(mappedRole);
                        if (mappedRole === 'staff') navigate('/staff/dashboard');
                        if (mappedRole === 'kitchen') navigate('/staff/kitchen');
                        if (mappedRole === 'admin') navigate('/staff/admin');
                    }} />
                } />

                <Route path="dashboard" element={<StaffDashboard />} />
                <Route path="kitchen" element={<KitchenDisplay area="kitchen" />} />
                <Route path="bar" element={<KitchenDisplay area="bar" />} />
                <Route path="scanner" element={<EventScannerView />} />
                <Route path="admin" element={role === 'admin' ? <AdminSettings /> : <Navigate to="/staff/login" />} />
            </Routes>

            {/* Show nav only if logged in */}
            {role && <StaffNavigation />}
        </>
    );
};

import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';

// ... existing StaffLayout ...

import { OfflineBanner } from './components/OfflineBanner';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <HashRouter future={{ v7_startTransition: true }}>
                <div className="font-sans antialiased selection:bg-cyan-500 selection:text-black">
                    <OfflineBanner />
                    <Routes>
                        {/* Public Login */}
                        <Route path="/login" element={<Login />} />

                        {/* Public Landing (Sales Pitch) */}
                        <Route path="/" element={<LandingPage />} />

                        {/* Main Event Client View (The Product) */}
                        <Route path="/event/:tableId" element={<EventClientView />} />

                        {/* Global Event View (Default) */}
                        <Route path="/event" element={<Navigate to="/event/GEN" replace />} />

                        {/* GOD MODE (Secret Route) - PROTECTED */}
                        <Route path="/core" element={
                            <AuthGuard>
                                <LuminaCore />
                            </AuthGuard>
                        } />

                        {/* Staff Area (The OS) */}
                        <Route path="/staff/*" element={<StaffLayout />} />

                        {/* Admin Route - AUTH REQUIRED */}
                        <Route path="/admin" element={
                            <PrivateRoute>
                                <AdminSettings />
                            </PrivateRoute>
                        } />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </HashRouter>
        </AuthProvider>
    );
};

export default App;
