import { Stack } from 'expo-router';

export default function LessonLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ headerShown: true, title: 'Lesson Detail' }} />
    </Stack>
  );
}