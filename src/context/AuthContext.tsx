import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check local storage on mount
        const stored = localStorage.getItem('LUMINA_SESSION');
        if (stored) {
            setUser(JSON.parse(stored));
        }
        setIsLoading(false);
    }, []);

    const login = async () => {
        return new Promise<void>((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                const mockUser: User = {
                    id: 'admin-001',
                    name: 'Lumina Admin',
                    email: 'admin@lumina.os',
                    avatar: 'https://ui-avatars.com/api/?name=Lumina+Admin&background=00f0ff&color=000'
                };
                localStorage.setItem('LUMINA_SESSION', JSON.stringify(mockUser));
                setUser(mockUser);
                resolve();
            }, 1500);
        });
    };

    const logout = () => {
        localStorage.removeItem('LUMINA_SESSION');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
