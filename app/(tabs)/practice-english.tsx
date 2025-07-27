import { Text, View } from '@/components/Themed';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { MessageInterface } from '@/types/MessageInterface';
import React, { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PracticeEnglishScreen() {
  const flatListRef = useRef<FlatList>(null);
  const [messages, setMessages] = useState<MessageInterface[]>([

    { id: '1', text: 'Hello! How can I help you practice English today?', sender: 'ai' },
  ]);
  const [inputText, setInputText] = useState('');
  const [inputHeight, setInputHeight] = useState(35);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: MessageInterface = {
        id: String(messages.length + 1),
        text: inputText.trim(),
        sender: 'user',
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      setInputHeight(35); // Reset input height
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: MessageInterface = {
          id: String(messages.length + 2),
          text: `AI: You said: "${inputText.trim()}"`, // Placeholder AI response
          sender: 'ai',
        };
        setMessages((prevMessages) => [...prevMessages, aiResponse]);
      }, 1000);
    }
  };

  const renderMessage = ({ item }: { item: MessageInterface }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.aiMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
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
              placeholder="Type your message..."
              placeholderTextColor={Colors.light.text + '80'}
              multiline
              onContentSizeChange={(event) => setInputHeight(event.nativeEvent.contentSize.height)}
            />
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
              <IconSymbol name="arrow.up.circle.fill" size={24} color={Colors.light.tint} />
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
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.light.tint,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.secondaryBackground,
  },
  messageText: {
    color: Colors.light.text,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.secondaryBackground,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginBottom:10
  },
  input: {
    flex: 1,
    color: Colors.light.text,
    marginRight: 10,
    fontSize: 16,
    minHeight: 35,
    maxHeight: 120, // Limit the maximum height of the input field
    paddingTop: 8, // Adjust padding to prevent text from being cut off
    paddingBottom: 8,
  },
  sendButton: {
    padding: 5,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
});