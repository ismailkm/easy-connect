import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FooterButtonsProps {
  onViewDocument: () => void;
  onNewDocument: () => void;
}

const FooterButtons: React.FC<FooterButtonsProps> = ({
  onViewDocument,
  onNewDocument
}) => {
  
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
        onPress={onNewDocument}
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
    backgroundColor: Colors.light.buttonColor,
    alignItems: 'center',
    shadowColor: Colors.light.buttonColor,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  footerButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default FooterButtons;