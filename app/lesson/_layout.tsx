import { Stack } from 'expo-router';

export default function LessonLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ headerShown: false, title: 'Lesson Detail' }} />
    </Stack>
  );
}