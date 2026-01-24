import React, {useCallback, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    useColorScheme,
    Image,
    Platform, RefreshControl, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GLOBAL_STYLES } from '@/styles/theme';
import { router, useFocusEffect } from 'expo-router';
import { appointmentService, AppointmentSlot } from '@/services/appointmentService';
import { format, parseISO, isAfter, isBefore } from 'date-fns';
import { pl } from 'date-fns/locale';

const SPECIALIZATIONS = [
    { id: 'Internista', name: 'Internista', icon: 'thermometer-outline' },
    { id: 'Stomatolog', name: 'Stomatolog', icon: 'happy-outline' },
    { id: 'Kardiolog', name: 'Kardiolog', icon: 'heart-outline' },
    { id: 'Dermatolog', name: 'Dermatolog', icon: 'body-outline' },
    { id: 'Okulista', name: 'Okulista', icon: 'eye-outline' },
];

export default function AppointmentsScreen() {
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    // Stan formularza nowej wizyty
    const [visitType, setVisitType] = useState<'NFZ' | 'PRIVATE'>('PRIVATE');
    const [selectedSpec, setSelectedSpec] = useState<string | null>(null);

    const [upcomingVisits, setUpcomingVisits] = useState<AppointmentSlot[]>([]);
    const [pastVisits, setPastVisits] = useState<AppointmentSlot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchAppointments = async () => {
        try {
            const allVisits = await appointmentService.getMyAppointments();
            const now = new Date();

            const upcoming = allVisits.filter(visit => isAfter(parseISO(visit.date_time), now));
            const past = allVisits.filter(visit => isBefore(parseISO(visit.date_time), now));

            upcoming.sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime());
            past.sort((a, b) => new Date(b.date_time).getTime() - new Date(a.date_time).getTime());

            setUpcomingVisits(upcoming);
            setPastVisits(past);
        } catch (e) {
            console.error("Błąd pobierania wizyt", e);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchAppointments();
        }, [])
    );

    const onRefresh = () => {
        setIsRefreshing(true);
        fetchAppointments();
    };

    const renderEmptyState = (message: string, icon: keyof typeof Ionicons.glyphMap) => (
        <View style={styles.emptyStateContainer}>
            <View style={[styles.emptyIconContainer, { backgroundColor: theme.surface }]}>
                <Ionicons name={icon} size={32} color={theme.textSecondary} />
            </View>
            <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
                {message}
            </Text>
        </View>
    );

    // Karta Nadchodzącej Wizyty
    const renderUpcomingCard = (visit: AppointmentSlot) => {
        const dateObj = parseISO(visit.date_time);

        return (
            <View key={visit.id} style={[styles.card, {
                backgroundColor: theme.surface,
                borderLeftColor: theme.primary,
                borderLeftWidth: 4
            }]}>
                <View style={styles.cardHeader}>
                    <View style={[styles.avatar, { backgroundColor: theme.primary + '20' }]}>
                        <Text style={styles.avatarText}>
                            {visit.doctor.name.charAt(0)}
                        </Text>
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={[styles.doctorName, {color: theme.text}]}>{visit.doctor.name}</Text>
                        <Text
                            style={[styles.specialization, {color: theme.textSecondary}]}>{visit.doctor.specialization}</Text>
                    </View>
                    <View style={[styles.badge, {backgroundColor: visit.type === 'NFZ' ? '#E3F2FD' : '#FFF3E0'}]}>
                        <Text style={[styles.badgeText, {color: visit.type === 'NFZ' ? '#1E88E5' : '#FB8C00'}]}>
                            {visit.type === 'NFZ' ? 'NFZ' : 'PRYWATNIE'}
                        </Text>
                    </View>
                </View>

                <View style={[styles.divider, {backgroundColor: theme.border}]}/>

                <View style={styles.cardFooter}>
                    <View style={styles.footerItem}>
                        <Ionicons name="calendar-outline" size={16} color={theme.primary}/>
                        <Text style={[styles.footerText, {color: theme.text, fontWeight: '600'}]}>
                            {format(dateObj, 'd MMM, HH:mm', { locale: pl })}
                        </Text>
                    </View>
                    <View style={styles.footerItem}>
                        <Ionicons name="location-outline" size={16} color={theme.textSecondary}/>
                        <Text style={[styles.footerText, {color: theme.textSecondary}]}>
                            {/*{visit.location}*/}
                            StuMedica Lublin
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    // Wiersz Historii
    const renderHistoryItem = (visit: AppointmentSlot) => {
        const dateObj = parseISO(visit.date_time);

        return (
            <View key={visit.id} style={[styles.historyItem, {borderBottomColor: theme.border}]}>
                <View style={styles.historyIconBox}>
                    <Ionicons name="checkmark-circle" size={24} color={theme.textSecondary}/>
                </View>
                <View style={{flex: 1}}>
                    <Text style={[styles.historyDoctor, {color: theme.text}]}>{visit.doctor.name}</Text>
                    <Text style={[styles.historySpec, {color: theme.textSecondary}]}>{visit.doctor.specialization}</Text>
                </View>
                <Text style={[styles.historyDate, {color: theme.textSecondary}]}>
                    {format(dateObj, 'd MMM yyyy', { locale: pl })}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView
            style={[GLOBAL_STYLES.container, { backgroundColor: theme.background }]}
            edges={['right', 'left', 'top']
        }>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Wizyty</Text>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor={theme.primary} />
                }
            >
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Umów nową wizytę</Text>

                    <View style={[styles.bookingCard, { backgroundColor: theme.surface }]}>
                        {/* Przełącznik NFZ / Prywatnie */}
                        <View style={[styles.toggleContainer, { backgroundColor: theme.background }]}>
                            <TouchableOpacity
                                style={[styles.toggleBtn, visitType === 'NFZ' && { backgroundColor: theme.surface, ...styles.shadow }]}
                                onPress={() => setVisitType('NFZ')}
                            >
                                <Text style={[styles.toggleText, { color: visitType === 'NFZ' ? theme.primary : theme.textSecondary }]}>NFZ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.toggleBtn, visitType === 'PRIVATE' && { backgroundColor: theme.surface, ...styles.shadow }]}
                                onPress={() => setVisitType('PRIVATE')}
                            >
                                <Text style={[styles.toggleText, { color: visitType === 'PRIVATE' ? theme.primary : theme.textSecondary }]}>Prywatnie</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Lista Specjalizacji */}
                        <Text style={[styles.subLabel, { color: theme.textSecondary }]}>Wybierz specjalizację:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.specScroll}>
                            {SPECIALIZATIONS.map((spec) => (
                                <TouchableOpacity
                                    key={spec.id}
                                    style={[
                                        styles.specChip,
                                        {
                                            backgroundColor: selectedSpec === spec.id ? theme.primary : theme.background,
                                            borderColor: theme.border,
                                            borderWidth: selectedSpec === spec.id ? 0 : 1
                                        }
                                    ]}
                                    onPress={() => setSelectedSpec(spec.id)}
                                >
                                    <Ionicons
                                        name={spec.icon as any}
                                        size={18}
                                        color={selectedSpec === spec.id ? theme.background : theme.textSecondary}
                                    />
                                    <Text style={[
                                        styles.specText,
                                        { color: selectedSpec === spec.id ? theme.background : theme.text }
                                    ]}>
                                        {spec.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Przycisk Szukaj */}
                        <TouchableOpacity
                            style={[styles.searchButton, { backgroundColor: theme.primary }]}
                            onPress={() => {
                                if (!selectedSpec) {
                                    alert("Wybierz specjalizację")
                                } else {
                                    if (visitType === 'PRIVATE') {
                                        router.push({
                                            pathname: '/(protected)/appointment-calendar',
                                            params: {specialization: selectedSpec}
                                        });
                                    } else {
                                        alert("Wizyty NFZ nie są jeszcze dostępne.")
                                    }
                                }
                            }}
                        >
                            <Text style={[styles.searchButtonText, { color: theme.background }]}>Znajdź termin</Text>
                            <Ionicons name="arrow-forward" size={20} color={theme.background} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* --- SEKCJA 2: NADCHODZĄCE --- */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Nadchodzące wizyty</Text>
                    {isLoading && !isRefreshing ? (
                        <ActivityIndicator color={theme.primary} />
                    ) : upcomingVisits.length > 0 ? (
                        <View style={{ gap: 16 }}>
                            {upcomingVisits.map(renderUpcomingCard)}
                        </View>
                    ) : (
                        renderEmptyState("Brak nadchodzących wizyt", "calendar-clear-outline")
                    )}
                </View>

                {/* --- SEKCJA 3: HISTORIA --- */}
                <View style={styles.section}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>Historia</Text>
                        <TouchableOpacity>
                            <Text style={{ color: theme.primary, fontWeight: '600' }}>Zobacz wszystkie</Text>
                        </TouchableOpacity>
                    </View>

                    {pastVisits.length > 0 ? (
                        <View style={[styles.historyContainer, { backgroundColor: theme.surface }]}>
                            {pastVisits.slice(0, 5).map(renderHistoryItem)}
                        </View>
                    ) : (
                        renderEmptyState("Brak historii wizyt", "time-outline")
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    iconButton: {
        padding: 10,
        borderRadius: 12,
    },
    section: {
        marginBottom: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },

    // --- UMÓW WIZYTĘ ---
    bookingCard: {
        borderRadius: 20,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    toggleContainer: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    toggleText: {
        fontWeight: '600',
        fontSize: 14,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    subLabel: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
    },
    specScroll: {
        flexGrow: 0,
        marginBottom: 20,
    },
    specChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        marginRight: 10,
        gap: 8,
    },
    specText: {
        fontWeight: '500',
        fontSize: 14,
    },
    searchButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 14,
        gap: 8,
    },
    searchButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // --- KARTY WIZYT ---
    card: {
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    cardContent: {
        flex: 1,
    },
    doctorName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    specialization: {
        fontSize: 13,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        width: '100%',
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    footerText: {
        fontSize: 13,
    },

    // --- HISTORIA ---
    historyContainer: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    historyIconBox: {
        marginRight: 12,
        opacity: 0.7,
    },
    historyDoctor: {
        fontSize: 14,
        fontWeight: '600',
    },
    historySpec: {
        fontSize: 12,
    },
    historyDate: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        gap: 12,
    },
    emptyIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        // Delikatny cień dla ikonki
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    emptyStateText: {
        fontSize: 14
    },
});