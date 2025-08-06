import React from 'react';
import { Modal, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ImageModalProps {
  visible: boolean;
  photoUri: string | null;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  visible, photoUri, onClose
}) => {
  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.modalContainer}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        {photoUri && (
          <Image 
            source={{ uri: photoUri }} 
            style={styles.modalImage}
            resizeMode="contain"
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
});

export default ImageModal;