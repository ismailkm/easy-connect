import { Text, View } from '@/components/Themed';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SoundPlayer } from '@/components/ui/SoundPlayer';
import { Colors } from '@/constants/Colors';
import { useGemma } from '@/context/GemmaProvider';
import { MessageInterface } from '@/types/MessageInterface';
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
  const { translateBatch } = useGemma();
  const [isTranslating, setIsTranslating] = useState(false);
  
  const handleSendMessage = async () => {
    const textToTranslate = inputText.trim();
    if (!textToTranslate || isTranslating) return;

    // 1. Add the user's message to the chat
    const userMessage: MessageInterface = {
      id: String(Date.now()),
      text: textToTranslate,
      sender: 'user',
      languageCode: 'en'
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setInputHeight(35);
    setIsTranslating(true);
    try {
      const resultArray = await translateBatch([textToTranslate], 'dari');
      
      let translatedText = "Translation failed.";
      if (resultArray && resultArray.length > 0) {
        translatedText = resultArray[0];
      }
      
      const translatedMessage: MessageInterface = {
        id: String(Date.now() + 1),
        text: translatedText,
        sender: 'ai',
        languageCode: 'fa-ir'
      };
      setMessages((prevMessages) => [...prevMessages, translatedMessage]);

    } catch (e: any) {
      const errorMessage: MessageInterface = {
        id: String(Date.now() + 1),
        text: "Sorry, an error occurred during translation.",
        sender: 'ai',
        languageCode: 'fa-ir'
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
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
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
              {isTranslating ? <ActivityIndicator/> : <IconSymbol name="arrow.up.circle.fill" color={Colors.light.tint} size={24} />}
            </TouchableOpacity>
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
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#ADD8E6',
    justifyContent: 'flex-end',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    justifyContent: 'flex-start',
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