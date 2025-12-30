import * as SecureStore from 'expo-secure-store';
import { Platform } from "react-native";

const API_BASE = "https://api.stumedica.pl";
// const API_BASE = "http://localhost:4000";

const TOKEN_KEY = 'user_jwt_token';

export async function saveToken(token: string) {
    if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
}

export async function getToken() {
    if (Platform.OS !== 'web') {
        return await SecureStore.getItemAsync(TOKEN_KEY);
    }
    return null;
}

export async function removeToken() {
    if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
}

export default async function loginApi(email: string, password: string) {
    const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
    });

    if (!res.ok) {
        let errText = await res.text().catch(() => "");
        try {
            const errJson = JSON.parse(errText || "{}");
            throw new Error(errJson.detail || errJson.message || `HTTP ${res.status}`);
        } catch (e: any) {
            if (e.message) throw e;
            throw new Error(errText || `HTTP ${res.status}`);
        }
    }

    return await res.json();
}

export async function validateSession() {
    try {
        const res = await fetchWithAuth('/auth/me');

        if (res.ok) {
            return await res.json();
        }
        return null;
    } catch (e) {
        return null;
    }
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (Platform.OS !== 'web') {
        const token = await getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
        // LOGIKA WEB: Wyślij ciasteczka
        credentials: 'include',
    });

    if (res.status === 401) {
        await removeToken();
        // Tutaj opcjonalnie można rzucić specyficzny błąd, który AuthContext wyłapie
        // aby przekierować na ekran logowania
        throw new Error("Unauthorized");
    }
    return res;
}

export async function logoutApi() {
    try {
        await fetch(`${API_BASE}/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        });
    } catch (e) {
        console.warn("Błąd podczas wylogowywania z serwera (możliwy brak sieci)", e);
    } finally {
        await removeToken();
    }
}

export async function registerApi(name: string, email: string, password: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name,
            email,
            password,
            account_type: 'patient'
        }),
    });

    if (!res.ok) {
        let errText = await res.text().catch(() => "");
        try {
            const errJson = JSON.parse(errText || "{}");
            throw new Error(errJson.detail || errJson.message || `Błąd rejestracji (HTTP ${res.status})`);
        } catch (e: any) {
            if (e.message) throw e;
            throw new Error(errText || `Błąd HTTP ${res.status}`);
        }
    }

    const data = await res.json();
    return data.success === true;
}