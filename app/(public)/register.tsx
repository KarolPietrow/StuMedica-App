import {
    Button,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity,
    View,
    useColorScheme, ScrollView, ActivityIndicator, Keyboard, Platform, KeyboardAvoidingView
} from "react-native";
import { Checkbox } from 'expo-checkbox';
import React, { useState } from "react";

import {router, useRouter} from "expo-router";
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SIZES, GLOBAL_STYLES } from '@/styles/theme';
import BackButton from "@/components/BackButton";

import { SafeAreaView } from 'react-native-safe-area-context';
import { registerApi } from "@/services/authService";



export default function Register() {
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    type ErrorState = {
        name: string | null;
        email: string | null;
        password: string | null;
        repeatPassword: string | null;
        general: string | null;
    };

    const [error, setError] = useState<ErrorState>({
        name: null,
        email: null,
        password: null,
        repeatPassword: null,
        general: null
    });

    const [isChecked, setChecked] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isRepeatPasswordVisible, setIsRepeatPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleOnChange = (
        field: keyof ErrorState,
        value: string,
        setter: React.Dispatch<React.SetStateAction<string>>
    ) => {
        setter(value);

        if (error[field]) {
            setError((prev) => ({
                ...prev,
                [field]: null,
                general: null,
            }));
        }
    };

    const handleRegister = async () => {
        let newError = { name: '', email: '', password: '', repeatPassword: '', general: '' }
        Keyboard.dismiss();
        let isValid = true;

        const cleanName = name.trim().replace(/\s+/g, ' ');
        const cleanEmail = email.trim();

        if (!cleanName) {
            newError.name = "Podaj imię i nazwisko.";
            isValid = false;
        }
        if (!cleanEmail) {
            newError.email = 'Podaj adres email.';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
            newError.email = 'Podaj poprawny adres email.';
            isValid = false;
        }
        if (!password) {
            newError.password = 'Podaj hasło.';
            isValid = false;
        } else if (password.length < 8) {
            newError.password = "Hasło musi mieć minimum 8 znaków.";
            isValid = false;
        }
        if (!repeatPassword) {
            newError.repeatPassword = "Wpisz ponownie hasło.";
            isValid = false;
        } else if (password !== repeatPassword) {
            newError.repeatPassword = "Hasła nie są identyczne.";
            isValid = false;
        }
        if (!isChecked) {
            newError.general = "Musisz zaakceptować regulamin, aby kontynuować.";
            isValid = false;
        }
        setError(newError);
        if (!isValid) return;

        setIsLoading(true);

        try {
            await registerApi(cleanName, cleanEmail, password);
            alert("Konto utworzone pomyślnie, możesz się zalogować!")
            router.replace('/login');
        } catch (error: any) {
            if (error.response?.data?.detail) {
                newError.general = error.response.data.detail;
            } else if (error.message) {
                newError.general = error.message;
            } else {
                newError.general= "Wystąpił błąd rejestracji.";
            }
            setError(newError);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={[GLOBAL_STYLES.container, { backgroundColor: theme.background }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <BackButton onPress={() => router.replace('/')} />
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.headerContainer}>
                        <Text style={[styles.title]}>Rejestracja</Text>
                        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                            Utwórz swoje konto pacjenta StuMedica
                        </Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Imię i nazwisko</Text>
                            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: error.name ? theme.error : theme.border }]}>
                                <Ionicons name="person-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: theme.text }]}
                                    placeholder="Jan Nowak"
                                    placeholderTextColor={theme.textSecondary}
                                    value={name}
                                    onChangeText={(text) => handleOnChange('name', text, setName)}
                                    autoCapitalize="words"

                                    autoComplete="name"
                                    importantForAutofill='yes'
                                />
                            </View>
                            {error.name && <Text style={[styles.errorText, { color: theme.error }]}>{error.name}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Adres email</Text>
                            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: error.email ? theme.error : theme.border }]}>
                                <Ionicons name="mail-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: theme.surface,
                                            color: theme.text,
                                            borderColor: error.email ? theme.error : theme.border
                                        }
                                    ]}
                                    placeholder="imie.nazwisko@poczta.pl"
                                    placeholderTextColor={theme.textSecondary}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={(email) => handleOnChange('email', email.replace(/\s/g, ''), setEmail)}
                                    autoComplete="email"
                                    importantForAutofill='yes'
                                />
                            </View>
                            {error.email && <Text style={[styles.errorText, { color: theme.error }]}>{error.email}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Hasło</Text>
                            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: (error.password || error.repeatPassword) ? theme.error : theme.border }]}>
                                <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: theme.text }]}
                                    placeholder="Minimum 8 znaków"
                                    placeholderTextColor={theme.textSecondary}
                                    secureTextEntry={!isPasswordVisible}
                                    value={password}
                                    onChangeText={(text) => handleOnChange('password', text, setPassword)}

                                    autoComplete="password"
                                    importantForAutofill='yes'

                                />
                                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                    <Ionicons
                                        name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color={theme.textSecondary}
                                    />
                                </TouchableOpacity>
                            </View>
                            {error.password && <Text style={[styles.errorText, { color: theme.error }]}>{error.password}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: theme.text }]}>Powtórz hasło</Text>
                            <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: error.repeatPassword ? theme.error : theme.border }]}>
                                <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: theme.text }]}
                                    placeholder="Wpisz ponownie hasło"
                                    placeholderTextColor={theme.textSecondary}
                                    secureTextEntry={!isRepeatPasswordVisible}
                                    value={repeatPassword}
                                    onChangeText={(text) => handleOnChange('repeatPassword', text, setRepeatPassword)}

                                    autoComplete="password"
                                    importantForAutofill='yes'
                                />
                                <TouchableOpacity onPress={() => setIsRepeatPasswordVisible(!isRepeatPasswordVisible)}>
                                    <Ionicons
                                        name={isRepeatPasswordVisible ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color={theme.textSecondary}
                                    />
                                </TouchableOpacity>
                            </View>
                            {error.repeatPassword && <Text style={[styles.errorText, { color: theme.error }]}>{error.repeatPassword}</Text>}
                        </View>

                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => {
                                setChecked(!isChecked);
                                if (error.general) setError(prev => ({...prev, general: null}));
                            }}
                            activeOpacity={0.7}
                        >
                            <Checkbox
                                style={styles.checkbox}
                                value={isChecked}
                                onValueChange={ (val) => {
                                    setChecked(val);
                                    if (error.general) setError(prev => ({...prev, general: null}));
                                }}
                                color={isChecked ? COLORS.light.primary : theme.textSecondary}
                            />

                            <View style={styles.textWrapper}>
                                <Text style={[styles.checkboxText, { color: theme.textSecondary }]}>
                                    Akceptuję{' '}
                                    <Text
                                        onPress={(e) => {
                                            router.push('/terms-of-service');
                                        }}
                                        style={{ color: COLORS.light.primary, fontWeight: 'bold' }}
                                    >
                                        Regulamin StuMedica
                                    </Text>
                                </Text>
                            </View>
                        </TouchableOpacity>

                        {error.general && (
                            <View style={[styles.generalErrorContainer, { backgroundColor: 'rgba(255, 59, 48, 0.1)' }]}>
                                <Ionicons name="alert-circle" size={20} color={theme.error} />
                                <Text style={[styles.generalErrorText, { color: theme.error }]}>
                                    {error.general}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[
                                GLOBAL_STYLES.primaryButton,
                                GLOBAL_STYLES.shadow,
                                (isLoading || !isChecked) && styles.buttonDisabled
                            ]}
                            onPress={handleRegister}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#1A1A1A" />
                            ) : (
                                <Text style={styles.buttonText}>Zarejestruj się</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={{ color: theme.textSecondary }}>Masz już konto? </Text>
                        <TouchableOpacity onPress={() => router.push("/login")}>
                            <Text style={{ color: COLORS.light.primary, fontWeight: 'bold' }}>Zaloguj się</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
        padding: SIZES.padding,
        paddingBottom: 40,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'rgb(118 231 162)'
    },
    subtitle: {
        fontSize: 16,
    },
    formContainer: {
        gap: 16,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 10,
        paddingVertical: 12,
        paddingHorizontal: 4,
    },
    checkbox: {
        // marginTop: 2,              // Wyrównanie optyczne krateczki do pierwszej linii tekstu
        marginRight: 12,           // Odstęp krateczki od tekstu
        width: 24,                 // Możesz wymusić rozmiar, jeśli domyślny jest za mały
        height: 24,
    },
    textWrapper: {
        flex: 1,
    },
    checkboxText: {
        fontSize: 14,
        lineHeight: 22,
    },
    buttonDisabled: {
        opacity: 0.5,
        backgroundColor: '#CCC',
    },
    buttonText: {
        color: '#1A1A1A',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },

    errorText: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    generalErrorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        padding: 10,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 59, 48, 0.1)', // Delikatne czerwone tło
    },
    generalErrorText: {
        marginLeft: 6,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
});