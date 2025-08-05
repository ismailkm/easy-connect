// In src/context/GemmaProvider.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { NativeModules } from 'react-native';

const { GemmaModule } = NativeModules;

interface GemmaContextType {
  isModelLoaded: boolean;
  isLoadingModel: boolean;
  loadModel: () => Promise<void>;
  unloadModel: () => Promise<void>;
  generateResponse: (prompt: string) => Promise<string>;
}

const GemmaContext = createContext<GemmaContextType | undefined>(undefined);

export const GemmaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  const loadModel = async () => {
    if (isModelLoaded) return;
    setIsLoadingModel(true);
    try {
      await GemmaModule.loadModel();
      setIsModelLoaded(true);
    } catch (e) { console.error("Failed to load Gemma model", e); }
    finally { setIsLoadingModel(false); }
  };

  const unloadModel = async () => {
    if (!isModelLoaded) return;
    try {
      await GemmaModule.unloadModel();
      setIsModelLoaded(false);
    } catch (e) { console.error("Failed to unload Gemma model", e); }
  };

  const generateResponse = async (prompt: string): Promise<string> => {
    if (!isModelLoaded) throw new Error('Gemma model is not loaded.');
    return await GemmaModule.generateResponse(prompt);
  };

  const value = { isModelLoaded, isLoadingModel, loadModel, unloadModel, generateResponse };

  return <GemmaContext.Provider value={value}>{children}</GemmaContext.Provider>;
};

export const useGemma = () => useContext(GemmaContext)!;