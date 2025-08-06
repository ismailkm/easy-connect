import { SoundPlayer } from '@/components/ui/SoundPlayer';
import { Colors } from '@/constants/Colors';
import { StyleSheet, Text, View } from 'react-native';

type TranslationLineProps = {
  englishText: string;
  nativeText: string;
  id: string;
};

export function TranslationLine({ englishText, nativeText, id }: TranslationLineProps) {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.englishText}>{englishText}</Text>
          <Text style={styles.nativeText}>{nativeText}</Text>
        </View>
        <SoundPlayer
          text={nativeText}
          languageCode="fa-ir"
          messageId={id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.aiMessageBackground,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: Colors.light.darkShadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  englishText: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 6,
    lineHeight: 24,
    fontWeight: '400'
  },
  nativeText: {
    textAlign: 'right',
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: 'bold',
  },
});
