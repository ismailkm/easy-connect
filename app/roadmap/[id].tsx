import { Colors } from '@/constants/Colors';
import { RoadmapModel } from '@/models/RoadmapModel';
import { RoadmapInterface, StageInterface } from '@/types/RoadmapInterface';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

export default function RoadmapDetailScreen() {
  const { id } = useLocalSearchParams();
  const [roadmap, setRoadmap] = useState<RoadmapInterface | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const loadRoadmaps = async () => {
      const roadmapId = Array.isArray(id) ? id[0] : id;
      let foundRoadmap = await RoadmapModel.getRoadmapById(roadmapId);
      setRoadmap(foundRoadmap || null);
      calculateProgress(foundRoadmap || null);
    };
    loadRoadmaps();
  }, [id]);

  const calculateProgress = (roadmap: RoadmapInterface | null) => {
    if (!roadmap) return 0;
    const totalStages = roadmap.stages.length;
    const completedStages = roadmap.stages.filter((stage) => stage.status === 'completed').length;
    const progress = completedStages / totalStages * 100;
    setProgress(progress);
  }

  const getStatusIcon = (status: 'not_started' | 'in_progress' | 'completed') => {
    switch (status) {
      case 'completed':
        return <MaterialCommunityIcons name="check-circle" size={24} color="green" />;
      case 'in_progress':
        return <MaterialCommunityIcons name="play-circle" size={24} color="orange" />;
      case 'not_started':
        return <MaterialCommunityIcons name="lock" size={24} color="gray" />;
      default:
        return '';
    }
  };

  const renderStageItem = ({ item }: { item: StageInterface }) => {
    return (
        <Pressable 
          style={styles.stageItem}
          onPress={() => router.push(`/lesson/${item.id}`)}
        >
          <View style={styles.stageHeader}>
          <Text style={styles.stageTitle}>{item.title}</Text>
            <Text style={styles.statusIcon}>
              {getStatusIcon(item.status)}
            </Text>
          </View>
      </Pressable>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.light.tint, Colors.light.tint + 'B3']}
        style={styles.roadmapSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.roadmapTitle}>{roadmap?.title}</Text>
        <Text style={styles.roadmapGoal}>{roadmap?.goal}</Text>
        <Text style={styles.roadmapInfo}>Duration: {roadmap?.duration}</Text>
        <Text style={styles.roadmapInfo}>Overall Progress: {progress}%</Text>
      </LinearGradient>

      <View style={styles.lessonsSection}>
        <FlatList
          data={roadmap?.stages}
          keyExtractor={(item) => item.id}
          renderItem={renderStageItem}
          contentContainerStyle={styles.listContent}
        />
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  roadmapSection: {
    padding: 25,
    shadowColor: Colors.light.tint,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  stageItem: {
    backgroundColor: Colors.light.aiMessageBackground,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: Colors.light.darkShadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  stageTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  statusIcon: {
    fontSize: 20,
  },
  roadmapHeader: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  roadmapTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colors.light.textWhite
  },
  roadmapInfo: {
    fontSize: 16,
    color: Colors.light.textWhite,
    marginBottom: 3,
  },
  roadmapGoal: {
    fontSize: 14,
    marginBottom: 20,
    color: Colors.light.textWhite
  },
  lessonsSection: {
    padding: 20
  }
});