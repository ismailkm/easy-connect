import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

interface AnswerButtonProps {
  title: string;
  onPress: () => void;
  isSelected: boolean;
  isCorrect: boolean;
  showFeedback: boolean;
  isDisabled: boolean;
}

export const AnswerButton: React.FC<AnswerButtonProps> = ({
  title,
  onPress,
  isSelected,
  isCorrect,
  showFeedback,
  isDisabled,
}) => {
  const buttonStyle:any = [styles.answerButton];
  const textStyle:any = [styles.answerButtonText];

  if (showFeedback) {
    if (isSelected) {
      buttonStyle.push(isCorrect ? styles.answerButtonCorrect : styles.answerButtonIncorrect);
      textStyle.push(styles.answerButtonTextSelected);
    } else if (isCorrect) {
      buttonStyle.push(styles.answerButtonCorrectBorder);
    }
  } else if (isSelected) {
    buttonStyle.push(styles.answerButtonSelected);
  }

  return (
    <Pressable
      style={buttonStyle}
      onPress={onPress}
      disabled={isDisabled}
    >
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  answerButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
    alignItems: 'center',
  },
  answerButtonText: {
    fontSize: 18,
    color: '#333',
  },
  answerButtonSelected: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  answerButtonCorrect: {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
    borderWidth: 2,
  },
  answerButtonIncorrect: {
    backgroundColor: '#f8d7da',
    borderColor: '#dc3545',
    borderWidth: 2,
  },
  answerButtonCorrectBorder: {
    borderColor: '#28a745',
    borderWidth: 2,
  },
  answerButtonTextSelected: {
    fontWeight: 'bold',
    fontSize: 18, 
    color: '#333', 
  },
});