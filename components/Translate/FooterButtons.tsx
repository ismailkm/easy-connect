import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FooterButtonsProps {
  onViewDocument: () => void;
}

const FooterButtons: React.FC<FooterButtonsProps> = ({
  onViewDocument
}) => {
  const router = useRouter();

  return (
    <View style={styles.footer}>
      <TouchableOpacity 
        style={styles.footerButton}
        onPress={onViewDocument}
      >
        <Text style={styles.footerButtonText}>View Document</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.footerButton}
        onPress={() => router.replace('/(tabs)/translate')}
      >
        <Text style={styles.footerButtonText}>Upload New</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    zIndex: 1,
  },
  footerButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  footerButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default FooterButtons;