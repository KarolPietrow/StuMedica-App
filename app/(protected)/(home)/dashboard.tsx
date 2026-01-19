import React, {useCallback, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    useColorScheme,
    Dimensions, RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {router, useFocusEffect} from "expo-router";

import { COLORS, GLOBAL_STYLES, SIZES } from '@/styles/theme';
import { useSession } from '@/context/AuthContext';
import {Medication, medicationService} from "@/services/medicationService";


interface DoseTask {
    uniqueId: string;
    medication: Medication;
    time: string;
    isPast: boolean;
}

const MOCK_NEXT_APPOINTMENT = {
    id: 101,
    doctorName: 'dr n. med. Anna Nowak',
    specialty: 'Kardiolog',
    date: '28 Sty',
    time: '15:30',
    location: 'Gabinet 204, II Piętro',
    avatar: null // Tu mógłby być URL do zdjęcia lekarza
};

export default function Dashboard() {
    const { session, user } = useSession();
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    const firstName = user?.name ? user.name.split(' ')[0] : 'Pacjencie';

    const [todaysDoses, setTodaysDoses] = useState<DoseTask[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [nextDose, setNextDose] = useState<DoseTask | null>(null);

    const processSchedule = (meds: Medication[]) => {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        const tasks: DoseTask[] = [];

        meds.forEach(med => {
            if (!med.is_active || !med.reminders || med.reminders.length === 0) return;

            med.reminders.forEach(timeStr => {
                const [h, m] = timeStr.split(':').map(Number);
                const doseMinutes = h * 60 + m;

                const isPast = currentMinutes >= doseMinutes;

                tasks.push({
                    uniqueId: `${med.id}-${timeStr}`,
                    medication: med,
                    time: timeStr,
                    isPast: isPast
                });
            });
        });

        tasks.sort((a, b) => {
            const [h1, m1] = a.time.split(':').map(Number);
            const [h2, m2] = b.time.split(':').map(Number);
            return (h1 * 60 + m1) - (h2 * 60 + m2);
        });

        setTodaysDoses(tasks);

        const next = tasks.find(t => !t.isPast);
        setNextDose(next || null);
    };

    const fetchData = async () => {
        if (!session) return;
        setIsLoading(true);
        try {
            const data = await medicationService.getAll(session);
            processSchedule(data);
        } catch (e) {
            console.error("Błąd pobierania dashboardu", e);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();

            const interval = setInterval(() => {
                fetchData();
            }, 60000);

            return () => clearInterval(interval);
        }, [session])
    );

    const renderDoseItem = (item: DoseTask) => {
        const isTaken = item.isPast;

        return (
            <View key={item.uniqueId} style={[styles.doseCard, { backgroundColor: theme.surface }]}>
                <View style={styles.timeColumn}>
                    <Text style={[styles.doseTime, { color: isTaken ? theme.textSecondary : theme.text }]}>
                        {item.time}
                    </Text>
                    <View style={[styles.timelineLine, { backgroundColor: theme.border }]} />
                </View>

                <View style={styles.doseInfo}>
                    <Text style={[
                        styles.doseName,
                        { color: isTaken ? theme.textSecondary : theme.text, textDecorationLine: isTaken ? 'line-through' : 'none' }
                    ]}>
                        {item.medication.name}
                    </Text>
                    <Text style={[styles.doseDosage, { color: theme.textSecondary }]}>
                        {item.medication.dosage}
                    </Text>
                </View>

                <View style={styles.statusColumn}>
                    {isTaken ? (
                        <View style={[styles.statusIcon, { backgroundColor: '#4CD964' }]}>
                            <Ionicons name="checkmark" size={16} color="#FFF" />
                        </View>
                    ) : (
                        <View style={[styles.statusIcon, { backgroundColor: theme.background, borderWidth: 2, borderColor: theme.border }]}>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Dzień dobry,";
        if (hour < 18) return "Miłego popołudnia,";
        return "Dobry wieczór,";
    };

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

    const QuickActions = () => {
        return (
            <View style={styles.quickActionsContainer}>
                    <TouchableOpacity
                        key={1}
                        style={styles.actionButton}
                        onPress={() => { router.push('/appointments')}}
                    >
                        <View style={[styles.actionIconCircle, { backgroundColor: `#4E8EF715` }]}>
                            <Ionicons name={'calendar-outline'} size={24} color={'#4E8EF7'} />
                        </View>
                        <Text style={[styles.actionLabel, { color: theme.text }]}>{'Umów wizytę'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        key={2}
                        style={styles.actionButton}
                        onPress={() => { router.push('/medicine')}}
                    >
                        <View style={[styles.actionIconCircle, { backgroundColor: `#11C19315` }]}>
                            <Ionicons name={'document-text-outline'} size={24} color={'#11C193'} />
                        </View>
                        <Text style={[styles.actionLabel, { color: theme.text }]}>{'Leki'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        key={3}
                        style={styles.actionButton}
                        onPress={() => { router.push('/appointments')}}
                    >
                        <View style={[styles.actionIconCircle, { backgroundColor: `#FF950015` }]}>
                            <Ionicons name={'time-outline'} size={24} color={'#FF9500'} />
                        </View>
                        <Text style={[styles.actionLabel, { color: theme.text }]}>{'Historia wizyt'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        key={4}
                        style={styles.actionButton}
                        onPress={() => { router.push('/chat')}}
                    >
                        <View style={[styles.actionIconCircle, { backgroundColor: `#80008015` }]}>
                            {/*<Ionicons name={'chatbubble-outline'} size={24} color={'#800080'} />*/}
                            <Ionicons name={'sparkles-outline'} size={24} color={'#800080'} />
                        </View>
                        <Text style={[styles.actionLabel, { color: theme.text }]}>{'Asystent AI'}</Text>
                    </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView
            style={[GLOBAL_STYLES.container, { backgroundColor: theme.background }]}
            edges={['right', 'left', 'top']
        }>
            <ScrollView
                showsVerticalScrollIndicator={false}
                // contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={fetchData} tintColor={theme.primary} />
                }
            >
                {/* --- HEADER: POWITANIE --- */}
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.greetingSub, { color: theme.textSecondary }]}>
                            {getGreeting()}
                        </Text>
                        <Text style={[styles.greetingName, { color: theme.text }]}>
                            {firstName}!
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

                <QuickActions/>

                {/* --- SEKCJA NAJBLIŻSZEJ DAWKI --- */}
                <View style={styles.sectionContainer}>
                    <SectionHeader title="Najbliższa dawka" />
                    {nextDose ? (
                    <TouchableOpacity
                        style={[styles.heroCard, { backgroundColor: theme.primary }]}
                        activeOpacity={0.7}
                        onPress={() => router.push('/medicine')}
                    >
                        <View>
                            <Text style={[styles.heroLabel, { color: theme.background}]}>Najbliższa dawka</Text>
                            <Text style={[styles.heroTime, { color: theme.background}]}>{nextDose.time}</Text>
                            <Text style={[styles.heroName, { color: theme.background}]}>{nextDose.medication.name}</Text>
                            <Text style={[styles.heroDosage, { color: theme.background}]}>{nextDose.medication.dosage}</Text>
                        </View>
                        <Ionicons name="alarm" size={48} color="rgba(255,255,255,0.2)" />
                    </TouchableOpacity>
                ) : (
                    <View style={[styles.heroCard, { backgroundColor: theme.surface }]}>
                        <View>
                            <Text style={[styles.heroLabel, { color: theme.textSecondary }]}>Na dzisiaj to wszystko</Text>
                            <Text style={[styles.heroName, { color: theme.text, marginTop: 4 }]}>Wszystkie leki wzięte</Text>
                        </View>
                        <Ionicons name="checkmark-circle" size={48} color="#4CD964" />
                    </View>
                )}
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
                                <Text style={[styles.dateDay, { color: theme.background}]}>
                                    {MOCK_NEXT_APPOINTMENT.date.split(' ')[0]}
                                </Text>
                                <Text style={[styles.dateMonth, { color: theme.background}]}>
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
    },
    heroCard: {
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginBottom: 24,
        // Cień
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    heroLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    heroTime: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    heroName: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    },
    heroDosage: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
    },

    // Timeline / Dose List
    timelineContainer: {
        paddingHorizontal: 20,
        gap: 12,
    },
    doseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
    },
    timeColumn: {
        alignItems: 'center',
        marginRight: 16,
        width: 50,
    },
    doseTime: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    timelineLine: {
        width: 2,
        height: 20, // krótka linia dekoracyjna
        borderRadius: 1,
    },
    doseInfo: {
        flex: 1,
    },
    doseName: {
        fontSize: 16,
        fontWeight: '600',
    },
    doseDosage: {
        fontSize: 13,
    },
    statusColumn: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 20,
    }
});