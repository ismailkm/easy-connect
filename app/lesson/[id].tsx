import { MOCK_ROADMAPS } from '@/assets/data/mockRoadmap';
import { VocabularyComponent } from '@/components/lesson/VocabularyComponent';
import { StageInterface } from '@/types/RoadmapInterface';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function LessonScreen() {
  const { id } = useLocalSearchParams();
  const [stageContent, setStageContent] = useState<StageInterface | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Find the stage content based on the ID
      let foundStage: StageInterface | null = null;
      for (const roadmap of MOCK_ROADMAPS) {
        foundStage = roadmap.stages.find(stage => stage.id === id) || null;
        if (foundStage) break;
      }
      setStageContent(foundStage);
      setLoading(false);
    }
  }, [id]);

  return (
    (loading)?
        <View style={styles.loadingContainer}>
            <Text>Loading lesson...</Text>
        </View>
    :
        (!stageContent) ?
            <View style={styles.container}>
                <Text style={styles.errorText}>Lesson content not found.</Text>
            </View>
        :
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View>
                        <Text style={styles.stageTitle}>{stageContent.title}</Text>
                        <Text style={styles.stageDuration}>Duration: {stageContent.duration}</Text>
                    </View>
                    <View style={styles.goalContainer}>
                        <Text style={styles.goalTitle}>Goal:</Text>
                        <Text style={styles.goalText}>{stageContent.goal}</Text>
                    </View>
                    
                    {stageContent.learningMaterials.map((material, index) => {
                        switch (material.type) {
                        case 'vocabulary':
                            return <VocabularyComponent key={index} material={material} />;
                        default:
                            return null;
                        }
                    })}
                    <View >
                        <Button title="Start Quiz" onPress={() => { /* Navigate to quiz screen */ }} />
                    </View>
                </ScrollView>
                
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
    justifyContent: 'center',
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