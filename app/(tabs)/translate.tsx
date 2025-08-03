import { DashboardButton } from '@/components/DashboardButton';
import { Text, View } from '@/components/Themed';
import { ImageSourceModal } from '@/components/Translate/ImageSourceModal';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function TranslateScreen() {
  const [showImageSourceModal, setShowImageSourceModal] = useState(false);
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Translate Screen</Text>
      <View style={styles.separator} />
          <DashboardButton
            iconName="text.bubble.fill"
            title="Translate Text"
            subtitle="Type or paste text to translate"
            onPress={() => router.push('/(tabs)/practice-english')}
          />

          <DashboardButton
            iconName="camera.fill"
            title="Upload Image"
            subtitle="Translate text from an image"
            onPress={() => setShowImageSourceModal(true)}
          />
          <ImageSourceModal
            visible={showImageSourceModal}
            onClose={() => setShowImageSourceModal(false)}
            onTakePicture={() => {
              setShowImageSourceModal(false);
              router.push('/translate/camera-screen');
            }}
            onSelectFromGallery={() => {
              setShowImageSourceModal(false);
              router.push('/translate/select-image');
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
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