import { fetchWithAuth } from './authService';

export const chatService = {
    /**
     * Wysyła wiadomość do asystenta AI i zwraca jego odpowiedź.
     * @param message Treść wiadomości użytkownika
     */
    async sendMessage(message: string): Promise<string> {
        const response = await fetchWithAuth('/chat/ask', {
            method: 'POST',
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Błąd połączenia z asystentem');
        }

        const data = await response.json();
        return data.response;
    }
};