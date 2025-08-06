import { RoadmapGeneratorAgent } from '@/agents/RoadmapGeneratorAgent';
import { Text, View } from '@/components/Themed';
import FormButton from '@/components/ui/FormButton';
import { Colors } from '@/constants/Colors';
import { useGemma } from '@/context/GemmaProvider';
import { RoadmapModel } from '@/models/RoadmapModel';
import { UserModel } from '@/models/UserModel';
import UserInterface from '@/types/UserInterface';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput } from 'react-native';

export default function CreateRoadmapScreen() {
  const [initialUserData, setInitialUserData] = useState<UserInterface | null>(null);
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const { generateResponse } = useGemma(); 
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await UserModel.getUserDetails();
        if (userData) {
          setInitialUserData(userData);
        }
      } catch (error) {
        console.error('Failed to load user data', error);
      }
    };
    loadUserData();
  }, []);

  const handleGenerateRoadmap = async () => {
    if (!title.trim() || !goal.trim()) {
      alert('Please provide both a title and a goal for your roadmap.');
      return;
    }
    setIsGenerating(true);
    try {
      const roadmap = await RoadmapGeneratorAgent.generateAndSave(generateResponse, initialUserData!, goal, title);
      await RoadmapModel.addRoadmap(roadmap);
      router.replace('/(tabs)/learn-english');
    } catch (e: any) {
      console.log("handleGenerateRoadmap error", e)
    } finally {
      setIsGenerating(false);
    }
  };


  return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <ScrollView contentContainerStyle={styles.scrollContentContainer}>
          <LinearGradient
            colors={[Colors.light.tint, Colors.light.tint + 'B3']}
            style={styles.introSection}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text type="title" style={styles.title}>Create Your Roadmap</Text>
            <Text type="subtitle" style={styles.subtitle}>Describe your goal in detail.{`\n`}This helps us create your perfect roadmap.</Text>
          </LinearGradient>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Roadmap Title</Text>
            <TextInput
              style={styles.titleTextInput}
              placeholder="e.g., 'IELTS Preparation', 'Daily English for UK Life'"
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
            <Text style={styles.charCounter}>{title.length} / 50</Text>
            
            <Text style={styles.label}>Your Goal</Text>
            <TextInput
              style={styles.goalTextInput}
              placeholder="e.g., 'I want to improve my conversational English for travel'"
              multiline
              numberOfLines={4}
              value={goal}
              onChangeText={setGoal}
              maxLength={150} 
            />
            <Text style={styles.charCounter}>{goal.length} / 150</Text>

            {isGenerating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.light.tint} />
              <Text style={styles.loadingText}>Generating your roadmap...</Text>
            </View>
            ) : (
              <FormButton
                title="Generate My Roadmap"
                onPress={handleGenerateRoadmap}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  introSection: {
    padding: 25,
    marginBottom: 20,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.textWhite,
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.light.textWhite,
    marginBottom: 4,
    textAlign: 'center',
  },
  inputContainer: {
    paddingHorizontal: 20,
  },
  titleTextInput: {
    width: '100%',
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
    backgroundColor: 'white',
  },
  goalTextInput: {
    width: '100%',
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
    backgroundColor: 'white',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  charCounter: {
    width: '100%',
    textAlign: 'right',
    color: '#888',
    fontSize: 12,
    marginTop: -15, 
    marginBottom: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.text,
    marginTop: 10,
  }
});