import FontAwesome from '@expo/vector-icons/FontAwesome';
import {Stack, Tabs} from 'expo-router';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { Platform } from "react-native";


export default function TabLayout() {
    // if (Platform.OS === 'web') { // ŹLE, poprawić
        return (
            <NativeTabs>
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
    // }
}
