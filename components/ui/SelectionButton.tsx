import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface SelectionButtonProps {
  title: string;
  onPress: () => void;
  isSelected: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const SelectionButton: React.FC<SelectionButtonProps> = ({ title, onPress, isSelected, style, textStyle }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSelected && styles.selectedButton,
        style,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          isSelected && styles.selectedButtonText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    marginHorizontal: 5,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 10
  },
  selectedButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center'
  },
  selectedButtonText: {
    color: '#FFFFFF',
  },
});

export default SelectionButton;