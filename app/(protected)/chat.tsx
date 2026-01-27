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
    ActivityIndicator,
    Alert,
    Keyboard, Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";

import { COLORS } from '@/styles/theme';
import { chatService } from '@/services/chatService'; // <--- IMPORT SERWISU

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
}

const WELCOME_MESSAGE: Message = {
    id: 'init-1',
    text: 'Dzień dobry! Jestem Twoim wirtualnym asystentem StuMedicAI. W czym mogę Ci dzisiaj pomóc? Pamiętaj, że nie zastępuję porady lekarskiej.',
    sender: 'ai',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

const SUGGESTIONS = [
    "Moje leki",
    "Dodaj leki",
    "Następna wizyta",
    "Umów wizytę"
];

export default function ChatScreen() {
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false); // <--- Stan ładowania

    const [isLocalMode, setIsLocalMode] = useState(false);

    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages, isTyping]);

    const handleSend = async (textOverride?: string) => {
        const textToSend = textOverride || inputText;
        if (!textToSend.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: textToSend,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        try {
            const responseText = await chatService.sendMessage(messages, textToSend, isLocalMode);

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'ai',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages((prev) => [...prev, aiMsg]);

        } catch (error) {
            console.error(error);
            Alert.alert("Błąd", "Nie udało się połączyć z asystentem. Sprawdź internet.");
        } finally {
            setIsTyping(false);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => {
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
                        { color: isUser ? '#1A1A1A' : theme.text }
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

    const handleKeyPress = (e: any) => {
        if (Platform.OS === 'web') {
            if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>

            {/* --- HEADER --- */}
            <View style={[styles.header, { borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={ () => {
                    if (router.canGoBack()) {
                        router.back()
                    } else {
                        router.replace("/dashboard");
                    }
                }} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>

                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Asystent StuMedicAI</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <View style={[styles.statusDot, { backgroundColor: isTyping ? '#FF9500' : '#4CD964' }]} />
                        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                            {isTyping ? 'Pisze...' : 'Dostępny online'}
                        </Text>
                    </View>
                </View>

                <View style={styles.modeSwitchContainer}>
                    <Text style={[styles.modeLabel, { color: theme.textSecondary }]}>
                        {isLocalMode ? 'LOCAL' : 'GEMINI'}
                    </Text>
                    <Switch
                        trackColor={{ false: "#767577", true: theme.primary }}
                        thumbColor={"#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => setIsLocalMode(prev => !prev)}
                        value={!isLocalMode}
                        style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                    />
                </View>
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
                ListFooterComponent={
                    isTyping ? (
                        <View style={styles.messageRowAi}>
                            <View style={[styles.avatarContainer, { backgroundColor: theme.surface }]}>
                                <Ionicons name="sparkles" size={16} color="#5856D6" />
                            </View>
                            <View style={[styles.bubble, { backgroundColor: theme.surface, borderBottomLeftRadius: 2, paddingVertical: 12 }]}>
                                <ActivityIndicator size="small" color={theme.textSecondary} />
                            </View>
                        </View>
                    ) : null
                }
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <View style={styles.suggestionsContainer}>
                    <FlatList
                        data={SUGGESTIONS}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
                        renderItem={({item}) => (
                            <TouchableOpacity
                                style={[styles.suggestionChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
                                disabled={isTyping}
                                onPress={() => handleSend(item)}
                            >
                                <Text style={{ fontSize: 13, color: theme.textSecondary }}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                {/* Input Bar */}
                <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
                        placeholder="Napisz wiadomość..."
                        placeholderTextColor={theme.textSecondary}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        onKeyPress={handleKeyPress}
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            { backgroundColor: inputText.trim() || isTyping ? theme.primary : theme.border }
                        ]}
                        disabled={!inputText.trim() || isTyping}
                        onPress={() => handleSend()}
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
        // justifyContent: 'space-between',
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
        marginRight: 4,
    },
    backButton: {
        padding: 4,
    },
    menuButton: {
        padding: 4,
    },
    disclaimerContainer: {
        backgroundColor: 'rgba(255, 149, 0, 0.1)',
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disclaimerText: {
        fontSize: 11,
        color: '#FF9500',
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
        width: 'auto',
        flexShrink: 1,
    },
    messageRowUser: {
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
    },
    messageRowAi: {
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        // marginBottom: 16,
    },
    avatarContainer: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        marginTop: 2,
    },
    bubble: {
        padding: 12,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        flexShrink: 1
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
        minHeight: 48,
        maxHeight: 120,
        borderRadius: 24,
        paddingHorizontal: 18,
        paddingTop: 12,
        paddingBottom: 12,
        marginRight: 10,
        fontSize: 16,
        borderWidth: 1,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modeSwitchContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
        marginRight: 8,
    },
    modeLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        marginBottom: -4,
    },
});