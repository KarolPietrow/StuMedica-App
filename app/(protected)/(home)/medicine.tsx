import React, { useState } from 'react';
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
    Keyboard,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, GLOBAL_STYLES, SIZES } from '@/styles/theme';
import {GlassView} from "expo-glass-effect";

// Typ danych leku (Mock)
interface Medication {
    id: string;
    name: string;
    dosage: string;
    note?: string;
}

export default function MedicineScreen() {
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    // --- STAN ---
    const [medications, setMedications] = useState<Medication[]>([
        { id: '1', name: 'Witamina D3', dosage: '2000 j.m.', note: 'Brać rano po śniadaniu' },
        { id: '2', name: 'Ibuprofen', dosage: '400 mg', note: 'Tylko w razie bólu' },
    ]);

    const [isModalVisible, setIsModalVisible] = useState(false);

    // Stan formularza
    const [newName, setNewName] = useState('');
    const [newDosage, setNewDosage] = useState('');
    const [newNote, setNewNote] = useState('');

    // --- LOGIKA ---

    const handleAddMedication = () => {
        if (!newName.trim() || !newDosage.trim()) {
            Alert.alert("Błąd", "Podaj nazwę leku i dawkę.");
            return;
        }

        const newMed: Medication = {
            id: Date.now().toString(),
            name: newName,
            dosage: newDosage,
            note: newNote
        };

        setMedications(prev => [...prev, newMed]);
        resetForm();
    };

    const resetForm = () => {
        setNewName('');
        setNewDosage('');
        setNewNote('');
        setIsModalVisible(false);
    };

    // --- KOMPONENTY UI ---

    const renderItem = ({ item }: { item: Medication }) => (
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconContainer, { backgroundColor: `${theme.primary}15` }]}>
                    <Ionicons name="medkit" size={24} color={theme.primary} />
                </View>
                <View style={styles.cardContent}>
                    <Text style={[styles.medName, { color: theme.text }]}>{item.name}</Text>
                    <Text style={[styles.medDosage, { color: theme.primary }]}>{item.dosage}</Text>
                </View>
                <TouchableOpacity onPress={() => Alert.alert("Opcje", "Edytuj lub usuń")}>
                    <Ionicons name="ellipsis-vertical" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            {item.note ? (
                <View style={[styles.noteContainer, { borderTopColor: theme.border }]}>
                    <Ionicons name="document-text-outline" size={14} color={theme.textSecondary} style={{marginTop: 2}} />
                    <Text style={[styles.medNote, { color: theme.textSecondary }]}>{item.note}</Text>
                </View>
            ) : null}
        </View>
    );

    const EmptyState = () => (
        <View style={styles.emptyContainer}>
            <Ionicons name="medical-outline" size={64} color={theme.border} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                Twoja apteczka jest pusta.{'\n'}Dodaj swój pierwszy lek.
            </Text>
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
                ListEmptyComponent={EmptyState}
                showsVerticalScrollIndicator={false}
            />

            {/* --- PRZYCISK DODAWANIA (FAB) --- */}
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

            {/* --- MODAL DODAWANIA --- */}
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
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalOverlayInner}>
                            {/* Kliknięcie w tło zamyka modal */}
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

                                {/* Formularz */}
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
                                        placeholder="np. 500 mg lub 1 tabletka"
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
                                        numberOfLines={3}
                                        textAlignVertical="top"
                                    />
                                </View>

                                <TouchableOpacity
                                    style={[styles.saveButton, { backgroundColor: theme.primary }]}
                                    onPress={handleAddMedication}
                                >
                                    <Text style={styles.saveButtonText}>Dodaj do listy</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
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
});