import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AppState, NativeModules } from 'react-native';

const { GemmaModule } = NativeModules;

// 1. Define the "shape" of the context data
interface GemmaContextType {
  isModelLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  generateResponse: (prompt: string) => Promise<string>;
}

// 2. Create the context with a default value
const GemmaContext = createContext<GemmaContextType | undefined>(undefined);

// 3. Create the Provider component
interface GemmaProviderProps {
  children: ReactNode;
}

export const GemmaProvider: React.FC<GemmaProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  }, []); // Empty dependency array ensures this runs only once

  // --- Functions to be exposed to the rest of the app ---

  const generateResponse = async (prompt: string): Promise<string> => {
    // This is our central safety check
    if (!isModelLoaded) {
      throw new Error('AI Model is not loaded yet. Please wait a moment and try again.');
    }
    if (!GemmaModule?.generateResponse) {
      throw new Error('The native generateResponse function is not available.');
    }
    
    console.log(`GemmaProvider: Sending prompt to native module...`);
    return await GemmaModule.generateResponse(prompt);
  };

  // The value that will be provided to all children components
  const value = {
    isModelLoaded,
    isLoading,
    error,
    generateResponse,
  };

  return <GemmaContext.Provider value={value}>{children}</GemmaContext.Provider>;
};

// 4. Create the custom hook for easy consumption
export const useGemma = (): GemmaContextType => {
  const context = useContext(GemmaContext);
  if (context === undefined) {
    throw new Error('useGemma must be used within a GemmaProvider');
  }
  return context;
};