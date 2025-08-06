import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ImagePickerExample() {
  const router = useRouter();
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
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
      <LinearGradient
        colors={['#45B7D8', '#3080A0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.pickImageButton}
      >
        <TouchableOpacity style={styles.innerButton} onPress={pickImage}>
            <Ionicons name="image-outline" size={50} color="white" />
            <Text style={styles.pickImageButtonText}>Pick an image from gallery</Text>
        </TouchableOpacity>
      </LinearGradient>
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
    borderRadius: 10,
    width: '80%',
    height: 150,
    overflow: 'hidden',
  },
  innerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  pickImageButtonText: {
    marginTop: 10,
    fontSize: 18,
    color: 'white',
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
