import { Stack } from 'expo-router';

export default function RoadmapLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ headerShown: true, title: 'Roadmap Detail' }} />
    </Stack>
  );
}