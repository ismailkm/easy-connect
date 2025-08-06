// In src/context/VoiceProvider.tsx
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';

const { VoiceModule } = NativeModules; 
const voiceModuleEmitter = new NativeEventEmitter(VoiceModule);

interface VoiceContextType {
  isSpeaking: boolean;
  speakingUtteranceId: string | null;
  speak: (text: string, langCode: string, utteranceId: string) => Promise<void>;
  stopSpeaking: () => Promise<void>;
  recognizeSpeech: (langCode: string) => Promise<string>;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [speakingUtteranceId, setSpeakingUtteranceId] = useState<string | null>(null);

  useEffect(() => {
    const onTtsFinish = (utteranceId: string) => {
      setSpeakingUtteranceId(currentId => (currentId === utteranceId ? null : currentId));
    };
    const onTtsError = (utteranceId: string) => {
      setSpeakingUtteranceId(currentId => (currentId === utteranceId ? null : currentId));
    };

    const finishSub = voiceModuleEmitter.addListener('tts-finish', onTtsFinish);
    const errorSub = voiceModuleEmitter.addListener('tts-error', onTtsError);
    return () => {
      finishSub.remove();
      errorSub.remove();
    };
  }, []);

  const speak = async (text: string, langCode: string, utteranceId: string) => {
    await VoiceModule.stopSpeaking();
    setSpeakingUtteranceId(utteranceId);
    await VoiceModule.speak(text, langCode, utteranceId);
  };

  const stopSpeaking = async () => {
    await VoiceModule.stopSpeaking();
    setSpeakingUtteranceId(null);
  };

  const recognizeSpeech = async (langCode: string): Promise<string> => {
    try {
      return await VoiceModule.recognizeSpeech(langCode);
    } catch (e) {
      console.log("Speech recognition canceled or failed.");
      return "";
    }
  };

  const value = { isSpeaking: speakingUtteranceId !== null, speakingUtteranceId, speak, stopSpeaking, recognizeSpeech };

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
};

export const useVoice = () => useContext(VoiceContext)!;