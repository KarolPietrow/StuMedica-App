import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import {Platform} from "react-native";


export default function TabLayout() {
    if (Platform.OS === 'ios') {
        return (
            <NativeTabs>
                <NativeTabs.Trigger name="index">
                    <Label>Główna</Label>
                    <Icon sf="house.fill" drawable="ic_menu_add" />
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="Login">
                    <Label>Logowanie</Label>
                    <Icon sf="person.crop.circle" drawable="custom_android_drawable" />
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="Register">
                    <Label>Rejestracja</Label>
                    <Icon sf="person.badge.plus" drawable="ic_menu_add" />
                </NativeTabs.Trigger>
                <NativeTabs.Trigger name="About">
                    <Label>O nas</Label>
                    <Icon sf="info.circle"/>
                </NativeTabs.Trigger>
            </NativeTabs>
            )
    } else {
        return (
            <Tabs screenOptions={{
                tabBarActiveTintColor: 'blue',
                headerShown: false,
            }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Główna',
                        tabBarIcon: ({color}) => <FontAwesome size={28} name="home" color={color}/>,
                    }}
                />
                <Tabs.Screen
                    name="Login"
                    options={{
                        title: 'Logowanie',
                        tabBarIcon: ({color}) => <SimpleLineIcons name="login" size={22} color="black"/>,
                    }}
                />
                <Tabs.Screen
                    name="Register"
                    options={{
                        title: 'Rejestracja',
                        tabBarIcon: ({color}) => <FontAwesome size={28} name="pencil" color={color}/>,
                    }}
                />
                <Tabs.Screen
                    name="About"
                    options={{
                        title: 'O nas',
                        tabBarIcon: ({color}) => <FontAwesome size={28} name="info" color={color}/>,
                    }}
                />
            </Tabs>
        )
    }
}
