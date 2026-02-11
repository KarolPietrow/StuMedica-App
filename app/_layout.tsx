import { Text, Platform, useColorScheme, View, StyleSheet } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from "expo-router";
import { COLORS } from "@/styles/theme";
import { useEffect, useState } from "react";
import "@/styles/global.css"
import { SessionProvider, useSession } from '@/context/AuthContext';
import {Head} from "expo-router/build/head";
import CookieBanner from "@/components/CookieBanner";

export default function RootLayout() {
    return (
        <SessionProvider>
            <InitialLayout />
        </SessionProvider>
    );
}

function InitialLayout() {
    const { session, isLoading } = useSession();

    const colorScheme = useColorScheme()
    const theme = COLORS[colorScheme ?? 'light'];
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (Platform.OS === 'web') {
            let metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (!metaThemeColor) {
                metaThemeColor = document.createElement('meta');
                document.head.appendChild(metaThemeColor);
            }
            metaThemeColor.setAttribute('content', theme.background);

            document.body.style.backgroundColor = theme.background;
            document.documentElement.style.backgroundColor = theme.background;
        }
    }, [colorScheme, theme.background]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || isLoading) {
        return null;
    }

    return (
        <>
            { Platform.OS === 'web' && (
                <Head>
                    <title>StuMedica</title>
                </Head>
            ) }
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Protected guard={!session}>
                    <Stack.Screen name="(public)" options={{ headerShown: false }} />
                </Stack.Protected>

                <Stack.Protected guard={!!session}>
                    <Stack.Screen name="(protected)" options={{ headerShown: false }} />
                </Stack.Protected>
                <Stack.Screen
                    name="terms-of-service"
                    options={{
                        // presentation: 'modal',
                        headerShown: false
                    }} />
                <Stack.Screen
                    name="privacy-policy"
                    options={{
                        // presentation: 'modal',
                        headerShown: false
                    }} />
                <Stack.Screen
                    name="aboutMain"
                    options={{
                        // presentation: 'modal',
                        headerShown: false
                    }} />
            </Stack>
            <CookieBanner />
        </ThemeProvider>
        </>
    )
}
