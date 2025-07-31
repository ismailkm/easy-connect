import { DashboardButton } from '@/components/DashboardButton';
import { Text, View } from '@/components/Themed';
import { RoadmapModel } from '@/models/RoadmapModel';
import { RoadmapInterface } from '@/types/RoadmapInterface';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function LearnEnglishScreen() {
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<RoadmapInterface[]>([]); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRoadmaps = async () => {
      let storageRoadmap = await RoadmapModel.getRoadmaps();
      console.log({storageRoadmap})
      setRoadmaps(storageRoadmap); 
      setIsLoading(false);
    };

    loadRoadmaps();
  }, []);

  // --- RENDER FUNCTION FOR THE EMPTY STATE ---
  const renderEmptyState = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.title}>Create a New Learning Plan</Text>
      <Text style={styles.subtitle}>
        Tell me what you want to learn, and I will create a personalized roadmap for you.
      </Text>
      <DashboardButton
        title="Start Your First Lesson"
        subtitle="Create your first plan now!"
        iconName="play"
        onPress={() => router.push('/create-roadmap')}
      />
    </View>
  );

  // --- RENDER FUNCTION FOR THE ROADMAPS LIST ---
  const renderRoadmapsList = () => (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <Text style={styles.title}>Your Learning Plans</Text>
      </View>
      <View style={{flex: 8}}>
        <FlatList
          data={roadmaps}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.roadmapItem} onPress={() => router.push({ pathname: "/roadmap/[id]", params: { id: item.id } })}>
                <View>
                  <Text style={styles.roadmapTitle}>{item.title}</Text>
                  <Text style={styles.roadmapGoal}>{item.goal}</Text>
                  <Text style={styles.roadmapProgress}>Progress: {item.progress * 100}%</Text>
                </View>
              </TouchableOpacity>
          )}
        />
      </View>
      
      <View style={styles.centerContainer}>
        <DashboardButton
          title="Create a New Roadmap"
          subtitle="Start a new learning journey"
          iconName="plus"
          onPress={() => router.push('/create-roadmap')}
        />
      </View>
      
    </View>
  );
  
  return (
    isLoading ? (
      <View style={styles.centerContainer}><Text>Loading...</Text></View>
    ) : (
      roadmaps.length === 0 ? renderEmptyState() : renderRoadmapsList()
    )
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
  },
  centerContainer: { 
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    paddingHorizontal: 20,
  },
  roadmapGoal: {
    fontSize: 12,
    color: '#666',
  },
  roadmapItem: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  roadmapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  roadmapProgress: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
});