import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    useColorScheme,
    Image,
    Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";

import { COLORS, SIZES } from '@/styles/theme';

const MOCK_MESSAGES = [
    {
        id: '1',
        text: 'Dzień dobry! Jestem Twoim wirtualnym asystentem medycznym. W czym mogę Ci dzisiaj pomóc? Pamiętaj, że nie zastępuję porady lekarskiej.',
        sender: 'ai',
        timestamp: '10:00'
    },
    {
        id: '2',
        text: 'Chciałbym umówić wizytę do kardiologa.',
        sender: 'user',
        timestamp: '10:02'
    },
    {
        id: '3',
        text: 'Jasne, chętnie pomogę. Kiedy chciałbyś odbyć wizytę? Mam wolne terminy w przyszłym tygodniu.',
        sender: 'ai',
        timestamp: '10:02'
    }
];

const SUGGESTIONS = [
    "Umów wizytę",
    "Moje leki",
    "Wyniki badań",
    "Boli mnie głowa"
];

export default function ChatScreen() {
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputText('');

        setTimeout(() => {
            const aiResponse = {
                id: (Date.now() + 1).toString(),
                text: 'Rozumiem. Przetwarzam Twoje zapytanie...',
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, aiResponse]);
        }, 1500);
    };

    const renderMessage = ({ item }: any) => {
        const isUser = item.sender === 'user';

        return (
            <View style={[
                styles.messageRow,
                isUser ? styles.messageRowUser : styles.messageRowAi
            ]}>
                {!isUser && (
                    <View style={[styles.avatarContainer, { backgroundColor: theme.surface }]}>
                        <Ionicons name="sparkles" size={16} color="#5856D6" />
                    </View>
                )}

                <View style={[
                    styles.bubble,
                    isUser
                        ? { backgroundColor: theme.primary, borderBottomRightRadius: 2 }
                        : { backgroundColor: theme.surface, borderBottomLeftRadius: 2 }
                ]}>
                    <Text style={[
                        styles.messageText,
                        { color: isUser ? '#1A1A1A' : theme.text } // Tekst na primary (miętowym) lepiej wygląda ciemny
                    ]}>
                        {item.text}
                    </Text>
                    <Text style={[
                        styles.timestamp,
                        { color: isUser ? 'rgba(0,0,0,0.4)' : theme.textSecondary, textAlign: isUser ? 'right' : 'left' }
                    ]}>
                        {item.timestamp}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>

            {/* --- HEADER --- */}
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <View>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Asystent StuMedicAI</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <View style={styles.statusDot} />
                        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>Dostępny online</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.menuButton}>
                    <Ionicons name="ellipsis-horizontal" size={24} color={theme.text} />
                </TouchableOpacity>
            </View>

            {/* --- DISCLAIMER --- */}
            <View style={styles.disclaimerContainer}>
                <Text style={styles.disclaimerText}>
                    Asystent AI może popełniać błędy. W nagłych wypadkach dzwoń na 112.
                </Text>
            </View>

            {/* --- LISTA WIADOMOŚCI --- */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            />

            {/* --- SUGGESTIONS & INPUT --- */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
            >
                {/* Sugestie (tylko gdy klawiatura ukryta lub zawsze - zależy od preferencji, tu dajemy zawsze nad inputem) */}
                <View style={styles.suggestionsContainer}>
                    <FlatList
                        data={SUGGESTIONS}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
                        renderItem={({item}) => (
                            <TouchableOpacity
                                style={[styles.suggestionChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
                                onPress={() => setInputText(item)}
                            >
                                <Text style={{ fontSize: 13, color: theme.textSecondary }}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                {/* Input Bar */}
                <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
                    <TouchableOpacity style={styles.attachButton}>
                        <Ionicons name="add-circle-outline" size={28} color={theme.textSecondary} />
                    </TouchableOpacity>

                    <TextInput
                        style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                        placeholder="Napisz wiadomość..."
                        placeholderTextColor={theme.textSecondary}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />

                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            { backgroundColor: inputText.trim() ? theme.primary : theme.border }
                        ]}
                        disabled={!inputText.trim()}
                        onPress={handleSend}
                    >
                        <Ionicons
                            name="arrow-up"
                            size={20}
                            color={inputText.trim() ? '#FFF' : theme.textSecondary}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 12,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4CD964',
    },
    backButton: {
        padding: 4,
    },
    menuButton: {
        padding: 4,
    },
    disclaimerContainer: {
        backgroundColor: 'rgba(255, 149, 0, 0.1)', // Light orange background
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disclaimerText: {
        fontSize: 11,
        color: '#FF9500', // Orange text
        textAlign: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 20,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: 16,
        maxWidth: '85%',
    },
    messageRowUser: {
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
    },
    messageRowAi: {
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
    },
    avatarContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        marginTop: 2, // align with top of bubble
    },
    bubble: {
        padding: 12,
        borderRadius: 20,
        // Cienie dla subtelnej głębi
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    timestamp: {
        fontSize: 10,
        marginTop: 4,
    },
    suggestionsContainer: {
        paddingVertical: 12,
    },
    suggestionChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        marginRight: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
    },
    attachButton: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        paddingHorizontal: 16,
        marginRight: 8,
        fontSize: 15,
        maxHeight: 100,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});