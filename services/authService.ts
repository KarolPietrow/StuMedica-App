const API_BASE = "https://api.stumedica.pl";


export default async function loginApi(email: string, password: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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

    const data = await res.json();
    return data.success === true;
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