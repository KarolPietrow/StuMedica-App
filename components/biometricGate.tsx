import React, { useEffect, useState, useRef } from 'react';
import {View, Text, StyleSheet, AppState, AppStateStatus, TouchableOpacity, Image, useColorScheme} from 'react-native';
import { biometricService } from '@/services/biometricService';
import { useSession } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/styles/theme';

export function BiometricGate({ children }: { children: React.ReactNode }) {
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    const { signOut } = useSession();
    const appState = useRef(AppState.currentState);

    const [isLocked, setIsLocked] = useState(false);

    const triggerAuth = async () => {
        const result = await biometricService.authenticate();
        if (result.success) {
            setIsLocked(false);
        }
    };

    useEffect(() => {
        const checkStartup = async () => {
            const enabled = await biometricService.isBiometricEnabled();
            if (enabled) {
                setIsLocked(true);
                setTimeout(() => triggerAuth(), 100);
            }
        };
        checkStartup();
    }, []);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', async (nextAppState) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                if (biometricService.isAuthenticating()) {
                    appState.current = nextAppState;
                    return;
                }
                const enabled = await biometricService.isBiometricEnabled();
                if (enabled && !isLocked) {
                    setIsLocked(true);
                    triggerAuth();
                }
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, [isLocked]);

    if (!isLocked) {
        return <>{children}</>;
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.content}>
                <View style={styles.iconCircle}>
                    <Ionicons name="lock-closed" size={64} />
                </View>
                <Text style={[styles.title, { color: theme.text }]}>StuMedica</Text>
                <Text style={[styles.subtitle, { color: theme.text }]}>Aplikacja jest zablokowana</Text>

                <TouchableOpacity style={styles.mainButton} onPress={triggerAuth}>
                    <Ionicons name="finger-print" size={24} />
                    <Text style={styles.mainButtonText}>Odblokuj</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                    <Text style={styles.logoutText}>Nie możesz odblokować? Zaloguj się ponownie</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject, // Pokrywa cały ekran
        zIndex: 9999, // Zawsze na wierzchu
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        padding: 30,
        width: '100%',
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: `${COLORS.light.primary}15`,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 48,
    },
    mainButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.light.primary,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 16,
        alignItems: 'center',
        gap: 12,
        width: '100%',
        justifyContent: 'center',
        marginBottom: 20,
    },
    mainButtonText: {
        fontSize: 18,
        fontWeight: '600',
    },
    logoutButton: {
        padding: 16,
    },
    logoutText: {
        color: COLORS.light.error,
        fontSize: 14,
        fontWeight: '500',
    }
});