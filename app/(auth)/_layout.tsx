import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Platform } from "react-native";


export default function TabLayout() {
    return (
        <NativeTabs>
            <NativeTabs.Trigger name="dashboard">
                <Label>Główna</Label>
                <Icon sf="house.fill" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="Calendar">
                <Label>Kalendarz</Label>
                <Icon sf="calendar" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="Account">
                <Label>Konto</Label>
                <Icon sf="person"/>
            </NativeTabs.Trigger>
        </NativeTabs>
        )
}
