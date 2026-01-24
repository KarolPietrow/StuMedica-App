import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { format, parseISO } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import {COLORS, GLOBAL_STYLES} from '@/styles/theme';
import { appointmentService, AppointmentSlot } from '@/services/appointmentService';
import BackButton from "@/components/BackButton";

LocaleConfig.locales['pl'] = {
    monthNames: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
    monthNamesShort: ['Sty.', 'Lut.', 'Mar.', 'Kwi.', 'Maj', 'Cze.', 'Lip.', 'Sie.', 'Wrz.', 'Paź.', 'Lis.', 'Gru.'],
    dayNames: ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'],
    dayNamesShort: ['Nd.', 'Pn.', 'Wt.', 'Śr.', 'Cz.', 'Pt.', 'Sb.'],
    today: 'Dzisiaj'
};
LocaleConfig.defaultLocale = 'pl';

export default function BookAppointmentScreen() {
    const params = useLocalSearchParams();
    const specialization = params.specialization as string;
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    const [slots, setSlots] = useState<AppointmentSlot[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [bookingInProgress, setBookingInProgress] = useState<number | null>(null);

    useEffect(() => {
        loadSlots();
    }, [specialization]);

    const loadSlots = async () => {
        try {
            const data = await appointmentService.getAvailableSlots(specialization);
            setSlots(data);
        } catch (e) {
            Alert.alert("Błąd", "Nie udało się pobrać terminów");
        } finally {
            setIsLoading(false);
        }
    };

    const markedDates = useMemo(() => {
        const marks: any = {};

        const availableStyle = {
            // marked: true,
            // dotColor: theme.primary,
            selected: true,
            selectedColor: theme.primary,
            selectedTextColor: theme.background,
            activeOpacity: 0.5
        };

        slots.forEach(slot => {
            const dateStr = slot.date_time.split('T')[0];
            if (!marks[dateStr]) {
                marks[dateStr] = { ...availableStyle };
            }
        });

        if (selectedDate) {
            marks[selectedDate] = {
                ...(marks[selectedDate] || {}),
                selected: true,
                selectedColor: theme.text,
                selectedTextColor: theme.background,
            };
        }
        return marks;
    }, [slots, selectedDate, theme]);

    const slotsForDay = useMemo(() => {
        if (!selectedDate) return [];
        return slots.filter(s => s.date_time.startsWith(selectedDate));
    }, [slots, selectedDate]);

    const handleBook = (slot: AppointmentSlot) => {
        router.push({
            pathname: '/(protected)/booking-summary',
            params: {
                slotId: slot.id,
                doctorName: slot.doctor.name,
                specialization: slot.doctor.specialization,
                price: slot.doctor.price_private,
                date: slot.date_time
            }
        });
    };

    const renderEmptySelection = () => (
        <View style={styles.emptyStateContainer}>
            <View style={[styles.iconCircle]}>
                <Ionicons name="calendar-outline" size={48} color={theme.text}/>
            </View>
            <Text style={[styles.emptyStateTitle, { color: theme.text }]}>Wybierz datę</Text>
            <Text style={[styles.emptyStateSub, { color: theme.textSecondary }]}>
                Zaznacz dzień w kalendarzu, aby zobaczyć dostępne godziny wizyt.
            </Text>
        </View>
    );

    const renderNoSlots = () => (
        <View style={styles.emptyStateContainer}>
            <View style={[styles.iconCircle]}>
                <Ionicons name="time-outline" size={48} color={theme.textSecondary} />
            </View>
            <Text style={[styles.emptyStateTitle, { color: theme.text }]}>Brak terminów</Text>
            <Text style={[styles.emptyStateSub, { color: theme.textSecondary }]}>
                Niestety w tym dniu nie ma wolnych wizyt dla wybranej specjalizacji.
            </Text>
        </View>
    );

    return (
        <SafeAreaView
            style={[GLOBAL_STYLES.container, { backgroundColor: theme.background }]}
            edges={['right', 'left', 'top']
        }>
            {/* Header */}
            <View style={styles.header}>
                {/*<BackButton style={styles.backButton} onPress={() => router.back()}/>*/}
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <View>
                    <Text style={[styles.title, { color: theme.text }]}>Wybierz termin</Text>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        {specialization || 'Wszystkie specjalizacje'}
                    </Text>
                </View>
            </View>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            ) : (
                <View style={{ flex: 1 }}>
                    <Calendar
                        key={colorScheme}
                        firstDay={1}
                        theme={{
                            backgroundColor: theme.background,
                            calendarBackground: theme.background,
                            textSectionTitleColor: theme.textSecondary,
                            selectedDayBackgroundColor: theme.primary,
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: theme.primary,
                            dayTextColor: theme.text,
                            textDisabledColor: theme.border, // Wyszarzone dni (inny miesiąc)
                            dotColor: theme.primary,
                            selectedDotColor: '#ffffff',
                            arrowColor: theme.primary,
                            disabledArrowColor: '#d9e1e8',
                            monthTextColor: theme.text,
                            indicatorColor: theme.primary,
                            textDayFontWeight: '300',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '500',
                            textDayFontSize: 16,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 14
                        }}
                        markedDates={markedDates}
                        onDayPress={(day: DateData) => {
                            setSelectedDate(day.dateString);
                        }}
                        enableSwipeMonths={true}
                    />

                    {/* LISTA TERMINÓW */}
                    <View style={[styles.slotsContainer, { backgroundColor: theme.surface }]}>

                        {!selectedDate ? (
                            renderEmptySelection()
                        ) : (
                            <>
                                <View style={styles.slotsHeaderRow}>
                                    <Text style={[styles.slotsHeader, { color: theme.text }]}>
                                        {format(parseISO(selectedDate), 'd MMMM yyyy', { locale: pl })}
                                    </Text>
                                    <TouchableOpacity onPress={() => setSelectedDate('')}>
                                        <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
                                    </TouchableOpacity>
                                </View>

                                {slotsForDay.length === 0 ? (
                                    renderNoSlots()
                                ) : (
                                    <FlatList
                                        data={slotsForDay}
                                        keyExtractor={(item) => item.id.toString()}
                                        contentContainerStyle={{ paddingBottom: 40 }}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item }) => (
                                            <View style={[styles.slotCard, { borderBottomColor: theme.border }]}>
                                                <View style={styles.slotInfo}>
                                                    <Text style={[styles.slotTime, { color: theme.primary }]}>
                                                        {format(parseISO(item.date_time), 'HH:mm')}
                                                    </Text>
                                                    <View>
                                                        <Text style={[styles.doctorName, { color: theme.text }]}>
                                                            {item.doctor.name}
                                                        </Text>
                                                        <Text style={[styles.price, { color: theme.textSecondary }]}>
                                                            {item.doctor.price_private} PLN
                                                        </Text>
                                                    </View>
                                                </View>

                                                <TouchableOpacity
                                                    style={[styles.bookButton, { backgroundColor: theme.primary }]}
                                                    onPress={() => handleBook(item)}
                                                    disabled={bookingInProgress === item.id}
                                                >
                                                    {bookingInProgress === item.id ? (
                                                        <ActivityIndicator color="#FFF" size="small" />
                                                    ) : (
                                                        <Text style={styles.bookButtonText}>Umów</Text>
                                                    )}
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    />
                                )}
                            </>
                        )}
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        gap: 15,
    },
    backButton: { padding: 8 },
    title: { fontSize: 20, fontWeight: 'bold' },
    subtitle: { fontSize: 14 },

    slotsContainer: {
        flex: 1,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 24,
        marginTop: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 15,
    },
    slotsHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    slotsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },

    // Empty States
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 40,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    emptyStateSub: {
        fontSize: 14,
        textAlign: 'center',
        maxWidth: '80%',
        lineHeight: 20,
    },

    // Slot Card
    slotCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    slotInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    timeBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    slotTime: {
        fontSize: 20,
        fontWeight: 'bold',
        width: 60,
    },
    doctorName: {
        fontSize: 15,
        fontWeight: '600',
    },
    price: {
        fontSize: 13,
    },
    bookButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        minWidth: 80,
        alignItems: 'center',
    },
    bookButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    }
});