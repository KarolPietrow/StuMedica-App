import { fetchWithAuth } from './authService';

export interface Medication {
    id: number;
    name: string;
    dosage: string;
    note?: string;
    reminders: string[];
    is_active: boolean;
}

export const medicationService = {
    async getAll(token: string): Promise<Medication[]> {
        const response = await fetchWithAuth('/medications/');
        if (!response.ok) throw new Error('Nie udało się pobrać leków');

        return response.json();
    },

    async add(token: string, data: Omit<Medication, 'id' | 'is_active'>): Promise<Medication> {
        const response = await fetchWithAuth('/medications/', {
            method: 'POST',
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Błąd dodawania leku');
        }
        return response.json();
    },

    async update(id: number, data: Omit<Medication, 'id' | 'is_active'>): Promise<Medication> {
        const response = await fetchWithAuth(`/medications/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Błąd aktualizacji leku');
        }
        return response.json();
    },

    async delete(token: string, id: number): Promise<void> {
        const response = await fetchWithAuth(`/medications/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Błąd usuwania leku');
    }
};