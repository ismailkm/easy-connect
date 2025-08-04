import { SummaryAgent } from '@/agents/SummaryAgent';
import FooterButtons from '@/components/Translate/FooterButtons';
import ImageModal from '@/components/Translate/ImageModal';
import { TranslationLine } from '@/components/Translate/TranslationLine';
import { SoundPlayer } from '@/components/ui/SoundPlayer';
import { useGemma } from '@/context/GemmaProvider';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PreviewTranslateScreen() {  
  const { recognizeText, translateBatch, generateResponse  } = useGemma();
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(true);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [englishLines, setEnglishLines] = useState<string[]>([]);
  const [nativeTranslation, setNativeTranslation] = useState<string[]>([]);
  const [summary, setSummary] = useState<string>('');

  useEffect(() => {
    const processImage = async () => {
      if (!photoUri) return;
      try {
        setIsLoadingTranslation(true);
        const recognizedEnglishLines = await recognizeText(photoUri);
 
        setEnglishLines(recognizedEnglishLines);
        const nativeLines = await translateBatch(recognizedEnglishLines, 'dari');
        setNativeTranslation(nativeLines);
        setIsLoadingTranslation(false);

        setIsLoadingSummary(true);
        const fullEnglishText = englishLines.join(' ');
        const englishSummary = await SummaryAgent.generateSummary(generateResponse, fullEnglishText);
        const translatedSummaryLines = await translateBatch([englishSummary], 'dari');
        setSummary(translatedSummaryLines.join('\n')); 
        setIsLoadingSummary(false);

      } catch (e) {
        // Handle errors
      } finally {
        setIsLoadingTranslation(false);
        setIsLoadingSummary(false);
      }
    };
    processImage();
  }, [photoUri]);

  const [imageModalVisible, setImageModalVisible] = useState(false);

  return (
    <View style={styles.container}> 
      
      <ImageModal 
        visible={imageModalVisible}
        photoUri={photoUri}
        onClose={() => setImageModalVisible(false)}
      />

      {(isLoadingTranslation) && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>
            {isLoadingTranslation ? 'Translating your document...' : 'Generating summary...'}
          </Text>
        </View>
      )}

      {!isLoadingTranslation && (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            {isLoadingSummary ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.loadingText}>Generating summary...</Text>
              </View>
            ) : (
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>{summary}</Text>
                <SoundPlayer
                  text={summary}
                  languageCode={'fa-ir'}
                  messageId={"summary"}
                />
              </View>
            )}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Translation</Text>
            {nativeTranslation.map((nativeLine, index) => (
              <TranslationLine 
                key={index} 
                englishText={englishLines[index] || ''}
                nativeText={nativeLine}
                id={index+"_translation"}
              />
            ))}
          </View>
        </ScrollView>
      )}

      {!isLoadingTranslation && !isLoadingSummary && (
        <FooterButtons onViewDocument={() => setImageModalVisible(true)} />
      )}
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    gap: 12,
  },
  summaryText: {
    flex: 1,
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});
