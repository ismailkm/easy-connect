import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TranslationLineProps = {
  text: string;
  onSpeak: () => void;
};

export function TranslationLine({ text, onSpeak }: TranslationLineProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <TouchableOpacity onPress={onSpeak} style={styles.speakButton}>
        <Ionicons name="volume-high" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  text: {
    flex: 1,
    fontSize: 16,
  },
  speakButton: {
    marginLeft: 10,
  },
});