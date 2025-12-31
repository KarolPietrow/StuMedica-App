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
    user: UserProfile | null;
    refreshUser: () => Promise<void>;
}

export interface UserProfile {
    name: string;
    email: string;
    // account_type: string;
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
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const res = await fetchWithAuth('/auth/me');
            if (res.ok) {
                const userData = await res.json();
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (e) {
            console.log("Nie udało się odświeżyć danych użytkownika", e);
        }
    };

    useEffect(() => {
        const loadUserSession = async () => {
            try {
                if (Platform.OS === 'web') {
                    const userData = await validateSession();
                    if (userData) {
                        setSession('active_web_session');
                        setUser(userData);
                    }
                } else {
                    const token = await getToken();
                    if (token) {
                        setSession(token);
                        await refreshUser();
                    }
                }
            } catch (e) {
                console.log("Błąd przywracania sesji", e);
                setSession(null);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        loadUserSession();
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            const data = await loginApi(email, password);

            if (data.token) {
                await saveToken(data.token);
                setSession(data.token);
                await refreshUser();
                router.replace('/dashboard');
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const signOut = async () => {
        await removeToken();
        await logoutApi();
        setSession(null);
        setUser(null);
        router.replace('/(public)/(home)');
    };

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signOut,
                session,
                isLoading,
                user,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}