import {ScrollView, StyleSheet, Text, useColorScheme, View} from "react-native";
import { COLORS, GLOBAL_STYLES, SIZES } from "@/styles/theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, {useEffect, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {fetchWithAuth} from "@/services/authService";


export default function Dashboard() {
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const res = await fetchWithAuth('/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUserData(data);
                }
            } catch (e) {
                console.error("Błąd pobierania profilu", e);
            }
        };
        getUserData();
    }, []);

    return (
        // <SafeAreaView >
            <ScrollView style={[GLOBAL_STYLES.container, { backgroundColor: theme.background}]}>
                <View style={[styles.contentContainer, {marginTop: 50}]}>
                    <View style={[styles.contentContainer, {alignItems: 'center'}]}>
                        {userData && <Text style={[styles.heading, { color: theme.text }]}>
                            Witaj, {userData.name}!
                        </Text>}
                        <Text style={[styles.description, { color: theme.text}]}>
                            Zaplanowane wizyty:
                        </Text>
                        <Text style={[styles.description, { color: theme.text}]}>

                        </Text>

                        <Text style={[styles.description, { color: theme.text}]}>
                            Historia wizyt
                        </Text>
                    </View>
                </View>
            </ScrollView>
        // </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 25,
        justifyContent: 'space-evenly'
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.light.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
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
});