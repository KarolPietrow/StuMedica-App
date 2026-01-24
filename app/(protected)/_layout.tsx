import { Stack } from "expo-router";
import { BiometricGate } from "@/components/biometricGate";

export default function TabLayout() {

    return (
        <BiometricGate>
            <Stack>
                <Stack.Screen
                    name="(home)"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="notification-request"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="chat"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="appointment-calendar"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="booking-summary"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="booking-success"
                    options={{ headerShown: false }}
                />
            </Stack>
        </BiometricGate>
    )
}