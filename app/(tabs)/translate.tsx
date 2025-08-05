import { DashboardButton } from '@/components/DashboardButton';
import { Text, View } from '@/components/Themed';
import { ImageSourceModal } from '@/components/Translate/ImageSourceModal';
import { Colors } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function TranslateScreen() {
  const [showImageSourceModal, setShowImageSourceModal] = useState(false);
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.light.tint, Colors.light.tint + 'B3']}
        style={styles.introSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>Translate Anything</Text>
        <Text style={styles.description}>Easily translate text from various sources, whether you type it, paste it, or capture it from an image.</Text>

      </LinearGradient>
      
    <View style={styles.buttonContainer} >
      <DashboardButton
        iconName="text.bubble.fill"
            title="Translate Text"
            subtitle="Type or paste text to translate"
            onPress={() => router.push('/(tabs)/practice-english')}
            startColor={Colors.light.translateButton}
        endColor={Colors.light.translateButton + 'B3'}
      />

      <DashboardButton
         iconName="camera.fill"
            title="Upload Image"
            subtitle="Translate text from an image"
            onPress={() => setShowImageSourceModal(true)}
            startColor={Colors.light.uploadImageButton}
         endColor={Colors.light.uploadImageButton + 'B3'}
      />
    </View>
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
  },
  introSection: {
    borderRadius: 15,
    padding: 25,
    marginBottom: 20,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: Colors.light.textWhite,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.light.textWhite,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
});