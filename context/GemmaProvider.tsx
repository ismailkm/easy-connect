import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AppState, NativeEventEmitter, NativeModules } from 'react-native';

const { GemmaModule } = NativeModules;
const gemmaModuleEmitter = new NativeEventEmitter(GemmaModule);

interface GemmaContextType {
  isModelLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  generateResponse: (prompt: string) => Promise<string>;
  translateBatch: (lines: string[], sourceLang: TranslateLanguage, targetLang: TranslateLanguage) => Promise<string[]>;
  speak: (text: string, langCode: LanguageCode, utteranceId: string) => Promise<void>;
  recognizeText: (imageUri: string) => Promise<string[]>;
  stopSpeaking: () => Promise<void>;
  speakingUtteranceId: string | null;
  isSpeaking: boolean;
}

const GemmaContext = createContext<GemmaContextType | undefined>(undefined);

interface GemmaProviderProps {
  children: ReactNode;
}

export const GemmaProvider: React.FC<GemmaProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speakingUtteranceId, setSpeakingUtteranceId] = useState<string | null>(null);

  useEffect(() => {
    // This function will contain the model loading logic
    const initializeModel = async () => {
      // Prevent re-loading if it's already loaded or has failed
      if (isModelLoaded || error) {
        setIsLoading(false);
        return;
      }

      console.log('GemmaProvider: Starting model load...');
      setIsLoading(true);
      setError(null);

      try {
        if (!GemmaModule?.loadModel) {
          throw new Error('GemmaModule or loadModel function is not available.');
        }
        const status = await GemmaModule.loadModel();
        console.log('GemmaProvider: Model loaded successfully.', status);
        setIsModelLoaded(true);
      } catch (e: any) {
        console.error('GemmaProvider: Failed to load model.', e);
        setError(e.message || 'An unknown error occurred during model loading.');
      } finally {
        setIsLoading(false);
      }
    };

    // --- App State Handling ---
    // This is a robust way to handle loading, especially on Android.
    // We wait until the app is "active" before starting a heavy task.
    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        initializeModel();
      }
    });

    // Initial load attempt if the app is already active
    if (AppState.currentState === 'active') {
      initializeModel();
    }

    // Cleanup subscription on component unmount
    return () => {
      appStateSubscription.remove();
    };
  }, []); 

  // --- This useEffect sets up the listeners ---
  useEffect(() => {
    const onTtsFinish = (utteranceId: string) => {
      // console.log('TTS finished for:', utteranceId);
      setSpeakingUtteranceId(currentId => (currentId === utteranceId ? null : currentId));
    };
    const onTtsError = (utteranceId: string) => {
      // console.error('TTS error for:', utteranceId);
      setSpeakingUtteranceId(currentId => (currentId === utteranceId ? null : currentId));
    };

    // Subscribe to the native events
    const finishSubscription = gemmaModuleEmitter.addListener('tts-finish', onTtsFinish);
    const errorSubscription = gemmaModuleEmitter.addListener('tts-error', onTtsError);

    // Return a cleanup function to unsubscribe
    return () => {
      finishSubscription.remove();
      errorSubscription.remove();
    };
  }, []);

  const generateResponse = async (prompt: string): Promise<string> => {
    if (!isModelLoaded) {
      throw new Error('AI Model is not loaded yet. Please wait a moment and try again.');
    }
    if (!GemmaModule?.generateResponse) {
      throw new Error('The native generateResponse function is not available.');
    }
    
    console.log(`GemmaProvider: Sending prompt to native module...`);
    return await GemmaModule.generateResponse(prompt);
  };

  const translateBatch = async (
    lines: string[],
    sourceLang: TranslateLanguage,
    targetLang: TranslateLanguage
  ): Promise<string[]> => {
    if (!GemmaModule?.translateBatch) {
      throw new Error('The native translateBatch function is not available.');
    }
    console.log(`GemmaProvider: Translating batch of ${lines.length} lines to ${targetLang}...`);
    return await GemmaModule.translateBatch(lines, sourceLang, targetLang);
  };

  const speak = async (text: string, langCode: LanguageCode, utteranceId: string) => {
    try {
      // 1. First, stop any speech that is currently playing.
      // This ensures we don't have overlapping sounds.
      await GemmaModule.stopSpeaking();
      
      // 2. IMMEDIATELY set the state. This is the crucial change.
      // The UI will now re-render instantly and show the 'stop-circle' icon.
      setSpeakingUtteranceId(utteranceId);
      
      // 3. Then, tell the native module to start speaking with the new ID.
      await GemmaModule.speak(text, langCode, utteranceId);
    } catch (e) {
      console.error("Speak Error:", e);
      // If speaking fails, clear the state.
      setSpeakingUtteranceId(null);
    }
  };

  const stopSpeaking = async () => {
    try {
      await GemmaModule.stopSpeaking();
      // When we manually stop, we also must manually clear the state.
      setSpeakingUtteranceId(null);
    } catch (e) {
      console.error("Stop Speaking Error:", e);
      setSpeakingUtteranceId(null);
    }
  };

  const recognizeText = async (imageUri: string): Promise<string[]> => {
    if (!GemmaModule?.recognizeTextFromImage) {
      throw new Error('The native recognizeText function is not available.');
    }
    console.log(`GemmaProvider: Sending image to native OCR...`);
    return await GemmaModule.recognizeTextFromImage(imageUri);
  };

  const value = {
    isModelLoaded,
    isLoading,
    error,
    generateResponse,
    translateBatch,
    speak,
    recognizeText,
    stopSpeaking,
    isSpeaking: speakingUtteranceId !== null, // A simple boolean for the UI
    speakingUtteranceId, // The specific ID, for more complex UI
  };

  return <GemmaContext.Provider value={value}>{children}</GemmaContext.Provider>;
};

export const useGemma = (): GemmaContextType => {
  const context = useContext(GemmaContext);
  if (context === undefined) {
    throw new Error('useGemma must be used within a GemmaProvider');
  }
  return context;
};