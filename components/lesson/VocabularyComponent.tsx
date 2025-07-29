import { LearningMaterial } from '@/types/RoadmapInterface';
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VocabularyComponentProps {
  material: LearningMaterial;
}

export const VocabularyComponent: React.FC<VocabularyComponentProps> = ({ material }) => {
  const handlePlaySound = (text: string, language: 'en' | 'native') => {
    console.log(`Playing sound for "${text}" in language "${language}"`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <FontAwesome name="book" size={20} color="#c43b81" />
        <Text style={styles.title}>{material.title}</Text>
      </View>
      <View style={styles.listContainer}>
        {material.items.map((item, index) => (
          <View key={index} style={styles.vocabRow}>
            {/* English Word and Speaker */}
            <View style={styles.languageContainer}>
              <Text style={styles.vocabText}>{item.en}</Text>
              <TouchableOpacity
                onPress={() => handlePlaySound(item.en, 'en')}
                style={styles.speakerButton}
              >
                <FontAwesome name="volume-up" size={22} color="#4A4A4A" />
              </TouchableOpacity>
            </View>

            {/* Pashto/Dari Word and Speaker */}
            <View style={styles.languageContainer}>
              <Text style={[styles.vocabText, styles.nativeText]}>{item.native}</Text>
              <TouchableOpacity
                onPress={() => handlePlaySound(item.native, 'native')}
                style={styles.speakerButton}
              >
                <FontAwesome name="volume-up" size={22} color="#4A4A4A" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// --- STYLES ---

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8, // Less padding at the bottom as rows have their own
    marginVertical: 10,
    elevation: 4, // Android shadow
    shadowColor: '#000000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#c43b81', // A warm, friendly magenta color for this section
  },
  listContainer: {
    // Container for all the rows
  },
  vocabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5', // Lighter separator line
  },
  languageContainer: {
    flex: 1, // Each language takes up half the space
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  vocabText: {
    fontSize: 18,
    color: '#333333',
    flex: 1, // Allow text to wrap if it's long
  },
  nativeText: {
    textAlign: 'right', // Align Pashto/Dari text to the right
    marginRight: 8,
    // You might need a specific font for Pashto/Dari here later
    // fontFamily: 'YourPashtoFont', 
  },
  speakerButton: {
    paddingHorizontal: 8, // Horizontal padding to make tap area bigger
  },
});