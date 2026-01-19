import {
    ActivityIndicator, Alert,
    Platform,
    ScrollView,
    StyleSheet, Switch,
    Text,
    TouchableOpacity,
    useColorScheme,
    View
} from "react-native";
import { COLORS, GLOBAL_STYLES, SIZES } from "@/styles/theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, {useEffect, useState} from "react";
import { useSession } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { GlassView } from "expo-glass-effect";

import { useNotificationObserver } from "@/hooks/useNotificationObserver";
import {scheduleTestNotification} from "@/services/notificationService";
import {biometricService} from "@/services/biometricService";
import {SafeAreaView} from "react-native-safe-area-context";

export default function Account() {
    const { user, refreshUser, signOut } = useSession()

    const isWeb = Platform.OS === 'web';

    const { notificationsEnabled, isChecking, toggleNotifications } = useNotificationObserver();

    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    // TODO: W przyszłości te dane będą przychodzić z user object lub osobnego zapytania API
    const securityState = {
        is2FAEnabled: false,
        isPasskeyEnabled: false,
        // isBiometricEnabled: false,
        isGoogleConnected: false,
        isAppleConnected: false,

        // notificationsEnabled: false,
        currentTheme: true
    };

    const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        checkBiometrics();
    }, []);

    const checkBiometrics = async () => {
        const supported = await biometricService.isHardwareAvailable();
        setIsSupported(supported);

        if (supported) {
            const enabled = await biometricService.isBiometricEnabled();
            setIsBiometricEnabled(enabled);
        }
    };

    const toggleBiometrics = async (value: boolean) => {
        if (value) {
            const result = await biometricService.authenticate();
            if (result.success) {
                await biometricService.setBiometricEnabled(true);
                setIsBiometricEnabled(true);
            } else {
                Alert.alert("Błąd", "Nie udało się zweryfikować tożsamości. Funkcja nie została włączona.");
            }
        } else {
            await biometricService.setBiometricEnabled(false);
            setIsBiometricEnabled(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const InfoRow = ({ label, value, icon, onEdit, isEditable = true }: any) => (
        <View style={[styles.rowContainer, { borderBottomColor: theme.border }]}>
            <View style={styles.rowIconContainer}>
                <Ionicons name={icon} size={22} color={theme.textSecondary} />
            </View>
            <View style={styles.rowContent}>
                <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>{label}</Text>
                <Text style={[styles.rowValue, { color: theme.text }]}>{value}</Text>
            </View>
            {isEditable && (
                <TouchableOpacity
                    style={[styles.editButton, { backgroundColor: theme.surface }]}
                    onPress={onEdit}
                >
                    <Ionicons name="pencil" size={18} color={theme.primary} />
                </TouchableOpacity>
            )}
        </View>
    );

    const StatusRow = ({
                           label,
                           isActive, // Tu przekażemy wartość bool dla switcha
                           activeText,
                           inactiveText,
                           icon,
                           onPress, // Dla zwykłych wierszy (np. 2FA)
                           isToggle = false, // Czy to ma być Switch?
                           onToggle, // Funkcja zmiany switcha
                           disabled = false,
                           disabledText = "Tylko w aplikacji"
                       }: any) => {
        const statusColor = disabled
            ? theme.textSecondary
            : (isActive ? '#4CD964' : theme.textSecondary);

        const displayText = disabled
            ? disabledText
            : (isActive ? activeText : inactiveText);

        const containerOpacity = disabled ? 0.5 : 1;

        // Kontener: Jeśli to Toggle, nie chcemy, żeby cały wiersz był klikalny tak samo jak przycisk
        const Wrapper = isToggle ? View : TouchableOpacity;

        return (
            <Wrapper
                style={[styles.rowContainer, { borderBottomColor: theme.border, opacity: containerOpacity }]}
                onPress={(!isToggle && !disabled) ? onPress : undefined}
                disabled={disabled}
            >
                <View style={styles.rowIconContainer}>
                    <Ionicons name={icon} size={22} color={theme.textSecondary} />
                </View>

                <View style={styles.rowContent}>
                    <Text style={[styles.statusLabelName, { color: theme.text }]}>{label}</Text>
                    {/* Jeśli to Switch, ukrywamy kropkę i tekst statusu, bo Switch sam w sobie jest statusem */}
                    {(!isToggle || isWeb) && (
                        <View style={styles.statusBadgeContainer}>
                            {!disabled && <View style={[styles.statusDot, { backgroundColor: statusColor }]} />}
                            <Text style={[styles.statusText, { color: statusColor, fontStyle: disabled ? 'italic' : 'normal' }]}>
                                {displayText}
                            </Text>
                        </View>
                    )}
                </View>

                {/* PRAWA STRONA WIERSZA */}
                {label === "Powiadomienia" && isChecking ? (
                    <ActivityIndicator size="small" color={theme.primary} />
                ) : (
                    <View>
                        {isToggle ? (
                            <>
                                {!disabled &&
                                <Switch
                                    trackColor={{false: theme.border, true: theme.primary}}
                                    thumbColor={'#fff'}
                                    ios_backgroundColor={theme.border}
                                    onValueChange={onToggle}
                                    value={isActive}
                                    disabled={disabled}
                                    style={Platform.select({
                                        ios: {transform: [{scaleX: 0.8}, {scaleY: 0.8}]}
                                    })}
                                />
                                }
                                {disabled &&
                                    <Ionicons name={"lock-closed-outline"} size={16} color={theme.textSecondary} />
                                }
                            </>
                        ) : (
                            <View style={[styles.chevronContainer, { backgroundColor: theme.surface }]}>
                                {!disabled && <Text style={[styles.manageText, { color: theme.primary }]}>Zarządzaj</Text>}
                                <Ionicons name={disabled ? "lock-closed-outline" : "chevron-forward"} size={16} color={disabled ? theme.textSecondary : theme.primary} />
                            </View>
                        )}
                    </View>
                )}
            </Wrapper>
        );
    };

    const ActionRow = ({ label, icon, onPress, color }: any) => (
        <TouchableOpacity
            style={[styles.actionRow, { borderBottomColor: theme.border }]}
            onPress={onPress}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={[styles.iconBox]}>
                    <Ionicons name={icon} size={20} color={theme.textSecondary} />
                </View>
                <Text style={[styles.actionLabel, { color: theme.text }]}>{label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
    );

    const AppDownloadBanner = () => {
        if (!isWeb) return null;

        return (
            <View style={[styles.webBanner, { backgroundColor: theme.primary }]}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', gap: 8}}>
                        <Text style={styles.webBannerTitle}> Pobierz aplikację mobilną </Text>
                        <Ionicons name="logo-android" size={22} />
                        <Ionicons name="logo-apple" size={22} />
                    </View>
                    <Text style={styles.webBannerText}>
                        Zyskaj dostęp do powiadomień o lekach i logowania biometrią.
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.webBannerButton}
                    onPress={() => alert("[TODO] Przekierowanie do App Store / Google Play")}
                >
                    <Text style={[styles.webBannerButtonText]}>Pobierz</Text>
                </TouchableOpacity>
            </View>
        );
    };


    if (!user) return null;

    return (
        <SafeAreaView
            style={[GLOBAL_STYLES.container, { backgroundColor: theme.background }]}
            edges={['right', 'left', 'top']
        }>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                        <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
                    </View>
                    <Text style={[styles.userName, { color: theme.text }]}>{user.name}</Text>
                    <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user.email}</Text>
                    <View style={[styles.badge, { borderColor: theme.primary }]}>
                        <Text style={[styles.badgeText, { color: theme.primary }]}>PACJENT</Text>
                    </View>
                </View>

                <AppDownloadBanner />

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Twoje Dane</Text>
                    <View style={[styles.card, { backgroundColor: theme.surface }]}>
                        <InfoRow
                            label="Imię i nazwisko"
                            value={user.name}
                            icon="person-outline"
                            onEdit={() => alert("[TODO] Jeszcze nie zaimplementowane")}
                        />
                        <InfoRow
                            label="Adres email"
                            value={user.email}
                            icon="mail-outline"
                            onEdit={() => alert("[TODO] Jeszcze nie zaimplementowane")}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Ustawienia aplikacji</Text>
                    <View style={[styles.card, { backgroundColor: theme.surface }]}>
                        {/* Powiadomienia */}
                        <StatusRow
                            label="Powiadomienia"
                            icon="notifications-outline"

                            isToggle={true}
                            isActive={notificationsEnabled}
                            onToggle={toggleNotifications}
                            disabled={isWeb}
                        />

                        {/* Motyw */}
                        <View style={{ overflow: 'hidden' }}>
                            <ActionRow
                                label="Motyw aplikacji"
                                value={securityState.currentTheme}
                                icon="moon-outline"
                                color="#5856D6" // Fioletowy dla motywu
                                onPress={() => alert("[TODO] Jeszcze nie zaimplementowane")}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Bezpieczeństwo</Text>
                    <View style={[styles.card, { backgroundColor: theme.surface, paddingVertical: 0 }]}>
                        {isSupported && (
                            <StatusRow
                                isToggle={true}
                                label="Logowanie biometrią"
                                isActive={isBiometricEnabled}
                                activeText="Włączone"
                                inactiveText="Wyłączone"
                                icon="finger-print-outline"
                                onToggle={ toggleBiometrics }
                                disabled={isWeb}
                            />)}
                        <StatusRow
                            label="Weryfikacja dwuetapowa (2FA)"
                            isActive={securityState.is2FAEnabled}
                            activeText="Aktywna"
                            inactiveText="Wyłączona"
                            icon="shield-checkmark-outline"
                            onPress={() => alert("[TODO] Jeszcze nie zaimplementowane")}
                        />
                        <StatusRow
                            label="Klucz dostępu (Passkey)"
                            isActive={securityState.isPasskeyEnabled}
                            activeText="Skonfigurowano"
                            inactiveText="Nie skonfigurowano"
                            icon="key"
                            onPress={() => alert("[TODO] Jeszcze nie zaimplementowane")}
                        />
                        <ActionRow
                            label="Zmień hasło"
                            icon="lock-closed-outline"
                            onPress={() => alert("[TODO] Jeszcze nie zaimplementowane")}
                        />
                        <ActionRow
                            label="Usuwanie konta"
                            icon="warning-outline"
                            color="#007AFF"
                            onPress={() => alert("[TODO] Jeszcze nie zaimplementowane")}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Połączone konta</Text>
                    <View style={[styles.card, { backgroundColor: theme.surface }]}>
                        <StatusRow
                            label="Konto Google"
                            isActive={securityState.isGoogleConnected}
                            activeText="Połączono"
                            inactiveText="Nie połączono"
                            icon="logo-google"
                            onPress={() => alert("[TODO] Jeszcze nie zaimplementowane")}
                        />
                        <StatusRow
                            label="Konto Apple"
                            isActive={securityState.isAppleConnected}
                            activeText="Połączono"
                            inactiveText="Nie połączono"
                            icon="logo-apple"
                            onPress={() => alert("[TODO] Jeszcze nie zaimplementowane")}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Informacje i pomoc</Text>
                    <View style={[styles.card, { backgroundColor: theme.surface }]}>
                        <ActionRow
                            label="Regulamin StuMedica"
                            icon="document-text-outline"
                            color="#FF9500" // Pomarańczowy
                            onPress={() => router.push('/terms-of-service')}
                        />
                        <ActionRow
                        label="Kontakt z nami"
                        icon="mail-outline"
                        color="#007AFF"
                        onPress={() => alert("[TODO] Jeszcze nie zaimplementowane")}
                        />
                        <ActionRow
                            label="Informacje o aplikacji"
                            icon="information-circle-outline"
                            color="#007AFF"
                            onPress={() => router.push('/aboutMain')}
                        />
                    </View>
                </View>

                <View style={[styles.section, { marginTop: 20 }]}>
                    <GlassView
                        isInteractive
                        style={{
                            borderRadius: SIZES.radius,
                        }}
                    >
                        <TouchableOpacity
                            style={[styles.logoutButton, { borderColor: theme.error, backgroundColor: theme.background }]}
                            onPress={signOut}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="log-out-outline" size={20} color={theme.error} />
                            <Text style={[styles.logoutText, { color: theme.error }]}>Wyloguj się</Text>
                        </TouchableOpacity>
                    </GlassView>
                </View>
        </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        paddingVertical: 30,
        marginBottom: 10,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: 'bold',
        // color: transparent,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        marginBottom: 12,
    },
    badge: {
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 10,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    card: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    rowIconContainer: {
        marginRight: 16,
        width: 24,
        alignItems: 'center',
    },
    rowContent: {
        flex: 1,
    },
    rowLabel: {
        fontSize: 12,
        marginBottom: 2,
    },
    rowValue: {
        fontSize: 16,
        fontWeight: '500',
    },
    editButton: {
        padding: 8,
        borderRadius: 20,
        marginLeft: 8,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    titleText: {
        fontSize: 50,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
        color: 'rgb(118 231 162)'
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: '90%',
        marginBottom: 12,
    },
    statusLabelName: {
        fontSize: 15,
        fontWeight: '500',
        marginBottom: 4
    },
    statusBadgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '600',
    },
    chevronContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 12,
        gap: 4
    },
    manageText: {
        fontSize: 12,
        fontWeight: '600'
    },

    webBanner: {
        marginHorizontal: 20,
        marginBottom: 24,
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        // Lekki cień
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    webBannerTitle: {
        // color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    webBannerText: {
        // color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        lineHeight: 18,
    },
    webBannerButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 10,
    },
    webBannerButtonText: {
        fontWeight: 'bold',
        fontSize: 13,
    }
});