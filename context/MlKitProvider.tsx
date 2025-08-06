// In src/context/MlKitProvider.tsx
import React, { createContext, ReactNode, useContext } from 'react';
import { NativeModules } from 'react-native';

const { MlKitModule } = NativeModules;

interface MlKitContextType {
  translateBatch: (lines: string[], sourceLang: string, targetLang: string) => Promise<string[]>;
  recognizeText: (imageUri: string) => Promise<string[]>;
}

const MlKitContext = createContext<MlKitContextType | undefined>(undefined);

export const MlKitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const translateBatch = async (lines: string[], sourceLang: string, targetLang: string): Promise<string[]> => {
    return await MlKitModule.translateBatch(lines, sourceLang, targetLang);
  };

  const recognizeText = async (imageUri: string): Promise<string[]> => {
    return await MlKitModule.recognizeTextFromImage(imageUri);
  };

  const value = { translateBatch, recognizeText };

  return <MlKitContext.Provider value={value}>{children}</MlKitContext.Provider>;
};

export const useMlKit = () => useContext(MlKitContext)!;