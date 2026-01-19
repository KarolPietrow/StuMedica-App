import { useState, useEffect, useCallback } from 'react';
import { Alert, AppState, Linking, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { registerForPushNotificationsAsync } from '@/services/notificationService';

const PREFERENCE_KEY = 'user_notifications_enabled';

export function useNotificationObserver() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [hasSystemPermission, setHasSystemPermission] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const checkStatus = useCallback(async () => {
        if (Platform.OS === 'web') {
            setIsChecking(false);
            return;
        }

        try {
            const {status} = await Notifications.getPermissionsAsync();
            const systemGranted = status === 'granted';
            setHasSystemPermission(systemGranted);

            const savedPref = await AsyncStorage.getItem(PREFERENCE_KEY);
            const userWants = savedPref === 'true';

            setNotificationsEnabled(userWants && systemGranted);
        } catch (error) {
            console.error("Błąd sprawdzania powiadomień:", error);
        } finally {
            setIsChecking(false);
        }
    }, []);

    const toggleNotifications = async (newValue: boolean) => {
        if (Platform.OS !== 'web') {
            if (newValue === true) {
                if (!hasSystemPermission) {
                    router.push('/notification-request')
                } else {
                    // Jest zgoda systemowa - włączamy powiadomienia bez request uprawnień
                    setNotificationsEnabled(true);
                    await AsyncStorage.setItem(PREFERENCE_KEY, 'true');
                    return true;
                }
            } else {
                setNotificationsEnabled(false);
                await AsyncStorage.setItem(PREFERENCE_KEY, 'false');
                await Notifications.cancelAllScheduledNotificationsAsync();
                return true;
            }
        }
    };

    const requestAndEnableNotifications = async () => {
        if (Platform.OS === 'web') return false;

        const status = await registerForPushNotificationsAsync();

        if (status === 'granted') {
            setNotificationsEnabled(true);
            setHasSystemPermission(true);
            await AsyncStorage.setItem(PREFERENCE_KEY, 'true');
            return true;
        } else {
            Alert.alert(
                "Wymagane uprawnienia",
                "Nie udzielono zgody na wysyłanie powiadomień. Przejdź do ustawień, aby włączyć powiadomienia.",
                [
                    { text: "Anuluj", style: "cancel" },
                    {
                        text: "Ustawienia",
                        onPress: () => Linking.openSettings()
                    }
                ]
            );
            return false;
        }
    };

    useEffect(() => {
        checkStatus();
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active') {
                checkStatus();
            }
        });
        return () => subscription.remove();
    }, [checkStatus]);

    return {
        notificationsEnabled,
        isChecking,
        toggleNotifications,
        requestAndEnableNotifications
    };
}