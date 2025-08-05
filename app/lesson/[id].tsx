import { LessonContentGeneratorAgent } from '@/agents/LessonContentGeneratorAgent';
import { LessonComponent } from '@/components/lesson/LessonComponent';
import FormButton from '@/components/ui/FormButton';
import { useGemma } from '@/context/GemmaProvider';
import { useMlKit } from '@/context/MlKitProvider';
import { RoadmapModel } from '@/models/RoadmapModel';
import { UserModel } from '@/models/UserModel';
import { LearningLine, StageInterface } from '@/types/RoadmapInterface';
import UserInterface from '@/types/UserInterface';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function LessonScreen() {
  const { id } = useLocalSearchParams();
  const [stageContent, setStageContent] = useState<StageInterface | null>(null);
  const [learningMaterials, setLearningMaterials] = useState<LearningLine[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setEasError] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading lesson...");
  const router = useRouter();
  const { generateResponse, isModelLoaded } = useGemma(); 
  const { translateBatch } = useMlKit();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await UserModel.getUserDetails();
        if (userData) {
          getStageLessions(userData);
        }
      } catch (error) {
        setEasError(true);
        setLoadingMessage("Failed to load user data. Please try again.");
      }
    };
    if(isModelLoaded){
      loadUserData();
    }
  }, [isModelLoaded]);

  const getStageLessions = async (userData: UserInterface) => {
    setLoading(true);
    try {
      const stage = await RoadmapModel.getStageById(id as string);
      if (!stage) {
          throw new Error('Stage title or goal is undefined');
      }
      setStageContent(stage);
      if (stage.learningMaterials && stage.learningMaterials.length > 0) {
        setLearningMaterials(stage.learningMaterials);
      } else {
        setLoadingMessage("Generating new lessons for you. Please wait.")
        const lessonsLines: LearningLine[] = await LessonContentGeneratorAgent.generateLessonContent(generateResponse, translateBatch, stage.title, stage.goal, userData);
        await RoadmapModel.saveLearningMaterialsToStage(id as string, lessonsLines);
        setLearningMaterials(lessonsLines);
      }
    } catch (error) {
      setEasError(true);
      setLoadingMessage(`Failed to generate lesson content. Please try again.${error?.toString()}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    
    <View style={styles.container}>
      <View>
        <Text style={styles.stageTitle}>{stageContent?.title}</Text>
        <Text style={styles.stageDuration}>{stageContent?.duration}</Text>
        <View style={styles.goalContainer}>
            <Text style={styles.goalTitle}>Goal</Text>
            <Text style={styles.goalText}>{stageContent?.goal}</Text>
        </View>
      </View>
      {(loading || hasError )? (
        <View style={styles.loadingContainer}>
          <Text>{loadingMessage}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    
          {learningMaterials?.map((material, index) => {
            return <LessonComponent key={index} id={index} material={material} />;
          })}
          
          <View style={{marginTop: 20}}>
            <FormButton title="Start Quiz" onPress={() => router.push(`/quiz/${id}`)} />
          </View>
        </ScrollView>
      )}
    </View>
        
            
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    paddingTop: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  scrollViewContent: {
    paddingBottom: 80, // Space for the button at the bottom
  },
  stageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  stageDuration: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  goalContainer: {
    backgroundColor: '#e6f7ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#1890ff',
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1890ff',
  },
  goalText: {
    fontSize: 16,
    color: '#333',
  },
  vocabularyContainer: {
    backgroundColor: '#fff0f6',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: '#eb2f96',
  },
  vocabularyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#eb2f96',
  },
  vocabularyItem: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  }
});