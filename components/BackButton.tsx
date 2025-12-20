import React from 'react';
import { TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/styles/theme';

export default function BackButton({ onPress } : any) {
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    return (
        <TouchableOpacity
            onPress={onPress}
    style={[styles.container, { backgroundColor: theme.surface }]}
    activeOpacity={0.7}
    >
    <Ionicons name="arrow-back" size={24} color={theme.text} />
    </TouchableOpacity>
);
}

const styles = StyleSheet.create({
    container: {
        // Pozycjonowanie absolutne sprawia, że przycisk "unosi się" nad resztą
        position: 'absolute',
        top: 10,  // Odstęp od góry (pod SafeAreaView)
        left: 15, // Odstęp od lewej (taki sam jak padding ekranu SIZES.padding)
        zIndex: 10, // Zapewnia, że przycisk jest zawsze na wierzchu

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
});