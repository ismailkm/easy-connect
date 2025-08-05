import { GemmaLoader } from '@/components/GemmaLoader';
import { Text, View } from '@/components/Themed';
import { GemmaProvider } from '@/context/GemmaProvider';
import { MlKitProvider } from '@/context/MlKitProvider';
import { VoiceProvider, useVoice } from '@/context/VoiceProvider'; // Import the new provider and hook
import { StorageHelper } from '@/models/StorageHelper';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Stack, useNavigation, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';

import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <GemmaProvider>
      <MlKitProvider>
        <VoiceProvider>
          <AppLayout />
        </VoiceProvider>
      </MlKitProvider>
    </GemmaProvider>
  );
}


function AppLayout() {
  const router = useRouter();
  const navigation = useNavigation();
  
  const { stopSpeaking, isSpeaking } = useVoice();
  
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      if (isSpeaking) {
        console.log('Screen lost focus, stopping active speech.');
        stopSpeaking();
      }
    });
    return unsubscribe;
  }, [navigation, isSpeaking, stopSpeaking]);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const hasOnboarded = await StorageHelper.getOnboardedStatus();
        if (hasOnboarded) {
          router.replace('/(tabs)');
        } else {
          router.replace('/welcome');
        }
      } catch (e) {
        router.replace('/welcome');
      }
    };
    if (fontsLoaded) {
      checkOnboardingStatus();
    }
  }, [fontsLoaded]); 

  
  if (fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error starting app: {fontError?.message}</Text>
      </View>
    );
  }

  return (
    <>
      <GemmaLoader />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="roadmap" />
        <Stack.Screen name="lesson" />
        <Stack.Screen name="quiz" />
        <Stack.Screen name="create-roadmap" options={{ headerShown: true, title: 'Create New Roadmap' }}/>
        <Stack.Screen name="translate" />
        <Stack.Screen name="preview-translate" 
          options={({ navigation }) => ({
            title: 'Preview & Translate',
            headerShown: true,
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => router.replace('/(tabs)/translate')}>
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
              );
            },
        })}/>
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
    
  );
}


