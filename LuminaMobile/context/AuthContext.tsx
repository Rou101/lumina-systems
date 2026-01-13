import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useSegments } from 'expo-router';

interface User {
    id: string;
    name: string;
    email: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// This hook can be used to access the user info.
export function useAuth() {
    return useContext(AuthContext);
}

// This hook will protect the routes.
function useProtectedRoute(user: User | null) {
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const inAuthGroup = segments[0] === '(tabs)';

        if (
            // If the user is not signed in and the initial segment is not anything in the auth group.
            !user &&
            inAuthGroup
        ) {
            // Redirect to the sign-in page.
            router.replace('/');
        } else if (user && !inAuthGroup) {
            // Redirect away from the sign-in page.
            router.replace('/(tabs)/feed');
        }
    }, [user, segments]);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useProtectedRoute(user);

    useEffect(() => {
        // Check for persisted session
        async function checkSession() {
            try {
                const session = await SecureStore.getItemAsync('LUMINA_MOB_SESSION');
                if (session) {
                    setUser(JSON.parse(session));
                }
            } catch (e) {
                console.error('Session restore failed', e);
            } finally {
                setIsLoading(false);
            }
        }
        checkSession();
    }, []);

    const signIn = async () => {
        // SIMULATED GOOGLE AUTH
        // In production, this would use GoogleSignin.signIn()
        const mockUser: User = {
            id: 'google-123456',
            name: 'Lumina Agent',
            email: 'agent@lumina.os',
            token: 'mock-jwt-token-xyz-999'
        };

        setUser(mockUser);
        await SecureStore.setItemAsync('LUMINA_MOB_SESSION', JSON.stringify(mockUser));
    };

    const signOut = async () => {
        setUser(null);
        await SecureStore.deleteItemAsync('LUMINA_MOB_SESSION');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                signIn,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
