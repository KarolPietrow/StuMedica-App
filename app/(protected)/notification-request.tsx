import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {COLORS, GLOBAL_STYLES, SIZES} from '@/styles/theme';
import { useNotificationObserver } from '@/hooks/useNotificationObserver'; // Twój hook
import { GlassView } from "expo-glass-effect";

export default function NotificationRequestScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    const { requestAndEnableNotifications } = useNotificationObserver();

    const handleEnable = async () => {
        const success = await requestAndEnableNotifications();

        if (success) {
            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace('/dashboard');
            }
        }
    };

    const handleSkip = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/dashboard');
        }
    };

    const features = [
        { icon: 'time-outline', text: 'Przypomnienia o lekach na czas' },
        { icon: 'calendar-outline', text: 'Powiadomienia o wizytach lekarskich' },
        { icon: 'document-text-outline', text: 'Informacje o nowych e-receptach' },
        { icon: 'warning-outline', text: 'Alerty o kończących się lekach' },
    ];

    if (Platform.OS === 'web') {
        handleSkip()
    } else {
        return (
            <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
                <View style={styles.contentContainer}>

                    <View style={styles.headerSection}>
                        <View style={[styles.iconCircle, {backgroundColor: `${theme.primary}15`}]}>
                            <Ionicons name="notifications" size={64}/>
                            <View style={[styles.badgeIcon, {backgroundColor: theme.background}]}>
                                <Ionicons name="checkmark-circle" size={32} color="#4CD964"/>
                            </View>
                        </View>

                        <Text style={[styles.title, {color: theme.text}]}>
                            Bądź na bieżąco
                        </Text>
                        <Text style={[styles.subtitle, {color: theme.textSecondary}]}>
                            Włącz powiadomienia, aby w pełni dbać o swoje zdrowie ze StuMedica.
                        </Text>
                    </View>

                    <View style={styles.featuresSection}>
                        {features.map((item, index) => (
                            <View key={index} style={styles.featureRow}>
                                <View style={[styles.featureIconBox, {backgroundColor: theme.surface}]}>
                                    <Ionicons name={item.icon as any} size={24} color={theme.primary}/>
                                </View>
                                <Text style={[styles.featureText, {color: theme.text}]}>
                                    {item.text}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.footerSection}>
                        <GlassView
                            isInteractive
                            style={{
                                borderRadius: SIZES.radius,
                            }}
                        >
                            <TouchableOpacity
                                style={[
                                    GLOBAL_STYLES.primaryButton,
                                    GLOBAL_STYLES.shadow,
                                ]}
                                onPress={ handleEnable }
                                activeOpacity={0.8}
                            >
                                <Text style={styles.primaryButtonText}>Włącz powiadomienia</Text>
                            </TouchableOpacity>
                        </GlassView>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={handleSkip}
                        >
                            <Text style={[styles.secondaryButtonText, {color: theme.textSecondary}]}>
                                Może później
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flex: 1,
        padding: 24,
        justifyContent: 'space-between', // Rozciąga sekcje (Góra - Środek - Dół)
    },
    // Sekcja nagłówka
    headerSection: {
        alignItems: 'center',
        marginTop: 40,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        position: 'relative',
    },
    badgeIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        padding: 4,
        borderRadius: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    // Sekcja listy
    featuresSection: {
        marginTop: 20,
        gap: 20,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    featureIconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        // Lekki cień
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    featureText: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    // Stopka z przyciskami
    footerSection: {
        marginBottom: 20,
        gap: 16,
    },
    primaryButton: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000", // Cień pod przyciskiem
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
    }
});