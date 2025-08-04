import { SoundPlayer } from '@/components/ui/SoundPlayer';
import { StyleSheet, Text, View } from 'react-native';

type TranslationLineProps = {
  englishText: string;
  nativeText: string;
  id: string;
};

export function TranslationLine({ englishText, nativeText, id }: TranslationLineProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.englishText}>{englishText}</Text>
        <Text style={styles.nativeText}>{nativeText}</Text>
      </View>
      <SoundPlayer
        text={nativeText}
        languageCode={'fa-ir'}
        messageId={id}
      />
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
    textAlign: 'right',
    fontSize: 18,
  },
  speakButton: {
    marginLeft: 10,
  },
});