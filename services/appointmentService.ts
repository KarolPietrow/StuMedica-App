import { fetchWithAuth } from './authService';

export interface Doctor {
    id: number;
    name: string;
    specialization: string;
    price_private: number;
}

export interface AppointmentSlot {
    id: number;
    date_time: string;
    doctor: Doctor;
    is_booked: boolean;
    type: string;
}

export const appointmentService = {
    async getAvailableSlots(specialization?: string): Promise<AppointmentSlot[]> {
        let url = '/appointments/slots';
        if (specialization) {
            url += `?specialization=${encodeURIComponent(specialization)}`;
        }

        const response = await fetchWithAuth(url);
        if (!response.ok) throw new Error('Nie udało się pobrać terminów');
        return response.json();
    },

    async bookAppointment(id: number, notes?: string): Promise<AppointmentSlot> {
        const response = await fetchWithAuth(`/appointments/${id}/book`, {
            method: 'POST',
            body: JSON.stringify({ notes })
        });

        if (!response.ok) throw new Error('Błąd rezerwacji wizyty');
        return response.json();
    },

    async getMyAppointments(): Promise<AppointmentSlot[]> {
        const response = await fetchWithAuth('/appointments/my-history');
        if (!response.ok) throw new Error('Nie udało się pobrać historii');
        return response.json();
    }
};