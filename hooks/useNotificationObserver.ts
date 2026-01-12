import { useState, useEffect, useCallback } from 'react';
import {Alert, AppState, Linking, Platform} from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
                    // TODO ZAIMPLEMENTOWAĆ ŁADNY EKRAN

                    Alert.alert(
                        "Brak uprawnień",
                        "Aby włączyć powiadomienia, musisz zezwolić na nie w ustawieniach systemu.",
                        [
                            {text: "Anuluj", style: "cancel"},
                            {text: "Ustawienia", onPress: () => Linking.openSettings()}
                        ]
                    );
                    return false;

                } else {
                    // Jest zgoda systemowa - włączamy powiadomienia bez request uprawnień
                    setNotificationsEnabled(true);
                    await AsyncStorage.setItem(PREFERENCE_KEY, 'true');
                    return true;
                }
            } else {
                // Wyłączenie powiadomień
                setNotificationsEnabled(false);
                await AsyncStorage.setItem(PREFERENCE_KEY, 'false');
                return true;
            }
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
        toggleNotifications
    };
}