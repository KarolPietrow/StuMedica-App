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
import { router, useFocusEffect } from "expo-router";
import { format, parseISO, isAfter } from 'date-fns';
import { pl } from 'date-fns/locale';

import { COLORS, GLOBAL_STYLES } from '@/styles/theme';
import { useSession } from '@/context/AuthContext';
import { Medication, medicationService } from "@/services/medicationService";
import { appointmentService, AppointmentSlot } from '@/services/appointmentService';

interface DoseTask {
    uniqueId: string;
    medication: Medication;
    time: string;
    isPast: boolean;
}

export default function Dashboard() {
    const { session, user } = useSession();
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    const firstName = user?.name ? user.name.split(' ')[0] : 'Pacjencie';

    const [todaysDoses, setTodaysDoses] = useState<DoseTask[]>([]);
    const [nextDose, setNextDose] = useState<DoseTask | null>(null);
    const [nextAppointment, setNextAppointment] = useState<AppointmentSlot | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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
            const medsData = await medicationService.getAll(session);
            processSchedule(medsData);

            const visitsData = await appointmentService.getMyAppointments();
            const now = new Date();

            const upcoming = visitsData.filter(visit => isAfter(parseISO(visit.date_time), now));
            upcoming.sort((a, b) => new Date(a.date_time).getTime() - new Date(b.date_time).getTime());

            setNextAppointment(upcoming.length > 0 ? upcoming[0] : null);
        } catch (e) {
            console.error("Błąd pobierania dashboardu", e);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
            const interval = setInterval(() => fetchData(), 60000);
            return () => clearInterval(interval);
            }, [session])
    );

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
                    <RefreshControl refreshing={isLoading} onRefresh={fetchData} tintColor={theme.background} />
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

                    {nextAppointment ? (
                        <TouchableOpacity
                            style={[
                                styles.card,
                                { backgroundColor: theme.surface, borderLeftColor: theme.primary, borderLeftWidth: 4 }
                            ]}
                            activeOpacity={0.9}
                            onPress={() => router.push('/appointments')}
                        >
                            <View style={styles.cardHeader}>
                                <View style={[styles.avatar, { backgroundColor: theme.primary + '20' }]}>
                                    <Text style={[styles.avatarText, {color: theme.background}]}>
                                        {nextAppointment.doctor.name.charAt(0)}
                                    </Text>
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={[styles.doctorName, { color: theme.text }]}>
                                        {nextAppointment.doctor.name}
                                    </Text>
                                    <Text style={[styles.specialization, { color: theme.textSecondary }]}>
                                        {nextAppointment.doctor.specialization}
                                    </Text>
                                </View>
                                <View style={[styles.badge, { backgroundColor: nextAppointment.type === 'NFZ' ? '#E3F2FD' : (colorScheme === 'dark' ? '#FB8C00' : '#FFF3E0') }]}>
                                    <Text style={[styles.badgeText, { color: nextAppointment.type === 'NFZ' ? '#1E88E5' : (colorScheme === 'dark' ? '#FFF3E0' : '#FB8C00') }]}>
                                        {nextAppointment.type === 'NFZ' ? 'NFZ' : 'PRYWATNIE'}
                                    </Text>
                                </View>
                            </View>

                            <View style={[styles.divider, { backgroundColor: theme.border }]} />

                            <View style={styles.cardFooter}>
                                <View style={styles.footerItem}>
                                    <Ionicons name="calendar-outline" size={16} color={theme.primary} />
                                    <Text style={[styles.footerText, { color: theme.text, fontWeight: '600' }]}>
                                        {format(parseISO(nextAppointment.date_time), 'd MMM, HH:mm', { locale: pl })}
                                    </Text>
                                </View>
                                <View style={styles.footerItem}>
                                    <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
                                    <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                                        StuMedica Lublin
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        // Stan pusty
                        <View style={[styles.emptyCard, { backgroundColor: theme.surface }]}>
                            <Ionicons name="calendar-clear-outline" size={40} color={theme.textSecondary} />
                            <Text style={{ color: theme.textSecondary, marginTop: 10 }}>Brak nadchodzących wizyt</Text>
                            <TouchableOpacity style={{ marginTop: 10 }} onPress={() => router.push('/appointments')}>
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
    },
    card: {
        marginHorizontal: 20, borderRadius: 16, padding: 16,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12
    },
    avatar: {
        width: 48, height: 48, borderRadius: 24,
        justifyContent: 'center', alignItems: 'center', marginRight: 12,
    },
    avatarText: { fontSize: 20, fontWeight: 'bold' },
    cardContent: { flex: 1 },
    doctorName: { fontSize: 16, fontWeight: 'bold' },
    specialization: { fontSize: 13 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    badgeText: { fontSize: 10, fontWeight: '700' },
    divider: { height: 1, width: '100%', marginBottom: 12 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
    footerItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    footerText: { fontSize: 13 },
});