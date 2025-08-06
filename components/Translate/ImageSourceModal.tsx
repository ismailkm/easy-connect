import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ImageSourceModalProps {
  visible: boolean;
  onClose: () => void;
  onTakePicture: () => void;
  onSelectFromGallery: () => void;
}

export const ImageSourceModal: React.FC<ImageSourceModalProps> = ({
  visible,
  onClose,
  onTakePicture,
  onSelectFromGallery,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <LinearGradient
          colors={[Colors.light.uploadImageButton, Colors.light.uploadImageButton + 'B3']}
          style={styles.modalView}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Choose Image Source</Text>
          <TouchableOpacity style={styles.optionButton} onPress={onTakePicture}>
            <Ionicons name="camera" size={40} color="white" />
            <Text style={styles.optionText}>Take Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={onSelectFromGallery}>
            <Ionicons name="image" size={40} color="white" />
            <Text style={styles.optionText}>Select from Gallery</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'white',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});