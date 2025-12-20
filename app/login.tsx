import {
    Text,
    View,
    StyleSheet,
    Button,
    Alert,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    StatusBar,
    useColorScheme, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform
} from "react-native";
import React, {useState} from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import loginApi from "@/services/authService";

import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, GLOBAL_STYLES } from '@/styles/theme';
import {router} from "expo-router";
import BackButton from "@/components/BackButton";

export default function Login() {
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    type ErrorState = {
        email: string | null;
        password: string | null;
        general: string | null;
    };

    const [error, setError] = useState<ErrorState>({
        email: null,
        password: null,
        general: null,
    });

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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

    const handleLogin = async () => {
        let newError = { email: '', password: '', general: '' }
        Keyboard.dismiss();
        let isValid = true;

        if (!email) {
            newError.email = 'Podaj adres email.';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newError.email = 'Podaj poprawny adres email.';
            isValid = false;
        }
        if (!password) {
            newError.password = 'Podaj hasło.';
            isValid = false;
        }

        setError(newError)
        if (!isValid) return;

        setIsLoading(true);

        try {
            const isSuccess = await loginApi(email.trim(), password);

            if (isSuccess) {
                router.replace('/dashboard');
            } else {
                setError({email: '', password: '', general: 'Nie udało się zalogować. Sprawdź poprawność danych i spróbuj ponownie.'})
            }
        } catch (err: any) {
            if (err.response && err.response.status_code === 401) {
                setError({email: '', password: '', general: 'Nie udało się zalogować. Sprawdź poprawność danych i spróbuj ponownie.'})
            } else {
                setError({
                    email: '',
                    password: '',
                    general: 'Nie udało się zalogować: ' + err.message || 'Wystąpił nieoczekiwany błąd.'
                })
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView
            style={[GLOBAL_STYLES.container, { backgroundColor: theme.background }]}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.inner}
            >
                <BackButton onPress={() => router.replace('/')} />
                <View style={styles.headerContainer}>
                    <View style={[styles.logoIcon, GLOBAL_STYLES.shadow]}>
                        <Ionicons name="person" size={40} color="#1A1A1A" />
                    </View>
                    <Text style={[styles.title]}>Witaj ponownie!</Text>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Zaloguj się do StuMedica
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: theme.text }]}>
                            Adres Email
                        </Text>
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
                            autoComplete="email"
                            autoCapitalize="none"
                            importantForAutofill='yes'
                            value={email}
                            onChangeText={(text) => handleOnChange('email', text, setEmail)}
                        />
                        {error.email && (
                            <Text style={[styles.errorText, { color: theme.error }]}>{error.email}</Text>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: theme.text }]}>
                            Hasło
                        </Text>
                        <View style={[
                            styles.passwordContainer,
                            {
                                backgroundColor: theme.surface,
                                borderColor: error.password ? theme.error : theme.border                            }
                        ]}>
                            <TextInput
                                style={[styles.passwordInput, { color: theme.text }]}
                                placeholder="Hasło"
                                placeholderTextColor={theme.textSecondary}
                                secureTextEntry={!isPasswordVisible}
                                autoCorrect={false}
                                autoCapitalize="none"
                                importantForAutofill='yes'
                                value={password}
                                onChangeText={(text) => handleOnChange('password', text, setPassword)}
                            />
                            <TouchableOpacity
                                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                                    size={24}
                                    color={theme.textSecondary}
                                />
                            </TouchableOpacity>
                        </View>
                        {error.password && (
                            <Text style={[styles.errorText, { color: theme.error }]}>{error.password}</Text>
                        )}
                    </View>
                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={{ color: theme.primary, fontWeight: '600' }}>
                            Nie pamiętam hasła
                        </Text>
                    </TouchableOpacity>
                </View>

                {error.general && (
                    <View style={styles.generalErrorContainer}>
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
                        isLoading && styles.buttonDisabled
                    ]}
                    onPress={ handleLogin }
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#1A1A1A" />
                    ) : (
                        <Text style={styles.loginButtonText}>Zaloguj się</Text>
                    )}
                </TouchableOpacity>

                <View style={[styles.footer, { gap: 10 }]}>
                    <Text style={{ color: theme.textSecondary }}>Nie masz jeszcze konta?</Text>
                    <TouchableOpacity onPress={() => { router.push('/register') }}>
                        <Text style={styles.secondaryButtonText}>
                            Utwórz konto pacjenta
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    inner: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: SIZES.padding,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    logoIcon: {
        width: 80,
        height: 80,
        backgroundColor: COLORS.light.primary,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 35,
        fontWeight: '700',
        marginBottom: 8,
        color: 'rgb(118 231 162)'
    },
    subtitle: {
        fontSize: 18,
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        height: 56,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 56,
        borderRadius: 12,
        borderWidth: 1,
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 16,
        fontSize: 16,
    },
    eyeIcon: {
        padding: 10,
        marginRight: 6,
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: '#1A1A1A', // Ciemny tekst na zielonym tle
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButtonText: {
        fontSize: 17,
        fontWeight: '600',
        color: COLORS.dark.primaryDark
    },
    footer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,

    },
});

