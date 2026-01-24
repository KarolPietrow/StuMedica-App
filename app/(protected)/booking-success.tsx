import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {COLORS, GLOBAL_STYLES} from '@/styles/theme';

const { width } = Dimensions.get('window');

export default function BookingSuccessScreen() {
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    const handleDone = () => {
        router.dismissAll();
        router.replace('/dashboard');
    };

    return (
        <SafeAreaView
            style={[GLOBAL_STYLES.container, { backgroundColor: theme.background }]}
            edges={['right', 'left', 'top']
        }>
            <View style={styles.content}>

                {/* Animacja/Ikona Sukcesu */}
                <View style={[styles.iconContainer, { backgroundColor: '#4CD964' + '15' }]}>
                    <Ionicons name="checkmark-circle" size={100} color="#4CD964" />
                </View>

                <Text style={[styles.title, { color: theme.text }]}>Wizyta potwierdzona!</Text>

                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Twoja rezerwacja została pomyślnie przesłana.{'\n'}
                    Szczegóły znajdziesz w zakładce Wizyty.
                </Text>

                {/* Karta informacyjna (Opcjonalnie) */}
                <View style={[styles.infoCard, { backgroundColor: theme.surface }]}>
                    <Ionicons name="mail-open-outline" size={24} color={theme.primary} />
                    <Text style={[styles.infoText, { color: theme.text }]}>
                        Potwierdzenie wysłaliśmy na Twój e-mail.
                    </Text>
                </View>
            </View>

            {/* Przycisk na dole */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={handleDone}
                >
                    <Text style={[styles.buttonText, {color: theme.background}]}>
                        Wróć do ekranu głównego
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        gap: 12,
        width: '100%',
    },
    infoText: {
        fontSize: 14,
        flex: 1,
    },
    footer: {
        padding: 20,
        paddingBottom: 40,
    },
    button: {
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});