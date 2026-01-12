import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Stack, Tabs} from 'expo-router';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import {DynamicColorIOS, Platform} from "react-native";
import {COLORS} from "@/styles/theme";
import {Ionicons} from "@expo/vector-icons";


export default function TabLayout() {
    if (Platform.OS === 'ios') {
        return (
            <NativeTabs
                tintColor={DynamicColorIOS({
                    dark: COLORS.light.primary,
                    light: COLORS.light.primary,
                })}
            >
                <NativeTabs.Trigger name="index">
                    <Label>Główna</Label>
                    <Icon sf="house.fill" />
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="about">
                    <Label>O nas</Label>
                    <Icon sf="info.circle"/>
                </NativeTabs.Trigger>
            </NativeTabs>
            )
    } else {
        return (
            <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: COLORS.light.primary }}>
                <Tabs.Screen
                    name="index"
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
                    name="about"
                    options={{
                        title: 'O nas',
                        tabBarIcon: ({ color, size, focused }) => (
                            <Ionicons
                                name={focused ? 'information-circle' : 'information-circle-outline'}
                                size={size}
                                color={color}
                            />
                        ),
                    }}
                />
            </Tabs>
        )
    }
}
