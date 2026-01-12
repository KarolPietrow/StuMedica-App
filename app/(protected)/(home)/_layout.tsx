import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import {DynamicColorIOS, Platform} from "react-native";
import {COLORS} from "@/styles/theme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
    if (Platform.OS === 'ios') {
        return (
            <NativeTabs
                tintColor={DynamicColorIOS({
                    dark: COLORS.light.primary,
                    light: COLORS.light.primary,
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
