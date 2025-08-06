import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface QuizCompletionScreenProps {
  onGoBack: () => void;
  totalQuestions: number;
  scored: number
}

export const QuizCompletionScreen: React.FC<QuizCompletionScreenProps> = ({ onGoBack, totalQuestions, scored }) => {
  const router = useRouter();

  return (
    <View style={styles.completionContainer}>
      <Text style={styles.completionIcon}>🏆</Text>
      <Text style={styles.completionText}>Congratulations!</Text>
      <Text style={styles.completionSubText}>You've successfully completed the quiz!</Text>
      <Text style={styles.scoreText}>
        You scored: {scored} out of {totalQuestions}
      </Text>
      <Pressable style={styles.completionButton} onPress={onGoBack}>
        <Text style={styles.completionButtonText}>Go Back to Lesson</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  completionText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  completionSubText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
  },
  completionIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  completionButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
  },
  completionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
});