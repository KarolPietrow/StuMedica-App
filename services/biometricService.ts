import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';

const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';

let isAuthInProgress = false;

export const biometricService = {
    async isHardwareAvailable(): Promise<boolean> {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        return hasHardware && isEnrolled;
    },

    async isBiometricEnabled(): Promise<boolean> {
        const storedValue = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
        return storedValue === 'true';
    },

    async setBiometricEnabled(enabled: boolean): Promise<void> {
        await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, String(enabled));
    },

    isAuthenticating(): boolean {
        return isAuthInProgress;
    },

    async authenticate(): Promise<{ success: boolean; error?: string }> {
        if (isAuthInProgress) {
            return { success: false, error: 'Auth in progress' };
        }
        isAuthInProgress = true;

        try {
            const hasHardware = await this.isHardwareAvailable();
            if (!hasHardware) return { success: false, error: 'Brak biometrii' };

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Odblokuj StuMedica',
                fallbackLabel: 'Użyj PIN',
                disableDeviceFallback: false,
                cancelLabel: 'Anuluj',
            });

            if (result.success) {
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (error) {
            return { success: false, error: 'Błąd systemowy' };
        } finally {
            setTimeout(() => {
                isAuthInProgress = false;
            }, 3000);
        }
    }
};