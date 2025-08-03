import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type TranslationLineProps = {
  englishText: string;
  nativeText: string;
  onSpeak: () => void;
};

export function TranslationLine({ englishText, nativeText, onSpeak }: TranslationLineProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.englishText}>{englishText}</Text>
        <Text style={styles.nativeText}>{nativeText}</Text>
      </View>
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
  textContainer: {
    flex: 1,
  },
  englishText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  nativeText: {
    fontSize: 18,
  },
  speakButton: {
    marginLeft: 10,
  },
});