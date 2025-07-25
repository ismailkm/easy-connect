// In App.tsx
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  NativeModules,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';

// This line imports your native module into React Native
const { GemmaModule } = NativeModules;

const HomeScreen = () => {
  const [status, setStatus] = useState('Model not loaded.');
  const [isLoading, setIsLoading] = useState(false);

  // This function is called when you press the button
  const handleLoadModel = async () => {
    // Check if the native module exists
    if (!GemmaModule) {
      setStatus('Error: GemmaModule is not available. Check your native setup.');
      return;
    }

    setIsLoading(true);
    setStatus('Loading model, please wait...');

    try {
      // This is the key part: it calls your Kotlin function
      const result = await GemmaModule.loadModel();
      console.log(result)
      setStatus(result); // If successful, display the success message from Kotlin
    } catch (error) {
      console.error(error);
      // If it fails, display the error message from Kotlin
      setStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>The Bridging App</Text>
      <Text style={styles.subtitle}>Day 1: Foundation Test</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Load Gemma 3n Model"
          onPress={handleLoadModel}
          disabled={isLoading}
        />
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Status:</Text>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.status}>{status}</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 18, color: 'gray', marginBottom: 40 },
  buttonContainer: { marginVertical: 20 },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  statusText: { fontSize: 16, fontWeight: 'bold', marginRight: 10 },
  status: { fontSize: 16, color: 'navy', flexShrink: 1 },
});

export default HomeScreen;