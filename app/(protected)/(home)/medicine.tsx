import React, {createElement, useState, useCallback, useEffect} from 'react';
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
    ScrollView, Switch, ActivityIndicator, RefreshControl, AppState
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GLOBAL_STYLES, SIZES } from '@/styles/theme';
import { GlassView } from "expo-glass-effect";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from "expo-router";

import { useSession } from '@/context/AuthContext';
import { medicationService, Medication } from '@/services/medicationService';
import { syncLocalNotifications } from '@/services/notificationService';
import { updateWidget } from "@/services/widgetService";

export default function MedicineScreen() {
    const { session } = useSession();
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    const [medications, setMedications] = useState<Medication[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [menuVisible, setMenuVisible] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState<{ top: number; right: number; item: Medication } | null>(null);

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [medToDelete, setMedToDelete] = useState<Medication | null>(null);

    const [editingId, setEditingId] = useState<number | null>(null);

    // Stan formularza
    const [newName, setNewName] = useState('');
    const [newDosage, setNewDosage] = useState('');
    const [newNote, setNewNote] = useState('');
    const [hasReminders, setHasReminders] = useState(false);
    const [frequency, setFrequency] = useState(1); // 1 - 4
    const [reminderTimes, setReminderTimes] = useState<string[]>(['08:00']);

    const [showTimePicker, setShowTimePicker] = useState(false);
    const [activeTimeIndex, setActiveTimeIndex] = useState<number | null>(null);
    const [tempDate, setTempDate] = useState(new Date());

    useEffect(() => {
        updateWidget(medications);
    }, [medications]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                updateWidget(medications);
            }
        });
        return () => subscription.remove();
    }, [medications]);

    const fetchMedications = async () => {
        if (!session) return;
        setIsLoading(true);
        try {
            const data = await medicationService.getAll(session);
            setMedications(data);

            syncLocalNotifications(data).catch(err => console.error("Błąd sync powiadomień:", err));

        } catch (error) {
            console.error(error);
            Alert.alert("Błąd", "Nie udało się pobrać listy leków.");
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchMedications();
        }, [session])
    );

    const openMenu = (event: any, item: Medication) => {
        const { pageY } = event.nativeEvent;
        setMenuAnchor({
            top: pageY,
            right: 50,
            item: item
        });
        setMenuVisible(true);
    };

    const closeMenu = () => {
        setMenuVisible(false);
        setMenuAnchor(null);
    };

    const handleEditFromMenu = () => {
        if (menuAnchor) {
            startEditing(menuAnchor.item);
        }
        closeMenu();
    };

    const handleDeleteFromMenu = () => {
        if (menuAnchor) {
            setMedToDelete(menuAnchor.item);
            closeMenu();
            setDeleteModalVisible(true);
        }
    }

    const confirmDelete = async () => {
        if (!medToDelete || !session) return;

        try {
            await handleDelete(medToDelete.id);
        } catch (error) {
            console.error("Błąd usuwania w confirmDelete", error);
        } finally {
            setDeleteModalVisible(false);
            setMedToDelete(null);
        }
    };

    const startEditing = (med: Medication) => {
        setEditingId(med.id);
        setNewName(med.name);
        setNewDosage(med.dosage);
        setNewNote(med.note || '');

        if (med.reminders && med.reminders.length > 0) {
            setHasReminders(true);
            setReminderTimes(med.reminders);
            setFrequency(med.reminders.length);
        } else {
            setHasReminders(false);
            setReminderTimes(['08:00']);
            setFrequency(1);
        }
        setIsModalVisible(true);
    };

    const handleSaveMedication = async () => {
        if (!newName.trim() || !newDosage.trim()) {
            Alert.alert("Podaj nazwę leku i dawkę.");
            return;
        }
        if (!session) return;

        setIsSubmitting(true);
        try {
            const medData = {
                name: newName,
                dosage: newDosage,
                note: newNote,
                reminders: hasReminders ? reminderTimes : []
            };

            let updatedList = [...medications];

            if (editingId) {
                const updatedMed = await medicationService.update(editingId, medData);
                updatedList = medications.map(m => m.id === editingId ? updatedMed : m);
            } else {
                const newMed = await medicationService.add(session, medData);
                updatedList = [...medications, newMed];
            }

            setMedications(updatedList);
            await syncLocalNotifications(updatedList);
            resetForm();

        } catch (error) {
            console.error(error);
            alert("Błąd zapisu.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!session) return;
        try {
            await medicationService.delete(session, id);
            const updatedList = medications.filter(m => m.id !== id);
            setMedications(updatedList);
            await syncLocalNotifications(updatedList);
        } catch (error) {
            alert("Nie udało się usunąć leku.");
        }
    };

    const resetForm = () => {
        setNewName('');
        setNewDosage('');
        setNewNote('');
        setHasReminders(false);
        setFrequency(1);
        setReminderTimes(['08:00']);
        setEditingId(null);
        setIsModalVisible(false);
    };


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
                <TouchableOpacity
                    onPress={(e) => openMenu(e, item)}
                    style={{ padding: 4 }}
                    activeOpacity={0.6}
                >
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
        <SafeAreaView
            style={[GLOBAL_STYLES.container, { backgroundColor: theme.background }]}
            edges={['right', 'left', 'top']
        }>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Moja Apteczka</Text>
                {/*{isLoading && <ActivityIndicator size="small" color={theme.primary} />}*/}
            </View>

            <FlatList
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={fetchMedications} tintColor={theme.primary} />
                }
                data={medications}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={[styles.listContent, medications.length === 0 && { flex: 1 }]}
                ListEmptyComponent={() => (
                    !isLoading ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="medical-outline" size={64} color={theme.border} />
                            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                                Twoja apteczka jest pusta.{'\n'}Dodaj swój pierwszy lek.
                            </Text>
                        </View>
                    ) : null                )}
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(false)
                    resetForm()
                }}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalOverlay}
                >
                    <TouchableWithoutFeedback>
                        <View style={styles.modalOverlayInner}>
                            <TouchableWithoutFeedback onPress={() => {
                                setIsModalVisible(false)
                                resetForm()
                            }}>
                                <View style={styles.modalBackdrop} />
                            </TouchableWithoutFeedback>

                            <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                                <View style={styles.modalHeader}>
                                    <Text style={[styles.modalTitle, { color: theme.text }]}>
                                        {editingId ? "Edytuj lek" : "Dodaj nowy lek"}                                    </Text>
                                    <TouchableOpacity onPress={resetForm}>
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

                                        {hasReminders && (
                                            <View style={styles.reminderOptions}>
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
                                                                            paddingLeft: '36px',
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
                                        style={[styles.saveButton, { backgroundColor: theme.primary, opacity: isSubmitting ? 0.7 : 1 }]}
                                        onPress={handleSaveMedication}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <ActivityIndicator color="#FFF" />
                                        ) : (
                                            <Text style={styles.saveButtonText}>Zapisz lek</Text>
                                        )}
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
                        <KeyboardAvoidingView
                            behavior="padding"
                            style={styles.iosPickerOverlay}
                        >
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
                                        display="spinner"
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

            <Modal
                animationType="slide"
                transparent={true}
                visible={deleteModalVisible}
                onRequestClose={() => setDeleteModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={() => setDeleteModalVisible(false)}>
                        <View style={styles.modalBackdrop} />
                    </TouchableWithoutFeedback>

                    <View style={[styles.modalContent, { backgroundColor: theme.background, height: 'auto', paddingBottom: 40 }]}>
                        <View style={{ alignItems: 'center', marginBottom: 20 }}>
                            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: theme.border }} />
                        </View>

                        <Text style={[styles.modalTitle, { color: theme.text, textAlign: 'center', marginBottom: 10 }]}>
                            Usuń lek
                        </Text>

                        <Text style={{ color: theme.textSecondary, textAlign: 'center', fontSize: 16, marginBottom: 24, paddingHorizontal: 20 }}>
                            Czy na pewno chcesz usunąć lek <Text style={{fontWeight: 'bold', color: theme.text}}>{medToDelete?.name}</Text>?
                            {"\n"}Tej operacji nie można cofnąć.
                        </Text>

                        <View style={styles.deleteButtonsRow}>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border }]}
                                onPress={() => setDeleteModalVisible(false)}
                            >
                                <Text style={[styles.btnText, { color: theme.text }]}>Anuluj</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: theme.error + '15' }]} // Jasny czerwony tło
                                onPress={confirmDelete}
                            >
                                <Text style={[styles.btnText, { color: theme.error }]}>Usuń</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={menuVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={closeMenu}
            >
                {/* TŁO: Kliknięcie gdziekolwiek zamyka menu */}
                <TouchableOpacity
                    style={styles.menuBackdrop}
                    activeOpacity={1}
                    onPress={closeMenu}
                >
                    {/* MENU WŁAŚCIWE */}
                    {menuAnchor && (
                        <View style={[
                            styles.dropdownMenu,
                            {
                                top: menuAnchor.top,
                                right: menuAnchor.right,
                                backgroundColor: theme.surface,
                                shadowColor: theme.text
                            }
                        ]}>
                            <TouchableOpacity style={styles.menuOption} onPress={handleEditFromMenu}>
                                <Ionicons name="pencil-outline" size={18} color={theme.text} />
                                <Text style={[styles.menuOptionText, { color: theme.text }]}>Edytuj</Text>
                            </TouchableOpacity>

                            <View style={[styles.menuSeparator, { backgroundColor: theme.border }]} />

                            <TouchableOpacity style={styles.menuOption} onPress={handleDeleteFromMenu}>
                                <Ionicons name="trash-outline" size={18} color={theme.error} />
                                <Text style={[styles.menuOptionText, { color: theme.error }]}>Usuń</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </TouchableOpacity>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
    card: {
        borderRadius: 16,
        padding: 16,
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

        maxHeight: '95%',
        width: '100%',
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
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center' },
    switchLabel: {
        fontSize: 16,
        fontWeight: '600'
    },
    reminderOptions: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: 'rgba(0,0,0,0.05)'
    },
    subLabel: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    frequencyContainer: {
        flexDirection: 'row',
        gap: 10 },
    freqButton: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1
    },
    freqText: {
        fontSize: 14,
        fontWeight: '600'
    },
    timesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10
    },
    timeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        minWidth: '45%'
    },
    timeText: {
        fontSize: 16,
        fontWeight: '500'
    },
    detailsContainer: {
        flexDirection: 'column',
        gap: 6,
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: StyleSheet.hairlineWidth
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center', gap: 6
    },
    detailText: {
        fontSize: 13,
        fontStyle: 'italic',
        flex: 1
    },

    iosPickerOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
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
    },
    menuBackdrop: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    dropdownMenu: {
        position: 'absolute',
        width: 150,
        borderRadius: 12,
        paddingVertical: 4,

        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    menuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 10,
    },
    menuOptionText: {
        fontSize: 15,
        fontWeight: '500',
    },
    menuSeparator: {
        height: 1,
        width: '100%',
        opacity: 0.1,
    },
    deleteButtonsRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
    },
    modalBtn: {
        flex: 1,
        height: 52,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        fontSize: 16,
        fontWeight: '600'
    }
});