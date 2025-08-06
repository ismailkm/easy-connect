import { SoundPlayer } from '@/components/ui/SoundPlayer';
import { Colors } from '@/constants/Colors';
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
     
          <View style={styles.vocabRow}>
            {/* English Word and Speaker */}
            <View style={styles.languageContainer}>
              <SoundPlayer
                text={material.en}
                languageCode={'en'}
                messageId={id+"en"}
              />
              <Text style={styles.vocabText}>{material.en}</Text>
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
  );
};

// --- STYLES ---

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.aiMessageBackground,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 12,
    shadowColor: Colors.light.darkShadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  vocabRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  vocabText: {
    fontSize: 14,
    color: Colors.light.text,
    flex: 1,
  },
  nativeText: {
    textAlign: 'right', 
    marginRight: 8,
    fontWeight: 'bold'
  },
});