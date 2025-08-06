// In src/components/ui/MarkdownRenderer.tsx

import { TextSegment } from '@/types/KnowledgebaseInterface'; // Import the type
import React from 'react';
import { StyleSheet, Text } from 'react-native';

interface MarkdownRendererProps {
  segments: TextSegment[];
  baseStyle?: object; // Allow passing in a base text style
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ segments, baseStyle }) => {
  return (
    <Text style={baseStyle}>
      {segments.map((segment, index) => (
        <Text key={index} style={segment.isBold ? styles.boldText : styles.normalText}>
          {segment.text}
        </Text>
      ))}
    </Text>
  );
};

const styles = StyleSheet.create({
  normalText: {
    // It will inherit from the baseStyle
  },
  boldText: {
    fontWeight: 'bold',
  },
});