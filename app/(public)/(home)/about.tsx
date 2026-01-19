import {ScrollView, StyleSheet, Text, useColorScheme, View} from "react-native";
import { COLORS, GLOBAL_STYLES, SIZES } from "@/styles/theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { SafeAreaView } from 'react-native-safe-area-context';
import React from "react";


export default function About() {
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    return (
        <SafeAreaView style={[GLOBAL_STYLES.container, { backgroundColor: theme.background }]}>
            <View style={[GLOBAL_STYLES.container, { backgroundColor: theme.background }]}>

                <ScrollView style={[GLOBAL_STYLES.container, { backgroundColor: theme.background }]}>
                    <View style={styles.contentContainer}>
                        <View style={GLOBAL_STYLES.center}>
                            <View style={[styles.iconCircle, GLOBAL_STYLES.shadow]}>
                                <FontAwesome name="plus" size={48} color={theme.background} />
                            </View>
                            <Text style={[styles.titleText]}>StuMedica</Text>
                        </View>

                        <View style={GLOBAL_STYLES.center}>
                            <Text style={[styles.heading, { color: theme.text }]}>
                                System rejestracji medycznej dla pacjentów 💖
                            </Text>
                            <Text style={[styles.description, { color: theme.text }]}>
                                StuMedica to elektroniczny system rejestracji medycznej, który umożliwia pacjentom łatwą rejestrację na wizyty lekarskie.
                            </Text>
                            <Text style={[styles.description, { color: theme.text }]}>
                                Pacjent może wybrać dogodny termin wizyty w kalendarzu, oraz od razu ją opłacić.
                            </Text>
                            <Text style={[styles.description, { color: theme.text }]}>
                                Dostępna jest też wirtualna apteczka, która umożliwia dodawanie leków, wraz z dawką oraz harmonogramem. Lista jest synchronizowana z serwerem, więc jest dostępna na każdym urządzeniu - wystarczy się zalogować.
                            </Text>
                            <Text style={[styles.description, { color: theme.text }]}>
                                Aplikacja umożliwia wysyłanie powiadomień w celu przypomnienia o wzięciu leków, oraz o nadchodzącej wizycie lekarskiej.
                            </Text>
                            <Text style={[styles.description, { color: theme.text }]}>
                                Dostępna jest aplikacja webowa w przeglądarce (stumedica.pl), oraz aplikacja mobilna na urządzenia iOS oraz Android.
                            </Text>
                            <Text style={[styles.description, { color: theme.text }]}>
                                Aplikacja została napisana w React Native (Expo&nbsp;54). Serwer został napisany w Pythonie (SQLite,&nbsp;FastAPI)
                            </Text>
                        </View>
                    </View>

                    <View style={GLOBAL_STYLES.center}>
                        <Text style={[styles.heading, { color: theme.text }]}>
                            Autorzy
                        </Text>
                        <Text style={[styles.description, { color: theme.text }]}>
                            Karol Pietrów - frontend
                        </Text>
                        <Text style={[styles.description, { color: theme.text }]}>
                            Wiktoria Powroźnik - frontend
                        </Text>
                        <Text style={[styles.description, { color: theme.text }]}>
                            Patrycja Siczek - backend
                        </Text>
                        <Text style={[styles.description, { color: theme.text }]}>
                            Angelina Szuszkiewicz - backend
                        </Text>
                    </View>
                </ScrollView>


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
        color: COLORS.light.primary
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
    scrollContent: {
        flexGrow: 1,
        padding: SIZES.padding,
        paddingBottom: 40,
    },
});