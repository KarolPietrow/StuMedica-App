import { fetchWithAuth } from './authService';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
}

export const chatService = {
    async sendMessage(allMessages: Message[], newMessageText: string, localMode: boolean = false): Promise<string> {

        const history = allMessages.map(msg => ({
            role: msg.sender === 'ai' ? 'model' : 'user',
            content: msg.text
        }));

        history.push({
            role: 'user',
            content: newMessageText
        });

        const response = await fetchWithAuth('/chat/ask', {
            method: 'POST',
            body: JSON.stringify({
                history: history,
                local_mode: localMode,
                use_functions: true
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Błąd połączenia z asystentem');
        }

        const data = await response.json();
        return data.response;
    }
};