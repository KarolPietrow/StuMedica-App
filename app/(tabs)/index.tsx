// npx expo run:android --no-build-cache --device

import {Text, View, StyleSheet, Button, Alert} from "react-native";
import { useRouter } from 'expo-router';


export default function Index() {
    const router = useRouter();

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
        <Text style={styles.titleText}>✚ StuMedica</Text>
        <Text style={styles.baseText}>
            Witamy w StuMedica, gdzie pomożemy Ci dobrać lekarza idealnego dla Twoich potrzeb.
        </Text>
        <Text style={styles.baseText}>
            Razem zadbajmy o Twoje zdrowie. 💖
        </Text>
        <Button
            title={"Utwórz swoje konto klienta"}
            onPress={() => { router.push('/(tabs)/Register') }}
        />
        <Text style={styles.baseText}>
            Masz już u nas konto?
        </Text>
        <Button title={"Zaloguj się"} onPress={() => { router.push('/(tabs)/Login') }}/>

        {/*<div className="centerHeader">*/}
        {/*    /!*<img src={stockImg1} alt="Photo" className="stockImg"/>*!/*/}
        {/*    <text>Fajny obrazek żeby przestestować czy przewijanie działa jak trzeba</text>*/}
        {/*</div>*/}
        {/*<div className="centerHeader">*/}
        {/*    <text>Tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst*/}
        {/*        tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst*/}
        {/*        tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst tekst*/}
        {/*        tekst tekst tekst tekst tekst</text>*/}
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
});
