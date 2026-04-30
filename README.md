# StuMedica - Personal Health & Medical Assistant app

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

**StuMedica** is a comprehensive, cross-platform medical application developed as a university project. It aims to simplify personal health management by offering features like a virtual medicine cabinet, medication reminders, appointment scheduling, and an intelligent AI assistant capable of handling user requests.

Built with **React Native (Expo)**, the application runs seamlessly across **Android, iOS, and the Web**. 

**Backend Repository:** https://github.com/KarolPietrow/StuMedica-Server

---

## Virtual Medicine Cabinet
Keep track of all your medications in one place. Users can easily add and manage their prescribed medicine. All data is securely synchronized and saved on the server.

## Notification support
The app features a built-in notification system that sends reminders to users about their scheduled medications.

## Doctor Appointments (simulated)
Ability to book doctor appointments:
*   Select the required medical specialty or type of visit.
*   Browse a calendar for available time slots.
*   Fill out details about the visit and select payment type.
*   Confirm and schedule the appointment.

## Intelligent AI Assistant
The app features an advanced, integrated conversational AI. Communicating with the Python backend, the assistant leverages the **Gemini API** powered by **RAG (Retrieval-Augmented Generation)** and **Function Calling**. 
*   **Informative:** Answers general questions about the application's usage.
*   **Context-Aware:** Can fetch and display the user's current medications and upcoming doctor appointments.
*   **Action-Oriented:** Users can ask the assistant to add a new medication to their cabinet or book a doctor's appointment on their behalf using natural language.
