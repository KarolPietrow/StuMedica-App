import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from "expo-router";
import {StatusBar} from "expo-status-bar";
import {Platform, useColorScheme} from "react-native";
import {COLORS} from "@/styles/theme";
import {useEffect, useState} from "react";
import "@/styles/global.css"

export default function RootLayout() {
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

    if (!mounted) return null;

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(home)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="terms-of-service"
                    options={{
                        presentation: 'modal',
                        headerShown: false
                    }} />
                <Stack.Screen
                    name="login"
                    options={{
                        headerShown: false
                    }} />
                <Stack.Screen
                    name="register"
                    options={{
                        headerShown: false
                    }} />
            </Stack>
        </ThemeProvider>
    )
}
