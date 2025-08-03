import { Stack } from 'expo-router';

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
    </Stack>
  );
}