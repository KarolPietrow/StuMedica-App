import {ScrollView, StyleSheet, Text, useColorScheme, View} from "react-native";
import { COLORS, GLOBAL_STYLES, SIZES } from "@/styles/theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";


export default function Medicine() {
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    return (
        <ScrollView style={[GLOBAL_STYLES.container, { backgroundColor: theme.background }]}>
            <View style={[styles.contentContainer, {marginTop: 50}]}>
                <View style={styles.contentContainer}>
                    <Text style={[styles.heading, { color: theme.text }]}>
                        Lista leków
                    </Text>

                    <Text style={[styles.description, { color: theme.text }]}>
                        Tutaj możesz zapisywać
                    </Text>

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