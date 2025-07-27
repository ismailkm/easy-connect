// In app/index.tsx
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  NativeModules,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const { GemmaModule } = NativeModules;

export default function ModelTestScreen() {
  const [modelStatus, setModelStatus] = useState('Not loaded');
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [prompt, setPrompt] = useState("Hello! I am new to the UK and want to practice my English.");
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState('');

  // Function to load the model
  const loadModel = async () => {
    if (!GemmaModule) {
      setModelStatus('Native module not found!');
      return;
    }
    setIsModelLoading(true);
    try {
      const status = await GemmaModule.loadModel();
      setModelStatus(status);
    } catch (e) {
      setModelStatus(`Error loading model: ${e.message}`);
      console.error(e);
    } finally {
      setIsModelLoading(false);
    }
  };

  // Function to generate a response
  const handleGenerate = async () => {
    if (!GemmaModule) {
      setResponse('Native module not found!');
      return;
    }
    setIsGenerating(true);
    setResponse('Generating...');
    try {
      const result = await GemmaModule.generateResponse(prompt);
      setResponse(result);
    } catch (e) {
      setResponse(`Error generating response: ${e.message}`);
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Model Inference Test</Text>

      {/* Model Loading Section */}
      <View style={styles.section}>
        <Button title="1. Load Model" onPress={loadModel} disabled={isModelLoading} />
        <Text style={styles.status}>
          Status: {isModelLoading ? <ActivityIndicator /> : modelStatus}
        </Text>
      </View>

      {/* Inference Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Enter your prompt:</Text>
        <TextInput
          style={styles.input}
          value={prompt}
          onChangeText={setPrompt}
          multiline
        />
        <Button
          title="2. Generate Response"
          onPress={handleGenerate}
          disabled={isGenerating || modelStatus.includes('Error') || modelStatus.includes('Not loaded')}
        />
      </View>

      {/* Response Section */}
      <View style={styles.section}>
        <Text style={styles.label}>Model's Response:</Text>
        <Text style={styles.response}>
          {isGenerating ? <ActivityIndicator /> : response}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    minHeight: 80,
    marginBottom: 10,
  },
  status: {
    marginTop: 10,
    textAlign: 'center',
    color: 'navy',
  },
  response: {
    marginTop: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    minHeight: 100,
    color: 'black',
  },
});