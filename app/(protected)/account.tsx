import {ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View} from "react-native";
import { COLORS, GLOBAL_STYLES, SIZES } from "@/styles/theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, {useState} from "react";
import { useSession } from "@/context/AuthContext";


export default function Account() {
    const { signOut } = useSession();

    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    return (
        <ScrollView style={[GLOBAL_STYLES.container, { backgroundColor: theme.background }]}>
            <View style={styles.contentContainer}>
                <View style={[styles.contentContainer, {marginTop: 50, alignItems: 'center'}]}>
                    <Text style={[styles.heading, { color: theme.text }]}>
                        Twoje Konto
                    </Text>

                    <TouchableOpacity onPress={ signOut }>
                        <Text style={{ color: theme.primary, fontWeight: 'bold', fontSize:20, marginTop: 20 }}>Wyloguj się</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
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