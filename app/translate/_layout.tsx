import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TranslateLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="camera-screen" 
        options={{ 
          title: 'Camera',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="preview" 
        options={({ navigation }) => ({
          title: 'Preview & Translate',
          headerShown: true,
          headerLeft: () => {
            const router = useRouter();
            return (
              <TouchableOpacity onPress={() => router.push('/(tabs)/translate')}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
            );
          },
        })}
      />
    </Stack>
  );
}