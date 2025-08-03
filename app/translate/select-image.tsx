import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ImagePickerExample() {
  const router = useRouter();
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Navigating to preview-translate with: ", result.assets[0].uri);
      router.replace({
        pathname: "/preview-translate", 
        params: { photoUri: result.assets[0].uri },
      });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.pickImageButton} onPress={pickImage}>
          <Ionicons name="image-outline" size={50} color="#007AFF" />
          <Text style={styles.pickImageButtonText}>Pick an image from gallery</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '70%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
  pickImageButton: {
    backgroundColor: '#E0E0E0',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: 150,
  },
  pickImageButtonText: {
    marginTop: 10,
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  retakeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  retakeButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
});
