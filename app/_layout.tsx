import { GemmaProvider, useGemma } from '@/context/GemmaProvider';
import { StorageHelper } from '@/models/StorageHelper';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <GemmaProvider>
      <AppLayout />
    </GemmaProvider>
  );
}

function AppLayout() {
  const router = useRouter();
  const { isModelLoaded, isLoading: isGemmaLoading, error: modelError } = useGemma();
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

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
    if (fontsLoaded && isModelLoaded) {
      checkOnboardingStatus();
    }
  }, [fontsLoaded, isModelLoaded]); 

  const isAppLoading = !fontsLoaded || isGemmaLoading;

  if (isAppLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Preparing Easy Connect...</Text>
      </View>
    );
  }
  
  if (modelError || fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error starting app: {modelError || fontError?.message}</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="roadmap" />
      <Stack.Screen name="lesson" />
      <Stack.Screen name="quiz" />
      <Stack.Screen name="create-roadmap" options={{ headerShown: true, title: 'Create New Roadmap' }}/>
      <Stack.Screen name="translate" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}