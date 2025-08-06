import { MOCK_ROADMAPS } from '@/assets/data/mockRoadmap';
import { AnswerButton } from '@/components/lesson/AnswerButton';
import { QuizCompletionScreen } from '@/components/lesson/QuizCompletionScreen';
import { QuizQuestion, StageInterface } from '@/types/RoadmapInterface';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function QuizScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAnswered, setIsAnswered] = useState(false); 
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (id) {
      let foundStage: StageInterface | null = null;
      for (const roadmap of MOCK_ROADMAPS) {
        foundStage = roadmap.stages.find(stage => stage.id === id) || null;
        if (foundStage) break;
      }

      if (foundStage && foundStage.quiz && foundStage.quiz.questions) {
        setQuizQuestions(foundStage.quiz.questions);
      } else {
        setQuizQuestions([]);
      }
      setLoading(false);
    }
  }, [id]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setIsAnswered(true); 
    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (answer === currentQuestion.correctAnswer) {
      setFeedback('Correct!');
      setScore(prevScore => prevScore + 1);
    } else {
      setFeedback(`Incorrect. The correct answer was: ${currentQuestion.correctAnswer}`);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false); // Reset for next question
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prevIndex: number) => prevIndex + 1);
      setSelectedAnswer(null);
      setFeedback(null);
    } else {
      setQuizCompleted(true);
    }
  };

  // Auto-advance logic
  useEffect(() => {
    if (isAnswered) {
      const timer = setTimeout(() => {
        handleNextQuestion();
      }, 1500); // 1.5 second delay
      return () => clearTimeout(timer);
    }
  }, [isAnswered, handleNextQuestion]);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const totalQuestions = quizQuestions.length;

  return (
    loading ? (
      <View style={styles.loadingContainer}>
        <Text>Loading quiz...</Text>
      </View>
    ) : quizCompleted ? (
      <QuizCompletionScreen
        onGoBack={() => router.back()}
        totalQuestions={totalQuestions}
        scored={score}
      />
    ) : quizQuestions.length === 0 ? (
      <View style={styles.container}>
        <Text style={styles.errorText}>No quiz questions found for this lesson.</Text>
      </View>
    ) : (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Text style={styles.progressText}>Question {currentQuestionIndex + 1} of {totalQuestions}</Text>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>
        {currentQuestion.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = option === currentQuestion.correctAnswer;
          const showFeedback = isAnswered;

          return (
            <AnswerButton
              key={index}
              title={option}
              onPress={() => handleAnswerSelect(option)}
              isSelected={isSelected}
              isCorrect={isCorrect}
              showFeedback={showFeedback}
              isDisabled={isAnswered}
            />
          );
        })}
      </View>
      {feedback && <Text style={styles.feedbackText}>{feedback}</Text>}
      {!isAnswered && (
        <Pressable
          style={[styles.nextButton, !selectedAnswer && styles.nextButtonDisabled]}
          onPress={handleNextQuestion}
          disabled={!selectedAnswer}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </Text>
        </Pressable>
      )}
    </ScrollView>
    )
  ); // This closing parenthesis closes the entire ternary expression
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  feedbackText: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  progressText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  nextButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#a0c8f7',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});