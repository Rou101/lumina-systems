import React, { useState, useEffect } from 'react';
import { LockScreen } from './LockScreen';

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check session storage on mount
        const key = sessionStorage.getItem('LUMINA_MASTER_KEY');
        if (key === 'VALID') {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const handleUnlock = () => {
        sessionStorage.setItem('LUMINA_MASTER_KEY', 'VALID');
        setIsAuthenticated(true);
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
                <div className="text-red-500 font-mono animate-pulse tracking-widest">SECURE_BOOT_SEQUENCE...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LockScreen onUnlock={handleUnlock} />;
    }

    return <>{children}</>;
}
