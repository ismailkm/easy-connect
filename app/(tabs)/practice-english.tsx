import { Text, View } from '@/components/Themed';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SoundPlayer } from '@/components/ui/SoundPlayer';
import { Colors } from '@/constants/Colors';
import { useMlKit } from '@/context/MlKitProvider';
import { useVoice } from '@/context/VoiceProvider';
import { MessageInterface } from '@/types/MessageInterface';
import { isEnglish } from '@/utils/languageDeductor';
import { FontAwesome } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PracticeEnglishScreen() {
  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<MessageInterface[]>([
    { id: '1', text: 'Hello! How can I help you practice English today?', sender: 'ai', languageCode: 'en' },
  ]);
  const [inputText, setInputText] = useState('');
  const [inputHeight, setInputHeight] = useState(35);
  
  const [isTranslating, setIsTranslating] = useState(false);
  const { recognizeSpeech } = useVoice();
  const { translateBatch } = useMlKit();

  const handleSendMessage = async (text: string) => {
    const textToTranslate = text.trim();
    const isEnglishText = isEnglish(textToTranslate);
    let sourceLang:TranslateLanguage = 'en';
    let targetLang:TranslateLanguage = 'dari';
    let userLangCode: LanguageCode = 'en';
    let aiLangCode: LanguageCode = 'fa-ir';

    if (!isEnglishText) {
        sourceLang = 'dari';
        targetLang = 'en';
        userLangCode = 'fa-ir';
        aiLangCode = 'en';
    }

    if (!textToTranslate || isTranslating) return;

    // 1. Add the user's message to the chat
    const userMessage: MessageInterface = {
      id: String(Date.now()),
      text: textToTranslate,
      sender: 'user',
      languageCode: userLangCode
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setInputHeight(35);
    setIsTranslating(true);

    try {

      const resultArray = await translateBatch([textToTranslate], sourceLang, targetLang);
      
      let translatedText = "Translation failed.";
      if (resultArray && resultArray.length > 0) {
        translatedText = resultArray[0];
      }
      
      const translatedMessage: MessageInterface = {
        id: String(Date.now() + 1),
        text: translatedText,
        sender: 'ai',
        languageCode: aiLangCode
      };
      setMessages((prevMessages) => [...prevMessages, translatedMessage]);

    } catch (e: any) {
      const errorMessage: MessageInterface = {
        id: String(Date.now() + 1),
        text: "Sorry, an error occurred during translation.",
        sender: 'ai',
        languageCode: 'en'
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsTranslating(false);
    }
  };

    // --- Logic for Speech-to-Text ---
  const handleMicrophonePress = async () => {
    setIsTranslating(true);
    try {
      // 1. Call the native speech recognizer
      const transcribedDari = await recognizeSpeech('fa-IR');

      if (transcribedDari) {
        console.log({transcribedDari})
        // 2. If we get text, send it through the same translation logic
        await handleSendMessage(transcribedDari);
      }
    } catch (e: any) {
      // This error often means the user canceled, so we can ignore it or show a subtle message
      console.log("Speech recognition canceled or failed:", e.message);
    } finally {
      setIsTranslating(false);
    }
  };

  const renderMessage = ({ item }: { item: MessageInterface }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.aiMessage]}>
      {item.sender === 'user' ? (
        <>
          <SoundPlayer
            text={item.text}
            languageCode={item.languageCode}
            messageId={item.id}
          />
          <Text style={styles.messageTextUser}>{item.text}</Text>
        </>
      ) : (
        <>
          <Text style={styles.messageTextAI}>{item.text}</Text>
          <SoundPlayer
            text={item.text}
            languageCode={item.languageCode}
            messageId={item.id}
          />
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <View style={styles.innerContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { height: Math.max(35, inputHeight) }]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type English here..."
              placeholderTextColor={Colors.light.text + '80'}
              multiline
              onContentSizeChange={(event) => setInputHeight(event.nativeEvent.contentSize.height)}
            />
            {inputText.trim().length > 0 ? (
              <TouchableOpacity onPress={() => handleSendMessage(inputText)} style={styles.sendButton} disabled={isTranslating}>
                {isTranslating ? <ActivityIndicator/> : <IconSymbol name="arrow.up.circle.fill" color={Colors.light.tint} size={24} />}
              </TouchableOpacity>
              ) : (
              <TouchableOpacity onPress={handleMicrophonePress} style={styles.sendButton} disabled={isTranslating}>
                <FontAwesome name="microphone" size={20} color={Colors.light.tint} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 10,
  },
  innerContainer: { 
    flex: 1,
    justifyContent: 'space-between', 
    backgroundColor: Colors.light.background,
  },
  messagesList: {
    paddingVertical: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#ADD8E6',
    justifyContent: 'flex-end',
    paddingRight: 20,
    paddingLeft: 10,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    justifyContent: 'flex-start',
    paddingRight: 20,
    paddingLeft: 10,
  },
  messageTextUser: {
    color: '#000',
    marginLeft: 10,
  },
  messageTextAI: {
    color: '#000',
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.secondaryBackground,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    color: Colors.light.text,
    marginRight: 10,
    fontSize: 16,
    minHeight: 35,
    maxHeight: 120, 
    paddingTop: 8, 
    paddingBottom: 8,
  },
  sendButton: {
    padding: 5,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  speakerButton: {
    backgroundColor: 'transparent',
    padding: 5,
  },
});