import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    useColorScheme,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";

import { COLORS, GLOBAL_STYLES, SIZES } from '@/styles/theme';
import { useSession } from '@/context/AuthContext';

const MOCK_MEDICATIONS = [
    { id: 1, name: 'Metformina', dose: '850mg', time: '08:00', taken: true, type: 'pill' },
    { id: 2, name: 'Witamina D3', dose: '2000j', time: '08:00', taken: true, type: 'pill' },
    { id: 3, name: 'Ibuprofen', dose: '400mg', time: '14:00', taken: false, type: 'capsule' },
    { id: 4, name: 'Magnez', dose: '1 tabl.', time: '20:00', taken: false, type: 'pill' },
];

const MOCK_NEXT_APPOINTMENT = {
    id: 101,
    doctorName: 'dr n. med. Anna Nowak',
    specialty: 'Kardiolog',
    date: '28 Sty',
    time: '15:30',
    location: 'Gabinet 204, II Piętro',
    avatar: null // Tu mógłby być URL do zdjęcia lekarza
};

const QUICK_ACTIONS = [
    { id: 1, label: 'Umów wizytę', icon: 'calendar-outline', route: '/appointments', color: '#4E8EF7' },
    { id: 2, label: 'Leki', icon: 'document-text-outline', route: '/prescriptions', color: '#11C193' },
    { id: 3, label: 'Historia wizyt', icon: 'time-outline', route: '/results', color: '#FF9500' },
    { id: 4, label: 'Symptomy', icon: 'pulse-outline', route: '/symptoms', color: '#FF3B30' },
];

export default function Dashboard() {
    const { user, signOut } = useSession();
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    const firstName = user?.name ? user.name.split(' ')[0] : 'Pacjencie';

    const SectionHeader = ({ title, actionLabel, onAction }: any) => (
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
            {actionLabel && (
                <TouchableOpacity onPress={onAction}>
                    <Text style={{ color: theme.primary, fontWeight: '600', fontSize: 14 }}>
                        {actionLabel}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );

    const MedicationItem = ({ item }: any) => {
        const statusColor = item.taken ? theme.primary : theme.textSecondary;
        const bgColor = item.taken ? `${theme.primary}20` : theme.surface;

        return (
            <TouchableOpacity style={[styles.medicationCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={[styles.medicationTimeBadge, { backgroundColor: item.taken ? statusColor : theme.border }]}>
                    <Text style={[styles.medicationTimeText, { color: item.taken ? '#fff' : theme.textSecondary }]}>
                        {item.time}
                    </Text>
                </View>

                <View style={styles.medicationIconWrapper}>
                    <Ionicons
                        name={item.taken ? "checkmark-circle" : "medical"}
                        size={28}
                        color={item.taken ? theme.primary : theme.textSecondary}
                    />
                </View>

                <View style={{ marginTop: 8 }}>
                    <Text style={[styles.medicationName, { color: item.taken ? theme.textSecondary : theme.text }]} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text style={{ fontSize: 12, color: theme.textSecondary }}>{item.dose}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* --- HEADER: POWITANIE --- */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greetingSub, { color: theme.textSecondary }]}>
                            Dzień dobry,
                        </Text>
                        <Text style={[styles.greetingName, { color: theme.text }]}>
                            {firstName}! 👋
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.profileButton, { backgroundColor: theme.surface }]}
                        onPress={ ()=>{ router.push('/account') }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.primary }}>
                            {firstName[0]}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.quickActionsContainer}>
                    {QUICK_ACTIONS.map((action) => (
                        <TouchableOpacity
                            key={action.id}
                            style={styles.actionButton}
                            onPress={() => {
                                // router.push(action.route);
                                alert(`Kliknięto: ${action.label}`)
                            }}
                        >
                            <View style={[styles.actionIconCircle, { backgroundColor: `${action.color}15` }]}>
                                <Ionicons name={action.icon as any} size={24} color={action.color} />
                            </View>
                            <Text style={[styles.actionLabel, { color: theme.text }]}>{action.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* --- SEKCJA: LEKI NA DZIŚ --- */}
                <View style={styles.sectionContainer}>
                    <SectionHeader
                        title="Twój plan na dziś"
                        actionLabel="Zobacz wszystkie"
                        onAction={() => router.push('/medicine')}
                    />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
                    >
                        {MOCK_MEDICATIONS.map((med) => (
                            <MedicationItem key={med.id} item={med} />
                        ))}
                    </ScrollView>
                </View>

                {/* --- SEKCJA: NADCHODZĄCA WIZYTA --- */}
                <View style={styles.sectionContainer}>
                    <SectionHeader title="Najbliższa wizyta" />

                    {MOCK_NEXT_APPOINTMENT ? (
                        <TouchableOpacity
                            style={[styles.appointmentCard, { backgroundColor: theme.surface }]}
                            activeOpacity={0.9}
                            onPress={() => router.push('/appointments')}
                        >
                            {/* Lewa strona: Data */}
                            <View style={[styles.dateBox, { backgroundColor: `${theme.primary}15` }]}>
                                <Text style={[styles.dateDay]}>
                                    {MOCK_NEXT_APPOINTMENT.date.split(' ')[0]}
                                </Text>
                                <Text style={[styles.dateMonth]}>
                                    {MOCK_NEXT_APPOINTMENT.date.split(' ')[1]}
                                </Text>
                            </View>

                            {/* Prawa strona: Info */}
                            <View style={styles.appointmentInfo}>
                                <Text style={[styles.doctorName, { color: theme.text }]}>
                                    {MOCK_NEXT_APPOINTMENT.doctorName}
                                </Text>
                                <Text style={[styles.specialty, { color: theme.textSecondary }]}>
                                    {MOCK_NEXT_APPOINTMENT.specialty}
                                </Text>

                                <View style={styles.appointmentMeta}>
                                    <View style={styles.metaRow}>
                                        <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
                                        <Text style={{ fontSize: 13, color: theme.textSecondary }}>
                                            {MOCK_NEXT_APPOINTMENT.time}
                                        </Text>
                                    </View>
                                    <View style={styles.metaRow}>
                                        <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
                                        <Text style={{ fontSize: 13, color: theme.textSecondary }}>
                                            Gabinet
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <Ionicons name="chevron-forward" size={20} color={theme.border} style={{ alignSelf: 'center' }} />
                        </TouchableOpacity>
                    ) : (
                        // Stan pusty (brak wizyt)
                        <View style={[styles.emptyCard, { backgroundColor: theme.surface }]}>
                            <Ionicons name="calendar-clear-outline" size={40} color={theme.textSecondary} />
                            <Text style={{ color: theme.textSecondary, marginTop: 10 }}>Brak nadchodzących wizyt</Text>
                            <TouchableOpacity style={{ marginTop: 10 }}>
                                <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Umów wizytę teraz</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {/* --- SEKCJA: BANER EDUKACYJNY / KARTA ZDROWIA --- */}
                <View style={[styles.promoCard, { backgroundColor: '#4E8EF7' }]}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.promoTitle}>Zniżka studencka</Text>
                        <Text style={styles.promoText}>Zweryfikuj status studenta i oszczędź do 50% na wybrane badania!</Text>
                        <TouchableOpacity style={styles.promoButton}>
                            <Text style={{ color: '#4E8EF7', fontWeight: 'bold', fontSize: 12 }}>Sprawdź szczegóły</Text>
                        </TouchableOpacity>
                    </View>
                    <Ionicons name="shield-checkmark" size={80} color="rgba(255,255,255,0.2)" style={{ position: 'absolute', right: -10, bottom: -10 }} />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        marginBottom: 20,
    },
    greetingSub: {
        fontSize: 14,
        fontWeight: '500',
    },
    greetingName: {
        fontSize: 26,
        fontWeight: 'bold',
    },
    profileButton: {
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    // Sekcja Quick Actions
    quickActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    actionButton: {
        alignItems: 'center',
        gap: 8,
        width: '22%',
    },
    actionIconCircle: {
        width: 55,
        height: 55,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionLabel: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
    // Sekcje ogólne
    sectionContainer: {
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Karty Leków
    medicationCard: {
        width: 110,
        height: 140,
        borderRadius: 16,
        borderWidth: 1,
        padding: 10,
        justifyContent: 'space-between',
    },
    medicationTimeBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    medicationTimeText: {
        fontSize: 11,
        fontWeight: '700',
    },
    medicationIconWrapper: {
        alignItems: 'center',
        marginTop: 5,
    },
    medicationName: {
        fontSize: 14,
        fontWeight: '600',
    },
    // Karta Wizyty
    appointmentCard: {
        marginHorizontal: 20,
        padding: 16,
        borderRadius: 20,
        flexDirection: 'row',
        gap: 16,
        // Cień
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    dateBox: {
        width: 60,
        height: 65,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateDay: {
        fontSize: 22,
        fontWeight: 'bold',
        lineHeight: 24,
    },
    dateMonth: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    appointmentInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    doctorName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    specialty: {
        fontSize: 13,
        marginBottom: 8,
    },
    appointmentMeta: {
        flexDirection: 'row',
        gap: 12,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    emptyCard: {
        marginHorizontal: 20,
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        borderStyle: 'dashed'
    },
    // Promo
    promoCard: {
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 20,
    },
    promoTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    promoText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        marginBottom: 12,
        marginRight: 20,
    },
    promoButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    }
});