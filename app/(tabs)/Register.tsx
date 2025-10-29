import {Button, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import { Checkbox } from 'expo-checkbox';
import {useState} from "react";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [isChecked, setChecked] = useState(false);

    return (
        <>
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
                    Rejestracja
                </Text>
                <Text style={styles.baseText}>
                    Utwórz swoje konto klienta
                </Text>
                <Text style={styles.baseText}>
                    Imię i nazwisko
                </Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="none"
                    keyboardType="default"
                    autoComplete="name"
                    placeholder="Jan Nowak"
                    importantForAutofill='yes'
                />
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
                <Text style={styles.baseText}>
                    Powtórz hasło
                </Text>
                <TextInput
                    style={styles.input}
                    value={repeatPassword}
                    onChangeText={setRepeatPassword}
                    secureTextEntry={true}
                    autoComplete="password"
                    placeholder="Hasło"
                    importantForAutofill='yes'
                />
                <View style={styles.section}>
                    <Checkbox
                        style={styles.checkbox}
                        value={isChecked}
                        onValueChange={setChecked}
                    />
                    <TouchableOpacity onPress={ () => { setChecked(!isChecked)} }>
                        <Text style={styles.baseText}>Akeptuję Regulamin korzystania z Usługi</Text>
                    </TouchableOpacity>
                </View>
                <Button title={"Zarejestruj się"} onPress={() => {  }}/>
            </View>
        </>
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
    section: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        margin: 8
    }
});