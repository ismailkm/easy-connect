import { SoundPlayer } from '@/components/ui/SoundPlayer';
import { LearningLine } from '@/types/RoadmapInterface';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface LessonComponentProps {
  material: LearningLine;
  id: number;
}

export const LessonComponent: React.FC<LessonComponentProps> = ({ material, id  }) => {

  return (
    <View style={styles.card}>
      <View style={styles.listContainer}>
     
          <View style={styles.vocabRow}>
            {/* English Word and Speaker */}
            <View style={styles.languageContainer}>
              <Text style={styles.vocabText}>{material.en}</Text>
              <SoundPlayer
                text={material.en}
                languageCode={'en'}
                messageId={id+"en"}
              />
            </View>

            {/* Pashto/Dari Word and Speaker */}
            <View style={styles.languageContainer}>
              <Text style={[styles.vocabText, styles.nativeText]}>{material.native}</Text>
              <SoundPlayer
                text={material.native}
                languageCode={'fa-ir'}
                messageId={id+"fa"}
              />
            </View>
          </View>
        
      </View>
    </View>
  );
};

// --- STYLES ---

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    elevation: 4, 
    shadowColor: '#000000', 
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
    paddingVertical: 10,
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
    fontSize: 14,
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