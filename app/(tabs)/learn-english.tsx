import { DashboardButton } from '@/components/DashboardButton';
import { Text, View } from '@/components/Themed';
import { Colors } from '@/constants/Colors';
import { RoadmapModel } from '@/models/RoadmapModel';
import { RoadmapInterface } from '@/types/RoadmapInterface';
import { LinearGradient } from 'expo-linear-gradient';
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
      setRoadmaps(storageRoadmap); 
      setIsLoading(false);
    };

    loadRoadmaps();
  }, []);

  // --- RENDER FUNCTION FOR THE EMPTY STATE ---
  const renderEmptyState = () => (
    <>
      <LinearGradient
        colors={[Colors.light.tint, Colors.light.tint + 'B3']}
        style={styles.introSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>Create a New Learning Plan</Text>
        <Text style={styles.subtitle}>
          Tell me what you want to learn, and I will create a personalized roadmap for you.
        </Text>
      </LinearGradient>
      <View style={styles.centerContainer}>
        <DashboardButton
          title="Start Your First Lesson"
          subtitle="Create your first roadmap now!"
          iconName="play"
          onPress={() => router.push('/create-roadmap')}
          startColor={Colors.light.learnEnglishButton}
          endColor={Colors.light.learnEnglishButton + 'B3'}
        />
      </View>
    </>
  );

  // --- RENDER FUNCTION FOR THE ROADMAPS LIST ---
  const renderRoadmapsList = () => (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.light.tint, Colors.light.tint + 'B3']}
        style={styles.introSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.title}>Your Learning Roadmaps</Text>
      </LinearGradient>
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
      
      <View style={{paddingHorizontal: 20}}>
        <DashboardButton
          title="Create a New Roadmap"
          subtitle="Start a new learning journey"
          iconName="plus"
          onPress={() => router.push('/create-roadmap')}
          startColor={Colors.light.learnEnglishButton}
          endColor={Colors.light.learnEnglishButton + 'B3'}
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
    backgroundColor: Colors.light.background,
  },
  introSection: {
    padding: 25,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  centerContainer: { 
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.light.textWhite,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: Colors.light.textWhite,
    paddingHorizontal: 20,
  },
  roadmapGoal: {
    fontSize: 12,
    color: '#666',
  },
  roadmapItem: {
    backgroundColor: Colors.light.background,
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