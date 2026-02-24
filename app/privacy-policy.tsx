import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";
import { COLORS, GLOBAL_STYLES } from "@/styles/theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";
import BackButton from "@/components/BackButton";
import { router } from "expo-router";
import {SafeAreaView} from "react-native-safe-area-context";


export default function PrivacyPolicy() {
    const colorScheme = useColorScheme();
    const theme = COLORS[colorScheme ?? 'light'];

    return (
        <SafeAreaView
            style={[GLOBAL_STYLES.container, { backgroundColor: theme.background }]}
            edges={['right', 'left', 'top']
        }>
            <KeyboardAvoidingView
                style={{ flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <BackButton onPress={() => {
                    if (router.canGoBack()) {
                        router.back()
                    } else {
                        router.replace("/");
                    }
                }} />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.mainContainer}>
                        <View style={styles.contentContainer}>
                            <View style={GLOBAL_STYLES.center}>
                                <Text style={[styles.titleText]}>StuMedica</Text>
                                <Text style={[styles.heading, { color: theme.text }]}>
                                    Polityka Prywatności StuMedica
                                </Text>
                                <Text style={[styles.text, { color: theme.text }]}>
                                    Wersja 0.1.0
                                </Text>
                                <Text style={[styles.text, { color: theme.text }]}>
                                    Data wejścia w życie: 06.02.2026 r.
                                </Text>
                            </View>
                        </View>

                        <View style={styles.contentContainer}>
                            <Text style={[styles.section, { color: theme.text }]}>
                                1. POSTANOWIENIA OGÓLNE
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych użytkowników korzystających z aplikacji StuMedica w wersji mobilnej oraz webowej (dalej: “Aplikacja”).
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                Administratorem danych osobowych użytkowników jest firma StuMedica z siedzibą w Lublinie, adres e-mail do kontaktu: kontakt@stumedica.pl (dalej: “Administrator”).
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                Dbamy o bezpieczeństwo Twoich danych i szanujemy Twoje prawo do prywatności. Dane są przetwarzane zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych, dalej: “RODO”).
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                Użytkownikiem jest każda osoba fizyczna powyżej 18 roku życia korzystająca z usług świadczonych za pośrednictwem Aplikacji. Nie świadczymy usług dla osób poniżej 18 roku życia.
                            </Text>


                            <Text style={[styles.section, { color: theme.text }]}>
                                2. JAKIE DANE ZBIERAMY
                            </Text>
                            <Text style={[styles.subsection, { color: theme.text }]}>
                                2.1. Dane podawane dobrowolnie
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                Do korzystania z Aplikacji wymagane jest utworzenie konta. W celu założenia konta użytkownik może zostać poproszony o podanie:
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - Imienia i nazwiska
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - Adresu e-mail
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - Numeru telefonu
                            </Text>

                            <Text style={[styles.subsection, { color: theme.text }]}>
                                2.2. Dane zbierane automatycznie (Urządzenie i Analityka)
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                Podczas korzystania z Aplikacji, automatycznie zbierane są dane o urządzeniu i sposobie korzystania z usług, w tym:
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - Identyfikatory urządzenia (Device ID, Advertising ID: Google AdID, Apple IDFA).
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - Adres IP.
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - Model urządzenia, wersja systemu operacyjnego, rozdzielczość ekranu.
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - Dane o awariach (crash logs) i wydajności Aplikacji.
                            </Text>


                            <Text style={[styles.section, { color: theme.text }]}>
                                3. CELE I PODSTAWY PRAWNE PRZETWARZANIA
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                Twoje dane przetwarzamy w następujących celach:
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                1. Świadczenie usług drogą elektroniczną – umożliwienie korzystania z funkcji Aplikacji (Podstawa prawna: Art. 6 ust. 1 lit. b RODO – wykonanie umowy/regulaminu).
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                2. Analityka i statystyka – ulepszanie działania Aplikacji, analiza błędów (Podstawa prawna: Art. 6 ust. 1 lit. f RODO – prawnie uzasadniony interes Administratora).
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                3. Obsługa reklamacji i kontakt – udzielanie odpowiedzi na zgłoszenia (Podstawa prawna: Art. 6 ust. 1 lit. f RODO).
                            </Text>


                            <Text style={[styles.section, { color: theme.text }]}>
                                4. ODBIORCY DANYCH I USŁUGI ZEWNĘTRZNE
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                W celu zapewnienia prawidłowego działania Aplikacji, korzystamy z usług zweryfikowanych dostawców infrastruktury IT. Administrator zawarł z tymi podmiotami odpowiednie umowy powierzenia przetwarzania danych, które gwarantują bezpieczeństwo informacji użytkownika.
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                Twoje dane są przetwarzane i przechowywane głównie na serwerach zlokalizowanych w Europejskim Obszarze Gospodarczym (dalej: “EOG”).
                            </Text>
                            <Text style={[styles.subsection, { color: theme.text }]}>
                                Hosting infrastruktury (Serwery aplikacji):
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - Microsoft Azure (dostawca: Microsoft Ireland Operations Ltd.) – serwery zlokalizowane w Szwecji (EOG).
                            </Text>
                            <Text style={[styles.subsection, { color: theme.text }]}>
                                Baza danych (Przechowywanie danych):
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - Neon.tech (dostawca: Neon Inc.) – baza danych zlokalizowana w infrastrukturze chmurowej w Niemczech (EOG)..
                            </Text>
                            <Text style={[styles.subsection, { color: theme.text }]}>
                                Dostarczanie treści (CDN):
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - Cloudflare Pages (dostawca: Cloudflare, Inc.) – usługa służąca do szybkiego i bezpiecznego dostarczania interfejsu aplikacji oraz ochrony przed atakami sieciowymi. Cloudflare posiada rozproszoną sieć serwerów na całym świecie, co pozwala na szybkie ładowanie Aplikacji niezależnie od lokalizacji użytkownika.
                            </Text>
                            <Text style={[styles.subsection, { color: theme.text }]}>
                                INFORMACJA O TRANSFERZE DANYCH POZA EOG:
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                Mimo że główne serwery, na których przechowujemy dane (tzw. data at rest), znajdują się w Europie (Niemcy, Szwecja), nasi dostawcy technologii (Microsoft, Cloudflare, Neon) są powiązani z korporacjami z siedzibą w Stanach Zjednoczonych. W związku z tym, w celach technicznych lub utrzymaniowych, może dochodzić do transferu danych do państwa trzeciego (USA). Transfer ten jest zabezpieczony prawnie:
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - W przypadku Microsoft i Cloudflare – podmioty te uczestniczą w programie Data Privacy Framework (DPF), co oznacza, że Komisja Europejska uznała, iż zapewniają one odpowiedni poziom ochrony danych.
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - W pozostałych przypadkach transfer opiera się na Standardowych Klauzulach Umownych (SCC) zatwierdzonych przez Komisję Europejską.
                            </Text>


                            <Text style={[styles.section, { color: theme.text }]}>
                                5. UPRAWNIENIA APLIKACJI MOBILNEJ
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                Aplikacja może prosić o dostęp do następujących funkcji urządzenia:
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - Zgoda na wysyłanie powiadomień: W celu wysyłania powiadomień o wzięciu leku, oraz o nadchodzącej wizycie. Użytkownik może w każdej chwili wyłączyć powiadomienia w ustawieniach Aplikacji.
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - Zgoda na korzystanie z uwierzytelniania biometrią: W ustawieniach Aplikacji możliwe jest włączenie konieczności weryfikacji biometrią (odcisk palca, skan twarzy, Touch ID, Face ID, itp.) przy każdym uruchomieniu aplikacji, w celu zwiększenia bezpieczeństwa.
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                Użytkownik może w każdej chwili cofnąć te uprawnienia w ustawieniach urządzenia. Może to ograniczyć funkcjonalność Aplikacji.
                            </Text>


                            <Text style={[styles.section, { color: theme.text }]}>
                                6. CZAS PRZECHOWYWANIA DANYCH
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                Przechowujemy Twoje dane tylko tak długo, jak jest to konieczne:
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - Dane powiązane z kontem – przez okres posiadania konta w Aplikacji. Po usunięciu konta dane są usuwane lub anonimizowane (chyba że przepisy prawa nakazują ich dalsze przechowywanie).
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - Dane analityczne – zazwyczaj przez okres do 12 miesięcy lub do momentu wycofania zgody/wniesienia sprzeciwu.
                            </Text>


                            <Text style={[styles.section, { color: theme.text }]}>
                                7. PRAWA UŻYTKOWNIKA
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                Zgodnie z RODO przysługują Ci następujące prawa:
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - Prawo dostępu do swoich danych.
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - Prawo do sprostowania (poprawienia) danych.
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - Prawo do usunięcia danych (&#34;prawo do bycia zapomnianym&#34;).
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - Prawo do ograniczenia przetwarzania.
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - Prawo do przenoszenia danych.
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                - Prawo do cofnięcia zgody w dowolnym momencie (bez wpływu na zgodność z prawem przetwarzania przed jej cofnięciem).
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                Aby skorzystać z przysługujących Ci praw, skontaktuj się z Administratorem.
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                Masz również prawo wniesienia skargi do organu nadzorczego (w Polsce: Prezes Urzędu Ochrony Danych Osobowych, ul. Stawki 2, 00-193 Warszawa), jeśli uznasz, że przetwarzamy Twoje dane niezgodnie z prawem.
                            </Text>


                            <Text style={[styles.section, { color: theme.text }]}>
                                8. USUNIĘCIE KONTA
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                Użytkownik ma prawo w każdej chwili usunąć swoje konto i powiązane z nim dane. Można to zrobić bezpośrednio w Aplikacji, wybierając “Usuń konto” w zakładce Konto. Alternatywnie, możliwe jest wysłanie żądania usunięcia danych na adres e-mail Administratora.
                            </Text>


                            <Text style={[styles.section, { color: theme.text }]}>
                                9. ZMIANY POLITYKI PRYWATNOŚCI
                            </Text>
                            <Text style={[styles.text, { color: theme.text }]}>
                                Zastrzegamy sobie prawo do wprowadzania zmian w Polityce Prywatności (np. w związku z rozwojem Aplikacji lub zmianą przepisów). O istotnych zmianach poinformujemy Cię komunikatem w Aplikacji lub drogą mailową.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/*</KeyboardAvoidingView>*/}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        alignItems: 'center',
    },
    contentContainer: {
        padding: 25,
        justifyContent: 'space-evenly',
        maxWidth: 800
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
    section: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    text: {
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 12,
    },
    subsection: {
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 24,
        maxWidth: '90%',
        marginBottom: 12,
    }
});