import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
// import Constants from 'expo-constants';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync() {
    // let token;

    if (Platform.OS === 'web') {
        return null;
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('medication-reminders', {
            name: 'Przypomnienia o lekach',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            return null; // Użytkownik odmówił
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }
}

export async function checkPermissionsStatus() {
    if (Platform.OS === 'web') return false;
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
}