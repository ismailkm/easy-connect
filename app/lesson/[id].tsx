import { LessonContentGeneratorAgent } from '@/agents/LessonContentGeneratorAgent';
import { LessonComponent } from '@/components/lesson/LessonComponent';
import { Colors } from '@/constants/Colors';
import { useGemma } from '@/context/GemmaProvider';
import { useMlKit } from '@/context/MlKitProvider';
import { RoadmapModel } from '@/models/RoadmapModel';
import { UserModel } from '@/models/UserModel';
import { LearningLine, StageInterface } from '@/types/RoadmapInterface';
import UserInterface from '@/types/UserInterface';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function LessonScreen() {
  const { id } = useLocalSearchParams();
  const [stageContent, setStageContent] = useState<StageInterface | null>(null);
  const [learningMaterials, setLearningMaterials] = useState<LearningLine[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasError, setEasError] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Loading lessons...");
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
      <LinearGradient
        colors={[Colors.light.tint, Colors.light.tint + 'B3']}
        style={styles.lessonIntroSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.stageTitle}>{stageContent?.title}</Text>
        <Text style={styles.stageDuration}>{stageContent?.duration}</Text>
        <View>
            <Text style={styles.goalTitle}>Goal</Text>
            <Text style={styles.goalText}>{stageContent?.goal}</Text>
        </View>
      </LinearGradient>
      {(loading || hasError )? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
          <Text style={styles.loadingText}>{loadingMessage}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    
          {learningMaterials?.map((material, index) => {
            return <LessonComponent key={index} id={index} material={material} />;
          })}
          
        </ScrollView>
      )}
    </View>
        
            
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  lessonIntroSection: {
    paddingVertical: 25,
    paddingHorizontal: 10,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: 'bold',
    marginTop: 10,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  scrollViewContent: {
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 80, // Space for the button at the bottom
  },
  stageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.light.textWhite
  },
  stageDuration: {
    fontSize: 16,
    color: Colors.light.textWhite,
    marginBottom: 20,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colors.light.textWhite,
  },
  goalText: {
    fontSize: 14,
    color: Colors.light.textWhite,
  },
  vocabularyContainer: {
    backgroundColor: Colors.light.background,
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