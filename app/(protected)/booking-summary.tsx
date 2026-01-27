import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, Alert, ActivityIndicator, useColorScheme, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import {COLORS, GLOBAL_STYLES} from '@/styles/theme';
import { useSession } from '@/context/AuthContext';
import { appointmentService } from '@/services/appointmentService';

export default function BookingSummaryScreen() {
    const { user } = useSession();
    const params = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    const { slotId, doctorName, specialization, price, date } = params;
    const parsedDate = parseISO(date as string);

    const [notes, setNotes] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'online'>('cash');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirmBooking = async () => {
        setIsSubmitting(true);
        try {
            await appointmentService.bookAppointment(Number(slotId), notes);
            router.replace('/(protected)/booking-success');
        } catch (e) {
            Alert.alert("Błąd", "Nie udało się potwierdzić wizyty. Spróbuj ponownie.");
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView
            style={[GLOBAL_STYLES.container, { backgroundColor: theme.background }]}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Podsumowanie</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* 1. KARTA WIZYTY */}
                <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Szczegóły wizyty</Text>
                <View style={[styles.card, { backgroundColor: theme.surface }]}>
                    <View style={styles.doctorRow}>
                        <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary + '20' }]}>
                            <Text style={[styles.avatarText, {  }]}>
                                {doctorName ? (doctorName as string).charAt(0) : 'D'}
                            </Text>
                        </View>
                        <View>
                            <Text style={[styles.doctorName, { color: theme.text }]}>{doctorName}</Text>
                            <Text style={[styles.specialization, { color: theme.textSecondary }]}>{specialization}</Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: theme.border }]} />

                    <View style={styles.detailsRow}>
                        <View style={styles.detailItem}>
                            <Ionicons name="calendar-outline" size={20} color={theme.primary} />
                            <Text style={[styles.detailText, { color: theme.text }]}>
                                {format(parsedDate, 'd MMMM yyyy', { locale: pl })}
                            </Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="time-outline" size={20} color={theme.primary} />
                            <Text style={[styles.detailText, { color: theme.text }]}>
                                {format(parsedDate, 'HH:mm')}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* 2. DANE PACJENTA */}
                <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Dane pacjenta</Text>
                <View style={[styles.card, { backgroundColor: theme.surface }]}>
                    <View style={styles.detailItem}>
                        <Ionicons name="person-outline" size={20} color={theme.textSecondary} />
                        <Text style={[styles.detailText, { color: theme.text }]}>{user?.name}</Text>
                    </View>
                    <View style={[styles.detailItem, { marginTop: 12 }]}>
                        <Ionicons name="mail-outline" size={20} color={theme.textSecondary} />
                        <Text style={[styles.detailText, { color: theme.text }]}>{user?.email}</Text>
                    </View>
                </View>

                {/* 3. METODA PŁATNOŚCI */}
                <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Metoda płatności</Text>
                <View style={styles.paymentContainer}>
                    <TouchableOpacity
                        style={[
                            styles.paymentOption,
                            { backgroundColor: theme.surface, borderColor: paymentMethod === 'cash' ? theme.primary : 'transparent' }
                        ]}
                        onPress={() => setPaymentMethod('cash')}
                    >
                        <Ionicons
                            name="cash-outline"
                            size={24}
                            color={paymentMethod === 'cash' ? theme.primary : theme.textSecondary}
                        />
                        <Text style={[
                            styles.paymentText,
                            { color: paymentMethod === 'cash' ? theme.primary : theme.textSecondary }
                        ]}>Gotówka</Text>
                        {paymentMethod === 'cash' && (
                            <View style={[styles.checkBadge, { backgroundColor: theme.primary }]}>
                                <Ionicons name="checkmark" size={12} color="#FFF" />
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.paymentOption,
                            { backgroundColor: theme.surface, borderColor: paymentMethod === 'online' ? theme.primary : 'transparent' }
                        ]}
                        onPress={() => setPaymentMethod('online')}
                    >
                        <Ionicons
                            name="card-outline"
                            size={24}
                            color={paymentMethod === 'online' ? theme.primary : theme.textSecondary}
                        />
                        <Text style={[
                            styles.paymentText,
                            { color: paymentMethod === 'online' ? theme.primary : theme.textSecondary }
                        ]}>Online</Text>
                        {paymentMethod === 'online' && (
                            <View style={[styles.checkBadge, { backgroundColor: theme.primary }]}>
                                <Ionicons name="checkmark" size={12} color="#FFF" />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* 4. NOTATKA */}
                <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Notatka dla lekarza (opcjonalnie)</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                    placeholder="Np. powód wizyty, objawy..."
                    placeholderTextColor={theme.textSecondary}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    value={notes}
                    onChangeText={setNotes}
                />

            </ScrollView>

            {/* FOOTER */}
            <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
                <View style={styles.priceContainer}>
                    <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Do zapłaty</Text>
                    <Text style={[styles.totalPrice, { color: theme.text }]}>{price} PLN</Text>
                </View>
                <TouchableOpacity
                    style={[styles.confirmButton, { backgroundColor: theme.primary }]}
                    onPress={handleConfirmBooking}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={[styles.confirmButtonText, { color: theme.background}]}>
                            Potwierdź i zapłać
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        marginTop: 16,
    },
    card: {
        borderRadius: 16,
        padding: 16,
        // Cień
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    doctorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    doctorName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    specialization: {
        fontSize: 14,
    },
    divider: {
        height: 1,
        width: '100%',
        marginBottom: 16,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 15,
        fontWeight: '500',
    },
    paymentContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    paymentOption: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        gap: 8,
        position: 'relative',
    },
    paymentText: {
        fontSize: 14,
        fontWeight: '600',
    },
    checkBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        fontSize: 15,
        minHeight: 80,
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
    },
    priceContainer: {
        justifyContent: 'center',
    },
    totalLabel: {
        fontSize: 12,
        fontWeight: '600',
    },
    totalPrice: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    confirmButton: {
        flex: 1,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});