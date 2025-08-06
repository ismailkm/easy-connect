
# Easy Connect

[![Gemma 3n Impact Challenge](https://img.shields.io/badge/Google-Gemma_3n_Impact_Challenge-blue.svg)](https://www.kaggle.com/competitions/gemma-3n-impact-challenge)

An offline-first mobile companion that uses on-device Gemma as an AI curriculum designer to create personalized English learning paths for new immigrants.

---

## Core Capabilities

Easy Connect is built on two powerful, complementary pillars: a personalized learning companion and an instant translation utility.

### 🧠 The AI Learning Companion (Powered by Gemma)

This is the heart of the app, using Gemma for tasks that require creativity and reasoning.
*   **AI Curriculum Designer**: The user describes their learning goals, and an on-device Gemma-powered agent generates a personalized, multi-stage roadmap of practical, real-world lesson titles.
*   **Just-in-Time Content**: To keep the app fast, a second agent uses Gemma to generate detailed lesson content (vocabulary, quizzes) on-demand, only when a lesson is opened for the first time.
*   **Trusted Q&A (RAG)**: A Retrieval-Augmented Generation system uses Gemma to provide safe, conversational answers about UK life based on a curated, offline `knowledgebase.json`.

### 🛠️ The Instant Translation Utility (Powered by ML Kit & Native Services)

This suite of tools solves immediate, real-world problems with a "best tool for the job" approach.
*   **Visual Translator**: Uses on-device ML Kit Vision (OCR) to read text from any sign or document, and ML Kit Translate for high-quality, line-by-line translation. Gemma is then used to provide a high-level summary.
*   **Bilingual Chat**: A chat interface uses ML Kit to provide fast, two-way translation between English and Dari.
*   **Speech-to-Text & Text-to-Speech**: The native Android `SpeechRecognizer` provides voice input, and the `TextToSpeech` engine provides audio playback for all translated content, making the app highly accessible.

## Key Technical Decisions & Architecture

*   **On-Device First**: All AI/ML processing happens 100% offline. No data ever leaves the user's phone.
*   **Hybrid AI Strategy**: I chose a hybrid approach, using Gemma for its generative strengths and Google's ML Kit for its specialized accuracy in translation and OCR, ensuring the highest quality experience for each feature.
*   **Custom Native Bridge**: All models are managed through a custom, multi-module native bridge built from scratch in Kotlin (`GemmaModule`, `MlKitModule`, `VoiceModule`) to ensure high performance and a clean architecture.
*   **On-Demand Memory Management**: The large Gemma model is loaded into RAM **only** when a feature requires it and is unloaded when the user navigates away. This is managed by a centralized, route-aware component, keeping the app's memory footprint low and preventing crashes.
*   **Offline Model Handling**: The Gemma model is fully bundled. For this MVP, the ML Kit and Speech Recognition models use a "first-use download" strategy, requiring a one-time internet connection, after which the entire application is **100% functional offline**.

## Tech Stack

*   **Framework**: React Native (Expo) with TypeScript
*   **Navigation**: Expo Router (File-based)
*   **AI Engine (Generative)**: Google Gemma 3n (`gemma3-1B-it-int4.task`) via MediaPipe
*   **AI Engine (Utility)**: Google ML Kit (Translate, Vision)
*   **Native Platform Services**: Android `TextToSpeech` & `SpeechRecognizer`
*   **State Management**: React Context API (Providers for Gemma, ML Kit, and Voice)
*   **Data Storage**: AsyncStorage

## Getting Started

### Prerequisites

-   Node.js (LTS version) & Yarn/npm
-   Android Studio & a configured Android Emulator or a physical device with USB debugging enabled.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ismailkm/easy-connect.git
    cd easy-connect
    ```
    *Note: You will need to install Git LFS to pull the large AI model file.*

2.  **Install dependencies:**
    ```bash
    yarn install
    # or npm install
    ```

### Running the Application

1.  **Start the development server:**
    ```bash
    npx expo start
    ```

2.  **Run on your device/emulator (requires a full rebuild):**
    ```bash
    npx expo run:android
    ```