import { ExtensionStorage } from '@bacons/apple-targets';import { Platform } from 'react-native';
import { Medication } from './medicationService';

const APP_GROUP_ID = 'group.pl.stumedica.stumedica-mobile.widget';

const widgetStorage = new ExtensionStorage(APP_GROUP_ID);

interface WidgetData {
    medName: string;
    medDosage: string;
    medTime: string;
    hasDose: boolean;
}

interface NextDoseInfo {
    time: string;
    med: Medication;
    minutes: number;
}

let reloadTimer: number | null = null;

export const updateWidget = async (medications: Medication[]) => {
    if (Platform.OS !== 'ios') return;

    try {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        let nextDose: NextDoseInfo | undefined;

        medications.forEach(med => {
            if (!med.is_active || !med.reminders) return;
            med.reminders.forEach(time => {
                const [h, m] = time.split(':').map(Number);
                const doseMinutes = h * 60 + m;

                if (doseMinutes > currentMinutes) {
                    if (!nextDose || doseMinutes < nextDose.minutes) {
                        nextDose = { time, med, minutes: doseMinutes };
                    }
                }
            });
        });

        const widgetData: WidgetData = nextDose
            ? {
                medName: nextDose.med.name,
                medDosage: nextDose.med.dosage,
                medTime: nextDose.time,
                hasDose: true
            }
            : {
                medName: "Wszystkie leki wzięte",
                medDosage: "",
                medTime: "--:--",
                hasDose: false
            };

        widgetStorage.set('nextDoseData', JSON.stringify(widgetData));
        console.log("Zapisano dane do AppGroup:", widgetData.medName);

        if (reloadTimer) {
            clearTimeout(reloadTimer);
        }

        ExtensionStorage.reloadWidget();

        reloadTimer = setTimeout(() => {
            ExtensionStorage.reloadWidget();
            console.log("Wysłano sygnał odświeżenia do WidgetKit");
            reloadTimer = null;
        }, 1000); // 1000ms opóźnienia
    } catch (error) {
        console.error("Błąd aktualizacji widgetu:", error);
    }
};