// In src/context/MlKitProvider.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { NativeModules } from 'react-native';

const { MlKitModule } = NativeModules;

interface MlKitContextType {
  isMlKitReady: boolean;
  translateBatch: (lines: string[], sourceLang: string, targetLang: string) => Promise<string[]>;
  recognizeText: (imageUri: string) => Promise<string[]>;
}

const MlKitContext = createContext<MlKitContextType | undefined>(undefined);

export const MlKitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMlKitReady, setIsMlKitReady] = useState(false);

  useEffect(() => {
    const prepareModels = async () => {
      try {
        if (!MlKitModule?.prepareDariTranslator) {
          throw new Error("prepareDariTranslator function not found on native module.");
        }
        console.log("MlKitProvider: Proactively preparing translation models...");
        await MlKitModule.prepareDariTranslator();
        setIsMlKitReady(true);
        console.log("MlKitProvider: Translation models are ready.");
      } catch (e) {
        console.error("MlKitProvider: Failed to prepare ML Kit models.", e);
      }
    };
    prepareModels();
  }, []);

  const translateBatch = async (lines: string[], sourceLang: string, targetLang: string): Promise<string[]> => {
    return await MlKitModule.translateBatch(lines, sourceLang, targetLang);
  };

  const recognizeText = async (imageUri: string): Promise<string[]> => {
    return await MlKitModule.recognizeTextFromImage(imageUri);
  };


  const value = { translateBatch, recognizeText, isMlKitReady };

  return <MlKitContext.Provider value={value}>{children}</MlKitContext.Provider>;
};

export const useMlKit = () => useContext(MlKitContext)!;