import React, { createContext, useContext, useState, useEffect } from 'react';
import loginApi, {
    saveToken,
    removeToken,
    getToken,
    fetchWithAuth,
    validateSession,
    logoutApi
} from '@/services/authService';
import { router } from "expo-router";
import {Platform} from "react-native";

interface AuthContextType {
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    session: string | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useSession() {
    const value = useContext(AuthContext);
    if (process.env.NODE_ENV !== 'production') {
        if (!value) {
            throw new Error('useSession must be wrapped in a <SessionProvider />');
        }
    }
    return value as AuthContextType;
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            try {
                if (Platform.OS === 'web') {
                    const userData = await validateSession();
                    if (userData) {
                        setSession('active_web_session');
                    }
                } else {
                    const token = await getToken();
                    if (token) {
                        setSession(token);
                    }

                }
            } catch (e) {
                console.log("Błąd odczytu tokena", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadToken();
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            const data = await loginApi(email, password);

            if (data.token) {
                setSession(data.token);
                await saveToken(data.token);
                router.replace('/dashboard');
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const signOut = async () => {
        await logoutApi();
        setSession(null);
        router.replace('/(public)/(home)');
    };

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signOut,
                session,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}