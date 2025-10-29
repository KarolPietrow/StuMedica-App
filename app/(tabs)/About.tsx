import {StyleSheet, Text, View} from "react-native";

export default function About() {
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
                <Text style={styles.logo}>✚</Text>
                <Text style={styles.titleText}>StuMedica</Text>

                <Text style={styles.baseText}>
                    System rejestracji medycznej dla pacjentów
                </Text>
                <Text style={styles.baseText}>
                    React Native + Expo
                </Text>
                <Text style={styles.baseText}>
                    💖
                </Text>
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
    logo: {
        fontSize: 150,
        fontWeight: 'bold',
        color: 'rgb(118 231 162)'
    }
});