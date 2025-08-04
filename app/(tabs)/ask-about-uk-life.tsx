import { QnaAgent } from '@/agents/QnaAgent';
import { DashboardButton } from '@/components/DashboardButton';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { Text, View } from '@/components/Themed';
import { SoundPlayer } from '@/components/ui/SoundPlayer';
import { TextSegment } from '@/types/KnowledgebaseInterface';
import { KnowledgebaseHelper } from '@/utils/KnowledgebaseHelper';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TextInput } from 'react-native';

export default function PracticeEnglishScreen() {
  
  const playId = String(Date.now());
  
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [answerSegments, setAnswerSegments] = useState<TextSegment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAskQuestion = async() => {
    setIsLoading(true);
    setAnswer('')
    try{
        let bestTopic = await KnowledgebaseHelper.findBestTopic(question);
        const finalAnswer = await QnaAgent.getAnswer(question, bestTopic, 'dari');
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
      {/* --- 1. Header Section --- */}
      <Text style={styles.title}>Ask About UK Life</Text>
      <Text style={styles.subtitle}>Get trusted answers to your questions, completely offline.</Text>

      {/* --- 2. Input Section --- */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask a question in your native language..."
          value={question}
          onChangeText={setQuestion}
          multiline
        />
        <DashboardButton
          title={isLoading ? 'Thinking...' : 'Ask about UK Life'}
          onPress={handleAskQuestion}
          iconName="questionmark.circle.fill"
          subtitle="Navigate daily life in the UK"
        />
      </View>

      {/* --- 3. Result Section --- */}
      <View style={styles.resultContainer}>
        {isLoading && <ActivityIndicator size="large" />}

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
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 16, color: 'gray', textAlign: 'center', marginBottom: 20 },
  inputContainer: { marginBottom: 20 },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  resultContainer: {
    flex: 1, // Make it take the rest of the screen
    paddingTop: 10,
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
  },
  speakerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
});