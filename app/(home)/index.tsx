// npx expo start
// npx expo run:android --no-build-cache --device
// npx expo export --platform web

import {Text, View, StyleSheet, Button, useColorScheme, TouchableOpacity, StatusBar, ScrollView} from "react-native";
import { COLORS, GLOBAL_STYLES, SIZES } from "@/styles/theme";
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {SafeAreaView} from "react-native-safe-area-context";
import React from 'react'


export default function Index() {
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];
    const router = useRouter();

    return (
        <SafeAreaView
            style={[GLOBAL_STYLES.container, { backgroundColor: theme.background }]}
        >
            <View style={styles.contentContainer}>
                <View style={GLOBAL_STYLES.center}>
                    <View style={[styles.iconCircle, GLOBAL_STYLES.shadow]}>
                        <FontAwesome name="plus" size={48} color={theme.background} />
                    </View>
                    <Text style={[styles.titleText]}>StuMedica</Text>
                </View>

                <View style={GLOBAL_STYLES.center}>
                    <Text style={[styles.heading, { color: theme.text }]}>
                        Twoje zdrowie w dobrych rękach
                    </Text>
                    <Text style={[styles.description, { color: theme.textSecondary }]}>
                        Witamy w StuMedica, gdzie pomożemy Ci dobrać lekarza idealnego dla Twoich potrzeb.
                        Razem zadbajmy o Twoje zdrowie. 💖
                    </Text>
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={[GLOBAL_STYLES.primaryButton, GLOBAL_STYLES.shadow]}
                        onPress={() => { router.push('/login') }}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.primaryButtonText}>Zaloguj się</Text>
                    </TouchableOpacity>

                    <View style={[GLOBAL_STYLES.center, { marginTop: 10, gap: 10 }]}>
                        <Text style={{ color: theme.textSecondary }}>Nie masz jeszcze konta?</Text>
                        <TouchableOpacity onPress={() => { router.push('/register') }}>
                            <Text style={styles.secondaryButtonText}>Utwórz konto pacjenta</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: SIZES.padding,
        justifyContent: 'space-evenly'
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.light.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    titleText: {
        fontSize: 50,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
        color: 'rgb(118 231 162)'
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: '90%',
    },
    buttonsContainer: {
        gap: 16,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    secondaryButtonText: {
        fontSize: 17,
        fontWeight: '600',
        color: COLORS.light.primary
    },
    scrollContent: {
        flexGrow: 1,
        padding: SIZES.padding,
        paddingBottom: 40,
    },
});