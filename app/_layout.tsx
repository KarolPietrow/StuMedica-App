import { Text, ActivityIndicator, Platform, useColorScheme, View, StyleSheet } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from "expo-router";
import { COLORS } from "@/styles/theme";
import { useEffect, useState } from "react";
import "@/styles/global.css"
import { SessionProvider, useSession } from '@/context/AuthContext';
import {Ionicons} from "@expo/vector-icons";

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

    // const [isTakingTooLong, setIsTakingTooLong] = useState(false);

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

    // useEffect(() => {
    //     let timeout: number;
    //     if (isLoading) {
    //         timeout = setTimeout(() => {
    //             setIsTakingTooLong(true);
    //         }, 8000);
    //     } else {
    //         setIsTakingTooLong(false);
    //     }
    //     return () => clearTimeout(timeout);
    // }, [isLoading]);

    if (!mounted) {
        return null;
    }

    if (isLoading) {
        return null;
        // return (
        //     // <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        //     //     { isTakingTooLong ? (
        //     //         <View style={styles.contentBox}>
        //     //             <Ionicons name="cloud-offline-outline" size={64} color={theme.textSecondary} />
        //     //             <Text style={[styles.errorTitle, { color: theme.text }]}>
        //     //                 Serwer nie odpowiada
        //     //             </Text>
        //     //             <Text style={[styles.errorText, { color: theme.textSecondary }]}>
        //     //                 Ładowanie trwa dłużej niż zwykle. Sprawdź połączenie z internetem. Upewnij się, że serwer jest dostępny pod api.stumedica.pl.
        //     //             </Text>
        //     //         </View>
        //     //     ) : (
        //     //         <View style={styles.contentBox}>
        //     //             <ActivityIndicator size="large" color={COLORS.light.primary} />
        //     //             <Text style={{ color: theme.textSecondary, marginTop: 20, fontWeight: '500' }}>
        //     //                 Ładowanie StuMedica...
        //     //             </Text>
        //     //         </View>
        //     //     )}
        //     // </View>
        // )
    }

    return (
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
            </Stack>
        </ThemeProvider>
    )
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    contentBox: {
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 300,
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'center',
    },
    errorText: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    }
});
