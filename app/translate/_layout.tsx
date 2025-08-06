import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';

export default function TranslateLayout() {
  
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity style={{ marginRight: 15 }} onPress={() => router.replace('/(tabs)/translate')}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        )
      }}>
      <Stack.Screen 
        name="camera-screen" 
        options={{ 
          title: 'Camera'
        }} 
      />
      <Stack.Screen 
        name="select-image" 
        options={{ 
          title: 'Select Image'
        }} 
      />
    </Stack>
  );
}