import React from 'react';
import { TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {COLORS, SIZES} from '@/styles/theme';
import {GlassView} from "expo-glass-effect";

export default function BackButton({ onPress } : any) {
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    return (
        <GlassView
            isInteractive
            style={
                styles.glassContainer
            }
        >
            <TouchableOpacity
                onPress={onPress}
                style={[styles.container, { backgroundColor: theme.surface }]}
                activeOpacity={0.7}
            >
                <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
        </GlassView>
);
}

const styles = StyleSheet.create({
    container: {
        // position: 'absolute',
        // top: 10,
        // left: 15,
        // zIndex: 10,

        // Wygląd przycisku
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',

        // Cień dla lepszej widoczności
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    glassContainer: {
        position: 'absolute',
        top: 10,
        left: 15,
        zIndex: 10,

        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',

        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        // elevation: 3,
    },
});