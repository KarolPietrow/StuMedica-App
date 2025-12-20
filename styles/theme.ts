import { StyleSheet } from "react-native";

const PRIMARY_COLOR = 'rgb(118, 231, 162)';
const PRIMARY_DARK = 'rgb(90, 200, 140)';

export const COLORS = {
    light: {
        primary: PRIMARY_COLOR,
        primaryDark: PRIMARY_DARK,
        background: '#F8F9FA',      // Jasne tło
        surface: '#FFFFFF',         // Karty
        text: '#1A1A1A',            // Prawie czarny
        textSecondary: '#757575',
        icon: '#1A1A1A',
        border: '#E1E1E1',
        error: '#FF3B30',
    },
    dark: {
        primary: PRIMARY_COLOR,     // Mint zostaje (dobrze wygląda na ciemnym)
        primaryDark: PRIMARY_DARK,
        background: '#121212',      // Prawie czarny (lepszy dla OLED niż #000)
        surface: '#1E1E1E',         // Ciemnoszare karty
        text: '#FFFFFF',            // Biały tekst
        textSecondary: '#A0A0A0',   // Jasnoszary
        icon: '#FFFFFF',
        border: '#333333',
        error: '#FF453A',
    }
};

export const SIZES = {
    padding: 24,
    radius: 16,
    h1: 32,
    h2: 24,
    body: 16,
};

export const GLOBAL_STYLES = StyleSheet.create({
    container: {
        flex: 1,
        // Tło ustawiamy dynamicznie w komponencie, nie tutaj
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 6,
    },
    // Styl dla głównego przycisku (niezależny od motywu, bo zawsze jest zielony)
    primaryButton: {
        height: 58,
        borderRadius: SIZES.radius,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: PRIMARY_COLOR,
        gap: 10,
    }
});