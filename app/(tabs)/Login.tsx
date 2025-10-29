import {Text, View, StyleSheet, Button, Alert, TextInput} from "react-native";
import {useState} from "react";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    function validate() {
        if (!email.trim() || !password) {
            Alert.alert('Walidacja', 'Podaj poprawny email i hasło.');
            return false;
        }
        // prosty email check
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            Alert.alert('Walidacja', 'Podaj poprawny adres email.');
            return false;
        }
        return true;
    }

    async function handleLogin() {
        if (!validate()) return;
        setLoading(true);
        try {
            // const res = await loginApi(email.trim(), password);
            // // oczekujemy odpowiedzi np. { access_token: "...", token_type: "bearer" } lub { token: "..." }
            // const token = res?.access_token ?? res?.token ?? null;
            // if (!token) throw new Error('Brak tokena w odpowiedzi serwera');
            //
            // await saveToken(token);
            // // nawiguj i zastąp historię (replace) żeby użytkownik nie wrócił do /login
            // router.replace(redirectTo);
        } catch (err: any) {
            Alert.alert('Błąd logowania', err.message ?? String(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                padding: 20
            }}
        >
            <Text style={styles.titleText}>
                Zaloguj się
            </Text>
            <Text style={styles.baseText}>
                Podaj dane logowania
            </Text>
            <Text style={styles.baseText}>
                Adres e-mail
            </Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                placeholder="email@example.com"
                importantForAutofill='yes'
            />
            <Text style={styles.baseText}>
                Hasło
            </Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
                autoComplete="password"
                placeholder="Hasło"
                importantForAutofill='yes'
            />
            <Button title={"Zaloguj się"} onPress={() => { handleLogin() }}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    baseText: {
        fontSize: 20,
    },
    titleText: {
        fontSize: 50,
        fontWeight: 'bold',
        color: 'rgb(118 231 162)'
    },
    input: {
        height: 48,
        width: 250,
        // backgroundColor: '#0f0f0f',
        color: '#0f0f0f',
        borderRadius: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#0f0f0f' },
});

