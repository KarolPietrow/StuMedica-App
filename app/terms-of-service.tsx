import {ScrollView, StyleSheet, Text, useColorScheme, View} from "react-native";
import { COLORS, GLOBAL_STYLES, SIZES } from "@/styles/theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import BackButton from "@/components/BackButton";
import { router } from "expo-router";


export default function TermsOfService() {
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    return (
        <ScrollView style={[GLOBAL_STYLES.container, { backgroundColor: theme.background }]}>
            <BackButton onPress={() => { router.back()}} />
            <View style={styles.contentContainer}>
                <View style={GLOBAL_STYLES.center}>
                    <View style={[styles.iconCircle, GLOBAL_STYLES.shadow]}>
                        <FontAwesome name="plus" size={48} color={theme.background} />
                    </View>
                    <Text style={[styles.titleText]}>StuMedica</Text>
                </View>

                <View style={GLOBAL_STYLES.center}>
                    <Text style={[styles.heading, { color: theme.text }]}>
                        Regulamin korzystania z usług firmy StuMedica
                    </Text>
                    <Text style={[styles.heading, { color: theme.text }]}>
                        [TODO]
                    </Text>
                    <Text style={[styles.description, { color: theme.text }]}>
                        StuMedica to elektroniczny system rejestracji medycznej, który umożliwia pacjentom łatwą rejestrację na wizyty lekarskie.
                    </Text>
                    <Text style={[styles.description, { color: theme.text }]}>
                        Pacjent może wybrać dogodny termin wizyty w kalendarzu, oraz od razu ją opłacić.
                    </Text>
                    <Text style={[styles.description, { color: theme.text }]}>
                        Dostępna jest aplikacja webowa w przeglądarce (stumedica.pl), oraz aplikacja mobilna na urządzenia iOS oraz Android.
                    </Text>
                    <Text style={[styles.description, { color: theme.text }]}>
                        Aplikacja została napisana w React Native (Expo&nbsp;54). Serwer został napisany w Pythonie (SQLite,&nbsp;FastAPI)
                    </Text>
                </View>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 25,
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
        marginBottom: 12,
    },
});