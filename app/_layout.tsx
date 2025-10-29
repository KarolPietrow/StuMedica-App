import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from "expo-router";
import {StatusBar} from "expo-status-bar";

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="dark" />
    </ThemeProvider>
)
}
