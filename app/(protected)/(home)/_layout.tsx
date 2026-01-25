import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import {DynamicColorIOS, Platform, View, StyleSheet, ActivityIndicator, Text, useColorScheme} from "react-native";
import {COLORS} from "@/styles/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {useSession} from "@/context/AuthContext";
import {useEffect, useState} from "react";

export default function TabLayout() {
    const { user } = useSession()

    const colorScheme = useColorScheme()
    const theme = COLORS[colorScheme ?? 'light'];

    const [isTakingTooLong, setIsTakingTooLong] = useState(false);


    useEffect(() => {
        let timeout: number;
        if (!user) {
            timeout = setTimeout(() => {
                setIsTakingTooLong(true);
            }, 8000);
        } else {
            setIsTakingTooLong(false);
        }
        return () => clearTimeout(timeout);
    }, [user]);

    if (!user) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                { isTakingTooLong ? (
                    <View style={styles.contentBox}>
                        <Ionicons name="cloud-offline-outline" size={64} color={theme.textSecondary} />
                        <Text style={[styles.errorTitle, { color: theme.text }]}>
                            Serwer nie odpowiada
                        </Text>
                        <Text style={[styles.errorText, { color: theme.textSecondary }]}>
                            Ładowanie trwa dłużej niż zwykle. Sprawdź połączenie z internetem. Upewnij się, że serwer jest dostępny pod api.stumedica.pl.
                        </Text>
                    </View>
                ) : (
                    <View style={styles.contentBox}>
                        <ActivityIndicator size="large" color={COLORS.light.primary} />
                        <Text style={{ color: theme.textSecondary, marginTop: 20, fontWeight: '500' }}>
                            Ładowanie StuMedica...
                        </Text>
                    </View>
                )}
            </View>
        )
    }

    if (Platform.OS === 'ios') {
        return (
            <NativeTabs
                tintColor={DynamicColorIOS({
                    dark: COLORS.light.primary,
                    light: COLORS.light.primary
                })}
            >
                <NativeTabs.Trigger name="dashboard">
                    <Label>Główna</Label>
                    <Icon sf="house.fill"/>
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="appointments">
                    <Label>Wizyty</Label>
                    <Icon sf="calendar"/>
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="medicine">
                    <Label>Leki</Label>
                    <Icon sf="pills"/>
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="account">
                    <Label>Konto</Label>
                    <Icon sf="person"/>
                </NativeTabs.Trigger>
            </NativeTabs>
        )
    } else {
        return (
            <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: COLORS.light.primary }}>
                <Tabs.Screen
                    name="dashboard"
                    options={{
                        title: 'Główna',
                        tabBarIcon: ({ color, size, focused }) => (
                            <Ionicons
                                name={focused ? 'home' : 'home-outline'}
                                size={size}
                                color={color}
                            />
                        )
                    }}
                />
                <Tabs.Screen
                    name="appointments"
                    options={{
                        title: 'Wizyty',
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons
                                name={focused ? 'calendar' : 'calendar-outline'}
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="medicine"
                    options={{
                        title: 'Leki',
                        tabBarIcon: ({ color, focused }) => (
                            <MaterialCommunityIcons
                                name="pill"
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="account"
                    options={{
                        title: 'Konto',
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons
                                name={focused ? 'person' : 'person-outline'}
                                size={24}
                                color={color}
                            />
                        ),
                    }}
                />
            </Tabs>
        )
    }
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
