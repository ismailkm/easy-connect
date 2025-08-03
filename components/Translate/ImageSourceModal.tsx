import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close-circle" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Choose Image Source</Text>
          <TouchableOpacity style={styles.optionButton} onPress={onTakePicture}>
            <Ionicons name="camera" size={40} color="#007AFF" />
            <Text style={styles.optionText}>Take Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={onSelectFromGallery}>
            <Ionicons name="image" size={40} color="#007AFF" />
            <Text style={styles.optionText}>Select from Gallery</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: 'white',
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
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '600',
  },
});