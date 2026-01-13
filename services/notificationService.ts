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

        return finalStatus;
    } else {
        console.log('Must use physical device for Push Notifications');
        return 'undefined';
    }
}

export async function checkPermissionsStatus() {
    if (Platform.OS === 'web') return false;
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
}

export async function scheduleTestNotification() {
    if (Platform.OS === 'web') return;

    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Nadchodząca wizyta",
            body: "Zbliża się Twoja umówiona wizyta w StuMedica! 🦆",
            sound: true,

            // data: { someData: 'goes here' }, // Opcjonalne dane
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 10, // Czas w sekundach od teraz
            repeats: false
        },
    });
}