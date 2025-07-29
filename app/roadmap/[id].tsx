import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { MOCK_ROADMAPS } from '@/assets/data/mockRoadmap';
import { RoadmapInterface, StageInterface } from '@/types/RoadmapInterface';

export default function RoadmapDetailScreen() {
  const { id } = useLocalSearchParams();
  const [roadmap, setRoadmap] = useState<RoadmapInterface | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      const foundRoadmap = MOCK_ROADMAPS.find((r: RoadmapInterface) => r.id === id);
      setRoadmap(foundRoadmap || null);
    }
  }, [id]);

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
    !roadmap ?
    <View style={styles.container}>
        <Text style={styles.title}>Roadmap Not Found</Text>
      </View>
    :
    <View style={styles.container}>
      <View style={styles.roadmapHeader}>
        <Text style={styles.roadmapTitle}>{roadmap.title}</Text>
        <Text style={styles.roadmapInfo}>Duration: {roadmap.duration}</Text>
        <Text style={styles.roadmapInfo}>Overall Progress: {Math.round(roadmap.progress * 100)}%</Text>
      </View>
      <FlatList
        data={roadmap.stages}
        keyExtractor={(item) => item.id}
        renderItem={renderStageItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  stageItem: {
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
  },
  roadmapInfo: {
    fontSize: 16,
    color: '#555',
    marginBottom: 3,
  },
});