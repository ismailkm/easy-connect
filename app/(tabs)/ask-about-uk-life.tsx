import { QnaAgent } from '@/agents/QnaAgent';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { Text, View } from '@/components/Themed';
import FormButton from '@/components/ui/FormButton';
import { SoundPlayer } from '@/components/ui/SoundPlayer';
import { Colors } from '@/constants/Colors';
import { useGemma } from '@/context/GemmaProvider';
import { TextSegment } from '@/types/KnowledgebaseInterface';
import { KnowledgebaseHelper } from '@/utils/KnowledgebaseHelper';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TextInput } from 'react-native';

export default function PracticeEnglishScreen() {
  const { generateResponse } = useGemma();
  const playId = String(Date.now());
  
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [answerSegments, setAnswerSegments] = useState<TextSegment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setQuestion('');
    setAnswer('');
    setAnswerSegments([]);
  }, []);

  const handleAskQuestion = async() => {
    if(!question) {
      alert("Please ask something to get an answer.")
      return;
    }
    setIsLoading(true);

    try{
        let bestTopic = await KnowledgebaseHelper.findBestTopic(question);
        const finalAnswer = await QnaAgent.getAnswer(generateResponse, question, bestTopic, 'dari');
        const answerSegments = KnowledgebaseHelper.parseBoldMarkdown(finalAnswer);
        setAnswer(finalAnswer);
        setAnswerSegments(answerSegments);
    } catch (error) {
      console.error('Error generating response:', error);
      setAnswer(`Sorry, an error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* --- 1. Header & Input Section --- */}
      <LinearGradient
        colors={[Colors.light.tint, Colors.light.tint + 'B3']}
        style={styles.introSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
          <Text style={styles.title}>Ask About UK Life</Text>
          <Text style={styles.subtitle}>Get trusted answers to your questions, completely offline.</Text>
      </LinearGradient>
      

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask a question in your native language..."
          value={question}
          onChangeText={setQuestion}
          multiline
        />
        <FormButton
          title="Get Information"
          onPress={handleAskQuestion}
          disabled={isLoading}
        />
      </View>

      {/* --- 3. Result Section --- */}
      <View style={styles.resultContainer}>
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.tint} />
            <Text style={styles.loadingText}>Finding answers for you...</Text>
          </View>
        )}

        {/* Only show the answer if it's not empty and we are not loading */}
        {!isLoading && answer && (
          <ScrollView contentContainerStyle={styles.answerCard}>
            <View style={styles.answerContentContainer}>
              <SoundPlayer
                text={answer}
                languageCode={'fa-ir'}
                messageId={playId}
              />
              <MarkdownRenderer segments={answerSegments} baseStyle={styles.answerText} />
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

// At the bottom of qna.tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  introSection: {
    padding: 25,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    textAlign: 'center',
    color: Colors.light.textWhite,
    marginBottom: 16,
  },
  subtitle: { 
    fontSize: 16, 
    color: Colors.light.textWhite,
    textAlign: 'center', 
    marginTop: 8,
    opacity: 0.9,
  },
  inputContainer: { 
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderWidth: 0,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    minHeight: 150,
    textAlignVertical: 'top',
    marginBottom: 10
  },
  resultContainer: {
    flex: 1, 
    marginHorizontal: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: 'bold',
  },
  answerCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  answerContentContainer: {
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  answerText: {
    fontSize: 16,
    textAlign: 'right',
    lineHeight: 24,
    color: '#333',
    flex: 1,
    fontWeight: 'bold'
  },
  speakerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
    submitButton: {
    backgroundColor: Colors.light.buttonColor,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: Colors.light.buttonColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});