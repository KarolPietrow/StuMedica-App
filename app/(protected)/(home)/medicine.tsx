import React, {createElement, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    useColorScheme,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Alert,
    ScrollView, Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GLOBAL_STYLES, SIZES } from '@/styles/theme';
import {GlassView} from "expo-glass-effect";
import DateTimePicker from '@react-native-community/datetimepicker';

// Typ danych leku (Mock)
interface Medication {
    id: string;
    name: string;
    dosage: string;
    note?: string;
    reminders?: string[];
}

export default function MedicineScreen() {
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    // --- STAN ---
    const [medications, setMedications] = useState<Medication[]>([
        { id: '1', name: 'Witamina D3', dosage: '2000 j.m.', note: 'Brać rano po śniadaniu', reminders: ['08:00'] },
        { id: '2', name: 'Ibuprofen', dosage: '400 mg', note: 'Tylko w razie bólu' },
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);

    // Stan formularza
    const [newName, setNewName] = useState('');
    const [newDosage, setNewDosage] = useState('');
    const [newNote, setNewNote] = useState('');

    const [hasReminders, setHasReminders] = useState(false);
    const [frequency, setFrequency] = useState(1); // 1 - 4
    const [reminderTimes, setReminderTimes] = useState<string[]>(['08:00']);

    const [showTimePicker, setShowTimePicker] = useState(false);
    const [activeTimeIndex, setActiveTimeIndex] = useState<number | null>(null); // Którą godzinę edytujemy?
    const [tempDate, setTempDate] = useState(new Date()); // Data tymczasowa dla iOS

    const parseTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    };

    const formatTime = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const handleFrequencyChange = (newFreq: number) => {
        setFrequency(newFreq);

        const newTimes = [...reminderTimes];

        if (newFreq > newTimes.length) {
            for (let i = newTimes.length; i < newFreq; i++) {
                const defaultHours = ['08:00', '12:00', '16:00', '20:00'];
                newTimes.push(defaultHours[i] || '08:00');
            }
        } else {
            newTimes.splice(newFreq);
        }
        setReminderTimes(newTimes);
    };

    const openTimePicker = (index: number) => {
        setActiveTimeIndex(index);
        const dateToEdit = parseTime(reminderTimes[index]);
        setTempDate(dateToEdit);
        setShowTimePicker(true);
    };

    const onTimeChange = (event: any, selectedDate?: Date) => {
        if (Platform.OS === 'android') {
            setShowTimePicker(false);
        }

        if (event.type === 'dismissed' || !selectedDate) {
            return;
        }

        if (activeTimeIndex !== null) {
            if (Platform.OS === 'android') {
                const newTimes = [...reminderTimes];
                newTimes[activeTimeIndex] = formatTime(selectedDate);
                setReminderTimes(newTimes);
            } else {
                setTempDate(selectedDate);
            }
        }
    };

    const confirmIOSDate = () => {
        if (activeTimeIndex !== null) {
            const newTimes = [...reminderTimes];
            newTimes[activeTimeIndex] = formatTime(tempDate);
            setReminderTimes(newTimes);
        }
        setShowTimePicker(false);
    };

    const handleAddMedication = () => {
        if (!newName.trim() || !newDosage.trim()) {
            Alert.alert("Błąd", "Podaj nazwę leku i dawkę.");
            return;
        }

        const newMed: Medication = {
            id: Date.now().toString(),
            name: newName,
            dosage: newDosage,
            note: newNote,
            reminders: hasReminders ? reminderTimes : undefined
        };

        setMedications(prev => [...prev, newMed]);
        resetForm();
    };

    const resetForm = () => {
        setNewName('');
        setNewDosage('');
        setNewNote('');
        setHasReminders(false);
        setFrequency(1);
        setReminderTimes(['08:00']);
        setIsModalVisible(false);
    };


    const renderItem = ({ item }: { item: Medication }) => (
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}15` }]}>
                    <Ionicons name="medkit" size={24} />
                </View>
                <View style={styles.cardContent}>
                    <Text style={[styles.medName, { color: theme.text }]}>{item.name}</Text>
                    <Text style={[styles.medDosage, { color: theme.primary }]}>{item.dosage}</Text>
                </View>
                <TouchableOpacity onPress={() => Alert.alert("Opcje", "Edytuj lub usuń")}>
                    <Ionicons name="ellipsis-vertical" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            {(item.note || (item.reminders && item.reminders.length > 0)) && (
                <View style={[styles.detailsContainer, { borderTopColor: theme.border }]}>
                    {item.note ? (
                        <View style={styles.detailRow}>
                            <Ionicons name="document-text-outline" size={14} color={theme.textSecondary} />
                            <Text style={[styles.detailText, { color: theme.textSecondary }]} numberOfLines={1}>{item.note}</Text>
                        </View>
                    ) : null}

                    {item.reminders && item.reminders.length > 0 && (
                        <View style={styles.detailRow}>
                            <Ionicons name="alarm-outline" size={14} color={theme.textSecondary} />
                            <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                                {item.reminders.join(', ')}
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Moja Apteczka</Text>
            </View>

            <FlatList
                data={medications}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={[styles.listContent, medications.length === 0 && { flex: 1 }]}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="medical-outline" size={64} color={theme.border} />
                        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                            Twoja apteczka jest pusta.{'\n'}Dodaj swój pierwszy lek.
                        </Text>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
            />

            {/* FAB */}
            <GlassView
                style={[styles.glassContainer, { bottom: ((Platform.OS === 'ios') ? 100 : 30) }]}
                isInteractive
            >
                <TouchableOpacity
                    style={[styles.fab, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
                    onPress={() => setIsModalVisible(true)}
                    activeOpacity={0.8}
                >
                    <Ionicons name="add" size={32} color="#FFF" />
                </TouchableOpacity>
            </GlassView>

            {/* MODAL */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalOverlay}
                >
                    <TouchableWithoutFeedback>
                        <View style={styles.modalOverlayInner}>
                            <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
                                <View style={styles.modalBackdrop} />
                            </TouchableWithoutFeedback>

                            <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                                <View style={styles.modalHeader}>
                                    <Text style={[styles.modalTitle, { color: theme.text }]}>Dodaj nowy lek</Text>
                                    <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                        <Ionicons name="close" size={24} color={theme.textSecondary} />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView showsVerticalScrollIndicator={false}>

                                    {/* Inputs */}
                                    <View style={styles.formGroup}>
                                        <Text style={[styles.label, { color: theme.textSecondary }]}>Nazwa leku</Text>
                                        <TextInput
                                            style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                            placeholder="np. Aspiryna"
                                            placeholderTextColor={theme.textSecondary}
                                            value={newName}
                                            onChangeText={setNewName}
                                        />
                                    </View>

                                    <View style={styles.formGroup}>
                                        <Text style={[styles.label, { color: theme.textSecondary }]}>Dawka / Ilość</Text>
                                        <TextInput
                                            style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                            placeholder="np. 500 mg"
                                            placeholderTextColor={theme.textSecondary}
                                            value={newDosage}
                                            onChangeText={setNewDosage}
                                        />
                                    </View>

                                    <View style={styles.formGroup}>
                                        <Text style={[styles.label, { color: theme.textSecondary }]}>Notatka (opcjonalnie)</Text>
                                        <TextInput
                                            style={[styles.input, styles.textArea, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]}
                                            placeholder="np. Brać po jedzeniu"
                                            placeholderTextColor={theme.textSecondary}
                                            value={newNote}
                                            onChangeText={setNewNote}
                                            multiline
                                            numberOfLines={2}
                                            textAlignVertical="top"
                                        />
                                    </View>

                                    {/* --- SEKCJA POWIADOMIEŃ --- */}
                                    <View style={[styles.sectionBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                        {/* Toggle */}
                                        <View style={styles.switchRow}>
                                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                                                <View style={[styles.iconBox, {backgroundColor: `${theme.primary}15`}]}>
                                                    <Ionicons name="notifications" size={20} />
                                                </View>
                                                <Text style={[styles.switchLabel, { color: theme.text }]}>Włącz przypomnienia</Text>
                                            </View>
                                            <Switch
                                                trackColor={{ false: theme.border, true: theme.primary }}
                                                thumbColor={'#fff'}
                                                ios_backgroundColor={theme.border}
                                                onValueChange={setHasReminders}
                                                value={hasReminders}
                                            />
                                        </View>

                                        {/* Rozszerzone opcje powiadomień */}
                                        {hasReminders && (
                                            <View style={styles.reminderOptions}>

                                                {/* Częstotliwość */}
                                                <Text style={[styles.subLabel, { color: theme.textSecondary }]}>Ile razy dziennie?</Text>
                                                <View style={styles.frequencyContainer}>
                                                    {[1, 2, 3, 4].map((num) => (
                                                        <TouchableOpacity
                                                            key={num}
                                                            style={[
                                                                styles.freqButton,
                                                                { borderColor: theme.border, backgroundColor: theme.background },
                                                                frequency === num && { backgroundColor: theme.primary, borderColor: theme.primary }
                                                            ]}
                                                            onPress={() => handleFrequencyChange(num)}
                                                        >
                                                            <Text style={[
                                                                styles.freqText,
                                                                { color: theme.text },
                                                                frequency === num && { color: '#FFF', fontWeight: 'bold' }
                                                            ]}>
                                                                {num}x
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </View>

                                                {/* Wybór godzin */}
                                                <Text style={[styles.subLabel, { color: theme.textSecondary, marginTop: 16 }]}>Godziny przyjmowania</Text>
                                                <View style={styles.timesContainer}>
                                                    {reminderTimes.map((time, index) => {
                                                        if (Platform.OS === 'web') {
                                                            return (
                                                                <View
                                                                    key={index}
                                                                    style={[
                                                                        styles.timeButton,
                                                                        {
                                                                            backgroundColor: theme.background,
                                                                            borderColor: theme.border,
                                                                            position: 'relative',
                                                                            overflow: 'hidden',
                                                                            justifyContent: 'center',
                                                                            paddingVertical: 0,
                                                                            height: 44
                                                                        }
                                                                    ]}
                                                                >
                                                                    <Ionicons
                                                                        name="time-outline"
                                                                        size={18}
                                                                        color={theme.textSecondary}
                                                                        style={{
                                                                            position: 'absolute',
                                                                            left: 12,
                                                                            zIndex: 1
                                                                        }}
                                                                    />

                                                                    {createElement('input', {
                                                                        type: 'time',
                                                                        value: time,
                                                                        onChange: (e: any) => {
                                                                            const newTimes = [...reminderTimes];
                                                                            newTimes[index] = e.target.value;
                                                                            setReminderTimes(newTimes);
                                                                        },
                                                                        style: {
                                                                            border: 'none',
                                                                            background: 'transparent',
                                                                            color: theme.text,
                                                                            fontSize: '16px',
                                                                            fontFamily: 'inherit',
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            paddingLeft: '36px', // Miejsce na ikonę
                                                                            outline: 'none',
                                                                            cursor: 'pointer'
                                                                        }
                                                                    })}
                                                                </View>
                                                            );
                                                        }

                                                    return (
                                                        <TouchableOpacity
                                                            key={index}
                                                            style={[styles.timeButton, { backgroundColor: theme.background, borderColor: theme.border }]}
                                                            onPress={() => openTimePicker(index)}
                                                        >
                                                            <Ionicons name="time-outline" size={18} color={theme.textSecondary} />
                                                            <Text style={[styles.timeText, { color: theme.text }]}>{time}</Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                                </View>
                                            </View>
                                        )}
                                    </View>

                                    <TouchableOpacity
                                        style={[styles.saveButton, { backgroundColor: theme.primary }]}
                                        onPress={handleAddMedication}
                                    >
                                        <Text style={styles.saveButtonText}>Zapisz lek</Text>
                                    </TouchableOpacity>

                                    <View style={{height: 20}} />
                                </ScrollView>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>

                {showTimePicker && Platform.OS === 'android' && (
                    <DateTimePicker
                        value={tempDate}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={onTimeChange}
                    />
                )}

                {Platform.OS === 'ios' && (
                    <Modal
                        transparent={true}
                        animationType="fade"
                        visible={showTimePicker}
                        onRequestClose={() => setShowTimePicker(false)}
                    >
                        {/* 1. DODANO KeyboardAvoidingView */}
                        <KeyboardAvoidingView
                            behavior="padding"
                            style={styles.iosPickerOverlay}
                        >
                            {/* Kliknięcie w tło zamyka modal (opcjonalne UX) */}
                            <TouchableWithoutFeedback onPress={() => setShowTimePicker(false)}>
                                <View style={styles.iosBackdrop} />
                            </TouchableWithoutFeedback>

                            <View style={[styles.iosPickerContent, { backgroundColor: theme.surface }]}>
                                <View style={[styles.iosPickerHeader, { borderBottomColor: theme.border }]}>
                                    <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                                        <Text style={{ color: theme.textSecondary, fontSize: 16 }}>Anuluj</Text>
                                    </TouchableOpacity>
                                    <Text style={{ fontWeight: '600', fontSize: 16, color: theme.text }}>Wybierz godzinę</Text>
                                    <TouchableOpacity onPress={confirmIOSDate}>
                                        <Text style={{ color: theme.primary, fontWeight: 'bold', fontSize: 16 }}>Gotowe</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.iosPickerBody}>
                                    <DateTimePicker
                                        value={tempDate}
                                        mode="time"
                                        is24Hour={true}
                                        display="spinner" // Spinner zazwyczaj nie wywołuje klawiatury, ale jeśli zmienisz na 'default', ten fix zadziała.
                                        onChange={onTimeChange}
                                        textColor={theme.text}
                                        style={{ width: '100%', height: 215 }}
                                    />
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </Modal>
                )}
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100, // Miejsce na FAB
        gap: 16,
    },
    // Karty
    card: {
        borderRadius: 16,
        padding: 16,
        // Cień
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    medName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    medDosage: {
        fontSize: 14,
        fontWeight: '600',
    },
    noteContainer: {
        flexDirection: 'row',
        gap: 6,
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    medNote: {
        fontSize: 13,
        fontStyle: 'italic',
        flex: 1,
    },
    // Empty State
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 16,
        fontSize: 16,
        lineHeight: 24,
    },
    // FAB (Floating Action Button)
    fab: {
        // position: 'absolute',
        // // bottom: 30,
        // right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    glassContainer: {
        position: 'absolute',
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    // Modal
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalOverlayInner: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        paddingTop: 12,
    },
    saveButton: {
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },

    sectionBox: {
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16
    },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    iconBox: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    switchLabel: { fontSize: 16, fontWeight: '600' },

    reminderOptions: { marginTop: 16, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(0,0,0,0.05)' },
    subLabel: { fontSize: 13, fontWeight: '600', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },

    // Frequency
    frequencyContainer: { flexDirection: 'row', gap: 10 },
    freqButton: { flex: 1, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 1 },
    freqText: { fontSize: 14, fontWeight: '600' },

    // Times
    timesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    timeButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, minWidth: '45%' },
    timeText: { fontSize: 16, fontWeight: '500' },

    detailsContainer: { flexDirection: 'column', gap: 6, marginTop: 8, paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    detailText: { fontSize: 13, fontStyle: 'italic', flex: 1 },

    iosPickerOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        // Usuwamy stąd backgroundColor, bo przenosimy go do iosBackdrop
    },
    // Nowy styl dla tła, aby było pod spodem
    iosBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: -1, // Ważne: tło musi być pod spodem
    },
    iosPickerContent: {
        paddingBottom: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: '100%',
        // Cień dla estetyki (opcjonalnie)
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    iosPickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    iosPickerBody: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingVertical: 10,
    }
});