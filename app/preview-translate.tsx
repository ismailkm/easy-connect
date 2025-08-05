import { SummaryAgent } from '@/agents/SummaryAgent';
import FooterButtons from '@/components/Translate/FooterButtons';
import ImageModal from '@/components/Translate/ImageModal';
import { ImageSourceModal } from '@/components/Translate/ImageSourceModal';
import { TranslationLine } from '@/components/Translate/TranslationLine';
import { SoundPlayer } from '@/components/ui/SoundPlayer';
import { Colors } from '@/constants/Colors';
import { useGemma } from '@/context/GemmaProvider';
import { useMlKit } from '@/context/MlKitProvider';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PreviewTranslateScreen() {  
  const { generateResponse, isModelLoaded  } = useGemma();
  const { recognizeText, translateBatch } = useMlKit();
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const [isLoadingTranslation, setIsLoadingTranslation] = useState(true);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [englishLines, setEnglishLines] = useState<string[]>([]);
  const [nativeTranslation, setNativeTranslation] = useState<string[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [showImageSourceModal, setShowImageSourceModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const processImage = async () => {
      if (!photoUri) return;
      try {
        setIsLoadingTranslation(true);
        const recognizedEnglishLines = await recognizeText(photoUri);
 
        setEnglishLines(recognizedEnglishLines);
        const nativeLines = await translateBatch(recognizedEnglishLines, 'en', 'dari');
 
        setNativeTranslation(nativeLines);
        setIsLoadingTranslation(false);

      } catch (e) {
        console.log('Error processing image:', e);
      } finally {
        setIsLoadingTranslation(false);
      }
    };
    processImage();
  }, [photoUri]);

  useEffect(() => {
    const processSummary = async () => {
      console.log("useEffect processSummary")
      console.log('isModelLoaded', isModelLoaded);

      try {
        setIsLoadingSummary(true);
        const fullEnglishText = englishLines.join(' ');
        const englishSummary = await SummaryAgent.generateSummary(generateResponse, fullEnglishText);
        const translatedSummaryLines = await translateBatch([englishSummary], 'en', 'dari');
        setSummary(translatedSummaryLines.join('\n')); 
        setIsLoadingSummary(false);
      } catch (e) {
        console.log('Error processing summary:', e);
      } finally {
        setIsLoadingSummary(false);
      }
    };

    if( isModelLoaded && englishLines.length > 0){
       processSummary();
    }
   
  }, [isModelLoaded, englishLines]);

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
             <LinearGradient
                colors={[Colors.light.tint + 'B3', Colors.light.tint]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.summarysection}
              >
            <Text style={styles.summarySectionTitle}>Summary</Text>
            {isLoadingSummary ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.light.textWhite} />
                <Text style={styles.summaryLoadingText}>Generating summary...</Text>
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
          </LinearGradient>
          <View style={styles.translationSection}>
              <Text style={styles.translationSectionTitle}>Translation</Text>
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
        <FooterButtons onViewDocument={() => setImageModalVisible(true)} onNewDocument={() => setShowImageSourceModal(true)}/>
      )}

      <ImageSourceModal
        visible={showImageSourceModal}
              onClose={() => setShowImageSourceModal(false)}
              onTakePicture={() => {
                setShowImageSourceModal(false);
                router.replace('/translate/camera-screen');
              }}
              onSelectFromGallery={() => {
                setShowImageSourceModal(false);
                router.replace('/translate/select-image');
        }}
      />
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
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
  contentContainer: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 120,
  },
  summarysection: {
    minHeight: 150,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  summarySectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.light.textWhite,
  },
  translationSection: {
    flex: 1,
    marginTop: 20
  },
  translationSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center'
  },
  summaryText: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.textWhite
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
  summaryLoadingText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.light.textWhite,
  }
});
