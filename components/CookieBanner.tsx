import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    useColorScheme,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS } from '@/styles/theme';

export default function CookieBanner() {
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (Platform.OS === 'web') {
            const consent = localStorage.getItem('cookieConsent');
            if (!consent) {
                setIsVisible(true);
            }
        }
    }, []);

    const handleAccept = () => {
        if (Platform.OS === 'web') {
            localStorage.setItem('cookieConsent', 'true');
            setIsVisible(false);
        }
    };

    const handlePolicyClick = () => {
        router.push('/privacy-policy');
    };

    if (Platform.OS !== 'web' || !isVisible) {
        return null;
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
            <View style={styles.contentContainer}>
                <View style={styles.iconContainer}>
                    <Ionicons name="information-circle-outline" size={24} color={theme.primary} />
                </View>

                <View style={styles.textContainer}>
                    <Text style={[styles.text, { color: theme.text }]}>
                        Ta strona używa plików cookie, aby zapewnić najlepszą jakość usług.
                        Korzystając ze strony, zgadzasz się na {' '}
                        <Text
                            style={[styles.link, { color: theme.primary }]}
                            onPress={handlePolicyClick}
                        >
                            Politykę Prywatności StuMedica
                        </Text>.
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={handleAccept}
                >
                    <Text style={[styles.buttonText, { color: theme.background}]}>OK</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderTopWidth: 1,

        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 10,
        zIndex: 9999,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: 1200,
        alignSelf: 'center',
        width: '100%',
        gap: 16,
        flexWrap: 'wrap',
    },
    iconContainer: {
        display: 'flex',
    },
    textContainer: {
        flex: 1,
        minWidth: 200,
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
    },
    link: {
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        cursor: 'pointer',
    } as any,
    button: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
    } as any,
    buttonText: {
        fontWeight: 'bold',
        fontSize: 14,
    },
});