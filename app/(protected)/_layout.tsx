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
            <NativeTabs.Trigger name="appointments">
                <Label>Wizyty</Label>
                <Icon sf="calendar" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="medicine">
                <Label>Leki</Label>
                <Icon sf="calendar" />
            </NativeTabs.Trigger>
            <NativeTabs.Trigger name="account">
                <Label>Konto</Label>
                <Icon sf="person"/>
            </NativeTabs.Trigger>
        </NativeTabs>
        )
}
